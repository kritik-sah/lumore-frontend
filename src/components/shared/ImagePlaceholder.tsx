import { cn } from "@/lib/utils";

export interface ImagePlaceholderProps {
  label: string;
  aspect: string;
  className?: string;
}

export default function ImagePlaceholder({
  label,
  aspect,
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{ aspectRatio: aspect }}
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-ui-shade/30 bg-[linear-gradient(140deg,rgba(250,250,250,0.92),rgba(241,233,218,0.75))] px-6 text-center",
        className,
      )}
    >
      <span className="text-sm font-medium text-ui-shade/70">{label}</span>
    </div>
  );
}
