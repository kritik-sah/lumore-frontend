import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  isConnected: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onKeyPress,
  onSend,
  isConnected,
}) => {
  return (
    <div className="p-4 border-t border-ui-shade/10">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <Button onClick={onSend} disabled={!isConnected}>
          Send
        </Button>
      </div>
    </div>
  );
};
