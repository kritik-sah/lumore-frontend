"use client";
import React from "react";
import NavLayout from "./components/layout/NavLayout";
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
