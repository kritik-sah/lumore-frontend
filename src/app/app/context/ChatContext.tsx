"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  fetchIdentityKey,
  fetchRoomChat,
  fetchRoomData,
  fetchRoomEnvelopes,
  upsertIdentityKey,
  upsertRoomEnvelopes,
} from "@/lib/apis";
import { ensureIdentityKeyPair } from "@/lib/chat-crypto/identity";
import {
  decryptTextMessage,
  encryptTextMessage,
  type EncryptedMessageContent,
} from "@/lib/chat-crypto/message";
import { createRoomKeyEnvelopes, ensureRoomKey } from "@/lib/chat-crypto/room-keys";
import { trackAnalytic } from "@/service/analytics";
import { getUser } from "@/service/storage";
import { Message } from "../components/ChatScreen";
import { useUser } from "../hooks/useUser";
import { useSocket } from "./SocketContext";

interface ChatContextType {
  roomId: string | null;
  roomData: any | null;
  matchedUser: any | null;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  cancelChat: () => void;
  lockProfile: (profileId: string) => void;
  unlockProfile: (profileId: string) => void;
  revalidateUser: () => void;
  error: string | null;
  isLoading: boolean;
  isActive: boolean;
  encryptTextForSend: (
    text: string
  ) => Promise<{ encryptedContent: EncryptedMessageContent } | null>;
}

const ChatContext = createContext<ChatContextType | null>(null);
const CHAT_E2EE_ENABLED =
  String(process.env.NEXT_PUBLIC_CHAT_E2EE_ENABLED || "true") === "true";

const getSenderId = (sender: any): string => {
  if (!sender) return "";
  if (typeof sender === "string") return sender;
  return sender._id || sender.id || "";
};

const mapReplyPreview = (replyTo: any) => {
  if (!replyTo?._id) return null;

  const replyType: "text" | "image" = replyTo.messageType || "text";
  const replyMessage =
    replyType === "image"
      ? "Photo"
      : replyTo?.encryptedContent
        ? "Message"
        : replyTo.message || "";

  return {
    _id: replyTo._id,
    senderId: getSenderId(replyTo.sender) || replyTo.senderId || "",
    messageType: replyType,
    message: replyMessage,
    imageUrl: replyTo.imageUrl || null,
  };
};

const sortByTimestamp = (items: Message[]) =>
  [...items].sort((a, b) => a.timestamp - b.timestamp);

const mergeIncomingMessage = (messages: Message[], incoming: Message) => {
  const next = [...messages];

  if (incoming.clientMessageId) {
    const optimisticIndex = next.findIndex(
      (item) => item.clientMessageId === incoming.clientMessageId,
    );
    if (optimisticIndex >= 0) {
      next[optimisticIndex] = { ...next[optimisticIndex], ...incoming, pending: false };
      return sortByTimestamp(next);
    }
  }

  if (incoming._id) {
    const existingIndex = next.findIndex((item) => item._id === incoming._id);
    if (existingIndex >= 0) {
      next[existingIndex] = { ...next[existingIndex], ...incoming, pending: false };
      return sortByTimestamp(next);
    }
  }

  next.push(incoming);
  return sortByTimestamp(next);
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams<{ id: string }>();
  const roomId = params?.id ?? null;
  const queryClient = useQueryClient();
  const { socket, revalidateSocket } = useSocket();
  const [userId, setUserId] = useState<string | null>(null);
  const [matchedUserId, setMatchedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [cryptoReady, setCryptoReady] = useState<boolean>(!CHAT_E2EE_ENABLED);
  const router = useRouter();
  const { user } = useUser(userId ?? "");
  const { user: matchedUser, isLoading } = useUser(matchedUserId ?? "");
  const { data: roomData } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => fetchRoomData(roomId!),
    enabled: !!roomId,
  });
  const currentKeyEpoch = Number(roomData?.encryption?.currentKeyEpoch || 1);

  const revalidateUser = useCallback(() => {
    if (userId) return;
    const u = getUser();
    if (!u?._id) return;
    revalidateSocket();
    setUserId(u._id);
  }, [userId, revalidateSocket]);

  useEffect(() => {
    revalidateUser();
  }, [revalidateUser]);

  useEffect(() => {
    if (!CHAT_E2EE_ENABLED || !userId) {
      setCryptoReady(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const identity = await ensureIdentityKeyPair();
        await upsertIdentityKey({
          identityPublicKey: identity.publicKeySpki,
          algorithm: identity.algorithm,
        });
        if (!cancelled) {
          setCryptoReady(true);
        }
      } catch (e) {
        console.error("[Chat] identity bootstrap failed", e);
        if (!cancelled) {
          setCryptoReady(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const ensureRoomKeyForEpoch = useCallback(
    async (epoch: number) => {
      if (!CHAT_E2EE_ENABLED || !roomId || !roomData || !userId) return null;

      const fetchMyEnvelope = async () => {
        const envelopes = await fetchRoomEnvelopes(roomId, epoch);
        return (
          envelopes.find(
            (item) => String(item.recipientUserId) === String(userId) && item.epoch === epoch,
          ) || null
        );
      };

      try {
        return await ensureRoomKey({
          roomId,
          epoch,
          fetchEnvelope: fetchMyEnvelope,
        });
      } catch (error) {
        const participantIds = (roomData?.participants || [])
          .map((participant: any) => participant?._id)
          .filter(Boolean);
        if (participantIds.length === 0) {
          throw error;
        }

        const keyResults = await Promise.all(
          participantIds.map(async (participantId: string) => {
            const key = await fetchIdentityKey(participantId);
            return {
              userId: participantId,
              publicKeySpki: key.identityPublicKey,
            };
          }),
        );

        const envelopes = await createRoomKeyEnvelopes({
          roomId,
          epoch,
          recipientPublicKeys: keyResults,
        });
        await upsertRoomEnvelopes(roomId, {
          epoch,
          envelopes: envelopes.envelopes,
        });

        return ensureRoomKey({
          roomId,
          epoch,
          fetchEnvelope: fetchMyEnvelope,
        });
      }
    },
    [roomData, roomId, userId],
  );

  const decryptIncomingMessage = useCallback(
    async (rawMessage: any): Promise<Message | null> => {
      const messageType: "text" | "image" = rawMessage?.messageType || "text";
      let text = messageType === "text" ? rawMessage?.message || "" : "";
      const encrypted = rawMessage?.encryptedContent || null;
      const sender = getSenderId(rawMessage?.sender) || rawMessage?.senderId || "";

      if (CHAT_E2EE_ENABLED && messageType === "text" && encrypted) {
        try {
          const roomKey = await ensureRoomKeyForEpoch(Number(encrypted?.keyEpoch || currentKeyEpoch));
          if (!roomKey) throw new Error("No room key");
          text = await decryptTextMessage({
            roomId: rawMessage?.roomId || roomId || "",
            senderId: sender,
            keyEpoch: Number(encrypted.keyEpoch || currentKeyEpoch),
            roomKey,
            encryptedContent: encrypted,
          });
        } catch (e) {
          text = "Unable to decrypt message";
        }
      }

      return {
        _id: rawMessage?._id,
        clientMessageId: rawMessage?.clientMessageId || undefined,
        sender,
        message: text,
        encryptedContent: encrypted,
        messageType,
        imageUrl: rawMessage?.imageUrl || null,
        imagePublicId: rawMessage?.imagePublicId || null,
        timestamp:
          rawMessage?.timestamp ||
          (rawMessage?.createdAt
            ? new Date(rawMessage.createdAt).getTime()
            : Date.now()),
        replyTo: mapReplyPreview(rawMessage?.replyTo),
        reactions: (rawMessage?.reactions || []).map((reaction: any) => ({
          userId: reaction.userId || reaction.user || "",
          emoji: reaction.emoji || "\u2764\uFE0F",
        })),
        editedAt: rawMessage?.editedAt ? new Date(rawMessage.editedAt).getTime() : null,
        deliveredAt: rawMessage?.deliveredAt
          ? new Date(rawMessage.deliveredAt).getTime()
          : null,
        readAt: rawMessage?.readAt ? new Date(rawMessage.readAt).getTime() : null,
        pending: false,
      };
    },
    [currentKeyEpoch, ensureRoomKeyForEpoch, roomId],
  );

  useEffect(() => {
    if (!roomData || !user?._id) return;
    const other = roomData.participants.find((p: any) => p._id !== user._id);
    setMatchedUserId(other?._id ?? null);
    if (roomData.status === "active") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [roomData, user]);

  useEffect(() => {
    if (!roomId) return;

    const loadMessages = async () => {
      try {
        const raw = await fetchRoomChat(roomId);

        const mapped: Message[] = (
          await Promise.all(raw.map((msg: any) => decryptIncomingMessage(msg)))
        ).filter(Boolean) as Message[];

        setMessages(mapped);
        queryClient.invalidateQueries({ queryKey: ["inbox", "active"] });
        queryClient.invalidateQueries({ queryKey: ["inbox", "archive"] });
      } catch (e) {
        console.error("[Chat] Failed loading messages", e);
      }
    };

    loadMessages();
  }, [roomId, queryClient, decryptIncomingMessage]);

  useEffect(() => {
    if (!socket || !roomId) return;

    const onIncomingMessage = async (payload: any) => {
      const mapped = await decryptIncomingMessage(payload);
      if (!mapped) return;
      setMessages((prev) => mergeIncomingMessage(prev, mapped as Message));
    };

    const onEdited = async (payload: any) => {
      if (!payload?.messageId) return;
      let nextMessage = payload.message || "";
      if (payload?.encryptedContent && CHAT_E2EE_ENABLED) {
        try {
          const senderId =
            messages.find((item) => item._id === payload.messageId)?.sender || "";
          const roomKey = await ensureRoomKeyForEpoch(
            Number(payload.encryptedContent.keyEpoch || currentKeyEpoch),
          );
          if (roomKey) {
            nextMessage = await decryptTextMessage({
              roomId: roomId || "",
              senderId,
              keyEpoch: Number(payload.encryptedContent.keyEpoch || currentKeyEpoch),
              roomKey,
              encryptedContent: payload.encryptedContent,
            });
          }
        } catch {
          nextMessage = "Unable to decrypt message";
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === payload.messageId
            ? {
                ...msg,
                message: nextMessage,
                encryptedContent: payload?.encryptedContent || msg.encryptedContent || null,
                editedAt: payload.editedAt
                  ? new Date(payload.editedAt).getTime()
                  : Date.now(),
              }
            : msg,
        ),
      );
    };

    const onReactionUpdated = (payload: any) => {
      if (!payload?.messageId) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === payload.messageId
            ? {
                ...msg,
                reactions: (payload.reactions || []).map((reaction: any) => ({
                  userId: reaction.userId || reaction.user || "",
                  emoji: reaction.emoji || "\u2764\uFE0F",
                })),
              }
            : msg,
        ),
      );
    };

    const onDelivered = (payload: any) => {
      const messageIds = new Set((payload?.messageIds || []).map(String));
      const deliveredAt = payload?.deliveredAt
        ? new Date(payload.deliveredAt).getTime()
        : Date.now();
      if (messageIds.size === 0) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id && messageIds.has(msg._id)
            ? {
                ...msg,
                deliveredAt: msg.deliveredAt || deliveredAt,
              }
            : msg,
        ),
      );
    };

    const onRead = (payload: any) => {
      const messageIds = new Set((payload?.messageIds || []).map(String));
      const readAt = payload?.readAt ? new Date(payload.readAt).getTime() : Date.now();
      if (messageIds.size === 0) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id && messageIds.has(msg._id)
            ? {
                ...msg,
                deliveredAt: msg.deliveredAt || readAt,
                readAt: msg.readAt || readAt,
              }
            : msg,
        ),
      );
    };

    socket.on("new_message", onIncomingMessage);
    socket.on("message_sent", onIncomingMessage);
    socket.on("message_edited", onEdited);
    socket.on("message_reaction_updated", onReactionUpdated);
    socket.on("message_delivered", onDelivered);
    socket.on("message_read", onRead);

    socket.on("chatEnded", () => {
      setIsActive(false);
    });

    return () => {
      socket.off("new_message", onIncomingMessage);
      socket.off("message_sent", onIncomingMessage);
      socket.off("message_edited", onEdited);
      socket.off("message_reaction_updated", onReactionUpdated);
      socket.off("message_delivered", onDelivered);
      socket.off("message_read", onRead);
      socket.off("chatEnded");
    };
  }, [socket, roomId, currentKeyEpoch, decryptIncomingMessage, ensureRoomKeyForEpoch, messages]);

  const cancelChat = useCallback(() => {
    if (!socket || !roomId) return;
    trackAnalytic({
      activity: "end_chat",
      label: "end Chat",
      value: roomId,
    });
    socket.emit("endChat", { roomId });
    queryClient.invalidateQueries({ queryKey: ["inbox", "active"] });
    queryClient.invalidateQueries({ queryKey: ["inbox", "archive"] });
    setIsActive(false);
    router.push("/app/chat/");
  }, [socket, roomId, queryClient, router]);

  const lockProfile = useCallback(
    (profileId: string) => {
      if (!socket || !roomId || !userId) return;
      trackAnalytic({
        activity: "lock_profile",
        label: "Lock Profile",
        value: roomId,
      });
      socket.emit("lockProfile", { roomId, userId, profileId });
    },
    [socket, roomId, userId],
  );

  const unlockProfile = useCallback(
    (profileId: string) => {
      if (!socket || !roomId || !userId) return;
      trackAnalytic({
        activity: "unlock_profile",
        label: "Unlock Profile",
        value: roomId,
      });
      socket.emit("unlockProfile", { roomId, userId, profileId });
    },
    [socket, roomId, userId],
  );

  const encryptTextForSend = useCallback(
    async (text: string) => {
      if (!CHAT_E2EE_ENABLED) return null;
      if (!roomId || !userId || !cryptoReady) return null;
      const roomKey = await ensureRoomKeyForEpoch(currentKeyEpoch);
      if (!roomKey) return null;
      const encrypted = await encryptTextMessage({
        roomId,
        senderId: userId,
        text,
        keyEpoch: currentKeyEpoch,
        roomKey,
      });
      return {
        encryptedContent: encrypted.encryptedContent,
      };
    },
    [cryptoReady, currentKeyEpoch, ensureRoomKeyForEpoch, roomId, userId],
  );

  const value = useMemo(
    () => ({
      roomId,
      roomData,
      matchedUser,
      messages,
      setMessages,
      cancelChat,
      lockProfile,
      unlockProfile,
      revalidateUser,
      error,
      isLoading,
      isActive,
      encryptTextForSend,
    }),
    [
      roomId,
      roomData,
      matchedUser,
      messages,
      cancelChat,
      lockProfile,
      unlockProfile,
      revalidateUser,
      error,
      isLoading,
      isActive,
      encryptTextForSend,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};
