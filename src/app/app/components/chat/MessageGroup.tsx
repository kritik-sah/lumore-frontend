import { ChatMessage } from "./ChatMessage";
import { DateHeader } from "./DateHeader";

interface Message {
  sender: string;
  message: string;
  timestamp: number;
}

interface MessageGroupProps {
  date: string;
  messages: Message[];
  currentUserId: string;
}

export const MessageGroup: React.FC<MessageGroupProps> = ({
  date,
  messages,
  currentUserId,
}) => {
  return (
    <div className="space-y-4">
      <DateHeader timestamp={messages[0].timestamp} />
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message.message}
          timestamp={message.timestamp}
          isOwnMessage={message.sender === currentUserId}
        />
      ))}
    </div>
  );
};
