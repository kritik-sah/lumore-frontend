interface ChatMessageProps {
  message: string;
  timestamp: number;
  isOwnMessage: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  timestamp,
  isOwnMessage,
}) => {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwnMessage ? "bg-ui-highlight text-white" : "bg-ui-shade/10"
        }`}
      >
        <p className="text-sm">{message}</p>
        <p className="text-xs mt-1 opacity-70">
          {new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>
    </div>
  );
};
