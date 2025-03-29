"use client";
import { Button } from "@/components/ui/button";
import { useExploreChat } from "../context/ExploreChatContext";
import ChatScreen from "./ChatScreen";

const MatchmakingScreen = () => {
  const { matchId, matchedUser, isMatching, error, startMatchmaking } =
    useExploreChat();

  // If we have a match, show the chat screen
  if (matchId && matchedUser) {
    return <ChatScreen />;
  }
  return (
    <div className="flex flex-col items-center justify-center h-[95vh] gap-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Find a Chat Partner</h1>
        <p className="text-ui-shade/60">
          {isMatching
            ? "Looking for someone to chat with..."
            : "Click start to begin matchmaking"}
        </p>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button disabled={isMatching} onClick={startMatchmaking}>
        {isMatching ? "Stop Matchmaking" : "Start Matchmaking"}
      </Button>
    </div>
  );
};
export default MatchmakingScreen;
