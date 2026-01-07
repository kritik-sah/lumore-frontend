"use client";
import { createSlot, fetchRoomData, updateSlot } from "@/lib/apis";
import { trackAnalytic } from "@/service/analytics";
import { getUser } from "@/service/storage";
import { useQuery } from "@tanstack/react-query";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import { useUser } from "../hooks/useUser";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatInput } from "./chat/ChatInput";
import { ChatMessages } from "./chat/ChatMessages";
import LumoreSplash from "./LumoreSplash";

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

const ChatScreen = () => {
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  // Safely parse user from cookie with error handling
  let userId = "";
  try {
    const _user = getUser();
    if (_user) {
      userId = _user?._id || "";
    }
  } catch (error) {
    console.error("[ChatScreen] Error parsing user:", error);
  }
  const { socket } = useSocket();
  const {
    roomId,
    roomData,
    matchedUser,
    cancelChat,
    messages,
    setMessages,
    isLoading,
    isActive,
  } = useChat();

  useEffect(() => {
    if (!socket || !roomId) return;

    // Retrieve encryption key from localStorage
    const storedKey = localStorage.getItem(`chat_key_${roomId}`);
    if (storedKey) {
      setIsConnected(true);
    }

    // Join the chat room
    socket.emit("joinChat", { roomId });

    // Handle key exchange requests
    socket.on("key_exchange_request", async (data: KeyExchangeRequest) => {
      const { fromUserId, sessionKey } = data;

      if (roomId && storedKey !== sessionKey) {
        localStorage.setItem(`chat_key_${roomId}`, sessionKey);
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
      const { sessionKey } = data;

      if (storedKey !== sessionKey) {
        localStorage.setItem(`chat_key_${roomId}`, sessionKey);
        setIsConnected(true);
      }
    });

    // Initiate key exchange
    socket.emit("init_key_exchange", { roomId });

    // Cleanup on unmount
    return () => {
      socket.off("key_exchange_request");
      socket.off("key_exchange_response");
    };
  }, [socket, roomId, userId, matchedUser]);

  const sendMessage = () => {
    if (!socket || !newMessage.trim() || !roomId || !matchedUser) return;

    const encryptionKey = localStorage.getItem(`chat_key_${roomId}`);
    if (!encryptionKey) {
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
      trackAnalytic({
        activity: "message_sent",
        label: "Message Sent",
        value: roomId,
      });
      socket.emit("send_message", {
        roomId,
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

  if (!matchedUser || isLoading) return <LumoreSplash />;

  return (
    <div className="flex flex-col w-full h-full py-2">
      <ChatHeader
        user={matchedUser}
        isConnected={isConnected}
        onEndChat={cancelChat}
        currentUserId={userId}
      />
      <ChatMessages messages={messages} currentUserId={userId} />
      <ChatInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        onSend={sendMessage}
        isConnected={isConnected}
        isActive={isActive}
        roomData={roomData}
        userId={userId}
      />
    </div>
  );
};

export default ChatScreen;
