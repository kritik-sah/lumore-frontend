import { useEffect, useState } from "react";
import type { Socket as SocketType } from "socket.io-client";
import io from "socket.io-client";

interface ProfileLockState {
  isLocked: boolean;
  lockedBy?: string;
  timestamp?: Date;
}

interface ProfileLockEvent {
  profileId: string;
  lockedBy?: string;
  unlockedBy?: string;
  timestamp: string;
}

interface ProfileErrorEvent {
  message: string;
}

interface SocketResponse {
  error?: string;
  success?: boolean;
}

export function useProfileLock(profileId: string, currentUserId: string) {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [lockState, setLockState] = useState<ProfileLockState>({
    isLocked: true, // Default to locked state
  });

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected for profile lock");
    });

    newSocket.on("profileUnlocked", (data: ProfileLockEvent) => {
      if (data.profileId === profileId) {
        setLockState({
          isLocked: false,
          lockedBy: data.unlockedBy,
          timestamp: new Date(data.timestamp),
        });
      }
    });

    newSocket.on("profileLocked", (data: ProfileLockEvent) => {
      if (data.profileId === profileId) {
        setLockState({
          isLocked: true,
          lockedBy: data.lockedBy,
          timestamp: new Date(data.timestamp),
        });
      }
    });

    newSocket.on("profileUnlockError", (error: ProfileErrorEvent) => {
      console.error("Profile unlock error:", error);
    });

    newSocket.on("profileLockError", (error: ProfileErrorEvent) => {
      console.error("Profile lock error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [profileId]);

  const unlockProfile = async () => {
    console.log("unlockProfile", profileId, currentUserId);
    if (!socket) return;

    return new Promise((resolve, reject) => {
      socket.emit(
        "unlockProfile",
        { profileId, userId: currentUserId },
        (response: SocketResponse) => {
          if (response?.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        }
      );
    });
  };

  const lockProfile = async () => {
    if (!socket) return;

    return new Promise((resolve, reject) => {
      socket.emit(
        "lockProfile",
        { profileId, userId: currentUserId },
        (response: SocketResponse) => {
          if (response?.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        }
      );
    });
  };

  return {
    isLocked: lockState.isLocked,
    lockedBy: lockState.lockedBy,
    timestamp: lockState.timestamp,
    unlockProfile,
    lockProfile,
  };
}
