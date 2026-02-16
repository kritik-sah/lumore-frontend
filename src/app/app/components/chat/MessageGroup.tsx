import type { Message } from "../ChatScreen";
import { ChatMessage } from "./ChatMessage";
import { DateHeader } from "./DateHeader";

interface MessageGroupProps {
  date: string;
  messages: Message[];
  currentUserId: string;
  onReply: (message: Message) => void;
  onStartEdit: (message: Message) => void;
  onToggleLike: (messageId: string, emoji?: string) => void;
}

export const MessageGroup: React.FC<MessageGroupProps> = ({
  messages,
  currentUserId,
  onReply,
  onStartEdit,
  onToggleLike,
}) => {
  return (
    <div className="space-y-4">
      <DateHeader timestamp={messages[0]?.timestamp} />
      {messages.map((message, index) => (
        <ChatMessage
          key={message._id || message.clientMessageId || index}
          message={message}
          isOwnMessage={message.sender === currentUserId}
          onReply={onReply}
          onStartEdit={onStartEdit}
          onToggleLike={onToggleLike}
        />
      ))}
    </div>
  );
};
