"use client";

import { FlipWords } from "@/components/ui/flip-words";

export default function HeroAnimatedWords({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) {
  return <FlipWords words={words} className={className} />;
}
