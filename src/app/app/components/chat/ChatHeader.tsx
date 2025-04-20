import { useProfileLock } from "@/app/app/hooks/useProfileLock";
import Icon from "@/components/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { calculateAge } from "@/utils/helpers";
import { Lock, Unlock } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useExploreChat } from "../../context/ExploreChatContext";

interface ChatHeaderProps {
  user: any;
  isConnected: boolean;
  onEndChat: () => void;
  onSaveChat: () => void;
  currentUserId: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  isConnected,
  onEndChat,
  onSaveChat,
  currentUserId,
}) => {
  const { matchId, matchedUser, cancelChat, lockProfile, unlockProfile } =
    useExploreChat();

  const handleUnlockProfile = async () => {
    if (!matchId || !currentUserId || !matchedUser) return;
    await unlockProfile(matchId, currentUserId, matchedUser);
  };

  const handleLockProfile = async () => {
    if (!matchId || !currentUserId || !matchedUser) return;
    await lockProfile(matchId, currentUserId, matchedUser);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-ui-shade/10">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-ui-highlight">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profilePicture} alt={user.username} />
              <AvatarFallback>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute bottom-0 right-0 bg-ui-light h-4 w-4 rounded-full flex items-center justify-center">
            {user?.isViewerUnlockedByUser ? (
              <Icon name="HiLockOpen" className="h-2 w-2 text-ui-shade" />
            ) : (
              <Icon name="HiLockClosed" className="h-2 w-2 text-ui-shade" />
            )}
          </div>
        </div>
        <div>
          <h2 className="font-medium">
            <Link href={`/app/profile/${user._id}`}>
              {user.realName || user.nickname || user.username}
            </Link>
          </h2>
          <div className="flex items-center justify-start gap-2 mt-1 text-sm">
            {user?.dob ? (
              <div className="flex items-center justify-center gap-1 flex-shrink-0">
                <Icon name="HiOutlineCake" className="flex-shrink-0" />{" "}
                <p>{calculateAge(user?.dob)}</p>
              </div>
            ) : null}

            {user?.gender ? (
              <div className="flex items-center justify-center gap-1 flex-shrink-0">
                <Icon name="HiOutlineUser" className="lex-shrink-0" />{" "}
                <p>{user?.gender}</p>
              </div>
            ) : null}
            <div className="flex items-center justify-center gap-1 flex-shrink-0">
              <Icon name="RiPinDistanceLine" className="flex-shrink-0" />{" "}
              <p>{user?.distance.toFixed(2)}km</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={
            user?.isViewerUnlockedUser ? handleLockProfile : handleUnlockProfile
          }
          className="hover:bg-gray-100"
        >
          {user?.isViewerUnlockedUser ? (
            <Icon name="HiLockOpen" className="h-5 w-5 text-gray-500" />
          ) : (
            <Icon name="HiLockClosed" className="h-5 w-5 text-gray-500" />
          )}
        </Button>
        <Menubar className="border-0 bg-transparent shadow-none">
          <MenubarMenu>
            <MenubarTrigger>
              <Icon name="HiMiniEllipsisVertical" className="text-xl" />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={onSaveChat}>Save Chat</MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                className="!text-red-500 focus:text-red-500"
                onClick={onEndChat}
              >
                End Chat
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};
