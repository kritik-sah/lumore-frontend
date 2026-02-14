"use client";

import { fetchUserThisOrThatAnswers } from "@/lib/apis";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";

const ThisOrThatAnswersCarousel = ({
  profileUserId,
}: {
  profileUserId: string;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["this-or-that-answers", profileUserId],
      queryFn: ({ pageParam = 1 }) =>
        fetchUserThisOrThatAnswers({
          userId: profileUserId,
          page: pageParam as number,
          limit: 10,
        }),
      getNextPageParam: (lastPage) =>
        lastPage?.pagination?.hasMore ? lastPage.pagination.nextPage : undefined,
      initialPageParam: 1,
      enabled: Boolean(profileUserId),
    });

  const answers = useMemo(
    () => data?.pages?.flatMap((page: any) => page?.data || []) || [],
    [data],
  );

  const onScroll = () => {
    const el = containerRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;

    const remaining = el.scrollWidth - el.scrollLeft - el.clientWidth;
    if (remaining < 220) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-ui-shade/10 bg-white p-4">
        <p className="text-sm text-ui-shade/70">This or that answers</p>
        <div className="mt-3 flex gap-3 overflow-hidden">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={`this-or-that-skeleton-${idx}`}
              className="min-w-[230px] rounded-xl border border-ui-shade/10 p-3"
            >
              <div className="h-24 w-full rounded bg-ui-shade/10 animate-pulse" />
              <div className="mt-2 h-4 w-4/5 rounded bg-ui-shade/10 animate-pulse" />
              <div className="mt-1 h-3 w-1/2 rounded bg-ui-shade/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!answers.length) return null;

  return (
    <div className="rounded-xl border border-ui-shade/10 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ui-shade/70">This or that answers</p>
      </div>
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="mt-3 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1"
      >
        {answers.map((answer: any) => {
          const isLeft = answer.selection === "left";
          return (
            <div
              key={answer._id}
              className="min-w-[240px] max-w-[240px] snap-start rounded-xl border border-ui-shade/10 overflow-hidden"
            >
              <div className="h-28 w-full bg-ui-shade/5">
                {answer.selectedImageUrl ? (
                  <picture>
                    <img
                      src={answer.selectedImageUrl}
                      alt={answer.selectedText}
                      className="h-full w-full object-cover"
                    />
                  </picture>
                ) : null}
              </div>
              <div className="p-3">
                <p className="text-xs uppercase text-ui-shade/60">
                  {answer.question?.category || "general"}
                </p>
                <p className="mt-1 text-sm font-medium text-ui-shade">
                  {answer.selectedText} over{" "}
                  {isLeft ? answer.question?.rightOption : answer.question?.leftOption}
                </p>
              </div>
            </div>
          );
        })}
        {isFetchingNextPage ? (
          <div className="min-w-[180px] snap-start rounded-xl border border-ui-shade/10 p-3 flex items-center justify-center text-sm text-ui-shade/70">
            Loading more...
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ThisOrThatAnswersCarousel;
