import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  isConnected: boolean;
  isActive: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onKeyPress,
  onSend,
  isConnected,
  isActive,
}) => {
  return (
    <div className="p-2 bg-ui-light border border-ui-shade/10 rounded-full mx-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder="Say Hi 👋"
          disabled={!isConnected || !isActive}
          className="border-0 focus-visible:ring-0 focus-visible:outline-none flex-grow shadow-none"
        />
        <Button
          size={"icon"}
          onClick={onSend}
          disabled={!isConnected || !isActive || value.trim() === ""}
          className="border-0 aspect-square rounded-full"
        >
          <Icon name="IoPaperPlane" />
        </Button>
      </div>
    </div>
  );
};
