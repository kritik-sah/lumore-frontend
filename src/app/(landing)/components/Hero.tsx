"use client";
import Icon from "@/components/icon";
// import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";
import { Particles } from "@/components/ui/particles";
import SketchButton from "@/components/ui/SketchButton";
import { usePWA } from "@/hooks/usePWA";
// import { PopupButton } from "@typeform/embed-react";
// import Image from "next/image";
// import { useEffect, useState } from "react";
import ProductHuntBadge from "./ProductHuntBadge";

export default function Hero() {
  const { install } = usePWA();

  return (
    <section className="max-w-7xl min-h-[70vh] mx-auto flex items-center justify-center gap-10 py-4 lg:py-14 px-5 text-center md:text-left !overflow-x-hidden">
      <div className="pt-20 flex flex-col items-center justify-center gap-2 ">
        <h1 className="text-3xl md:text-5xl text-center font-bold uppercase">
          Meet <span className="text-ui-highlight">People</span>,
          <br className="hidden md:block" />
          <FlipWords
            className="text-center"
            words={[
              "Not Profiles.",
              "Not Their Best Selfie.",
              "Not AI-Generated Prompts.",
              "Not Job Titles in Bios.",
              `Not "Here for a Good Time" Clichés.`,
              "Not Catfish Filters.",
              "Not Swipe Leftovers.",
              `Not "Hey" Collectors.`,
              "Not Ghost Stories.",
              "Not Algorithm Mistakes.",
            ]}
          />
        </h1>
        <h6 className="text-ui-shade text-center max-w-xl my-5 text-base md:text-lg">
          Lumore helps you meet new people, not just swipe on them. We&apos;re
          building a more meaningful, less awkward way to socialize.
        </h6>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <a
            className="w-full md:w-auto"
            href="https://play.google.com/store/apps/details?id=xyz.lumore.www.twa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SketchButton className="py-3 px-6 w-full md:w-auto">
              <Icon
                name="AiFillAndroid"
                className="text-3xl flex-shrink-0 mr-2"
              />
              Install Lumore
            </SketchButton>
          </a>
          <ProductHuntBadge />
        </div>
      </div>

      <Particles
        className="absolute inset-0 -z-10"
        quantity={100}
        staticity={50}
        ease={100}
        color="#00000050"
        refresh
        vy={-0.3}
      />
    </section>
  );
}
