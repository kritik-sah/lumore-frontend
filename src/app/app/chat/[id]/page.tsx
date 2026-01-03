import React from "react";
import ChatScreen from "../../components/ChatScreen";
import { ChatProvider } from "../../context/ChatContext";

const Chats = () => {
  return (
    <ChatProvider>
      <ChatScreen />
    </ChatProvider>
  );
};

export default Chats;
