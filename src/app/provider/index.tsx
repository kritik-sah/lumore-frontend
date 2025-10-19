import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { ReactQueryProvider } from "./QueryClientProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <GoogleOAuthProvider clientId="681858960345-ve9vanjcbhk293pj2niqnvme31m2kded.apps.googleusercontent.com">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </GoogleOAuthProvider>
    </>
  );
};

export default Providers;
