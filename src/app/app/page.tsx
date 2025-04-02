"use client";
import React from "react";
import NavLayout from "./components/layout/NavLayout";
import MatchmakingScreen from "./components/MatchmakingScreen";

const AppScreen = () => {
  return (
    <NavLayout>
      <MatchmakingScreen />
    </NavLayout>
  );
};

export default AppScreen;
