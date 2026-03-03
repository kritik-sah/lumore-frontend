import { cn } from "@/lib/utils";
import React from "react";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
}) => {
  return (
    <section
      className={cn(
        "group mx-auto w-full relative rounded-2xl overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-1",
        containerClassName
      )}
    >
      <div
        className="relative  h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 10px 32px rgba(34, 42, 53, 0.12), 1px rgba(0, 0, 0.05), 4px 6px 0.08), 24px 108px rgba(47, 48, 55, 0.10)",
        }}
      >
        <div
          className={cn(
            "h-full px-4 py-20 sm:px-10 transition-transform duration-200 ease-out group-hover:scale-[1.01]",
            className,
          )}
        >
          <Noise />
          {children}
        </div>
      </div>
    </section>
  );
};

const Noise = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
      style={{
        backgroundImage:
          "radial-gradient(rgba(10,10,9,0.35) 0.8px, transparent 0.8px)",
        backgroundSize: "18px 18px",
      }}
    ></div>
  );
};
