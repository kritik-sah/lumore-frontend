import type { Piece } from "@/lib/careers-data";
import Card from "../shared/Card";
import InlineIcon from "../shared/InlineIcon";

interface PieceCardProps {
  piece: Piece;
}

export default function PieceCard({ piece }: PieceCardProps) {
  return (
    <Card className="h-full bg-ui-light/95">
      <div className="inline-flex items-center gap-2 rounded-lg border border-ui-shade/12 bg-ui-background/70 px-2.5 py-1.5">
        <InlineIcon name="chess" className="text-ui-highlight" />
        <span className="text-xs font-semibold text-ui-shade/75">Piece</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-ui-shade">{piece.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ui-shade/78">{piece.meaning}</p>
    </Card>
  );
}
