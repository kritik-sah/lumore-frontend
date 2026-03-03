"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_MEASUREMENT_ID = "G-349HPV22MR";
const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8794679058209848";

function ensureGtagStub() {
  if (typeof window === "undefined") {
    return;
  }

  (window as any).dataLayer = (window as any).dataLayer || [];
  if (typeof (window as any).gtag !== "function") {
    (window as any).gtag = (...args: unknown[]) => {
      (window as any).dataLayer.push(args);
    };
  }
}

export default function DeferredThirdPartyScripts() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    ensureGtagStub();
    (window as any).gtag("js", new Date());
    (window as any).gtag("config", GA_MEASUREMENT_ID);

    const triggerLoad = () => {
      setShouldLoad(true);
    };

    const handleFirstInteraction = () => {
      triggerLoad();
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
    };

    window.addEventListener("pointerdown", handleFirstInteraction, {
      passive: true,
      once: true,
    });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });
    window.addEventListener("scroll", handleFirstInteraction, {
      passive: true,
      once: true,
    });

    let idleCallbackId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const requestIdleCallback =
      (window as Window & {
        requestIdleCallback?: (
          callback: IdleRequestCallback,
          opts?: IdleRequestOptions,
        ) => number;
      }).requestIdleCallback;

    const cancelIdleCallback =
      (window as Window & {
        cancelIdleCallback?: (id: number) => void;
      }).cancelIdleCallback;

    if (typeof requestIdleCallback === "function") {
      idleCallbackId = requestIdleCallback(() => triggerLoad(), {
        timeout: 6000,
      });
    } else {
      timeoutId = setTimeout(triggerLoad, 6000);
    }

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);

      if (idleCallbackId !== null && typeof cancelIdleCallback === "function") {
        cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script src={ADSENSE_SRC} strategy="lazyOnload" crossOrigin="anonymous" />
    </>
  );
}
