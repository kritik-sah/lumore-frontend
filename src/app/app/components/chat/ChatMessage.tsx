import { useMemo, useRef } from "react";
import type { Message } from "../ChatScreen";

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  onReply: (message: Message) => void;
  onStartEdit: (message: Message) => void;
  onToggleLike: (messageId: string, emoji?: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwnMessage,
  onReply,
  onStartEdit,
  onToggleLike,
}) => {
  const lastTapRef = useRef(0);
  const type = message.messageType || "text";

  const reactionCounts = useMemo(() => {
    const grouped = new Map<string, number>();
    (message.reactions || []).forEach((reaction) => {
      const emoji = reaction.emoji || "\u2764\uFE0F";
      grouped.set(emoji, (grouped.get(emoji) || 0) + 1);
    });
    return Array.from(grouped.entries());
  }, [message.reactions]);

  const onDoubleLike = () => {
    if (!message._id) return;
    onToggleLike(message._id, "\u2764\uFE0F");
  };

  const handleTouchEnd = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 280) {
      onDoubleLike();
    }
    lastTapRef.current = now;
  };

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className="flex flex-col max-w-[75%] gap-1">
        <div
          onDoubleClick={onDoubleLike}
          onTouchEnd={handleTouchEnd}
          className={`rounded-xl whitespace-pre-wrap break-words p-3 ${
            isOwnMessage ? "bg-ui-highlight text-white" : "bg-ui-highlight/5"
          }`}
        >
          {message.replyTo ? (
            <div
              className={`mb-2 text-xs rounded-md px-2 py-1 border ${
                isOwnMessage
                  ? "border-white/40 bg-white/10"
                  : "border-ui-shade/20 bg-ui-light"
              }`}
            >
              Replying to {message.replyTo.senderId === message.sender ? "self" : "message"}: {" "}
              {message.replyTo.messageType === "image"
                ? "Photo"
                : message.replyTo.message || "Message"}
            </div>
          ) : null}

          {type === "image" && message.imageUrl ? (
            <img
              src={message.imageUrl}
              alt="Shared chat image"
              className="rounded-lg max-h-64 w-auto object-cover"
            />
          ) : (
            <span>
              <LinkifyText text={message.message} />
            </span>
          )}
        </div>

        {reactionCounts.length > 0 ? (
          <div className={`flex gap-2 text-xs ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            {reactionCounts.map(([emoji, count]) => (
              <span key={emoji} className="bg-ui-highlight/10 rounded-full px-2 py-0.5">
                {emoji} {count}
              </span>
            ))}
          </div>
        ) : null}

        <div className={`flex gap-3 text-xs ${isOwnMessage ? "justify-end" : "justify-start"}`}>
          <button
            type="button"
            onClick={() => onReply(message)}
            className="text-ui-shade/70 hover:text-ui-highlight"
          >
            Reply
          </button>
          {isOwnMessage && type === "text" && message._id ? (
            <button
              type="button"
              onClick={() => onStartEdit(message)}
              className="text-ui-shade/70 hover:text-ui-highlight"
            >
              Edit
            </button>
          ) : null}
        </div>

        <p
          className={`text-xs text-ui-shade/60 mt-1 opacity-70 ${
            isOwnMessage ? "text-end" : "text-start"
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
          {message.editedAt ? " (edited)" : ""}
          {message.pending ? " ..." : ""}
        </p>
      </div>
    </div>
  );
};

const LinkifyText = ({ text }: { text: string }) => {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;

  return text.split(urlRegex).map((part, index) => {
    if (!part) return null;

    if (part.match(urlRegex)) {
      const href = part.startsWith("http") ? part : `https://${part}`;

      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all underline"
        >
          {part}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

