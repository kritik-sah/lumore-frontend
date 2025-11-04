import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-neutral-200 px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-ui-shade text-neutral-50 shadow hover:bg-neutral-900/80",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80",
        destructive:
          "border-transparent bg-red-500 text-neutral-50 shadow hover:bg-red-500/80",
        outline: "text-neutral-950",
        glass:
          "relative overflow-hidden border-white/30 bg-white/5 text-ui-shade shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_2px_1px_rgba(255,255,255,0.1)] backdrop-blur-[10px] hover:bg-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant === "glass" && (
        <>
          {/* Top highlight */}
          <span className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          {/* Left highlight */}
          <span className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-white/80 via-transparent to-white/30" />
        </>
      )}
      {props.children}
    </div>
  );
}

export { Badge, badgeVariants };
