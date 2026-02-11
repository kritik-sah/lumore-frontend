"use client";

import { WobbleCard } from "@/components/ui/wobble-card";
import React from "react";

function ProductPortfolio() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full p-4 md:p-0">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-ui-highlight min-h-[500px] lg:min-h-[320px] overflow-hidden"
        className="p-8"
      >
        <div className="max-w-md">
          <h2 className="text-left text-balance text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-tight">
            Tired of endless swiping?
          </h2>
          <p className="mt-4 text-left text-base/6 text-neutral-200">
            Find your perfect match with our AI-powered, intent-based swipeless
            dating app.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <p className="text-left text-xs uppercase tracking-wide text-neutral-200">
              Available on
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-start gap-3">
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
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-start gap-2">
              <span className="text-xs text-neutral-200">
                Also on Telegram Mini App
              </span>
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
        </div>
        <img
          src="/assets/tired-of-endless-swiping.png"
          width={500}
          height={500}
          alt="Lumore app preview"
          className="absolute right-0 -bottom-16 translate-x-6 object-contain rounded-2xl w-[320px] md:w-[420px]"
        />
      </WobbleCard>
      <WobbleCard
        containerClassName="col-span-1 min-h-[320px] bg-black overflow-hidden"
        className="p-8"
      >
        <span className="inline-flex items-center rounded-full bg-ui-primary text-ui-shade text-xs font-bold px-2 py-1">
          Community-first
        </span>
        <h2 className="mt-4 max-w-80 text-left text-balance text-2xl md:text-3xl font-semibold tracking-tight text-white leading-tight">
          Stop Swiping. Start Showing Up.
        </h2>
        <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
          We do real-life vibes only board games, chill house parties,
          spontaneous meetups. No small talk. No awkwardness. Just connection.
        </p>
        <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
          Join the Community
        </p>
      </WobbleCard>
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-3 bg-ui-primary text-ui-dark min-h-[500px] lg:min-h-[600px] xl:min-h-[320px] overflow-hidden"
        className="p-8"
      >
        <div className="max-w-md">
          <h2 className="max-w-sm md:max-w-lg text-left text-balance text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight">
            Be Part of Something Before It Becomes Big.
          </h2>
          <p className="mt-4 max-w-[30rem] text-left text-base/6">
            We&apos;re building Lumore with our community. Early members get
            invites to private events board game nights, rooftop house parties,
            mystery meetups, and more.
          </p>
        </div>
        <img
          src="assets/be-part-of-something.png"
          width={500}
          height={500}
          alt="Lumore community events"
          className="absolute right-0 -bottom-6 md:-bottom-10 translate-x-6 object-contain rounded-2xl w-[320px] md:w-[420px]"
        />
      </WobbleCard>
    </div>
  );
}

export default ProductPortfolio;
