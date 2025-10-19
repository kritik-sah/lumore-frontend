"use client";
import { getAccessToken, getUser } from "@/service/storage";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const user: any = getUser();

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      setIsConnected(false);
      setIsActive(false);
      return;
    }

    // Get the token from cookies
    const token = getAccessToken();
    if (!token) {
      return;
    }

    // If we already have a socket, don't create a new one
    if (socket?.connected) {
      console.log(
        "SocketContext: Socket already connected, skipping initialization"
      );
      return;
    }

    const newSocket = io(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/chat`,
      {
        auth: { token: token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ["websocket", "polling"],
      }
    );

    newSocket.on("connect", () => {
      setIsConnected(true);
      setIsActive(true);
    });

    newSocket.on("connect_error", (error: Error) => {
      setIsConnected(false);
      setIsActive(false);
    });

    newSocket.on("reconnect", (attemptNumber: number) => {
      setIsConnected(true);
      setIsActive(true);
    });

    newSocket.on("reconnect_attempt", (attemptNumber: number) => {});

    newSocket.on("reconnect_error", (error: Error) => {
      console.error("SocketContext: Reconnection error:", error);
    });

    newSocket.on("reconnect_failed", () => {
      console.error("SocketContext: Failed to reconnect after all attempts");
      setIsConnected(false);
      setIsActive(false);
    });

    newSocket.on("disconnect", (reason: string) => {
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
      clearInterval(pingInterval);
      newSocket.close();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, isActive }}>
      {children}
    </SocketContext.Provider>
  );
};
