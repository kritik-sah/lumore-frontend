"use client";
import { usePushNotification } from "@/app/provider/PushNotificationProvider";
import { fetchRoomChat } from "@/lib/apis";
import { trackAnalytic } from "@/service/analytics";
import { getUser } from "@/service/storage";
import { useQueryClient } from "@tanstack/react-query";
import CryptoJS from "crypto-js";
import {
  createContext,
  Dispatch,
  SetStateAction,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import { Message } from "../components/ChatScreen";
import { useUser } from "../hooks/useUser";
import { useSocket } from "./SocketContext";

interface ExploreChatContextType {
  matchId: string | null;
  matchedUser: any | null;
  isMatching: boolean;
  error: string | null;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  startMatchmaking: () => void;
  stopMatchmaking: () => void;
  clearMatch: (data: any) => void;
  cancelChat: (matchId: string) => void;
  lockProfile: (matchId: string, userId: string, profileId: string) => void;
  unlockProfile: (matchId: string, userId: string, profileId: string) => void;
  revalidateUser: () => void;
}

const ExploreChatContext = createContext<ExploreChatContextType | undefined>(
  undefined
);

export const ExploreChatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const { user } = useUser(userId as string);
  const [isMatching, setIsMatching] = useState(user?.isMatching || false);
  const { socket, revalidateSocket } = useSocket();
  const [matchId, setMatchId] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<any | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { user: matchedUserData } = useUser(matchedUser || "");
  const queryClient = useQueryClient();
  const {
    isSupported,
    isSubscribed,
    permissionState,
    subscribeToPush,
    requestPermission,
  } = usePushNotification();

  useEffect(() => {
    if (user) {
      setIsMatching(user.isMatching || false);
    }
  }, [user]);

  const revalidateUser = () => {
    if (userId) return;
    const _user = getUser();
    revalidateSocket();
    setUserId(_user?._id || null);
  };

  useEffect(() => {
    console.log({ userId, isSupported });
    if (userId && isSupported) {
      handleEnablePush();
    }
  }, [userId, isSupported]);

  const handleEnablePush = async () => {
    try {
      await requestPermission();
      await subscribeToPush(userId as string); // This will trigger browser permission prompt
    } catch (error) {
      console.error("Failed to enable notifications:", error);
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      if (!matchId) return;

      const encryptionKey = localStorage.getItem(`chat_key_${matchId}`);

      if (!encryptionKey) {
        console.warn("[ExploreChatContext] No encryption key found.");
        return;
      }

      try {
        const rawMessages = await fetchRoomChat(matchId);
        const key = CryptoJS.enc.Hex.parse(encryptionKey);

        const decryptedMessages: Message[] = rawMessages
          .map((msg: any) => {
            try {
              // Convert character codes to hex string
              const encryptedHexStr = String.fromCharCode(
                ...msg.encryptedData.data
              );
              const ivHexStr = String.fromCharCode(...msg.iv.data);

              const ciphertextWordArray =
                CryptoJS.enc.Hex.parse(encryptedHexStr);
              const base64CipherText =
                CryptoJS.enc.Base64.stringify(ciphertextWordArray);
              const iv = CryptoJS.enc.Hex.parse(ivHexStr);

              const decrypted = CryptoJS.AES.decrypt(base64CipherText, key, {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
              });

              const message = decrypted.toString(CryptoJS.enc.Utf8);
              if (!message) throw new Error("Failed to decrypt message");

              return {
                sender: msg.sender?._id || msg.sender,
                message,
                timestamp: new Date(msg.createdAt).getTime(),
              };
            } catch (err) {
              console.warn(
                "[ExploreChatContext] Skipped a message due to decryption error:",
                err
              );
              return null;
            }
          })
          .filter(Boolean) as Message[];

        setMessages(decryptedMessages);
      } catch (error) {
        console.error("[ExploreChatContext] Error loading messages:", error);
      }
    };

    loadMessages();
  }, [matchId]);

  const startMatchmaking = () => {
    console.log("start matching", {
      socket,
      user,
      isMatching,
    });

    if (!socket || !user || isMatching) return;
    if (userId && isSupported) {
      handleEnablePush();
    }
    setIsMatching(true);
    setError(null);

    trackAnalytic({
      activity: "started_matchmaking",
      label: "Started Matchmaking",
    });

    socket.emit("startMatchmaking");
  };

  const stopMatchmaking = () => {
    if (!socket || !userId || !isMatching) return;
    setIsMatching(false);
    trackAnalytic({
      activity: "stoped_matchmaking",
      label: "Stoped Matchmaking",
    });
    socket.emit("stopMatchmaking", { userId: userId });
  };

  const cancelChat = (roomId: string) => {
    if (!socket) return;
    trackAnalytic({
      activity: "end_chat",
      label: "end Chat",
      value: roomId,
    });
    socket.emit("cancelChat", { roomId: roomId });
    clearMatch(roomId);
  };

  const clearMatch = (roomId: any) => {
    const matchIdToClear = roomId;
    if (matchIdToClear === matchId) {
      setMatchId(null);
      setMatchedUser(null);
      setError(null);
      setMessages([]);
      setIsMatching(false);
    } else {
      console.error(
        "[ExploreChatContext] Ignoring clearMatch for different matchId:",
        matchIdToClear,
        "current:",
        matchId
      );
    }
  };

  const lockProfile = (matchId: string, userId: string, profileId: string) => {
    if (!socket) return;
    trackAnalytic({
      activity: "lock_profile",
      label: "Lock Profile",
      value: matchId,
    });
    socket.emit("lockProfile", { matchId, userId, profileId });
  };
  const unlockProfile = (
    matchId: string,
    userId: string,
    profileId: string
  ) => {
    if (!socket) return;
    trackAnalytic({
      activity: "unlock_profile",
      label: "Unlock Profile",
      value: matchId,
    });
    socket.emit("unlockProfile", { matchId, userId, profileId });
  };

  const handleNewMessage = (data: {
    senderId: string;
    encryptedData: string;
    iv: string;
    timestamp: number;
  }) => {
    const encryptionKey = localStorage.getItem(`chat_key_${matchId}`);
    if (!encryptionKey) {
      console.warn(
        "[ChatScreen] No encryption key available, cannot decrypt message."
      );
      return;
    }

    try {
      const key = CryptoJS.enc.Hex.parse(encryptionKey);
      const iv = CryptoJS.enc.Hex.parse(data.iv);

      // Convert the hex-encoded encryptedData to WordArray directly
      const encryptedWordArray = CryptoJS.enc.Hex.parse(data.encryptedData);
      const base64Encrypted = CryptoJS.enc.Base64.stringify(encryptedWordArray);

      const decrypted = CryptoJS.AES.decrypt(base64Encrypted, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const message = decrypted.toString(CryptoJS.enc.Utf8);

      if (!message)
        throw new Error("Decryption failed: Message is empty or invalid UTF-8");

      setMessages((prev) => {
        const isDuplicate = prev.some(
          (msg) =>
            msg.timestamp === data.timestamp && msg.sender === data.senderId
        );
        if (isDuplicate) return prev;

        const newMsg: Message = {
          sender: data.senderId,
          message,
          timestamp: data.timestamp,
        };

        return [...prev, newMsg].sort((a, b) => a.timestamp - b.timestamp);
      });
    } catch (error) {
      console.error("[ChatScreen] Error decrypting message:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    console.log("%c[SOCKET LISTENERS READY]", "color:#00FFFF");

    // ✅ Matchmaking status update
    socket.on("matchmaking_status", (data) => {
      console.log("[Socket] matchmaking_status:", data);

      if (data.status === "searching") setIsMatching(true);
      if (data.status === "idle") setIsMatching(false);
    });

    // ✅ When match is found
    socket.on("matchFound", ({ roomId, matchedUser }) => {
      console.log("[Socket] Match found:", roomId, matchedUser);
      setMatchId(roomId);
      setMatchedUser(matchedUser);
      setIsMatching(false);
    });

    // ✅ Handle reconnection event (RESTORES MATCH + CHAT SESSION)
    socket.on("reconnected", ({ roomId, matchedUserId }) => {
      setMatchId(roomId);
      setMatchedUser(matchedUserId);
      setIsMatching(false);
      setError(null);
    });

    // ✅ Error while matching
    socket.on("matchmakingError", ({ message }) => {
      console.error("[Socket] matchmakingError:", message);
      setError(message);
      setIsMatching(false);
    });

    // ✅ When match is found
    socket.on("chatCancelled", ({ roomId }) => {
      console.log("[chatCancelled] :", roomId);
      clearMatch(roomId);
    });

    // ✅ Partner disconnected unexpectedly
    socket.on("userDisconnected", ({ userId }) => {
      console.log("[Socket] Partner disconnected:", userId);
      clearMatch(matchId);
    });

    // ✅ NEW MESSAGE RECEIVED (encrypted)
    socket.on("new_message", handleNewMessage);

    // ✅ Partner typing
    socket.on("typing", ({ userId, isTyping }) => {
      console.log("[Socket] typing:", { userId, isTyping });
    });

    // ✅ PUBLIC KEY received → store & reply
    socket.on("public_key_received", async ({ fromUserId, key }) => {
      console.log("[Socket] public_key_received from", fromUserId);

      /// TODO: store key, generate AES key, encrypt, emit "exchange_key"
    });

    socket.on("key_exchange_success", () => {
      console.log("[Socket] Key exchange complete ✅");
    });

    // ✅ Profile lock/unlock (invalidate react-query)
    socket.on("profileLocked", () => {
      console.log("[Socket] profileLocked");
      queryClient.invalidateQueries({ queryKey: ["user", matchedUser] });
    });

    socket.on("profileUnlocked", () => {
      console.log("[Socket] profileUnlocked");
      queryClient.invalidateQueries({ queryKey: ["user", matchedUser] });
    });

    // 🔥 Cleanup: avoids duplicate listeners
    return () => {
      socket.off("matchmaking_status");
      socket.off("matchFound");
      socket.off("reconnected");
      socket.off("matchmakingError");
      socket.off("chatCancelled");
      socket.off("userDisconnected");
      socket.off("new_message");
      socket.off("typing");
      socket.off("public_key_received");
      socket.off("key_exchange_success");
      socket.off("profileLocked");
      socket.off("profileUnlocked");
    };
  }, [socket, matchId, clearMatch]);

  return (
    <ExploreChatContext.Provider
      value={{
        matchId,
        matchedUser: matchedUserData,
        isMatching,
        error,
        messages,
        setMessages,
        startMatchmaking,
        stopMatchmaking,
        clearMatch,
        cancelChat,
        lockProfile,
        unlockProfile,
        revalidateUser,
      }}
    >
      {children}
    </ExploreChatContext.Provider>
  );
};

export const useExploreChat = () => {
  const context = useContext(ExploreChatContext);
  if (context === undefined) {
    throw new Error(
      "useExploreChat must be used within an ExploreChatProvider"
    );
  }
  return context;
};
