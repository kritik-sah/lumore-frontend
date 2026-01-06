"use client";
import { usePushNotification } from "@/app/provider/PushNotificationProvider";
import { fetchRoomChat } from "@/lib/apis";
import { trackAnalytic } from "@/service/analytics";
import { queryClient } from "@/service/query-client";
import { getUser } from "@/service/storage";
import { useQueryClient } from "@tanstack/react-query";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
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
  isMatching: boolean;
  error: string | null;
  startMatchmaking: () => void;
  stopMatchmaking: () => void;
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
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

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

  const onMatchFound = (roomId: string, matchedUser: any) => {
    console.log("[Socket] Match found:", roomId, matchedUser);
    setMatchId(roomId);
    setIsMatching(false);
    router.push("/app/chat/" + roomId);
  };

  useEffect(() => {
    if (!socket) return;
    console.log("%c[SOCKET LISTENERS READY]", "color:#00FFFF");

    // ✅ When match is found
    socket.on("matchFound", ({ roomId, matchedUser }) => {
      onMatchFound(roomId, matchedUser);
    });

    // ✅ Error while matching
    socket.on("matchmakingError", ({ message }) => {
      console.error("[Socket] matchmakingError:", message);
      setError(message);
      setIsMatching(false);
    });

    socket.on("profileLocked", ({ lockedBy }) =>
      queryClient.invalidateQueries({
        queryKey: ["user", lockedBy],
      })
    );

    socket.on("profileUnlocked", ({ unlockedBy }) =>
      queryClient.invalidateQueries({
        queryKey: ["user", unlockedBy],
      })
    );

    // 🔥 Cleanup: avoids duplicate listeners
    return () => {
      socket.off("matchFound");
      socket.off("profileLocked");
      socket.off("profileUnlocked");
      socket.off("matchmakingError");
    };
  }, [socket, matchId]);

  return (
    <ExploreChatContext.Provider
      value={{
        matchId,
        isMatching,
        error,
        startMatchmaking,
        stopMatchmaking,
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
