import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReplyingToPreview {
  _id: string;
  senderId: string;
  messageType: "text" | "image";
  message: string;
  imageUrl?: string | null;
}

interface PendingImage {
  previewUrl: string;
  imagePublicId: string | null;
  uploading: boolean;
}

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  onImageSelect: (file: File) => void;
  onDiscardSelectedImage: () => void;
  isConnected: boolean;
  isActive: boolean;
  roomData: any;
  userId: string;
  isUploadingImage: boolean;
  replyingTo: ReplyingToPreview | null;
  onCancelReply: () => void;
  isEditing: boolean;
  onCancelEdit: () => void;
  pendingImage: PendingImage | null;
  uploadError?: string | null;
  onDismissUploadError: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onKeyPress,
  onSend,
  onImageSelect,
  onDiscardSelectedImage,
  isConnected,
  isActive,
  roomData,
  userId,
  isUploadingImage,
  replyingTo,
  onCancelReply,
  isEditing,
  onCancelEdit,
  pendingImage,
  uploadError,
  onDismissUploadError,
}) => {
  if (!isActive) {
    return (
      <div className="p-4 text-center text-sm text-ui-shade">
        The chat has ended by {" "}
        {roomData?.endedBy === userId ? "you" : "the other user"}. You can no
        longer send messages.
      </div>
    );
  }

  return (
    <div className="p-2 bg-ui-light border border-ui-shade/10 rounded-2xl mx-2 space-y-2">
      {replyingTo ? (
        <div className="flex items-center justify-between rounded-xl px-3 py-2 bg-ui-highlight/5 text-xs">
          <span>
            Replying: {replyingTo.messageType === "image" ? "Photo" : replyingTo.message || "Message"}
          </span>
          <button type="button" onClick={onCancelReply} className="text-ui-shade/70">
            Cancel
          </button>
        </div>
      ) : null}

      {isEditing ? (
        <div className="flex items-center justify-between rounded-xl px-3 py-2 bg-ui-highlight/5 text-xs">
          <span>Editing message</span>
          <button type="button" onClick={onCancelEdit} className="text-ui-shade/70">
            Cancel
          </button>
        </div>
      ) : null}

      <div className="flex gap-2 items-center">
        <label className="cursor-pointer inline-flex items-center justify-center h-9 w-9 rounded-full border border-ui-shade/20">
          <Icon name="HiOutlinePlusCircle" />
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            disabled={!isConnected || !isActive || isUploadingImage}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImageSelect(file);
              e.currentTarget.value = "";
            }}
          />
        </label>

        <Input
          value={value}
          onChange={onChange}
          onKeyDown={onKeyPress}
          placeholder={isEditing ? "Edit your message" : "Say Hi"}
          disabled={!isConnected || !isActive}
          className="border-0 focus-visible:ring-0 focus-visible:outline-none flex-grow shadow-none"
        />

        <Button
          size={"icon"}
          onClick={onSend}
          disabled={
            !isConnected ||
            !isActive ||
            (isUploadingImage && (!pendingImage || pendingImage.uploading)) ||
            (!value.trim() &&
              !isEditing &&
              (!pendingImage || pendingImage.uploading))
          }
          className="border-0 aspect-square rounded-full"
        >
          <Icon name="IoPaperPlane" />
        </Button>
      </div>

      {pendingImage ? (
        <div className="rounded-xl border border-ui-shade/15 p-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-ui-shade">
              {pendingImage.uploading ? "Uploading..." : ""}
            </span>
            <button
              type="button"
              onClick={onDiscardSelectedImage}
              className="text-xs text-ui-shade/80"
            >
              Remove
            </button>
          </div>
          <div className="relative w-fit">
            <img
              src={pendingImage.previewUrl}
              alt="Selected chat attachment"
              className="max-h-36 rounded-lg object-cover"
            />
            {pendingImage.uploading ? (
              <div className="absolute inset-0 rounded-lg bg-black/30 flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {uploadError ? (
        <div className="flex items-start justify-between gap-2 px-1">
          <p className="text-xs text-red-500">{uploadError}</p>
          <button
            type="button"
            onClick={onDismissUploadError}
            className="text-xs text-ui-shade/70 hover:text-ui-shade"
          >
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
};
