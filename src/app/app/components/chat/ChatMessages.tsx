import { useEffect, useRef } from "react";
import { MessageGroup } from "./MessageGroup";

interface Message {
  sender: string;
  message: string;
  timestamp: number;
}

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentUserId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message?.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = {
          messages: [],
          timestamp: message?.timestamp,
        };
      }
      groups[date].messages.push(message);
      return groups;
    },
    {} as Record<string, { messages: Message[]; timestamp: number }>
  );

  // Sort dates in ascending order
  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => groupedMessages[a]?.timestamp - groupedMessages[b]?.timestamp
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {sortedDates.map((date) => (
        <MessageGroup
          key={date}
          date={date}
          messages={groupedMessages[date]?.messages}
          currentUserId={currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
