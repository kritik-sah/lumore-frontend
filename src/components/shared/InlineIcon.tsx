import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export type InlineIconName =
  | "spark"
  | "shield"
  | "exit"
  | "chess"
  | "rocket"
  | "users"
  | "search"
  | "location"
  | "clock"
  | "briefcase"
  | "arrowRight"
  | "check";

interface InlineIconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: InlineIconName;
  className?: string;
}

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.8,
};

export default function InlineIcon({ name, className, ...rest }: InlineIconProps) {
  const baseClassName = cn("h-4 w-4", className);

  if (name === "spark") {
    return (
      <svg viewBox="0 0 24 24" className={baseClassName} aria-hidden {...rest}>
        <path {...strokeProps} d="M12 3v4m0 10v4M3 12h4m10 0h4m-3.5-6.5-2.8 2.8M9.3 14.7l-2.8 2.8m0-11 2.8 2.8m8.4 8.4 2.8 2.8" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg viewBox="0 0 24 24" className={baseClassName} aria-hidden {...rest}>
        <path {...strokeProps} d="M12 3l7 3v6c0 5-2.8 8.7-7 10-4.2-1.3-7-5-7-10V6l7-3z" />
        <path {...strokeProps} d="M8.5 12.5l2.2 2.2 4.8-4.8" />
      </svg>
    );
  }

  if (name === "exit") {
    return (
      <svg viewBox="0 0 24 24" className={baseClassName} aria-hidden {...rest}>
        <path {...strokeProps} d="M10 8V6a2 2 0 0 1 2-2h6v16h-6a2 2 0 0 1-2-2v-2" />
        <path {...strokeProps} d="M14 12H3m0 0 3-3m-3 3 3 3" />
      </svg>
    );
  }

  if (name === "chess") {
    return (
      <svg viewBox="0 0 24 24" className={baseClassName} aria-hidden {...rest}>
        <path {...strokeProps} d="M7 20h10M8 16h8l-1-4H9l-1 4zm4-10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM10 10h4l1-3h-6l1 3z" />
      </svg>
    );
  }

  if (name === "rocket") {
    return (
      <svg viewBox="0 0 24 24" className={baseClassName} aria-hidden {...rest}>
        <path {...strokeProps} d="M14 4c3 1 5 3 6 6-1.7 1.8-3.8 3.2-6 4-1.2-2.2-2.6-4.3-4-6 1.1-1.1 2.5-2.1 4-4z" />
        <path {...strokeProps} d="M10 8 6 9l-2 4 4-2m6 3 1 4 4 2-2-4" />
      </svg>
    );
  }

  if (name === "users") {
    return (
      <svg viewBox="0 0 24 24" className={baseClassName} aria-hidden {...rest}>
        <path {...strokeProps} d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path {...strokeProps} d="M3 20a5 5 0 0 1 10 0M13 20a5 5 0 0 1 8 0" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg viewBox="0 0 24 24" className={baseClassName} aria-hidden {...rest}>
        <circle {...strokeProps} cx="11" cy="11" r="6" />
        <path {...strokeProps} d="m20 20-3.5-3.5" />
      </svg>
    );
  }

  if (name === "location") {
    return (
      <svg viewBox="0 0 24 24" className={baseClassName} aria-hidden {...rest}>
        <path {...strokeProps} d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
        <circle {...strokeProps} cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg viewBox="0 0 24 24" className={baseClassName} aria-hidden {...rest}>
        <circle {...strokeProps} cx="12" cy="12" r="8" />
        <path {...strokeProps} d="M12 8v5l3 2" />
      </svg>
    );
  }

  if (name === "briefcase") {
    return (
      <svg viewBox="0 0 24 24" className={baseClassName} aria-hidden {...rest}>
        <rect {...strokeProps} x="3" y="7" width="18" height="12" rx="2" />
        <path {...strokeProps} d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12h18" />
      </svg>
    );
  }

  if (name === "arrowRight") {
    return (
      <svg viewBox="0 0 24 24" className={baseClassName} aria-hidden {...rest}>
        <path {...strokeProps} d="M5 12h14m-5-5 5 5-5 5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={baseClassName} aria-hidden {...rest}>
      <path {...strokeProps} d="M5 12l4 4 10-10" />
    </svg>
  );
}
