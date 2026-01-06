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
      <div className="flex flex-col max-w-[70%]">
        <div
          className={`rounded-xl whitespace-pre-wrap break-words p-3 ${
            isOwnMessage ? "bg-ui-highlight text-white" : "bg-ui-highlight/5"
          }`}
        >
          <span className="">
            <LinkifyText text={message} />
          </span>
        </div>
        <p
          className={`text-xs text-ui-shade/60 mt-1 opacity-70 ${
            isOwnMessage ? "text-end" : "text-start"
          }`}
        >
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
          className="break-all"
        >
          {part}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
};
