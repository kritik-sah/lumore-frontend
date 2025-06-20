// components/Hero.tsx
"use client";
import Icon from "@/components/icon";
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
        <h2 className="text-3xl md:text-7xl font-bold leading-tight uppercase">
          Meet <span className="text-ui-highlight">People</span>,
          <br className="hidden md:block" /> Not Profiles.
        </h2>
        <p className="text-ui-shade max-w-md my-5 text-sm md:text-base">
          Lumore helps you meet new people, not just swipe on
          them. We&apos;re building a more meaningful, less awkward way to
          socialize.

        </p>

        <div className="flex flex-col lg:flex-row items-center justify-start gap-4">
          <Button
            size="lg"
            className="bg-ui-primary text-ui-shade hover:bg-ui-primary/90 text-xl md:text-lg py-8 md:py-6 w-full md:w-auto rounded-xl"
            onClick={install}
          >
            Install Lumore
            {/* <Icon name="FaApple" className="text-3xl flex-shrink-0" /> */}
            <Icon name="AiFillAndroid" className="text-3xl flex-shrink-0" />
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
