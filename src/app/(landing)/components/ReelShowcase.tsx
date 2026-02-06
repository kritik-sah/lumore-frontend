"use client";
import Icon from "@/components/icon";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ReactPlayer from "react-player";

const ReelShowcase = () => {
  const [muted, setMuted] = useState(true);
  return (
    <section id="reel-showcase" className="py-20">
      <div className="px-4 lg:px-0 max-w-7xl mx-auto">
        <div className="relative w-full flex flex-col md:flex-row items-start justify-between bg-ui-highlight/10 overflow-hidden p-4 md:p-8 rounded-2xl shadow-2xl gap-6">
          <BackgroundRippleEffect />

          <div className="relative z-10 h-auto w-full md:w-96 aspect-[9/16]">
            <ReactPlayer
              src="https://ik.imagekit.io/rebel/reel/reel2.mp4?tr=orig&updatedAt=1761736348210"
              className="rounded-2xl shadow-2xl overflow-hidden "
              playing
              width="100%"
              height="100%"
              controls={false}
              loop
              muted={muted}
            />
          </div>
          <div className="relative z-10 flex-1 h-full shrink-0 flex-grow pt-4 md:pt-8">
            <div className="flex flex-col items-start justify-center gap-6">
              <span className="inline-flex items-center rounded-full bg-ui-primary text-ui-shade text-xs font-bold px-2 py-1 uppercase tracking-wide">
                Watch a real moment
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-ui-highlight text-balance">
                Feeling exhausted after using dating apps.
              </h2>
              <p className="text-lg italic text-ui-shade/80 max-w-2xl">
                Experience the magic of spontaneous connections through our
                reel. See how our platform brings people together in real-time,
                creating unforgettable moments and genuine interactions.
              </p>

              <Button
                onClick={() => setMuted(!muted)}
                className="rounded-full gap-2 px-5"
              >
                <Icon name={muted ? "GoUnmute" : "GoMute"} />
                <span className="hidden md:inline">
                  Sound {muted ? "on" : "off"}
                </span>
              </Button>
            </div>
          </div>
          <span className="font-dmSans -tracking-[16px] leading-0 font-bold italic absolute bottom-16 right-4 text-[220px] text-ui-light/40">
            Lumore
          </span>
        </div>
      </div>
    </section>
  );
};

export default ReelShowcase;
