import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { calculateAge } from "@/utils/helpers";
import Link from "next/link";

interface ChatHeaderProps {
  user: any;
  isConnected: boolean;
  onEndChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  isConnected,
  onEndChat,
}) => {
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
      <Button variant="destructive" size="sm" onClick={onEndChat}>
        End Chat
      </Button>
    </div>
  );
};
