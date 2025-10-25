"use client";
import {
  init,
  isTMA,
  useLaunchParams,
  useRawInitData,
} from "@tma.js/sdk-react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface TelegramContextType {
  IsTMA: boolean;
  launchParams: any;
  initData: string;
}
const TelegramContext = createContext<TelegramContextType | undefined>(
  undefined
);

const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
  const [IsTMA, setIsTMA] = useState(false);
  const [launchParams, setLaunchParams] = useState<any>();
  const [initData, setInitData] = useState<string>("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTMA(isTMA());
    }
  }, []);

  if (IsTMA) {
    return (
      <TMAProvider
        launchParams={launchParams}
        initData={initData}
        setLaunchParams={setLaunchParams}
        setInitData={setInitData}
      >
        {children}
      </TMAProvider>
    );
  }

  return (
    <TelegramContext.Provider value={{ IsTMA, launchParams, initData }}>
      {children}
    </TelegramContext.Provider>
  );
};

export default TelegramProvider;

interface TMAProviderProps {
  children: React.ReactNode;
  launchParams: any;
  initData: string;
  setLaunchParams: React.Dispatch<React.SetStateAction<any>>;
  setInitData: React.Dispatch<React.SetStateAction<string>>;
}

const TMAProvider = ({
  children,
  launchParams,
  initData,
  setLaunchParams,
  setInitData,
}: TMAProviderProps) => {
  const lp = useLaunchParams();
  const init_data = useRawInitData();
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize the package.
      init();
      console.log("Launch Params:", lp);
      console.log("initData:", init_data);
    }
  }, []);

  useEffect(() => {
    setLaunchParams(lp);
    setInitData(init_data || "");
  }, [lp, init_data]);

  return (
    <TelegramContext.Provider value={{ IsTMA: true, launchParams, initData }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error("useTelegram must be used within a TelegramProvider");
  }
  return context;
};
