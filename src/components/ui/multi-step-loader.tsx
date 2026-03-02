"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { HiCheckCircle, HiOutlineCheckCircle } from "react-icons/hi2";

const CheckIcon = ({ className }: { className?: string }) => {
  return <HiOutlineCheckCircle className={cn("h-6 w-6", className)} />;
};

const CheckFilled = ({ className }: { className?: string }) => {
  return <HiCheckCircle className={cn("h-6 w-6", className)} />;
};

type LoadingState = {
  text: string;
};

const LoaderCore = ({
  loadingStates,
  value = 0,
  compact = false,
}: {
  loadingStates: LoadingState[];
  value?: number;
  compact?: boolean;
}) => {
  return (
    <div
      className={cn(
        "relative mx-auto flex max-w-xl flex-col justify-start",
        compact ? "mt-0" : "mt-40",
      )}
    >
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0); // Minimum opacity is 0, keep it 0.2 if you're sane.

        return (
          <motion.div
            key={index}
            className={cn("text-left flex gap-2 mb-4")}
            initial={{ opacity: 0, y: -(value * 40) }}
            animate={{ opacity: opacity, y: -(value * 40) }}
            transition={{ duration: 0.5 }}
          >
            <div>
              {index > value && <CheckIcon className="text-black " />}
              {index <= value && (
                <CheckFilled
                  className={cn(
                    "text-ui-highlight ",
                    value === index && "text-ui-highlight  opacity-100",
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-black dark:text-white",
                value === index && "text-black dark:text-lime-500 opacity-100",
              )}
            >
              {loadingState.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = true,
  inline = false,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
  inline?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1),
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className={cn(
            "flex items-center justify-center",
            inline
              ? "relative w-full"
              : "fixed inset-0 z-[100] h-full w-full backdrop-blur-2xl",
          )}
        >
          <div className={cn("relative", inline ? "h-56" : "h-96")}>
            <LoaderCore
              value={currentState}
              loadingStates={loadingStates}
              compact={inline}
            />
          </div>

          {!inline ? (
            <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white dark:bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
