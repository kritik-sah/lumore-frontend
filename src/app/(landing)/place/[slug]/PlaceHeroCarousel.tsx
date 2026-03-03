"use client";

import Icon from "@/components/icon";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

type HeroCarouselImage = {
  src: string;
  alt: string;
};

type PlaceHeroCarouselProps = {
  images: HeroCarouselImage[];
  placeName: string;
};

export default function PlaceHeroCarousel({
  images,
  placeName,
}: PlaceHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalImages = images.length;
  const hasImages = totalImages > 0;
  const hasMultipleImages = totalImages > 1;

  const safeActiveIndex = useMemo(() => {
    if (!hasImages) {
      return 0;
    }

    if (activeIndex >= totalImages) {
      return 0;
    }

    return activeIndex;
  }, [activeIndex, hasImages, totalImages]);

  const goNext = useCallback(() => {
    if (!hasMultipleImages) {
      return;
    }

    setActiveIndex((prev) => (prev + 1) % totalImages);
  }, [hasMultipleImages, totalImages]);

  const goPrev = useCallback(() => {
    if (!hasMultipleImages) {
      return;
    }

    setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [hasMultipleImages, totalImages]);

  useEffect(() => {
    if (!hasMultipleImages) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        Boolean(target?.isContentEditable);

      if (isTypingTarget) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, hasMultipleImages]);

  if (!hasImages) {
    return (
      <div className="flex h-full min-h-[260px] items-center justify-center bg-[linear-gradient(130deg,rgba(84,19,136,0.16),rgba(255,212,0,0.18))] p-6 text-center text-sm font-medium text-ui-shade/75">
        Hero image coming soon for {placeName}
      </div>
    );
  }

  const currentImage = images[safeActiveIndex];

  return (
    <div className="relative h-full min-h-[260px] md:min-h-[380px]">
      <Image
        src={currentImage.src}
        alt={currentImage.alt}
        fill
        className="h-full w-full object-cover"
        sizes="(max-width: 1024px) 100vw, 42vw"
        priority
      />

      {hasMultipleImages ? (
        <>
          <button
            type="button"
            aria-label="Previous hero image"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-ui-light/30 bg-ui-shade/50 p-2 text-ui-light backdrop-blur-sm transition hover:bg-ui-shade/70"
          >
            <Icon name="FaChevronLeft" className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next hero image"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-ui-light/30 bg-ui-shade/50 p-2 text-ui-light backdrop-blur-sm transition hover:bg-ui-shade/70"
          >
            <Icon name="FaChevronRight" className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ui-shade/60 px-3 py-1 text-xs font-semibold text-ui-light backdrop-blur-sm">
            {safeActiveIndex + 1} / {totalImages}
          </div>
        </>
      ) : null}
    </div>
  );
}
