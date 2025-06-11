"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
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
import { fetchRoomChat } from "@/lib/apis";

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
}

const ExploreChatContext = createContext<ExploreChatContextType | undefined>(
  undefined
);

export const ExploreChatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { _id: userId } = JSON.parse(Cookies.get("user") || "{}");
  const { user } = useUser(userId);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<any | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();
  const { user: matchedUserData } = useUser(matchedUser || "");
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadMessages = async () => {
      if (!matchId) return;

      const encryptionKey = localStorage.getItem(`chat_key_${matchId}`);
      console.log("Encryption Key:", encryptionKey);

      if (!encryptionKey) {
        console.warn("[ExploreChatContext] No encryption key found.");
        return;
      }

      try {
        const rawMessages = await fetchRoomChat(matchId);
        const key = CryptoJS.enc.Hex.parse(encryptionKey);

        const decryptedMessages: Message[] = rawMessages.map((msg: any) => {
          try {
            // Convert character codes to hex string
            const encryptedHexStr = String.fromCharCode(...msg.encryptedData.data);
            const ivHexStr = String.fromCharCode(...msg.iv.data);

            const ciphertextWordArray = CryptoJS.enc.Hex.parse(encryptedHexStr);
            const base64CipherText = CryptoJS.enc.Base64.stringify(ciphertextWordArray);
            const iv = CryptoJS.enc.Hex.parse(ivHexStr);

            const decrypted = CryptoJS.AES.decrypt(base64CipherText, key, {
              iv,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7,
            });

            const message = decrypted.toString(CryptoJS.enc.Utf8);
            if (!message) throw new Error("Failed to decrypt message");

            console.log("[ExploreChatContext] Decrypted message:", message);

            return {
              sender: msg.sender?._id || msg.sender,
              message,
              timestamp: new Date(msg.createdAt).getTime(),
            };
          } catch (err) {
            console.warn("[ExploreChatContext] Skipped a message due to decryption error:", err);
            return null;
          }
        }).filter(Boolean) as Message[];

        setMessages(decryptedMessages);
      } catch (error) {
        console.error("[ExploreChatContext] Error loading messages:", error);
      }
    };

    loadMessages();
  }, [matchId]);

  const startMatchmaking = () => {
    if (!socket || !user || isMatching) return;
    setIsMatching(true);
    setError(null);
    socket.emit("startMatchmaking");
    console.log("startMatchmaking");
  };

  const stopMatchmaking = () => {
    if (!socket || !userId || !isMatching) return;
    setIsMatching(false);
    socket.emit("stopMatchmaking", { userId });
    console.log("stopMatchmaking for :", userId);
  };

  const cancelChat = (matchId: string) => {
    if (!socket) return;
    console.log(
      "[ExploreChatContext] Emitting cancelChat event for matchId:",
      matchId
    );
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
    socket.emit("lockProfile", { matchId, userId, profileId });
  };
  const unlockProfile = (
    matchId: string,
    userId: string,
    profileId: string
  ) => {
    if (!socket) return;
    socket.emit("unlockProfile", { matchId, userId, profileId });
  };

  const handleNewMessage = (data: {
    senderId: string;
    encryptedData: string;
    iv: string;
    timestamp: number;
  }) => {
    console.log("[ChatScreen] Received new message:", data);

    const encryptionKey = localStorage.getItem(`chat_key_${matchId}`);
    if (!encryptionKey) {
      console.warn("[ChatScreen] No encryption key available, cannot decrypt message.");
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

      if (!message) throw new Error("Decryption failed: Message is empty or invalid UTF-8");

      console.log("[ChatScreen] Decrypted message:", message);

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
      console.log("[ExploreChatContext] Match found:", data);
      setMatchId(data.matchId);
      setMatchedUser(data.matchedUser);
      setIsMatching(false);
    };

    const handleError = (error: { message: string }) => {
      console.log("[ExploreChatContext] Matchmaking error:", error);
      setError(error.message);
      setIsMatching(false);
    };

    const handleChatCancelled = (data: any) => {
      console.log("[ExploreChatContext] Received chatCancelled event:", data);
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
      console.log(
        "[ExploreChatContext] Received userDisconnected event:",
        data
      );
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
      console.log("[ExploreChatContext] Received profileLocked event:", data);
      queryClient.invalidateQueries({ queryKey: ["user", matchedUser] });
    };

    const handleProfileUnlocked = (data: any) => {
      console.log("[ExploreChatContext] Received profileUnlocked event:", data);
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
      console.log("[ExploreChatContext] Cleaning up socket event listeners");
      // socket.off("matchFound", handleMatchFound);
      // socket.off("matchmakingError", handleError);
      // socket.off("chatCancelled", handleChatCancelled);
      socket.off("userDisconnected", handleUserDisconnected);
    };
  }, [socket, matchId, clearMatch]);

  // useEffect(() => {
  //   if (matchId && socket) {

  //   }
  // }, [matchId, socket]);

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
