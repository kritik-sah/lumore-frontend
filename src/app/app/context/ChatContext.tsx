"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import CryptoJS from "crypto-js";
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

import { fetchRoomChat, fetchRoomData } from "@/lib/apis";
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
}

const ChatContext = createContext<ChatContextType | null>(null);

const decodeHexField = (raw: any): string | null => {
  if (!raw) return null;
  if (typeof raw === "string") return raw;

  if (raw?.data && Array.isArray(raw.data)) {
    return String.fromCharCode(...raw.data);
  }

  return null;
};

const decryptMessage = (
  encryptedHex: string,
  ivHex: string,
  keyHex: string
): string | null => {
  try {
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);

    const cipherWordArray = CryptoJS.enc.Hex.parse(encryptedHex);
    const base64Cipher = CryptoJS.enc.Base64.stringify(cipherWordArray);

    const decrypted = CryptoJS.AES.decrypt(base64Cipher, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const text = decrypted.toString(CryptoJS.enc.Utf8);
    return text || null;
  } catch {
    return null;
  }
};

const getSenderId = (sender: any): string => {
  if (!sender) return "";
  if (typeof sender === "string") return sender;
  return sender._id || sender.id || "";
};

const mapReplyPreview = (replyTo: any, keyHex: string | null) => {
  if (!replyTo?._id) return null;

  const replyType: "text" | "image" = replyTo.messageType || "text";

  let replyMessage = "";
  if (replyType === "image") {
    replyMessage = "Photo";
  } else if (keyHex) {
    const encryptedHex = decodeHexField(replyTo.encryptedData);
    const ivHex = decodeHexField(replyTo.iv);
    replyMessage =
      encryptedHex && ivHex ? decryptMessage(encryptedHex, ivHex, keyHex) || "" : "";
  }

  return {
    _id: replyTo._id,
    senderId: getSenderId(replyTo.sender) || replyTo.senderId || "",
    messageType: replyType,
    message: replyMessage,
    imageUrl: replyTo.imageUrl || null,
  };
};

const mapSocketMessage = (payload: any, keyHex: string | null): Message | null => {
  const messageType: "text" | "image" = payload?.messageType || "text";

  let text = "";
  if (messageType === "text") {
    if (!keyHex) return null;

    const decrypted = decryptMessage(payload.encryptedData, payload.iv, keyHex);
    if (!decrypted) return null;
    text = decrypted;
  }

  return {
    _id: payload?._id,
    clientMessageId: payload?.clientMessageId || undefined,
    sender: payload?.senderId || "",
    message: text,
    messageType,
    imageUrl: payload?.imageUrl || null,
    imagePublicId: payload?.imagePublicId || null,
    timestamp:
      payload?.timestamp ||
      (payload?.createdAt ? new Date(payload.createdAt).getTime() : Date.now()),
    replyTo: mapReplyPreview(payload?.replyTo, keyHex),
    reactions: (payload?.reactions || []).map((reaction: any) => ({
      userId: reaction.userId || reaction.user || "",
      emoji: reaction.emoji || "\u2764\uFE0F",
    })),
    editedAt: payload?.editedAt ? new Date(payload.editedAt).getTime() : null,
    pending: false,
  };
};

const sortByTimestamp = (items: Message[]) =>
  [...items].sort((a, b) => a.timestamp - b.timestamp);

const mergeIncomingMessage = (messages: Message[], incoming: Message) => {
  const next = [...messages];

  if (incoming.clientMessageId) {
    const optimisticIndex = next.findIndex(
      (item) => item.clientMessageId === incoming.clientMessageId
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
  const router = useRouter();
  const { user } = useUser(userId ?? "");
  const { user: matchedUser, isLoading } = useUser(matchedUserId ?? "");

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

  const { data: roomData } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => fetchRoomData(roomId!),
    enabled: !!roomId,
  });

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
      const keyHex = localStorage.getItem(`chat_key_${roomId}`);
      if (!keyHex) return;

      try {
        const raw = await fetchRoomChat(roomId);

        const mapped: Message[] = raw
          .map((msg: any) => {
            const messageType: "text" | "image" = msg.messageType || "text";
            const encryptedHex = decodeHexField(msg.encryptedData);
            const ivHex = decodeHexField(msg.iv);

            let text = "";
            if (messageType === "text") {
              if (!encryptedHex || !ivHex) return null;
              const decrypted = decryptMessage(encryptedHex, ivHex, keyHex);
              if (!decrypted) return null;
              text = decrypted;
            }

            return {
              _id: msg._id,
              sender: getSenderId(msg.sender),
              message: text,
              messageType,
              imageUrl: msg.imageUrl || null,
              imagePublicId: msg.imagePublicId || null,
              timestamp: new Date(msg.createdAt || msg.timestamp).getTime(),
              replyTo: mapReplyPreview(msg.replyTo, keyHex),
              reactions: (msg.reactions || []).map((reaction: any) => ({
                userId: reaction.user?._id || reaction.user || reaction.userId || "",
                emoji: reaction.emoji || "\u2764\uFE0F",
              })),
              editedAt: msg.editedAt ? new Date(msg.editedAt).getTime() : null,
              pending: false,
            } as Message;
          })
          .filter(Boolean);

        setMessages(mapped);
      } catch (e) {
        console.error("[Chat] Failed loading messages", e);
      }
    };

    loadMessages();
  }, [roomId]);

  useEffect(() => {
    if (!socket || !roomId) return;

    const onIncomingMessage = (payload: any) => {
      const keyHex = localStorage.getItem(`chat_key_${roomId}`);
      const mapped = mapSocketMessage(payload, keyHex);
      if (!mapped) return;

      setMessages((prev) => mergeIncomingMessage(prev, mapped));
    };

    const onEdited = (payload: any) => {
      const keyHex = localStorage.getItem(`chat_key_${roomId}`);
      if (!keyHex || !payload?.messageId) return;

      const text = decryptMessage(payload.encryptedData, payload.iv, keyHex);
      if (!text) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === payload.messageId
            ? {
                ...msg,
                message: text,
                editedAt: payload.editedAt
                  ? new Date(payload.editedAt).getTime()
                  : Date.now(),
              }
            : msg
        )
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
            : msg
        )
      );
    };

    socket.on("new_message", onIncomingMessage);
    socket.on("message_sent", onIncomingMessage);
    socket.on("message_edited", onEdited);
    socket.on("message_reaction_updated", onReactionUpdated);

    socket.on("chatEnded", () => {
      setIsActive(false);
    });

    return () => {
      socket.off("new_message", onIncomingMessage);
      socket.off("message_sent", onIncomingMessage);
      socket.off("message_edited", onEdited);
      socket.off("message_reaction_updated", onReactionUpdated);
      socket.off("chatEnded");
    };
  }, [socket, roomId]);

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
    [socket, roomId, userId]
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
    [socket, roomId, userId]
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
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};

