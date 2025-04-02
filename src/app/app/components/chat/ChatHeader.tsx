import { useProfileLock } from "@/app/app/hooks/useProfileLock";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { calculateAge } from "@/utils/helpers";
import { Lock, Unlock } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
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
        <div className="w-10 h-10 rounded-full bg-ui-highlight"></div>
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
          onClick={user?.isUnlocked ? handleLockProfile : handleUnlockProfile}
          className="hover:bg-gray-100"
        >
          {user?.isUnlocked ? (
            <Icon name="HiOutlineLockOpen" className="h-5 w-5 text-gray-500" />
          ) : (
            <Icon
              name="HiOutlineLockClosed"
              className="h-5 w-5 text-gray-500"
            />
          )}
        </Button>
        <Button variant="destructive" size="sm" onClick={onEndChat}>
          End Chat
        </Button>
      </div>
    </div>
  );
};
