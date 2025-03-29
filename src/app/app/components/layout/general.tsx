import React from "react";
import GeneralHeader from "../headers/General";
import MobileNav from "../MobileNav";

const GeneralLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <GeneralHeader />
      {children}
      <MobileNav />
    </div>
  );
};

export default GeneralLayout;
