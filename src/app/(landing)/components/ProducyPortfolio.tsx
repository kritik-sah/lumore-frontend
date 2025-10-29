"use client";

import { WobbleCard } from "@/components/ui/wobble-card";
import { Link } from "lucide-react";
import React from "react";

function ProductPortfolio() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full p-4 md:p-0">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-ui-highlight min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-sm">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Tired of endless swiping?
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
            Find your perfect match with our AI-powered, Intent based swipeless
            dating app.
          </p>
          <p className="mt-4 ps-4 text-left  text-base/6 text-neutral-200">
            Available on
          </p>
          <div className="flex flex-column md:flex-row items-center justify-start gap-1 z-50">
            <a
              href="https://play.google.com/store/apps/details?id=xyz.lumore.www.twa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/play.png"
                width={150}
                height={50}
                alt="Lumore: Android App on Google Play"
                className="object-contain"
              />
            </a>
            <a
              href="https://t.me/lumore_bot/lumore"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/tma.png"
                width={150}
                height={50}
                alt="Lumore: Mini App on Telegram"
                className="object-contain"
              />
            </a>
          </div>
        </div>
        <img
          src="/assets/tired-of-endless-swiping.png"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-4 -bottom-64 object-contain rounded-2xl"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Stop Swiping. Start Showing Up.
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          We do real-life vibes only — board games, chill house parties,
          spontaneous meetups. No small talk. No awkwardness. Just connection.
        </p>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          🤝 Join the Community
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-ui-primary text-ui-dark min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em]">
            Be Part of Something Before It Becomes Big.
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 ">
            We&apos;re building Lumore with our community. Early members get
            invites to private events — board game nights, rooftop house
            parties, mystery meetups, and more.
          </p>
        </div>
        <img
          src="assets/be-part-of-something.png"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}

export default ProductPortfolio;
