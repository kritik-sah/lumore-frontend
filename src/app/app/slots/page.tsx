import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import React from "react";
import NavLayout from "../components/layout/NavLayout";

const chats = [
  { id: 1, name: "John Doe", lastMessage: "Hey, how are you?", time: "2m ago" },
  { id: 2, name: "Jane Smith", lastMessage: "See you later!", time: "1h ago" },
  {
    id: 3,
    name: "Bob Johnson",
    lastMessage: "Thanks for the help!",
    time: "3h ago",
  },
];

const Slots = () => {
  return (
    <NavLayout>
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Chats</h1>
        <ul className="space-y-4">
          {chats.map((chat) => (
            <li key={chat.id}>
              <Link
                href={`/app/chat/${chat.id}`}
                className="flex items-center space-x-4 hover:bg-gray-100 p-2 rounded-lg"
              >
                <Avatar>
                  <AvatarImage
                    src={`https://i.pravatar.cc/150?u=${chat.id}`}
                    alt={chat.name}
                  />
                  <AvatarFallback>
                    {chat.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="font-semibold">{chat.name}</h2>
                  <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                </div>
                <span className="text-xs text-gray-400">{chat.time}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </NavLayout>
  );
};

export default Slots;
