"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import CryptoJS from "crypto-js";
import { useParams } from "next/navigation";
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
  matchedUser: any | null;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  cancelChat: () => void;
  lockProfile: (profileId: string) => void;
  unlockProfile: (profileId: string) => void;
  revalidateUser: () => void;
  error: string | null;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

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

/* -------------------------------------------------------
   Provider
------------------------------------------------------- */

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams<{ id: string }>();
  const roomId = params?.id ?? null;
  const queryClient = useQueryClient();
  const { socket, revalidateSocket } = useSocket();
  const [userId, setUserId] = useState<string | null>(null);
  const [matchedUserId, setMatchedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser(userId ?? "");
  const { user: matchedUser, isLoading } = useUser(matchedUserId ?? "");

  /* -------------------------------------------------------
     Bootstrap user
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     Load room data
  ------------------------------------------------------- */

  const { data: roomData } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => fetchRoomData(roomId!),
    enabled: !!roomId,
  });

  useEffect(() => {
    if (!roomData || !user?._id) return;
    const other = roomData.participants.find((p: any) => p._id !== user._id);
    setMatchedUserId(other?._id ?? null);
  }, [roomData, user]);

  /* -------------------------------------------------------
     Load chat history
  ------------------------------------------------------- */

  useEffect(() => {
    if (!roomId) return;

    const loadMessages = async () => {
      const keyHex = localStorage.getItem(`chat_key_${roomId}`);
      if (!keyHex) return;

      try {
        const raw = await fetchRoomChat(roomId);

        const decrypted: Message[] = raw
          .map((msg: any) => {
            const encryptedHex = String.fromCharCode(...msg.encryptedData.data);
            const ivHex = String.fromCharCode(...msg.iv.data);

            const text = decryptMessage(encryptedHex, ivHex, keyHex);
            if (!text) return null;

            return {
              sender: msg.sender?._id ?? msg.sender,
              message: text,
              timestamp: new Date(msg.createdAt).getTime(),
            };
          })
          .filter(Boolean);

        setMessages(decrypted);
      } catch (e) {
        console.error("[Chat] Failed loading messages", e);
      }
    };

    loadMessages();
  }, [roomId]);

  /* -------------------------------------------------------
     Socket listeners
  ------------------------------------------------------- */

  useEffect(() => {
    if (!socket || !roomId) return;

    const onNewMessage = (data: any) => {
      const keyHex = localStorage.getItem(`chat_key_${roomId}`);
      if (!keyHex) return;

      const text = decryptMessage(data.encryptedData, data.iv, keyHex);
      if (!text) return;

      setMessages((prev) => {
        if (
          prev.some(
            (m) => m.timestamp === data.timestamp && m.sender === data.senderId
          )
        )
          return prev;

        return [
          ...prev,
          {
            sender: data.senderId,
            message: text,
            timestamp: data.timestamp,
          },
        ].sort((a, b) => a.timestamp - b.timestamp);
      });
    };

    socket.on("new_message", onNewMessage);

    socket.on("profileLocked", () =>
      queryClient.invalidateQueries({
        queryKey: ["user", matchedUserId],
      })
    );

    socket.on("profileUnlocked", () =>
      queryClient.invalidateQueries({
        queryKey: ["user", matchedUserId],
      })
    );

    socket.on("chatCancelled", () => {
      console.log("[Chat] Chat cancelled");
    });

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("profileLocked");
      socket.off("profileUnlocked");
      socket.off("chatCancelled");
    };
  }, [socket, roomId, matchedUserId, queryClient]);

  /* -------------------------------------------------------
     Actions
  ------------------------------------------------------- */

  const cancelChat = useCallback(() => {
    if (!socket || !roomId) return;
    trackAnalytic({
      activity: "end_chat",
      label: "end Chat",
      value: roomId,
    });
    socket.emit("cancelChat", { roomId });
  }, [socket, roomId]);

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

  /* -------------------------------------------------------
     Context value
  ------------------------------------------------------- */

  const value = useMemo(
    () => ({
      roomId,
      matchedUser,
      messages,
      setMessages,
      cancelChat,
      lockProfile,
      unlockProfile,
      revalidateUser,
      error,
      isLoading,
    }),
    [
      roomId,
      matchedUser,
      messages,
      cancelChat,
      lockProfile,
      unlockProfile,
      revalidateUser,
      error,
      isLoading,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

/* -------------------------------------------------------
   Hook
------------------------------------------------------- */

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};
