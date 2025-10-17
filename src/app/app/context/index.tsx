import React from "react";
import { LocationProvider } from "./LocationProvider";
import { SocketProvider } from "./SocketContext";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SocketProvider>
      <LocationProvider>{children}</LocationProvider>
    </SocketProvider>
  );
};

export default Provider;
