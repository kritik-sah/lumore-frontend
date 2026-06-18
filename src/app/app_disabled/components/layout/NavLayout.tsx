import React from "react";
import AppShell from "./AppShell";

const NavLayout = ({ children }: { children: React.ReactNode }) => {
  return <AppShell>{children}</AppShell>;
};

export default NavLayout;

