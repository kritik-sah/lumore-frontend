"use client";
import { ChatRoomLoader } from "@/components/page-loaders";
import { deleteTempChatImage, uploadChatImage } from "@/lib/apis";
import { trackAnalytic } from "@/service/analytics";
import { getUser } from "@/service/storage";
import CryptoJS from "crypto-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatInput } from "./chat/ChatInput";
import { ChatMessages } from "./chat/ChatMessages";

export interface ChatReaction {
  userId: string;
  emoji: string;
}

export interface ChatReplyPreview {
  _id: string;
  senderId: string;
  messageType: "text" | "image";
  message: string;
  imageUrl?: string | null;
}

export interface Message {
  _id?: string;
  clientMessageId?: string;
  sender: string;
  message: string;
  messageType?: "text" | "image";
  imageUrl?: string | null;
  imagePublicId?: string | null;
  timestamp: number;
  replyTo?: ChatReplyPreview | null;
  reactions?: ChatReaction[];
  editedAt?: number | null;
  pending?: boolean;
}

interface PendingImage {
  previewUrl: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  uploading: boolean;
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

const DEFAULT_HEART_EMOJI = "\u2764\uFE0F";
const DRAFT_KEY_PREFIX = "chat_draft_";
const CLIENT_MESSAGE_ID_RANDOM_SLICE_START = 2;
const CLIENT_MESSAGE_ID_RANDOM_SLICE_END = 8;

const ChatScreen = () => {
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pendingImageRef = useRef<PendingImage | null>(null);
  const uploadRequestIdRef = useRef(0);

  const userId = useMemo(() => {
    try {
      return getUser()?._id || "";
    } catch (error) {
      console.error("[ChatScreen] Error parsing user:", error);
      return "";
    }
  }, []);

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

  const replyingToPreview = useMemo(() => {
    if (!replyingTo?._id) return null;
    return {
      _id: replyingTo._id,
      senderId: replyingTo.sender,
      messageType: replyingTo.messageType || "text",
      message:
        replyingTo.messageType === "image"
          ? "Photo"
          : (replyingTo.message || "").slice(0, 140),
      imageUrl: replyingTo.imageUrl || null,
    };
  }, [replyingTo]);

  const createClientMessageId = useCallback(
    () =>
      `${userId}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(
          CLIENT_MESSAGE_ID_RANDOM_SLICE_START,
          CLIENT_MESSAGE_ID_RANDOM_SLICE_END,
        )}`,
    [userId],
  );

  const clearPendingImage = useCallback(() => {
    setPendingImage((prev) => {
      if (prev?.previewUrl) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      return null;
    });
  }, []);

  useEffect(() => {
    if (!roomId) return;
    try {
      const saved = localStorage.getItem(`${DRAFT_KEY_PREFIX}${roomId}`);
      if (saved) {
        setNewMessage(saved);
      }
    } catch (error) {
      console.error("[ChatScreen] Failed to read room draft:", error);
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    try {
      const key = `${DRAFT_KEY_PREFIX}${roomId}`;
      if (newMessage.trim()) {
        localStorage.setItem(key, newMessage);
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error("[ChatScreen] Failed to persist room draft:", error);
    }
  }, [roomId, newMessage]);

  useEffect(() => {
    if (!socket || !roomId) return;

    const storedKey = localStorage.getItem(`chat_key_${roomId}`);
    if (storedKey) {
      setIsConnected(true);
    }

    socket.emit("joinChat", { roomId });

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

    socket.on("key_exchange_response", async (data: KeyExchangeResponse) => {
      const { sessionKey } = data;

      if (storedKey !== sessionKey) {
        localStorage.setItem(`chat_key_${roomId}`, sessionKey);
        setIsConnected(true);
      }
    });

    socket.emit("init_key_exchange", { roomId });

    return () => {
      socket.off("key_exchange_request");
      socket.off("key_exchange_response");
    };
  }, [socket, roomId]);

  const encryptText = (text: string) => {
    const encryptionKey = localStorage.getItem(`chat_key_${roomId}`);
    if (!encryptionKey) return null;

    const iv = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.enc.Hex.parse(encryptionKey);
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return {
      encryptedContent: encrypted.ciphertext.toString(CryptoJS.enc.Hex),
      iv: iv.toString(CryptoJS.enc.Hex),
    };
  };

  const sendMessage = () => {
    if (!socket || !roomId || !matchedUser || !isActive) return;
    if (pendingImage?.uploading) return;

    const trimmed = newMessage.trim();
    if (!trimmed && !pendingImage) return;

    if (editingMessageId) {
      if (!trimmed) return;
      const encryptedPayload = encryptText(trimmed);
      if (!encryptedPayload) return;

      socket.emit("edit_message", {
        roomId,
        messageId: editingMessageId,
        encryptedContent: encryptedPayload.encryptedContent,
        iv: encryptedPayload.iv,
      });
      setEditingMessageId(null);
      setNewMessage("");
      return;
    }

    if (pendingImage && !pendingImage.uploading && pendingImage.imageUrl && pendingImage.imagePublicId) {
      const imageClientMessageId = createClientMessageId();

      socket.emit("send_message", {
        roomId,
        receiverId: matchedUser._id,
        messageType: "image",
        imageUrl: pendingImage.imageUrl,
        imagePublicId: pendingImage.imagePublicId,
        replyTo: replyingToPreview?._id || null,
        clientMessageId: imageClientMessageId,
      });

      setMessages((prev) => [
        ...prev,
        {
          clientMessageId: imageClientMessageId,
          sender: userId,
          message: "",
          messageType: "image",
          imageUrl: pendingImage.imageUrl,
          imagePublicId: pendingImage.imagePublicId,
          timestamp: Date.now(),
          replyTo: replyingToPreview,
          reactions: [],
          pending: true,
        },
      ]);
    }

    if (trimmed) {
      const encryptedPayload = encryptText(trimmed);
      if (encryptedPayload) {
        const textClientMessageId = createClientMessageId();

        trackAnalytic({
          activity: "message_sent",
          label: "Message Sent",
          value: roomId,
        });

        socket.emit("send_message", {
          roomId,
          receiverId: matchedUser._id,
          encryptedContent: encryptedPayload.encryptedContent,
          iv: encryptedPayload.iv,
          replyTo: replyingToPreview?._id || null,
          messageType: "text",
          clientMessageId: textClientMessageId,
        });

        setMessages((prev) => [
          ...prev,
          {
            clientMessageId: textClientMessageId,
            sender: userId,
            message: trimmed,
            messageType: "text",
            timestamp: Date.now(),
            replyTo: replyingToPreview,
            reactions: [],
            pending: true,
          },
        ]);
      }
    }

    setNewMessage("");
    setReplyingTo(null);
    clearPendingImage();
  };

  const handleImageSelect = async (file: File) => {
    if (!roomId || !isActive || !file) return;
    const requestId = ++uploadRequestIdRef.current;
    const previewUrl = URL.createObjectURL(file);
    const previousPending = pendingImageRef.current;

    try {
      setUploadError(null);
      setIsUploadingImage(true);
      setPendingImage((prev) => {
        if (prev?.previewUrl) {
          URL.revokeObjectURL(prev.previewUrl);
        }
        return {
          previewUrl,
          imagePublicId: null,
          imageUrl: null,
          uploading: true,
        };
      });

      const uploaded = await uploadChatImage(roomId, file);

      if (requestId !== uploadRequestIdRef.current) {
        if (uploaded?.imagePublicId) {
          await deleteTempChatImage(uploaded.imagePublicId).catch(() => {});
        }
        return;
      }

      setPendingImage((prev) => {
        if (!prev || prev.previewUrl !== previewUrl) {
          return prev;
        }
        return {
          previewUrl,
          imagePublicId: uploaded.imagePublicId,
          imageUrl: uploaded.imageUrl,
          uploading: false,
        };
      });

      if (previousPending?.imagePublicId) {
        await deleteTempChatImage(previousPending.imagePublicId);
      }
    } catch (error: any) {
      if (requestId !== uploadRequestIdRef.current) return;
      const status = Number(error?.response?.status || 0);
      const apiMessage = error?.response?.data?.message;
      const fallbackMessage =
        status === 413
          ? "Image is too large. Please choose a smaller image."
          : status === 503
            ? "Image safety scan is temporarily unavailable. Please try again."
          : status === 422
            ? "Image was blocked by safety checks. Please choose another image."
            : "Image upload failed. Please try again.";
      setUploadError(apiMessage || fallbackMessage);
      setPendingImage((prev) => {
        if (prev?.previewUrl === previewUrl) {
          URL.revokeObjectURL(previewUrl);
          return null;
        }
        return prev;
      });
      console.error("[ChatScreen] Image upload failed:", error);
    } finally {
      if (requestId === uploadRequestIdRef.current) {
        setIsUploadingImage(false);
      }
    }
  };

  const handleDiscardSelectedImage = async () => {
    if (!pendingImage) return;
    uploadRequestIdRef.current += 1;

    try {
      setUploadError(null);
      if (pendingImage.imagePublicId) {
        await deleteTempChatImage(pendingImage.imagePublicId);
      }
    } catch (error) {
      console.error("[ChatScreen] Temp image delete failed:", error);
    } finally {
      clearPendingImage();
      setIsUploadingImage(false);
    }
  };

  useEffect(() => {
    pendingImageRef.current = pendingImage;
  }, [pendingImage]);

  useEffect(() => {
    return () => {
      const pending = pendingImageRef.current;
      if (pending?.previewUrl) {
        URL.revokeObjectURL(pending.previewUrl);
      }
      if (pending?.imagePublicId) {
        void deleteTempChatImage(pending.imagePublicId).catch(() => {});
      }
    };
  }, []);

  const handleToggleLike = (messageId: string, emoji = DEFAULT_HEART_EMOJI) => {
    if (!socket || !roomId || !messageId) return;
    socket.emit("toggle_message_reaction", {
      roomId,
      messageId,
      emoji,
    });
  };

  const handleReply = (msg: Message) => {
    setReplyingTo(msg);
    setEditingMessageId(null);
  };

  const handleStartEdit = (msg: Message) => {
    if (!msg._id || msg.sender !== userId || msg.messageType !== "text") return;
    setEditingMessageId(msg._id);
    setReplyingTo(null);
    setNewMessage(msg.message);
  };

  const cancelReply = () => setReplyingTo(null);
  const cancelEdit = () => {
    setEditingMessageId(null);
    setNewMessage("");
  };

  const dismissUploadError = () => setUploadError(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!matchedUser || isLoading) return <ChatRoomLoader />;

  return (
    <div className="flex flex-col w-full h-full py-2">
      <ChatHeader
        user={matchedUser}
        isConnected={isConnected}
        onEndChat={cancelChat}
        currentUserId={userId}
      />
      <ChatMessages
        messages={messages}
        currentUserId={userId}
        onReply={handleReply}
        onStartEdit={handleStartEdit}
        onToggleLike={handleToggleLike}
      />
      <ChatInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        onSend={sendMessage}
        onImageSelect={handleImageSelect}
        onDiscardSelectedImage={handleDiscardSelectedImage}
        isConnected={isConnected}
        isActive={isActive}
        roomData={roomData}
        userId={userId}
        isUploadingImage={isUploadingImage}
        replyingTo={replyingToPreview}
        onCancelReply={cancelReply}
        isEditing={Boolean(editingMessageId)}
        onCancelEdit={cancelEdit}
        pendingImage={pendingImage}
        uploadError={uploadError}
        onDismissUploadError={dismissUploadError}
      />
    </div>
  );
};

export default ChatScreen;
