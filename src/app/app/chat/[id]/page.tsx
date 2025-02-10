import React from "react";
import ChatScreen from "../../components/ChatScreen";

const Chats = ({ params }: { params: { id: string } }) => {
  console.log("params", params);
  return (
    <div>
      <ChatScreen />
    </div>
  );
};

export default Chats;
