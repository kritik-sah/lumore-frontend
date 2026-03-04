import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import Container from "./Container";

type SectionTone = "surface" | "muted" | "accent";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  tone?: SectionTone;
}

const toneStyles: Record<SectionTone, string> = {
  surface:
    "bg-ui-light ring-1 ring-ui-shade/10 shadow-[0_16px_42px_rgba(0,0,0,0.07)]",
  muted:
    "bg-[linear-gradient(165deg,rgba(250,250,250,0.98),rgba(241,233,218,0.62))] ring-1 ring-ui-shade/10 shadow-[0_16px_42px_rgba(0,0,0,0.07)]",
  accent:
    "bg-[linear-gradient(135deg,rgba(84,19,136,0.95),rgba(217,3,104,0.86),rgba(255,212,0,0.82))] text-ui-light shadow-[0_24px_58px_rgba(36,20,50,0.34)]",
};

export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  contentClassName,
  tone = "surface",
}: SectionProps) {
  const contrastTone = tone === "accent";

  return (
    <section id={id} className={cn("py-6 md:py-8", className)}>
      <Container>
        <div className={cn("relative overflow-hidden rounded-[30px] p-6 md:p-10", toneStyles[tone])}>
          <div
            className={cn(
              "pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full blur-3xl",
              contrastTone ? "bg-ui-light/15" : "bg-ui-highlight/20",
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute -bottom-16 left-0 h-40 w-40 rounded-full blur-3xl",
              contrastTone ? "bg-ui-primary/20" : "bg-ui-primary/30",
            )}
          />

          <div className="relative">
            {eyebrow ? (
              <p
                className={cn(
                  "text-xs font-bold uppercase tracking-[0.16em]",
                  contrastTone ? "text-ui-primary" : "text-ui-highlight",
                )}
              >
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className={cn("mt-3 text-3xl font-bold leading-tight md:text-5xl", contrastTone ? "text-ui-light" : "text-ui-shade")}>
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                className={cn(
                  "mt-3 max-w-3xl text-sm leading-relaxed md:text-base",
                  contrastTone ? "text-ui-light/85" : "text-ui-shade/80",
                )}
              >
                {description}
              </p>
            ) : null}
          </div>

          <div className={cn("relative mt-8", contentClassName)}>{children}</div>
        </div>
      </Container>
    </section>
  );
}
