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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useChat } from "../../context/ChatContext";
import { useExploreChat } from "../../context/ExploreChatContext";

interface ChatHeaderProps {
  user: any;
  isConnected: boolean;
  onEndChat: () => void;
  currentUserId: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  isConnected,
  onEndChat,

  currentUserId,
}) => {
  const { roomId, matchedUser, lockProfile, unlockProfile, isActive } =
    useChat();
  const router = useRouter();

  const [isUnlocked, setisUnlocked] = useState(
    user?.isViewerUnlockedUser || false
  );

  const handleUnlockProfile = async () => {
    if (!roomId || !currentUserId || !matchedUser) return;
    setisUnlocked(true);
    unlockProfile(matchedUser?._id);
  };

  const handleLockProfile = async () => {
    if (!roomId || !currentUserId || !matchedUser) return;
    setisUnlocked(false);
    lockProfile(matchedUser?._id);
  };

  const navigateToInbox = () => {
    router.push("/app/chat");
  };

  return (
    <div className="flex items-center justify-between p-2 pt-0 border-b border-ui-shade/10 bg-ui-light">
      <div className="flex items-center gap-2">
        <div className="w-8 flex items-center justify-center">
          <Icon
            name="HiArrowLeft"
            className="h-6 w-6 cursor-pointer"
            onClick={navigateToInbox}
          />
        </div>
        <div className="relative">
          <div className="w-8 h-8 rounded-full border border-ui-shade/10 bg-ui-light overflow-hidden">
            <Avatar className="h-8 w-8">
              <AvatarImage
                className={user?.isViewerUnlockedByUser ? "" : "blur-xs"}
                src={user?.profilePicture}
                alt={user?.realName || user?.nickname || user?.username}
              />
              <AvatarFallback>
                {`${user?.realName || user?.nickname || user?.username}`
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 bg-ui-light h-4 w-4 rounded-full flex items-center justify-center">
            {user?.isViewerUnlockedByUser ? (
              <Icon name="HiLockOpen" className="h-3 w-3 text-ui-shade" />
            ) : (
              <Icon name="HiLockClosed" className="h-3 w-3 text-ui-shade" />
            )}
          </div>
        </div>
        <div>
          <h2 className="font-medium">
            <Link href={`/app/profile/${user?._id}`}>
              {user?.realName || user?.nickname || user?.username}
            </Link>
          </h2>
          <div className="flex items-center justify-start gap-2 text-sm">
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
          onClick={isUnlocked ? handleLockProfile : handleUnlockProfile}
          className="hover:bg-gray-100"
        >
          {isUnlocked ? (
            <Icon name="HiLockOpen" className="h-5 w-5 text-gray-500" />
          ) : (
            <Icon name="HiLockClosed" className="h-5 w-5 text-gray-500" />
          )}
        </Button>
        {isActive && (
          <Menubar className="border-0 bg-transparent shadow-none">
            <MenubarMenu>
              <MenubarTrigger>
                <Icon name="HiMiniEllipsisVertical" className="text-xl" />
              </MenubarTrigger>
              <MenubarContent>
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
        )}
      </div>
    </div>
  );
};
