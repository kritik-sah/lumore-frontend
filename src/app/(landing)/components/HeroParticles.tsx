"use client";

import { Particles } from "@/components/ui/particles";
import { useEffect, useState } from "react";

export default function HeroParticles() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isDesktop = window.innerWidth >= 1024;

    if (prefersReducedMotion || !isDesktop) {
      return;
    }

    const timer = window.setTimeout(() => {
      setEnabled(true);
    }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Particles
      className="absolute inset-0 -z-10"
      quantity={100}
      staticity={50}
      ease={100}
      color="#00000050"
      refresh
      vy={-0.3}
    />
  );
}
