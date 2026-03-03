"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const LoadMorePosts = dynamic(() => import("./LoadMorePosts"));

export default function DeferredLoadMorePosts({
  initialCount = 12,
}: {
  initialCount?: number;
}) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current || shouldLoad) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "280px 0px" },
    );

    observer.observe(rootRef.current);

    return () => observer.disconnect();
  }, [shouldLoad]);

  if (shouldLoad) {
    return <LoadMorePosts initialCount={initialCount} />;
  }

  return (
    <div ref={rootRef} className="mt-12 flex justify-center">
      <button
        type="button"
        onClick={() => setShouldLoad(true)}
        className="px-6 py-3 rounded-full bg-ui-primary text-ui-shade font-semibold border border-ui-shade/20 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition"
      >
        Load More
      </button>
    </div>
  );
}
