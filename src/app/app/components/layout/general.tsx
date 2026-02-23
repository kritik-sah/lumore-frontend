import React from "react";
import AppShell from "./AppShell";

const GeneralLayout = ({
  children,
  userSetting,
}: {
  children: React.ReactNode;
  userSetting?: boolean;
}) => <AppShell showHeader userSetting={userSetting}>{children}</AppShell>;

export default GeneralLayout;

