import { useEffect, useRef } from "react";
import type { Message } from "../ChatScreen";
import { MessageGroup } from "./MessageGroup";

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
  onReply: (message: Message) => void;
  onStartEdit: (message: Message) => void;
  onToggleLike: (messageId: string, emoji?: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentUserId,
  onReply,
  onStartEdit,
  onToggleLike,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = {
          messages: [],
          timestamp: message.timestamp,
        };
      }
      groups[date].messages.push(message);
      return groups;
    },
    {} as Record<string, { messages: Message[]; timestamp: number }>
  );

  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => groupedMessages[a].timestamp - groupedMessages[b].timestamp
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {sortedDates.map((date) => (
        <MessageGroup
          key={date}
          date={date}
          messages={groupedMessages[date].messages}
          currentUserId={currentUserId}
          onReply={onReply}
          onStartEdit={onStartEdit}
          onToggleLike={onToggleLike}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
