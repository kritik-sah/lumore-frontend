import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CTAProps {
  href?: string;
  label?: string;
  note?: string;
  className?: string;
}

export default function CTA({
  href = "https://play.google.com/store/apps/details?id=xyz.lumore.www.twa",
  label = "Try Lumore",
  note,
  className,
}: CTAProps) {
  return (
    <div
      className={cn("flex flex-col items-start gap-3 sm:flex-row", className)}
    >
      <Button
        asChild
        size="lg"
        className="h-11 rounded-xl px-6 text-sm font-semibold"
      >
        <Link href={href}>{label}</Link>
      </Button>
      {note ? (
        <p className="text-xs text-ui-shade/75 sm:self-center md:text-sm">
          {note}
        </p>
      ) : null}
    </div>
  );
}
