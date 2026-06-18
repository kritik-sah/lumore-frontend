"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=xyz.lumore.rebel";

const screenshots = Array.from({ length: 7 }, (_, index) => ({
  src: `/assets/lumore-screens/${index + 1}.png`,
  alt: `Lumore app preview ${index + 1}`,
}));

export default function LumoreUpgradePage() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % screenshots.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, []);

  const showPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? screenshots.length - 1 : currentIndex - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % screenshots.length);
  };

  return (
    <main className="h-[100svh] overflow-y-auto overflow-x-hidden bg-ui-shade text-white">
      <section className="relative isolate min-h-[100svh] px-5 py-6 sm:px-7 lg:px-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_14%,rgba(255,212,0,0.18),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(217,3,104,0.22),transparent_30%),linear-gradient(145deg,#07070a_0%,#11111a_46%,#050506_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:44px_44px]"
        />

        <div className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-6xl items-center justify-center text-center gap-9 md:grid-cols-[minmax(0,0.92fr)_minmax(330px,440px)] lg:gap-14">
          <div className="order-2 md:order-1">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Image
                alt="Lumore"
                className="h-9 w-auto"
                height={44}
                priority
                src="/assets/lumore-brand-kit/logo-white.svg"
                width={148}
              />
            </div>

            <h1 className="mt-7 max-w-[700px] text-[32px] font-black leading-[0.94] text-white sm:text-[58px] lg:text-[74px]">
              Get the faster, fresher Lumore app.
            </h1>
            <p className="mt-6 max-w-[610px] text-sm text-white/70">
              Lumore Lite is no longer the main experience. Install the Play
              Store app for the newest design, smoother chats, and every new
              update from here on.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-ui-primary px-6 text-center text-base font-medium text-ui-shade shadow-[0_14px_34px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-[#ffe04d] active:translate-y-0"
                href={PLAY_STORE_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Download aria-hidden="true" size={21} strokeWidth={2.8} />
                Install on Play Store
                <ExternalLink aria-hidden="true" size={18} strokeWidth={2.8} />
              </a>
              <p className="text-sm leading-5 text-white/50">
                Required to continue using Lumore.
              </p>
            </div>
          </div>

          <div className="order-1 flex flex-col items-center md:order-2">
            <div className="relative w-full max-w-[390px]">
              <div
                aria-hidden="true"
                className="absolute -inset-5 rounded-[40px] bg-[#d90368]/16 blur-3xl"
              />
              <div className="relative aspect-[9/16] overflow-hidden rounded-[34px] border border-white/16 bg-[#101015] p-2 shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
                <div className="relative h-full overflow-hidden rounded-[26px] bg-black">
                  {screenshots.map((screenshot, index) => (
                    <Image
                      alt={screenshot.alt}
                      className={`object-contain transition-opacity duration-500 ${
                        index === activeIndex ? "opacity-100" : "opacity-0"
                      }`}
                      fill
                      key={screenshot.src}
                      priority={index === 0}
                      sizes="(max-width: 768px) 86vw, 390px"
                      src={screenshot.src}
                    />
                  ))}
                </div>

                <button
                  aria-label="Previous app preview"
                  className="absolute left-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/14 bg-black/58 text-white shadow-lg backdrop-blur transition hover:bg-white hover:text-black"
                  onClick={showPrevious}
                  type="button"
                >
                  <ChevronLeft aria-hidden="true" size={22} strokeWidth={2.7} />
                </button>
                <button
                  aria-label="Next app preview"
                  className="absolute right-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/14 bg-black/58 text-white shadow-lg backdrop-blur transition hover:bg-white hover:text-black"
                  onClick={showNext}
                  type="button"
                >
                  <ChevronRight
                    aria-hidden="true"
                    size={22}
                    strokeWidth={2.7}
                  />
                </button>
              </div>
            </div>

            <div className="mt-5 flex max-w-full justify-center gap-2 overflow-x-auto px-1 pb-1">
              {screenshots.map((screenshot, index) => (
                <button
                  aria-label={`Show app preview ${index + 1}`}
                  className={`relative h-14 w-8 shrink-0 overflow-hidden rounded-md border transition sm:h-16 sm:w-9 ${
                    index === activeIndex
                      ? "border-[#ffd400] opacity-100"
                      : "border-white/14 opacity-48 hover:opacity-80"
                  }`}
                  key={screenshot.src}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="36px"
                    src={screenshot.src}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
