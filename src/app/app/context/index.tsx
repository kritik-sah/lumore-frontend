import React from "react";
import { LocationProvider } from "./LocationProvider";

import { OnboardingProvider } from "./Onboardingprovider";
import { SocketProvider } from "./SocketContext";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SocketProvider>
      <OnboardingProvider>
        <LocationProvider>{children}</LocationProvider>
      </OnboardingProvider>
    </SocketProvider>
  );
};

export default Provider;
