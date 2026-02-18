"use client";
import Icon from "@/components/icon";
import { ChatInboxLoader } from "@/components/page-loaders";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchIbox } from "@/lib/apis";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CryptoJS from "crypto-js";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import NavLayout from "../components/layout/NavLayout";
import { useSocket } from "../context/SocketContext";
import { useCookies } from "../hooks/useCookies";
import { useUser } from "../hooks/useUser";

const ChatInbox = () => {
  const { userCookie } = useCookies();
  const queryClient = useQueryClient();
  const { socket, revalidateSocket } = useSocket();
  const { user } = useUser(userCookie?._id);
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

  useEffect(() => {
    revalidateSocket();
  }, [revalidateSocket]);

  useEffect(() => {
    if (!socket) return;

    const onInboxUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ["inbox", "active"] });
      queryClient.invalidateQueries({ queryKey: ["inbox", "archive"] });
    };

    socket.on("inbox_updated", onInboxUpdated);
    return () => {
      socket.off("inbox_updated", onInboxUpdated);
    };
  }, [socket, queryClient]);

  return (
    <NavLayout>
      <div className="h-full w-full  max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <Link
            href="/app/feedback"
            className="text-sm text-ui-highlight hover:underline"
          >
            Feedback
          </Link>
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
                user={user}
                rooms={rooms}
                isLoading={isLoading}
                error={error}
              />
            </TabsContent>
            <TabsContent value="archive">
              <Inbox
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
    return <ChatInboxLoader />;
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
              (p: any) => p._id !== user?._id,
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

const decodeLastMessage = (room: any) => {
  const lastMessage = room?.lastMessage;
  if (!lastMessage) return "";

  if (lastMessage.messageType === "image") {
    return "Photo";
  }

  if (!lastMessage.encryptedData || !lastMessage.iv) {
    return "New message";
  }

  try {
    const encryptionKey = localStorage.getItem(`chat_key_${room._id}`);
    if (!encryptionKey) {
      return "New message";
    }

    const key = CryptoJS.enc.Hex.parse(encryptionKey);
    const iv = CryptoJS.enc.Hex.parse(lastMessage.iv);
    const cipherWordArray = CryptoJS.enc.Hex.parse(lastMessage.encryptedData);
    const base64Cipher = CryptoJS.enc.Base64.stringify(cipherWordArray);

    const decrypted = CryptoJS.AES.decrypt(base64Cipher, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const text = decrypted.toString(CryptoJS.enc.Utf8);
    return text || "New message";
  } catch {
    return "New message";
  }
};

const UserChat = ({ room, matchedUser }: { room: any; matchedUser: any }) => {
  const { user, isLoading } = useUser(matchedUser?._id ?? "");
  const unreadCount = Number(room?.unreadCount || 0);
  const lastMessagePreview = useMemo(() => decodeLastMessage(room), [room]);
  if (isLoading) {
    return (
      <li className="flex items-center space-x-4 p-2 border-b border-ui-shade/10">
        <div className="h-10 w-10 rounded-full bg-ui-shade/10 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-ui-shade/10 rounded animate-pulse" />
          <div className="h-3 w-20 bg-ui-shade/10 rounded animate-pulse" />
        </div>
      </li>
    );
  }

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
          {lastMessagePreview ? (
            <p className="text-sm text-ui-shade/70 truncate">
              {lastMessagePreview}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-gray-400">
            {new Date(room.lastMessageAt).toLocaleDateString()}
          </span>
          {unreadCount > 0 ? (
            <span className="min-w-5 h-5 px-1 rounded-full bg-ui-highlight text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          ) : null}
        </div>
      </Link>
    </li>
  );
};
