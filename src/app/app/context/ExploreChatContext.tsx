"use client";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { useSocket } from "./SocketContext";

interface ExploreChatContextType {
  matchId: string | null;
  matchedUser: any | null;
  isMatching: boolean;
  error: string | null;
  startMatchmaking: () => void;
  stopMatchmaking: () => void;
  clearMatch: (data: any) => void;
  cancelChat: (matchId: string) => void;
}

const ExploreChatContext = createContext<ExploreChatContextType | undefined>(
  undefined
);

export const ExploreChatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [matchId, setMatchId] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<any | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();
  const { _id: userId } = JSON.parse(Cookies.get("user") || "{}");
  const { user } = useUser(userId);
  const { user: matchedUserData } = useUser(matchedUser || "");

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
  };

  const clearMatch = (data: any) => {
    console.log("[ExploreChatContext] clearMatch called with data:", data);
    setMatchId(null);
    setMatchedUser(null);
    setError(null);
    setIsMatching(false);
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
      if (data && data.matchId) {
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
      if (data && data.matchId) {
        clearMatch(data);
      } else {
        console.log(
          "[ExploreChatContext] Invalid userDisconnected data:",
          data
        );
      }
    };

    console.log("[ExploreChatContext] Registering socket event listeners");

    socket.on("matchFound", handleMatchFound);
    socket.on("matchmakingError", handleError);
    socket.on("chatCancelled", handleChatCancelled);
    socket.on("userDisconnected", handleUserDisconnected);

    return () => {
      console.log("[ExploreChatContext] Cleaning up socket event listeners");
      socket.off("matchFound", handleMatchFound);
      socket.off("matchmakingError", handleError);
      socket.off("chatCancelled", handleChatCancelled);
      socket.off("userDisconnected", handleUserDisconnected);
    };
  }, [socket]);

  return (
    <ExploreChatContext.Provider
      value={{
        matchId,
        matchedUser: matchedUserData,
        isMatching,
        error,
        startMatchmaking,
        stopMatchmaking,
        clearMatch,
        cancelChat,
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
