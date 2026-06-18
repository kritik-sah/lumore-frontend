"use client";

import AnimatedDots from "@/components/AnimatedDots";
import Icon from "@/components/icon";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchPreferenceMatchCount } from "@/lib/apis";
import { trackAnalytic } from "@/service/analytics";
import { getIsOnboarded, getUser } from "@/service/storage";
import { formatNumber } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useExploreChat } from "../context/ExploreChatContext";
import { useCreditsBalance } from "../hooks/useCredits";

const MatchmakingScreen = () => {
  const { revalidateUser } = useExploreChat();

  useEffect(() => {
    return revalidateUser();
  }, [revalidateUser]);

  return (
    <div className="flex-1 overflow-y-auto p-2">
      <SearchScreen />
    </div>
  );
};

export default MatchmakingScreen;

const SearchScreen = () => {
  const { isMatching, error, startMatchmaking, stopMatchmaking } =
    useExploreChat();
  const { data: creditsRes } = useCreditsBalance();
  const router = useRouter();
  const [availableUsersCount, setAvailableUsersCount] = useState(0);

  useEffect(() => {
    const fetchMatchCount = async () => {
      const response = await fetchPreferenceMatchCount();
      if (response?.success) {
        setAvailableUsersCount(response.data?.availableUsers || 0);
      }
    };

    void fetchMatchCount();
  }, []);

  const handleStartMatchmaking = () => {
    trackAnalytic({
      activity: "matchmaking_started",
      label: "explore",
      category: "ui-simplification",
    });
    startMatchmaking();
  };

  const handleRedirection = () => {
    const user = getUser();
    const isOnborded = getIsOnboarded(user?._id);
    if (isOnborded) {
      router.push("/app/profile/edit");
      return;
    }
    router.push("/app/onboarding");
  };

  return (
    <div className="relative h-full flex flex-col items-center justify-between gap-4 bg-bg-muted border border-border-default/10 rounded-xl">
      <BackgroundRippleEffect />
      <div className="z-10 flex items-center justify-between p-3 w-full gap-2">
        <Badge className="bg-action-primary/70 text-action-primary-contrast rounded-full">
          <span>{creditsRes?.data?.credits ?? 0} credits</span>
        </Badge>
        <Badge className="animate-pulse bg-bg-surface text-text-primary rounded-full space-x-1">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
          </span>
          <span>{formatNumber(availableUsersCount)} Users</span>
        </Badge>
      </div>

      <div className="z-10 relative w-full flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div
              className={`h-16 w-16 ${isMatching ? "animate-revolve" : "animate-wiggle"} bg-bg-surface/30 border border-border-default/10 rounded-full flex items-center justify-center`}
            >
              <Icon
                name={isMatching ? "BsSearchHeart" : "IoRoseOutline"}
                className="h-8 w-8"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isMatching ? (
              <AnimatedDots text="Searching" />
            ) : (
              "Meet Someone New"
            )}
          </h1>
          <p className="text-text-primary/80 text-lg px-4">
            {isMatching ? (
              <span className="text-base">
                We are searching for your perfect match. It can take a moment
                while availability grows.
              </span>
            ) : (
              "Discover real connection around you, effortlessly, and authentically."
            )}
          </p>
        </div>

        {error ? <div className="text-red-500 text-sm">{error}</div> : null}

        <Button
          variant={isMatching ? "outline" : "default"}
          onClick={isMatching ? stopMatchmaking : handleStartMatchmaking}
          className="rounded-lg py-6 px-8"
        >
          {isMatching ? "Stop Matchmaking" : "Start Matchmaking"}
        </Button>
      </div>

      <div className="z-10 p-3 w-full grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div
          onClick={handleRedirection}
          className="bg-bg-surface/60 border border-border-default/10 rounded-xl p-3 flex items-center justify-between cursor-pointer"
        >
          <p className="text-action-primary font-medium">
            Complete your profile for better matches.
          </p>
          <Button size="icon" className="rounded-full shrink-0">
            <Icon name="HiArrowLongRight" />
          </Button>
        </div>
      </div>
    </div>
  );
};

