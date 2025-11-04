"use client";
import React from "react";
import MatchmakingScreen from "./components/MatchmakingScreen";
import GeneralLayout from "./components/layout/general";

const AppScreen = () => {
  return (
    <GeneralLayout>
      <MatchmakingScreen />
    </GeneralLayout>
  );
};

export default AppScreen;
