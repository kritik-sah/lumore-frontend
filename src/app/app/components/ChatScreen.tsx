"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useExploreChat } from "../context/ExploreChatContext";
import { useSocket } from "../context/SocketContext";
import { useUser } from "../hooks/useUser";

interface Message {
  sender: string;
  message: string;
  timestamp: number;
}

interface ChatScreenProps {
  matchId: string;
  matchedUser: any;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasJoinedRoomRef = useRef(false);
  const hasInitiatedKeyExchangeRef = useRef(false);

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
    if (!hasJoinedRoomRef.current) {
      console.log("[ChatScreen] Joining chat room:", matchId);
      socket.emit("joinChat", { matchId });
      hasJoinedRoomRef.current = true;
    }

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

    // Initiate key exchange if needed
    if (!hasInitiatedKeyExchangeRef.current) {
      console.log("[ChatScreen] Initiating key exchange");
      socket.emit("init_key_exchange", { matchId });
      hasInitiatedKeyExchangeRef.current = true;
    }

    // Cleanup on unmount
    return () => {
      socket.off("key_exchange_request");
      socket.off("key_exchange_response");
      socket.off("new_message");
      socket.off("chatCancelled");
    };
  }, [socket, matchId, userId, matchedUser?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      <div className="flex items-center justify-between p-4 border-b border-ui-shade/10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-ui-highlight"></div>
          <div>
            <h2 className="font-medium">{matchedUser.username}</h2>
            <p className="text-sm text-ui-shade/60">
              {isConnected ? "Secure Connection" : "Connecting..."}
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => cancelChat(matchId || "")}
        >
          End Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === userId
                  ? "bg-ui-highlight text-white"
                  : "bg-ui-shade/10"
              }`}
            >
              <p>{message.message}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-ui-shade/10">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={!isConnected}
          />
          <Button onClick={sendMessage} disabled={!isConnected}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
