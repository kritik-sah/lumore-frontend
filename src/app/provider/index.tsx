import React from "react";
import { ReactQueryProvider } from "./QueryClientProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </>
  );
};

export default Providers;
