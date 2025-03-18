import React from "react";
import { LocationProvider } from "./LocationProvider";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <LocationProvider>{children}</LocationProvider>;
};

export default Provider;
