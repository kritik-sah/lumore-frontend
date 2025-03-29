"use client";
import React from "react";
import NavLayout from "./components/layout/NavLayout";
import MatchmakingScreen from "./components/MatchmakingScreen";
import { ExploreChatProvider } from "./context/ExploreChatContext";

const AppScreen = () => {
  return (
    <ExploreChatProvider>
      <NavLayout>
        <MatchmakingScreen />
      </NavLayout>
    </ExploreChatProvider>
  );
};

export default AppScreen;
