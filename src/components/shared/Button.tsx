import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface BaseButtonProps {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
}

interface LinkButtonProps extends BaseButtonProps {
  href: string;
  target?: string;
  rel?: string;
}

interface NativeButtonProps
  extends BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  href?: undefined;
}

export type ButtonProps = LinkButtonProps | NativeButtonProps;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ui-highlight text-ui-light border-ui-highlight hover:bg-ui-highlight/90",
  secondary:
    "bg-ui-light text-ui-shade border-ui-shade/20 hover:bg-ui-background/70",
  ghost:
    "bg-transparent text-ui-shade border-transparent hover:bg-ui-shade/5",
};

const baseStyles =
  "inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-highlight/60";

export default function Button(props: ButtonProps) {
  const {
    className,
    variant = "primary",
    children,
    ...rest
  } = props as ButtonProps;

  const classes = cn(baseStyles, variantStyles[variant], className);

  if ("href" in props && props.href) {
    return (
      <a href={props.href} className={classes} target={props.target} rel={props.rel}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as NativeButtonProps)}>
      {children}
    </button>
  );
}
