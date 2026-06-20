"use client";
import {
  AUTH_ACCESS_TOKEN_EVENT,
  getAccessToken,
  getUser,
} from "@/service/storage";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

type Socket = ReturnType<typeof io>;

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isActive: boolean;
  revalidateSocket: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isActive: false,
  revalidateSocket: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const revalidateSocket = () => {
    const _user = getUser();
    setUserId(_user?._id || null);
    setAuthToken(getAccessToken());
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleAccessTokenChange = (event: Event) => {
      const nextToken =
        event instanceof CustomEvent
          ? (event.detail?.token ?? null)
          : getAccessToken();

      setAuthToken(nextToken);
    };

    window.addEventListener(
      AUTH_ACCESS_TOKEN_EVENT,
      handleAccessTokenChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        AUTH_ACCESS_TOKEN_EVENT,
        handleAccessTokenChange as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    if (!userId || !authToken) {
      setIsConnected(false);
      setIsActive(false);
      setSocket(null);
      return;
    }

    const applyLatestToken = () => {
      const nextToken = getAccessToken();
      if (!nextToken) return;
      newSocket.auth = { token: nextToken };
    };
    const handleReconnectAttempt = () => {
      applyLatestToken();
    };

    const newSocket = io(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/chat`,
      {
        auth: { token: authToken },
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
      applyLatestToken();
      setIsConnected(false);
      setIsActive(false);
    });

    newSocket.io.on("reconnect_attempt", handleReconnectAttempt);

    newSocket.on("reconnect", () => {
      setIsConnected(true);
      setIsActive(true);
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
      setIsConnected(false);
      setIsActive(false);

      if (reason === "io server disconnect") {
        applyLatestToken();
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
      newSocket.io.off("reconnect_attempt", handleReconnectAttempt);
      newSocket.close();
    };
  }, [authToken, userId]);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, isActive, revalidateSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};

