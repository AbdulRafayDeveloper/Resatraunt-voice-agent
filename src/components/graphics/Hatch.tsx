import { cn } from "@/lib/utils";

interface HatchProps {
  className?: string;
  color?: string;
  opacity?: number;
  /** Tile size in px */
  size?: number;
}

/**
 * Fine diagonal linen hatch as a tiled SVG background, used on dark bands.
 * Absolutely positioned; parent must be `relative`.
 */
export function Hatch({ className, color = "#B8893A", opacity = 0.1, size = 14 }: HatchProps) {
  const id = `hatch-${size}-${color.replace("#", "")}`;
  return (
    <svg className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} aria-hidden="true" style={{ opacity }}>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2={size} stroke={color} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
