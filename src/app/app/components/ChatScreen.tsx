"use client";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useExploreChat } from "../context/ExploreChatContext";
import { useSocket } from "../context/SocketContext";
import { useUser } from "../hooks/useUser";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatInput } from "./chat/ChatInput";
import { ChatMessages } from "./chat/ChatMessages";

interface Message {
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
  const [messages, setMessages] = useState<Message[]>([]);
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
  const { clearMatch, matchId, matchedUser, cancelChat } = useExploreChat();

  useEffect(() => {
    if (!socket || !matchId) return;

    // Retrieve encryption key from sessionStorage
    const storedKey = sessionStorage.getItem(`chat_key_${matchId}`);
    if (storedKey) {
      console.log("[ChatScreen] Retrieved encryption key from sessionStorage");
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
        sessionStorage.setItem(`chat_key_${matchId}`, sessionKey);
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
        sessionStorage.setItem(`chat_key_${matchId}`, sessionKey);
        setIsConnected(true);
      }
    });

    // Handle new messages
    socket.on(
      "new_message",
      (data: {
        senderId: string;
        encryptedData: string;
        iv: string;
        timestamp: number;
      }) => {
        console.log("[ChatScreen] Received new message:", data);

        const encryptionKey = sessionStorage.getItem(`chat_key_${matchId}`);
        if (!encryptionKey) {
          console.log(
            "[ChatScreen] No encryption key available, message cannot be decrypted"
          );
          return;
        }

        try {
          const key = CryptoJS.enc.Hex.parse(encryptionKey);
          const iv = CryptoJS.enc.Hex.parse(data.iv);
          const decrypted = CryptoJS.AES.decrypt(
            CryptoJS.enc.Hex.parse(data.encryptedData).toString(
              CryptoJS.enc.Base64
            ),
            key,
            {
              iv,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7,
            }
          );

          const message = decrypted.toString(CryptoJS.enc.Utf8);
          if (!message) throw new Error("Decryption failed, empty message");

          setMessages((prev) => [
            ...prev,
            { sender: data.senderId, message, timestamp: data.timestamp },
          ]);
        } catch (error) {
          console.error("[ChatScreen] Error decrypting message:", error);
        }
      }
    );

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

    const encryptionKey = sessionStorage.getItem(`chat_key_${matchId}`);
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

  if (!matchedUser) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-[95vh] bg-ui-background/10">
      <ChatHeader
        username={matchedUser.username}
        isConnected={isConnected}
        onEndChat={() => cancelChat(matchId || "")}
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
