"use client";

import { useRouter } from "next/navigation";
import React from "react";
import PostTypeCard from "../components/create-post/PostTypeCard";
import GeneralLayout from "../components/layout/general";

const GamesPage = () => {
  const router = useRouter();

  return (
    <GeneralLayout>
      <div className="h-full p-3">
        <div className="mx-auto w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-ui-shade">Games</h2>
          <p className="text-sm text-ui-shade/70 mt-1">
            Help us understand your vibe better.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center px-0 gap-3 mt-4 max-w-2xl mx-auto">
          <PostTypeCard
            title="Play This Or That"
            description="Choose between two options and shape your match signals."
            className="border-ui-highlight bg-ui-highlight/5 text-ui-highlight"
            onClick={() => router.push("/app/games/this-or-that")}
          />
        </div>
      </div>
    </GeneralLayout>
  );
};

export default GamesPage;
