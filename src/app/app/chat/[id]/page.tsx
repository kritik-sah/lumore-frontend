import React from "react";
import ChatScreen from "../../components/ChatScreen";
import NavLayout from "../../components/layout/NavLayout";

const Chats = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <NavLayout>
      <p>Chat room id : {id}</p>
      {/* <ChatScreen roomId={id} /> */}
    </NavLayout>
  );
};

export default Chats;
