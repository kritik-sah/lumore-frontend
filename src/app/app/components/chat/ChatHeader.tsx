import Icon from "@/components/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { reportChatUser, submitChatFeedback } from "@/lib/apis";
import { calculateAge } from "@/utils/helpers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useChat } from "../../context/ChatContext";

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"menu" | "feedback" | "report">(
    "menu"
  );
  const [feedbackText, setFeedbackText] = useState("");
  const [reportText, setReportText] = useState("");
  const [reportCategory, setReportCategory] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const openSheet = () => {
    setSheetMode("menu");
    setActionError("");
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setSheetMode("menu");
    setFeedbackText("");
    setReportText("");
    setReportCategory("");
    setActionError("");
  };

  const handleSubmitFeedback = async () => {
    if (!roomId) return;
    if (!feedbackText.trim()) {
      setActionError("Please add feedback before ending the chat.");
      return;
    }
    setIsSubmitting(true);
    setActionError("");
    try {
      await submitChatFeedback(roomId, feedbackText.trim());
      toast.success("Feedback sent");
      closeSheet();
      onEndChat();
    } catch (error) {
      setActionError("Unable to submit feedback right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportUser = async () => {
    if (!roomId) return;
    if (!reportCategory) {
      setActionError("Please choose a report category.");
      return;
    }
    if (!reportText.trim()) {
      setActionError("Please describe the issue before reporting.");
      return;
    }
    setIsSubmitting(true);
    setActionError("");
    try {
      await reportChatUser(
        roomId,
        reportCategory,
        "report_from_chat",
        reportText.trim()
      );
      toast.success("Report submitted");
      closeSheet();
    } catch (error) {
      setActionError("Unable to submit report right now.");
    } finally {
      setIsSubmitting(false);
    }
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
                <MenubarItem onClick={openSheet}>Chat options</MenubarItem>
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
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="flex flex-col p-0">
          <SheetHeader className="hidden">
            <SheetTitle>Chat actions</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {sheetMode === "menu" ? (
              <>
                <h3 className="text-lg font-semibold">Chat options</h3>
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    onClick={() => setSheetMode("feedback")}
                    className="w-full rounded-lg border border-ui-shade/20 bg-ui-light px-4 py-2 text-left"
                  >
                    <p className="font-medium">End chat with feedback</p>
                    <p className="text-xs text-ui-shade/60">
                      Leave a quick note before ending
                    </p>
                  </button>
                  <button
                    onClick={() => setSheetMode("report")}
                    className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-left"
                  >
                    <p className="font-medium text-red-600">Report user</p>
                    <p className="text-xs text-red-500/80">
                      Tell us what happened
                    </p>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <button
                    className="text-sm text-ui-shade"
                    onClick={() => setSheetMode("menu")}
                  >
                    Back
                  </button>
                  <h3 className="text-lg font-semibold">
                    {sheetMode === "feedback" ? "End chat" : "Report user"}
                  </h3>
                  <span className="w-10" />
                </div>

                {sheetMode === "feedback" ? (
                  <div className="mt-4">
                    <label className="text-sm text-ui-shade/70">
                      Feedback
                    </label>
                    <textarea
                      className="mt-2 w-full rounded-lg border border-ui-shade/20 p-3 text-sm"
                      rows={4}
                      placeholder="What could they improve?"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="mt-4">
                    <label className="text-sm text-ui-shade/70">
                      Category
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        { label: "Spam", value: "spam" },
                        { label: "Harassment", value: "harassment" },
                        { label: "Nudity", value: "nudity" },
                        { label: "Hate Speech", value: "hate_speech" },
                        { label: "Scam/Fraud", value: "scam_fraud" },
                        { label: "Impersonation", value: "impersonation" },
                        { label: "Underage", value: "underage" },
                        { label: "Violence", value: "violence" },
                        { label: "Threats", value: "threats" },
                        { label: "Self-harm", value: "self_harm" },
                        { label: "Bullying", value: "bullying" },
                        { label: "Other", value: "other" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setReportCategory(option.value)}
                          className={`rounded-full border px-3 py-1 text-xs ${
                            reportCategory === option.value
                              ? "border-ui-highlight bg-ui-highlight text-white"
                              : "border-ui-shade/20 bg-white text-ui-shade"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <label className="text-sm text-ui-shade/70 mt-4 block">
                      Details
                    </label>
                    <textarea
                      className="mt-2 w-full rounded-lg border border-ui-shade/20 p-3 text-sm"
                      rows={4}
                      placeholder="Describe what happened..."
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                    />
                  </div>
                )}

                {actionError ? (
                  <p className="mt-2 text-sm text-red-500">{actionError}</p>
                ) : null}

                <div className="mt-4">
                  <Button
                    className="w-full"
                    onClick={
                      sheetMode === "feedback"
                        ? handleSubmitFeedback
                        : handleReportUser
                    }
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : sheetMode === "feedback"
                        ? "Submit & End Chat"
                        : "Submit report"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
