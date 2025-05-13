import React from "react";
import GeneralHeader from "../headers/General";
import MobileNav from "../MobileNav";

const GeneralLayout = ({ children, userSetting }: { children: React.ReactNode, userSetting?: boolean }) => {
  return (
    <>
      <GeneralHeader userSetting={userSetting} />
      {children}
      <MobileNav />
    </>
  );
};

export default GeneralLayout;
