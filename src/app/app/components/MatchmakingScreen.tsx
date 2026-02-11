"use client";
import AnimatedDots from "@/components/AnimatedDots";
import Icon from "@/components/icon";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchAppStatus } from "@/lib/apis";
import { getIsOnboarded, getUser } from "@/service/storage";
import { formatNumber } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useExploreChat } from "../context/ExploreChatContext";

const MatchmakingScreen = () => {
  const { revalidateUser } = useExploreChat();

  useEffect(() => {
    return revalidateUser();
  }, []);

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
  const router = useRouter();
  interface APP_STATUS {
    totalUsers: number;
    activeUsers: number;
    isMatching: number;
    inactiveUsers: number;
    genderDistribution: { woman: number; man: number; others: number };
  }
  const [appStatus, setappStatus] = useState<APP_STATUS | null>(null);

  useEffect(() => {
    const _fetchAppStatus = async () => {
      const appStatus = await fetchAppStatus();
      if (appStatus.success) {
        setappStatus(appStatus.data);
      }
    };

    _fetchAppStatus();
  }, []);

  const handleStartMatchmaking = () => {
    startMatchmaking();
  };

  const handleRedirection = () => {
    const user = getUser();
    const isOnborded = getIsOnboarded(user?._id);
    if (isOnborded) {
      // redirect to edit profile
      router.push("/app/profile/edit");
    } else {
      // redirect to onboarding
      router.push("/app/onboarding");
    }
  };

  return (
    <div className="relative h-full flex flex-col items-center justify-between gap-4 bg-ui-background border border-ui-shade/10 rounded-xl">
      <BackgroundRippleEffect />
      <div className="z-10 flex items-center justify-end p-3 w-full">
        <Badge className="animate-pulse bg-ui-light text-ui-shade rounded-full space-x-1">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
          </span>
          <span>{formatNumber(appStatus?.isMatching || 0)} Users</span>
        </Badge>
      </div>
      <div className="z-10 relative w-full flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div
              className={`h-16 w-16 ${isMatching ? "animate-revolve" : "animate-wiggle"} bg-ui-light/30 border border-ui-shade/10 rounded-full flex items-center justify-center`}
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
          <p className="text-ui-shade/80 text-lg px-4">
            {isMatching ? (
              <span className="text-base">{`We're searching for your perfect match! As we're newly launched, it might take a moment to connect you with someone special. Hang tight we'll notify you as soon as we find them.`}</span>
            ) : (
              "Discover real connection around you, effortlessly, and authentically"
            )}
          </p>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Button
          variant={isMatching ? "outline" : "default"}
          onClick={isMatching ? stopMatchmaking : handleStartMatchmaking}
          className="rounded-lg py-6 px-8"
        >
          {isMatching ? "Stop Matchmaking" : "Start Matchmaking"}
        </Button>
      </div>
      <div className="z-10 p-3 w-full">
        <div
          onClick={handleRedirection}
          className="bg-[#E9E3EF] border border-ui-shade/10 rounded-xl p-3 flex items-center justify-between "
        >
          <p className="text-ui-highlight font-medium">
            Complete your profile for better experience ❤️‍🔥
          </p>
          <Button size={"icon"} className="rounded-full shrink-0">
            <Icon name="HiArrowLongRight" />
          </Button>
        </div>
      </div>
    </div>
  );
};
