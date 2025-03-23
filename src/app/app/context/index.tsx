import React from "react";
import { AuthProvider } from "./AuthContext";
import { LocationProvider } from "./LocationProvider";
import { SocketProvider } from "./SocketContext";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AuthProvider>
      <SocketProvider>
        <LocationProvider>{children}</LocationProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default Provider;
