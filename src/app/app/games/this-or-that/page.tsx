"use client";

import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  fetchThisOrThatQuestions,
  submitThisOrThatAnswer,
} from "@/lib/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import GeneralLayout from "../../components/layout/general";

type ThisOrThatQuestion = {
  _id: string;
  leftOption: string;
  leftImageUrl?: string;
  rightOption: string;
  rightImageUrl?: string;
  category?: string;
  plays?: number;
};

const ThisOrThatPage = () => {
  const [index, setIndex] = useState(0);
  const [localTotal, setLocalTotal] = useState(0);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["this-or-that", "questions"],
    queryFn: () => fetchThisOrThatQuestions(20),
  });

  const questions: ThisOrThatQuestion[] = data?.data || [];
  const current = questions[index];
  const total = questions.length;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: submitThisOrThatAnswer,
  });

  useEffect(() => {
    if (!data?.data) return;
    setIndex(0);
    setLocalTotal(0);
  }, [data]);

  const progress = useMemo(() => {
    if (!total) return 0;
    return Math.min(Math.round(((index + 1) / total) * 100), 100);
  }, [index, total]);

  const handleChoice = async (selection: "left" | "right") => {
    if (!current || isPending) return;
    try {
      await mutateAsync({
        questionId: current._id,
        selection,
      });
      setLocalTotal((prev) => prev + 1);
      setIndex((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to submit answer", error);
    }
  };

  const handleSkip = () => {
    if (!current) return;
    setIndex((prev) => prev + 1);
  };

  return (
    <GeneralLayout>
      <div className="h-full overflow-y-auto p-4">
        <div className="mx-auto w-full max-w-2xl pb-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-ui-shade/70">
                This Or That
              </p>
              <h1 className="text-2xl font-bold text-ui-shade mt-1">
                Pick your vibe
              </h1>
              <p className="text-sm text-ui-shade/70 mt-1">
                Your choices help us understand your preferences better.
              </p>
            </div>
            <Link href="/app/games/this-or-that/submit">
              <Button variant="outline" className="shrink-0">
                Submit Question
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="mt-6 rounded-2xl border border-ui-shade/10 bg-ui-light p-5">
              <div className="h-4 w-24 rounded bg-ui-shade/10 animate-pulse" />
              <div className="mt-4 h-9 w-3/4 rounded bg-ui-shade/10 animate-pulse" />
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="h-20 rounded-xl bg-ui-shade/10 animate-pulse" />
                <div className="h-20 rounded-xl bg-ui-shade/10 animate-pulse" />
              </div>
            </div>
          ) : null}

          {isError ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm text-red-600">Unable to load questions.</p>
              <Button className="mt-3" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : null}

          {!isLoading && !isError && !current ? (
            <div className="mt-6 rounded-2xl border border-ui-shade/10 bg-ui-light p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-ui-highlight/10 flex items-center justify-center">
                <Icon name="HiOutlineSparkles" className="text-ui-highlight" />
              </div>
              <h2 className="mt-3 text-xl font-semibold text-ui-shade">
                You are all caught up
              </h2>
              <p className="text-sm text-ui-shade/70 mt-2">
                You answered {localTotal} question{localTotal === 1 ? "" : "s"}.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button onClick={() => refetch()}>Get More</Button>
                <Link href="/app/games/this-or-that/submit">
                  <Button variant="outline">Submit a new one</Button>
                </Link>
              </div>
            </div>
          ) : null}

          {current ? (
            <div className="mt-6 rounded-2xl border border-ui-shade/10 bg-ui-light p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wide text-ui-shade/70">
                  {current.category || "general"}
                </p>
                <p className="text-xs text-ui-shade/70">
                  {Math.min(index + 1, total)} / {total}
                </p>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-ui-shade/10">
                <div
                  className="h-2 rounded-full bg-ui-highlight transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-5 text-center text-sm text-ui-shade/70">
                Which one describes you better?
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  className="min-h-24 rounded-xl border border-ui-highlight/20 bg-ui-highlight/5 p-4 text-left font-medium text-ui-shade hover:bg-ui-highlight/10 disabled:opacity-70"
                  onClick={() => handleChoice("left")}
                  disabled={isPending}
                >
                  {current.leftImageUrl ? (
                    <img
                      src={current.leftImageUrl}
                      alt={current.leftOption}
                      className="mb-3 h-36 w-full rounded-lg object-cover"
                    />
                  ) : null}
                  {current.leftOption}
                </button>
                <button
                  className="min-h-24 rounded-xl border border-ui-shade/20 bg-white p-4 text-left font-medium text-ui-shade hover:bg-ui-background disabled:opacity-70"
                  onClick={() => handleChoice("right")}
                  disabled={isPending}
                >
                  {current.rightImageUrl ? (
                    <img
                      src={current.rightImageUrl}
                      alt={current.rightOption}
                      className="mb-3 h-36 w-full rounded-lg object-cover"
                    />
                  ) : null}
                  {current.rightOption}
                </button>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  className="text-ui-shade/70"
                  onClick={handleSkip}
                  disabled={isPending}
                >
                  Skip
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </GeneralLayout>
  );
};

export default ThisOrThatPage;
