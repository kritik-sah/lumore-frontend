import React from "react";
import MobileNav from "../MobileNav";

const NavLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <MobileNav />
    </>
  );
};

export default NavLayout;
