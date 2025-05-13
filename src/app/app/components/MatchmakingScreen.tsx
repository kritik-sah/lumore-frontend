"use client";
import { Button } from "@/components/ui/button";
import { useExploreChat } from "../context/ExploreChatContext";
import ChatScreen from "./ChatScreen";
import Icon from "@/components/icon";

const MatchmakingScreen = () => {
  const {
    matchId,
    matchedUser,
    isMatching,
    error,
    startMatchmaking,
    stopMatchmaking,
  } = useExploreChat();

  // If we have a match, show the chat screen
  if (matchId && matchedUser) {
    return <div className="flex-1 overflow-y-auto p-2">
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-ui-background border border-ui-shade/10 rounded-xl">
        <ChatScreen />
      </div>
    </div>;
  }
  return (
    <div className="flex-1 overflow-y-auto p-2">
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-ui-background border border-ui-shade/10 rounded-xl">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="h-16 w-16 bg-ui-light/30 border border-ui-shade/10 rounded-full flex items-center justify-center">
              <Icon name="IoRoseOutline" className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Meet Someone New</h1>
          <p className="text-ui-shade/80 text-lg">
            {isMatching
              ? "Discovering real connection around you, effortlessly, and authentically..."
              : "Discover real connection around you, effortlessly, and authentically"}
          </p>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button
          variant={isMatching ? "outline" : "default"}
          onClick={isMatching ? stopMatchmaking : startMatchmaking}
          className="rounded-lg py-6 px-8"
        >
          {isMatching ? "Stop Matchmaking" : "Start Matchmaking"}
        </Button>
      </div>
    </div>

  );
};
export default MatchmakingScreen;
