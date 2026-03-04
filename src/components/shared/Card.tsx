import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-ui-shade/10 bg-ui-light p-5 shadow-[0_12px_32px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      {children}
    </article>
  );
}
