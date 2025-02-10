import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./MessageInput";

import React from "react";

const messages = [
  { id: 1, sender: "John Doe", content: "Hey, how are you?", time: "2:30 PM" },
  {
    id: 2,
    sender: "You",
    content: "I'm good, thanks! How about you?",
    time: "2:31 PM",
  },
  {
    id: 3,
    sender: "John Doe",
    content: "Doing great! Any plans for the weekend?",
    time: "2:32 PM",
  },
];

const ChatScreen = () => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto">
      <header className="flex items-center space-x-4 p-4 border-b">
        <Avatar>
          <AvatarImage
            src={`https://i.pravatar.cc/150?u=${1}`}
            alt="John Doe"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-semibold">John Doe</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "You" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === "You"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs text-gray-400 mt-1 block">
                {message.time}
              </span>
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatScreen;
