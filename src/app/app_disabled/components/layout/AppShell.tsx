"use client";

import React from "react";
import GeneralHeader from "../headers/General";
import MobileNav from "../MobileNav";

interface AppShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showNav?: boolean;
  userSetting?: boolean;
}

const AppShell = ({
  children,
  showHeader = false,
  showNav = true,
  userSetting = false,
}: AppShellProps) => {
  return (
    <>
      {showHeader ? <GeneralHeader userSetting={userSetting} /> : null}
      {children}
      {showNav ? <MobileNav /> : null}
    </>
  );
};

export default AppShell;


