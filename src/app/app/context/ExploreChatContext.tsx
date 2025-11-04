"use client";
import { fetchRoomChat } from "@/lib/apis";
import { trackAnalytic } from "@/service/analytics";
import { getUser } from "@/service/storage";
import { useQueryClient } from "@tanstack/react-query";
import CryptoJS from "crypto-js";
import {
  createContext,
  Dispatch,
  SetStateAction,
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
  const { socket, revalidateSocket } = useSocket();
  const [matchId, setMatchId] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<any | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { user: matchedUserData } = useUser(matchedUser || "");
  const queryClient = useQueryClient();

  const revalidateUser = () => {
    if (userId) return;
    const _user = getUser();
    revalidateSocket();
    setUserId(_user?._id || null);
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

  const cancelChat = (matchId: string) => {
    if (!socket) return;
    trackAnalytic({
      activity: "end_chat",
      label: "end Chat",
      value: matchId,
    });
    socket.emit("cancelChat", { matchId });
    clearMatch(matchId);
  };

  const clearMatch = (data: any) => {
    const matchIdToClear = typeof data === "string" ? data : data?.matchId;
    if (matchIdToClear === matchId) {
      setMatchId(null);
      setMatchedUser(null);
      setError(null);
      setMessages([]);
      setIsMatching(false);
    } else {
      console.log(
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

    const handleMatchFound = (data: { matchId: string; matchedUser: any }) => {
      setMatchId(data.matchId);
      setMatchedUser(data.matchedUser);
      setIsMatching(false);
    };

    const handleError = (error: { message: string }) => {
      setError(error.message);
      setIsMatching(false);
    };

    const handleChatCancelled = (data: any) => {
      if (Array.isArray(data)) {
        const matchId = data[1]?.matchId;
        if (matchId) {
          clearMatch(matchId);
        }
      } else if (data?.matchId) {
        clearMatch(data);
      } else {
        console.log("[ExploreChatContext] Invalid chatCancelled data:", data);
      }
    };

    const handleUserDisconnected = (data: any) => {
      // if (Array.isArray(data)) {
      //   const matchId = data[1]?.matchId;
      //   if (matchId) {
      //     clearMatch(matchId);
      //   }
      // } else if (data?.matchId) {
      //   clearMatch(data);
      // } else {
      //   console.log(
      //     "[ExploreChatContext] Invalid userDisconnected data:",
      //     data
      //   );
      // }
    };

    const handleProfileLocked = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["user", matchedUser] });
    };

    const handleProfileUnlocked = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["user", matchedUser] });
    };

    socket.on("matchFound", handleMatchFound);
    socket.on("new_message", handleNewMessage);
    socket.on("matchmakingError", handleError);
    socket.on("chatCancelled", handleChatCancelled);
    socket.on("userDisconnected", handleUserDisconnected);
    socket.on("profileLocked", handleProfileLocked);
    socket.on("profileUnlocked", handleProfileUnlocked);

    return () => {
      // socket.off("matchFound", handleMatchFound);
      // socket.off("matchmakingError", handleError);
      // socket.off("chatCancelled", handleChatCancelled);
      socket.off("userDisconnected", handleUserDisconnected);
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
