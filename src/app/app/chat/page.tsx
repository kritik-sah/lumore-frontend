"use client";
import Icon from "@/components/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchIbox, fetchUserSlots } from "@/lib/apis";
import { calculateAge } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import NavLayout from "../components/layout/NavLayout";
import { useCookies } from "../hooks/useCookies";
import { useOnboarding } from "../hooks/useOnboarding";
import { useUser } from "../hooks/useUser";

// interface Slot {
//   _id: string;
//   profile: {
//     username: string;
//     nickname: string;
//     profilePicture: string;
//   };
//   roomId: string;
//   unReadMessageCount: number;
//   createdAt: string;
// }

const ChatInbox = () => {
  const { userCookie } = useCookies();
  const { user, isLoading: gettingUser } = useUser(userCookie?._id);
  const [tab, setTab] = useState<"active" | "archive">("active");

  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery<any[]>({
    queryKey: ["inbox", tab],
    queryFn: () => fetchIbox(tab),
    enabled: !!userCookie,
  });

  return (
    <NavLayout>
      <div className="h-full w-full  max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Inbox</h1>
        </div>
        <div className="w-full">
          <Tabs
            defaultValue="active"
            onValueChange={(value) => setTab(value as "active" | "archive")}
            className="w-full"
          >
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="active">
                Active
              </TabsTrigger>
              <TabsTrigger className="w-full" value="archive">
                Archived
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <Inbox
                id="active"
                user={user}
                rooms={rooms}
                isLoading={isLoading}
                error={error}
              />
            </TabsContent>
            <TabsContent value="archive">
              <Inbox
                id="archived"
                user={user}
                rooms={rooms}
                isLoading={isLoading}
                error={error}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </NavLayout>
  );
};

const Inbox = ({ user, rooms, isLoading, error }: any) => {
  if (isLoading) {
    return (
      <p className=" text-center mb-4 text-ui-shade">Fetching your chats...</p>
    );
  }

  if (error) {
    return (
      <p className=" text-center mb-4 text-red-500">No active chats yet</p>
    );
  }

  return (
    <>
      {rooms?.length === 0 ? (
        <p className="text-gray-500 text-center">No active chats yet</p>
      ) : (
        <ul className="space-y-4">
          {rooms.map((room: any) => {
            const matchedUser = room.participants.find(
              (p: any) => p._id !== user?._id
            );

            return (
              <UserChat key={room._id} room={room} matchedUser={matchedUser} />
            );
          })}
        </ul>
      )}
    </>
  );
};

export default ChatInbox;

const UserChat = ({ room, matchedUser }: { room: any; matchedUser: any }) => {
  const { user, isLoading } = useUser(matchedUser?._id ?? "");
  return (
    <li key={room._id}>
      <Link
        href={`/app/chat/${room._id}`}
        className="flex items-center space-x-4 hover:bg-gray-100 p-2 border-b border-ui-shade/10 "
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full border border-ui-shade/10 bg-ui-light overflow-hidden">
            <Avatar className="h-10 w-10">
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
        <div className="flex-1">
          <h2 className="font-semibold">
            {user?.realName || user?.nickname || user?.username}
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
          {/* {slot.unReadMessageCount > 0 && (
                        <p className="text-sm text-blue-500">
                          {slot.unReadMessageCount} new message
                          {slot.unReadMessageCount > 1 ? "s" : ""}
                        </p>
                      )} */}
        </div>
        <span className="text-xs text-gray-400">
          {new Date(room.lastMessageAt).toLocaleDateString()}
        </span>
      </Link>
    </li>
  );
};
