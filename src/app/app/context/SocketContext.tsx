"use client";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

type Socket = ReturnType<typeof io>;

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isActive: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isActive: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    console.log(
      "SocketContext: Auth state - isLoading:",
      isLoading,
      "user:",
      user ? user._id : "null"
    );

    if (isLoading) {
      console.log("SocketContext: Waiting for auth to initialize...");
      return;
    }

    if (!user) {
      console.log(
        "SocketContext: No user found, skipping socket initialization"
      );
      if (socket) {
        console.log("SocketContext: Closing existing socket");
        socket.close();
        setSocket(null);
      }
      setIsConnected(false);
      setIsActive(false);
      return;
    }

    // Get the token from cookies
    const token = Cookies.get("token");
    console.log("SocketContext: Token:", token);

    if (!token) {
      console.log(
        "SocketContext: No token found, skipping socket initialization"
      );
      return;
    }

    // If we already have a socket, don't create a new one
    if (socket?.connected) {
      console.log(
        "SocketContext: Socket already connected, skipping initialization"
      );
      return;
    }

    console.log(
      "SocketContext: Initializing socket connection for user:",
      user._id
    );
    const newSocket = io(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/chat`,
      {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ["websocket", "polling"],
      }
    );

    newSocket.on("connect", () => {
      console.log(
        "SocketContext: Socket connected and authenticated for user:",
        user._id
      );
      setIsConnected(true);
      setIsActive(true);
    });

    newSocket.on("connect_error", (error: Error) => {
      console.error("SocketContext: Connection error:", error);
      setIsConnected(false);
      setIsActive(false);
    });

    newSocket.on("reconnect", (attemptNumber: number) => {
      console.log(
        `SocketContext: Socket reconnected after ${attemptNumber} attempts for user:`,
        user._id
      );
      setIsConnected(true);
      setIsActive(true);
    });

    newSocket.on("reconnect_attempt", (attemptNumber: number) => {
      console.log(
        `SocketContext: Reconnection attempt ${attemptNumber} for user:`,
        user._id
      );
    });

    newSocket.on("reconnect_error", (error: Error) => {
      console.error("SocketContext: Reconnection error:", error);
    });

    newSocket.on("reconnect_failed", () => {
      console.error("SocketContext: Failed to reconnect after all attempts");
      setIsConnected(false);
      setIsActive(false);
    });

    newSocket.on("disconnect", (reason: string) => {
      console.log(
        "SocketContext: Socket disconnected for user:",
        user._id,
        "Reason:",
        reason
      );
      setIsConnected(false);
      setIsActive(false);

      if (reason === "io server disconnect") {
        newSocket.connect();
      }
    });

    setSocket(newSocket);

    const pingInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit("ping");
      }
    }, 30000);

    return () => {
      console.log(
        "SocketContext: Cleaning up socket connection for user:",
        user._id
      );
      clearInterval(pingInterval);
      newSocket.close();
    };
  }, [user, isLoading]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, isActive }}>
      {children}
    </SocketContext.Provider>
  );
};
