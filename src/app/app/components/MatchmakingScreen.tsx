"use client";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useExploreChat } from "../context/ExploreChatContext";
import { useOnboarding } from "../hooks/useOnboarding";
import ChatScreen from "./ChatScreen";
// const AdBanner = dynamic(() => import("@/components/AdsBanner"), {
//   ssr: false,
// });

const MatchmakingScreen = () => {
  const { matchId, matchedUser } = useExploreChat();
  useOnboarding();

  return (
    <div className="flex-1 overflow-y-auto p-2">
      {matchId && matchedUser ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 bg-ui-background border border-ui-shade/10 rounded-xl">
          <ChatScreen />
        </div>
      ) : (
        <SearchScreen />
      )}
    </div>
  );
};

export default MatchmakingScreen;

const SearchScreen = () => {
  const { isMatching, error, startMatchmaking, stopMatchmaking } =
    useExploreChat();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-ui-background border border-ui-shade/10 rounded-xl">
      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          <div className="h-16 w-16 bg-ui-light/30 border border-ui-shade/10 rounded-full flex items-center justify-center">
            <Icon
              name={isMatching ? "BsSearchHeart" : "IoRoseOutline"}
              className="h-8 w-8"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {isMatching ? "Searching..." : "Meet Someone New"}
        </h1>
        <p className="text-ui-shade/80 text-lg">
          {isMatching
            ? "Discovering real connection around you, effortlessly, and authentically..."
            : "Discover real connection around you, effortlessly, and authentically"}
        </p>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* <AdBanner
        data-ad-slot="8827977087"
        data-full-width-responsive="true"
        data-ad-layout="display"
        data-ad-format="auto"
      /> */}

      {/* <SqAdBanner /> */}

      <Button
        variant={isMatching ? "outline" : "default"}
        onClick={isMatching ? stopMatchmaking : startMatchmaking}
        className="rounded-lg py-6 px-8"
      >
        {isMatching ? "Stop Matchmaking" : "Start Matchmaking"}
      </Button>
    </div>
  );
};

// const SqAdBanner = () => {
//   const adRef = useRef<HTMLDivElement>(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // Check if container has width > 0
//     const checkVisibility = () => {
//       if (adRef.current && adRef.current.offsetWidth > 0) {
//         setIsVisible(true);
//       }
//     };

//     // Retry after a brief delay to ensure layout is ready
//     const timeout = setTimeout(checkVisibility, 300);

//     return () => clearTimeout(timeout);
//   }, []);

//   useEffect(() => {
//     if (isVisible) {
//       try {
//         (window.adsbygoogle = window.adsbygoogle || []).push({});
//       } catch (e) {
//         console.error("AdsbyGoogle error:", e);
//       }
//     }
//   }, [isVisible]);

//   return (
//     <div ref={adRef}>
//       <ins
//         className="adsbygoogle"
//         style={{ display: "block" }}
//         data-ad-client="ca-pub-8794679058209848"
//         data-ad-slot="8827977087"
//         data-ad-format="auto"
//         data-full-width-responsive="true"
//         data-ad-layout="display"
//       />
//     </div>
//   );
// };
