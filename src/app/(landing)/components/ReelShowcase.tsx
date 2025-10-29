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
        <div className="relative w-full flex flex-col md:flex-row items-start justify-between bg-ui-highlight/10 overflow-hidden p-3 md:p-6 rounded-2xl shadow-2xl gap-4">
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
          <div className="relative z-10 flex-1 h-full shrink-0 flex-grow pt-8">
            <div className="flex flex-col items-start justify-center gap-6 ">
              <h2 className="text-6xl font-bold text-ui-highlight">
                Feeling exhausted after using dating app.
              </h2>
              <p className="text-lg italic">
                Experience the magic of spontaneous connections through our
                reel. See how our platform brings people together in real-time,
                creating unforgettable moments and genuine interactions.
              </p>

              <Button
                onClick={() => setMuted(!muted)}
                size={"icon"}
                className="rounded-full"
              >
                <Icon name={muted ? "GoUnmute" : "GoMute"} />
              </Button>
            </div>
          </div>
          <span className="font-dmSans -tracking-[16px] leading-0 font-bold italic absolute bottom-21 right-6 text-[250px] text-ui-light/70">
            Lumore
          </span>
        </div>
      </div>
    </section>
  );
};

export default ReelShowcase;
