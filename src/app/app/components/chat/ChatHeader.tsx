import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  username: string;
  isConnected: boolean;
  onEndChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  username,
  isConnected,
  onEndChat,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-ui-shade/10">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-ui-highlight"></div>
        <div>
          <h2 className="font-medium">{username}</h2>
          <p className="text-sm text-ui-shade/60">
            {isConnected ? "Secure Connection" : "Connecting..."}
          </p>
        </div>
      </div>
      <Button variant="destructive" size="sm" onClick={onEndChat}>
        End Chat
      </Button>
    </div>
  );
};
