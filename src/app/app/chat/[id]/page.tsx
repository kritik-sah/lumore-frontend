import React from "react";
import ChatScreen from "../../components/ChatScreen";
import NavLayout from "../../components/layout/NavLayout";

const Chats = () => {
  // console.log("params", params);
  return (
    <NavLayout>
      <ChatScreen />
    </NavLayout>
  );
};

export default Chats;
