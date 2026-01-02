"use client";
import { createSlot, fetchRoomData, updateSlot } from "@/lib/apis";
import { trackAnalytic } from "@/service/analytics";
import { getUser } from "@/service/storage";
import { useQuery } from "@tanstack/react-query";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { use, useEffect, useState } from "react";
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

const ChatScreen = ({ roomId }: { roomId: string }) => {
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [matchedUserId, setMatchedUserId] = useState("");
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

  const { user } = useUser(userId);
  const { user: matchedUser } = useUser(matchedUserId);
  const { socket } = useSocket();
  const {
    // matchId,
    // matchedUser,
    cancelChat,
    lockProfile,
    unlockProfile,
    messages,
    setMessages,
  } = useExploreChat();

  const {
    data: roomData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => fetchRoomData(roomId),
  });

  useEffect(() => {
    if (roomData && roomData.match) {
      const matchedProfile = roomData.participants.find(
        (p: any) => p._id !== user?._id
      );
      setMatchedUserId(matchedProfile._id);
    }
  }, [roomData, user]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col w-full h-full py-2">
      <ChatHeader
        user={matchedUser}
        isConnected={isConnected}
        onEndChat={() => cancelChat(roomId || "")}
        onSaveChat={() => {
          console.log("save chat");
        }}
        currentUserId={userId}
      />
      {/* <ChatMessages messages={messages} currentUserId={userId} /> */}
      <ChatInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={() => {}}
        onSend={() => {}}
        isConnected={isConnected}
      />
    </div>
  );
};

export default ChatScreen;
