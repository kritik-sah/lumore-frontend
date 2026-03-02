import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionTone = "surface" | "alt" | "contrast";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  tone?: SectionTone;
  className?: string;
  contentClassName?: string;
}

const toneStyles: Record<SectionTone, string> = {
  surface:
    "bg-ui-light/85 text-ui-shade ring-1 ring-ui-shade/10 shadow-[0_18px_42px_rgba(0,0,0,0.07)]",
  alt: "bg-[linear-gradient(145deg,rgba(241,233,218,0.65),rgba(250,250,250,0.96))] text-ui-shade ring-1 ring-ui-shade/8 shadow-[0_20px_46px_rgba(0,0,0,0.08)]",
  contrast:
    "bg-[linear-gradient(140deg,rgba(84,19,136,0.95),rgba(46,41,78,0.96))] text-ui-light shadow-[0_26px_64px_rgba(30,18,43,0.34)]",
};

export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  tone = "surface",
  className,
  contentClassName,
}: SectionProps) {
  const isContrast = tone === "contrast";

  return (
    <section id={id} className={cn("py-8 md:py-10", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[30px] px-6 py-8 md:px-10 md:py-11",
          toneStyles[tone],
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full blur-3xl",
            isContrast ? "bg-ui-primary/25" : "bg-ui-highlight/15",
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute -bottom-14 -left-8 h-32 w-32 rounded-full blur-2xl",
            isContrast ? "bg-ui-light/10" : "bg-ui-primary/20",
          )}
        />

        <div className="relative">
          {eyebrow ? (
            <p
              className={cn(
                "text-xs font-bold uppercase tracking-[0.14em]",
                isContrast ? "text-ui-primary" : "text-ui-highlight",
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={cn(
              "mt-2 text-3xl font-bold leading-tight md:text-5xl",
              isContrast ? "text-ui-light" : "text-ui-shade",
            )}
          >
            {title}
          </h2>
          {description ? (
            <p
              className={cn(
                "mt-4 max-w-3xl text-sm leading-relaxed md:text-base",
                isContrast ? "text-ui-light/82" : "text-ui-shade/78",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        <div className={cn("relative mt-8", contentClassName)}>{children}</div>
      </div>
    </section>
  );
}
