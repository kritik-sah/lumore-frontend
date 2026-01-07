// hooks/useConfettiSideCannons.ts
"use client";

import confetti from "canvas-confetti";
import { useCallback } from "react";

interface ConfettiOptions {
  durationMs?: number;
  colors?: string[];
}

export const useConfettiSideCannons = (options?: ConfettiOptions) => {
  const {
    durationMs = 3000,
    colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"],
  } = options || {};

  const fire = useCallback(() => {
    const end = Date.now() + durationMs;

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, [durationMs, colors]);

  return fire;
};
