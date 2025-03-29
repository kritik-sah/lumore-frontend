import React from "react";
import MobileNav from "../MobileNav";

const NavLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <MobileNav />
    </div>
  );
};

export default NavLayout;
