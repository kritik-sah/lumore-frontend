// components/Hero.tsx
"use client";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/usePWA";
import { PopupButton } from "@typeform/embed-react";
import Image from "next/image";
import ProductHuntBadge from "./ProductHuntBadge";

export default function Hero() {
  const { install } = usePWA();
  return (
    <section className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-center gap-10 py-4 lg:py-14 px-5 text-center md:text-left">
      {/* Left Content */}
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl md:text-6xl font-bold leading-tight">
          Find Your <span className="text-ui-accent">Match</span>,
          <br className="hidden md:block" /> Your Way
        </h2>
        <p className="text-ui-shade max-w-xl my-5 text-sm md:text-base">
          Lumore connects you instantly with like-minded people through
          real-time, anonymous chat, eliminating endless swiping. Our mission is
          to make dating effortless, secure, and meaningful by matching users
          based on interests, location, and preferences.
        </p>
        <div className="flex flex-col lg:flex-row items-center justify-start gap-4">
          <Button
            size="lg"
            className="text-base md:text-lg py-4 md:py-6"
            onClick={install}
          >
            Install Lumore
          </Button>
          {/* <PopupButton id="ITzseckk">
            <Button size="lg" className="text-base md:text-lg py-4 md:py-6">
              Join Lumore Waitlist !!
            </Button>
          </PopupButton> */}
          <ProductHuntBadge />
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/assets/date.svg"
          alt="Date you are looking for"
          height={400}
          width={400}
          className="w-[80%] md:w-full max-w-sm md:max-w-md"
        />
      </div>
    </section>
  );
}
