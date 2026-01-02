"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchIbox, fetchUserSlots } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
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

const Slots = () => {
  const { getCookies, userCookie } = useCookies();
  useOnboarding();
  const { user, isLoading: gettingUser } = useUser(userCookie?._id);

  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery<any[]>({
    queryKey: ["inbox"],
    queryFn: fetchIbox,
    enabled: !!userCookie,
  });

  if (isLoading) {
    return (
      <NavLayout>
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Chats</h1>
          </div>
          <p className=" text-center mb-4 text-ui-shade">
            Fetching your chats...
          </p>
        </div>
      </NavLayout>
    );
  }

  if (error) {
    return (
      <NavLayout>
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Chats</h1>
          </div>
          <p className=" text-center mb-4 text-red-500">No active chats yet</p>
        </div>
      </NavLayout>
    );
  }

  return (
    <NavLayout>
      <div className="w-full h-full max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <span>{rooms?.length}</span>
        </div>
        {rooms?.length === 0 ? (
          <p className="text-gray-500 text-center">No active chats yet</p>
        ) : (
          <ul className="space-y-4">
            {rooms.map((room: any) => {
              const matchedUser = room.participants.find(
                (p: any) => p._id !== user?._id
              );

              return (
                <li key={room._id}>
                  <Link
                    href={`/app/chat/${room._id}`}
                    className="flex items-center space-x-4 hover:bg-gray-100 p-2 rounded-lg"
                  >
                    <Avatar>
                      <AvatarImage
                        src={
                          matchedUser?.profilePicture ||
                          `https://i.pravatar.cc/150?u=${room._id}`
                        }
                        alt={matchedUser?.nickname || matchedUser?.username}
                      />
                      <AvatarFallback>
                        {(matchedUser?.nickname || matchedUser?.username || "U")
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="font-semibold">
                        {matchedUser.nickname ||
                          matchedUser.username ||
                          "Unknown User"}
                      </h2>
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
            })}
          </ul>
        )}
      </div>
    </NavLayout>
  );
};

export default Slots;
