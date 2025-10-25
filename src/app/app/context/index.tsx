import React from "react";
import { LocationProvider } from "./LocationProvider";

import { OnboardingProvider } from "./Onboardingprovider";
import { SocketProvider } from "./SocketContext";
import TelegramProvider from "./TelegramProvider";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <TelegramProvider>
      <SocketProvider>
        <OnboardingProvider>
          <LocationProvider>{children}</LocationProvider>
        </OnboardingProvider>
      </SocketProvider>
    </TelegramProvider>
  );
};

export default Provider;
