"use client";
import { createSlot, updateSlot } from "@/lib/apis";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useExploreChat } from "../context/ExploreChatContext";
import { useSocket } from "../context/SocketContext";
import { useUser } from "../hooks/useUser";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatInput } from "./chat/ChatInput";
import { ChatMessages } from "./chat/ChatMessages";

export interface Message {
  sender: string;
  message: string;
  timestamp: number;
}

interface KeyExchangeRequest {
  fromUserId: string;
  sessionKey: string;
  timestamp: number;
}

interface KeyExchangeResponse {
  fromUserId: string;
  sessionKey: string;
  timestamp: number;
}

const ChatScreen: React.FC = () => {
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Safely parse user from cookie with error handling
  let userId = "";
  try {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      userId = parsedUser?._id || "";
    }
  } catch (error) {
    console.error("[ChatScreen] Error parsing user cookie:", error);
  }

  const { user } = useUser(userId);
  const { socket } = useSocket();
  const {
    matchId,
    matchedUser,
    cancelChat,
    lockProfile,
    unlockProfile,
    messages,
    setMessages,
  } = useExploreChat();

  useEffect(() => {
    if (!socket || !matchId) return;

    // Retrieve encryption key from localStorage
    const storedKey = localStorage.getItem(`chat_key_${matchId}`);
    if (storedKey) {
      console.log("[ChatScreen] Retrieved encryption key from localStorage");
      setIsConnected(true);
    }

    // Join the chat room
    socket.emit("joinChat", { matchId });

    // Handle key exchange requests
    socket.on("key_exchange_request", async (data: KeyExchangeRequest) => {
      console.log("[ChatScreen] Received key exchange request:", data);
      const { fromUserId, sessionKey } = data;

      if (storedKey !== sessionKey) {
        console.log("[ChatScreen] Storing new encryption key");
        localStorage.setItem(`chat_key_${matchId}`, sessionKey);
        setIsConnected(true);
        socket.emit("key_exchange_response", {
          fromUserId,
          sessionKey,
          timestamp: Date.now(),
        });
      }
    });

    // Handle key exchange responses
    socket.on("key_exchange_response", async (data: KeyExchangeResponse) => {
      console.log("[ChatScreen] Received key exchange response:", data);
      const { sessionKey } = data;

      if (storedKey !== sessionKey) {
        console.log("[ChatScreen] Updating encryption key");
        localStorage.setItem(`chat_key_${matchId}`, sessionKey);
        setIsConnected(true);
      }
    });

    // Initiate key exchange
    socket.emit("init_key_exchange", { matchId });

    // Cleanup on unmount
    return () => {
      socket.off("key_exchange_request");
      socket.off("key_exchange_response");
      socket.off("new_message");
      socket.off("chatCancelled");
    };
  }, [socket, matchId, userId, matchedUser?._id]);

  const sendMessage = () => {
    if (!socket || !newMessage.trim() || !matchId || !matchedUser) return;

    const encryptionKey = localStorage.getItem(`chat_key_${matchId}`);
    console.log("matchId: ===>", matchId);
    console.log("sessionKey: ===>", encryptionKey);
    if (!encryptionKey) {
      console.log(
        "[ChatScreen] No encryption key available, cannot send message"
      );
      return;
    }
    try {
      const iv = CryptoJS.lib.WordArray.random(16);
      const key = CryptoJS.enc.Hex.parse(encryptionKey);
      const encrypted = CryptoJS.AES.encrypt(newMessage.trim(), key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      socket.emit("send_message", {
        matchId,
        receiverId: matchedUser._id,
        encryptedContent: encrypted.ciphertext.toString(CryptoJS.enc.Hex),
        iv: iv.toString(CryptoJS.enc.Hex),
      });
      setMessages((prev) => [
        ...prev,
        { sender: userId, message: newMessage.trim(), timestamp: Date.now() },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("[ChatScreen] Error encrypting message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const saveChat = async () => {
    if (!matchId || !matchedUser) {
      toast.error("Missing required information to save chat");
      return;
    }

    try {
      // First create a new slot
      const newSlot = await createSlot();

      // Then update the slot with the chat room and profile information
      await updateSlot(newSlot._id, {
        profile: matchedUser._id,
        roomId: matchId,
      });

      toast.success("Chat saved successfully!");
    } catch (error: any) {
      console.error("Error saving chat:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save chat";
      toast.error(errorMessage);
    }
  };

  if (!matchedUser) return <div>Loading...</div>;

  return (
    <div className="flex flex-col w-full h-full py-2">
      <ChatHeader
        user={matchedUser}
        isConnected={isConnected}
        onEndChat={() => cancelChat(matchId || "")}
        onSaveChat={() => saveChat()}
        currentUserId={userId}
      />
      <ChatMessages messages={messages} currentUserId={userId} />
      <ChatInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        onSend={sendMessage}
        isConnected={isConnected}
      />
    </div>
  );
};

export default ChatScreen;
