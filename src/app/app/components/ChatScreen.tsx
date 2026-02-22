"use client";
import { ChatRoomLoader } from "@/components/page-loaders";
import {
  deleteTempChatImage,
  fetchRecoveryStatus,
  setupRecoveryPin,
  uploadChatImage,
} from "@/lib/apis";
import {
  buildPinRecoveryBackup,
  ensureIdentityKeyPair,
} from "@/lib/chat-crypto/identity";
import { messageSchema } from "@/lib/validation";
import { trackAnalytic } from "@/service/analytics";
import {
  getUser,
  setChatSecurePromptShownToday,
  wasChatSecurePromptShownToday,
} from "@/service/storage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatInput } from "./chat/ChatInput";
import { ChatMessages } from "./chat/ChatMessages";
import type { EncryptedMessageContent } from "@/lib/chat-crypto/message";
import { RecoveryPinSheet } from "./recovery/RecoveryPinSheet";

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
  encryptedContent?: EncryptedMessageContent | null;
  messageType?: "text" | "image";
  imageUrl?: string | null;
  imagePublicId?: string | null;
  timestamp: number;
  replyTo?: ChatReplyPreview | null;
  reactions?: ChatReaction[];
  editedAt?: number | null;
  deliveredAt?: number | null;
  readAt?: number | null;
  pending?: boolean;
}

interface PendingImage {
  previewUrl: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  uploading: boolean;
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
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [recoveryEnabled, setRecoveryEnabled] = useState(true);
  const [secureSheetOpen, setSecureSheetOpen] = useState(false);
  const [secureStatus, setSecureStatus] = useState<string | null>(null);
  const [secureLoading, setSecureLoading] = useState(false);
  const pendingImageRef = useRef<PendingImage | null>(null);
  const uploadRequestIdRef = useRef(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const partnerTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

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
    encryptTextForSend,
  } = useChat();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const status = await fetchRecoveryStatus();
        if (!cancelled) {
          setRecoveryEnabled(Boolean(status?.recoveryEnabled));
        }
      } catch {
        if (!cancelled) {
          setRecoveryEnabled(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

    socket.emit("joinChat", { roomId });
    setIsConnected(socket.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.emit("leaveChat", { roomId });
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket, roomId]);

  const sendMessage = async () => {
    if (!socket || !roomId || !matchedUser || !isActive) return;
    if (pendingImage?.uploading) return;

    const trimmed = newMessage.trim();
    if (!trimmed && !pendingImage) return;
    if (
      !recoveryEnabled &&
      userId &&
      !wasChatSecurePromptShownToday(userId) &&
      !secureSheetOpen
    ) {
      setChatSecurePromptShownToday(userId);
      setSecureSheetOpen(true);
      return;
    }
    if (trimmed) {
      const messageResult = messageSchema.safeParse(trimmed);
      if (!messageResult.success) {
        setUploadError(messageResult.error.issues[0]?.message || "Invalid message.");
        return;
      }
    }

    if (editingMessageId) {
      if (!trimmed) return;
      const encrypted = await encryptTextForSend(trimmed);
      socket.emit("edit_message", {
        roomId,
        messageId: editingMessageId,
        message: encrypted ? undefined : trimmed,
        encryptedContent: encrypted?.encryptedContent || null,
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
          deliveredAt: null,
          readAt: null,
        },
      ]);
    }

    if (trimmed) {
      const textClientMessageId = createClientMessageId();
      const encrypted = await encryptTextForSend(trimmed);

      trackAnalytic({
        activity: "message_sent",
        label: "Message Sent",
        value: roomId,
      });

      socket.emit("send_message", {
        roomId,
        receiverId: matchedUser._id,
        message: encrypted ? undefined : trimmed,
        encryptedContent: encrypted?.encryptedContent || null,
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
          encryptedContent: encrypted?.encryptedContent || null,
          messageType: "text",
          timestamp: Date.now(),
          replyTo: replyingToPreview,
          reactions: [],
          pending: true,
          deliveredAt: null,
          readAt: null,
        },
      ]);
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
      const localMessage = error instanceof Error ? error.message : null;
      const fallbackMessage =
        status === 413
          ? "Image is too large. Please choose a smaller image."
          : "Image upload failed. Please try again.";
      setUploadError(apiMessage || localMessage || fallbackMessage);
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

  useEffect(() => {
    if (!socket || !roomId || !matchedUser?._id || !isActive) return;

    const onTyping = (payload: {
      roomId?: string;
      userId?: string;
      isTyping?: boolean;
    }) => {
      if (payload?.roomId !== roomId) return;
      if (payload?.userId !== matchedUser._id) return;

      const typing = Boolean(payload?.isTyping);
      setIsPartnerTyping(typing);

      if (partnerTypingTimeoutRef.current) {
        clearTimeout(partnerTypingTimeoutRef.current);
      }

      if (typing) {
        partnerTypingTimeoutRef.current = setTimeout(() => {
          setIsPartnerTyping(false);
        }, 2500);
      }
    };

    socket.on("typing", onTyping);
    return () => {
      socket.off("typing", onTyping);
      if (partnerTypingTimeoutRef.current) {
        clearTimeout(partnerTypingTimeoutRef.current);
        partnerTypingTimeoutRef.current = null;
      }
    };
  }, [socket, roomId, matchedUser?._id, isActive]);

  useEffect(() => {
    if (!socket || !roomId || !isActive) return;

    const isTyping = newMessage.trim().length > 0;
    socket.emit("typing", { roomId, isTyping });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", { roomId, isTyping: false });
      }, 1500);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [newMessage, socket, roomId, isActive]);

  useEffect(() => {
    return () => {
      if (socket && roomId) {
        socket.emit("typing", { roomId, isTyping: false });
      }
    };
  }, [socket, roomId]);

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
        isPartnerTyping={isPartnerTyping}
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
      <RecoveryPinSheet
        open={secureSheetOpen}
        onOpenChange={setSecureSheetOpen}
        title="Secure your chats"
        description="Set a 6-digit chat PIN to restore secure messages on new devices."
        submitLabel="Secure now"
        secondaryLabel="Later"
        onSecondary={() => setSecureSheetOpen(false)}
        loading={secureLoading}
        statusText={secureStatus}
        onSubmit={async (pin) => {
          setSecureLoading(true);
          setSecureStatus(null);
          try {
            await ensureIdentityKeyPair();
            const backup = await buildPinRecoveryBackup(pin);
            await setupRecoveryPin({ ...backup, pin });
            setRecoveryEnabled(true);
            setSecureStatus("Chats are secured.");
            setSecureSheetOpen(false);
          } catch {
            setSecureStatus("Could not secure chats right now.");
          } finally {
            setSecureLoading(false);
          }
        }}
      />
    </div>
  );
};

export default ChatScreen;
