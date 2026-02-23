import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-ui-shade/20 px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-action-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-ui-shade text-ui-light shadow hover:bg-ui-shade/80",
        secondary:
          "border-transparent bg-ui-shade/10 text-ui-shade hover:bg-ui-shade/20",
        destructive:
          "border-transparent bg-danger text-ui-light shadow hover:bg-danger/80",
        outline: "text-ui-shade",
        glass:
          "relative overflow-hidden border-white/30 bg-ui-light/5 text-ui-shade shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_2px_1px_rgba(255,255,255,0.1)] backdrop-blur-[10px] hover:bg-ui-light/10",
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

