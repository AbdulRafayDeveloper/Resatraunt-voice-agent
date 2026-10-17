interface LogoMarkProps {
  className?: string;
  /** Explicit pixel size; required inside next/og ImageResponse where classes do not apply. */
  size?: number;
  /** Colour of the speech-bubble table; defaults to claret. */
  bubble?: string;
  /** Colour of the plate ring and the two seats; defaults to brass. */
  accent?: string;
  title?: string;
}

/**
 * Geometry shared with scripts/generate-brand-assets.mjs. A round table seen from above, drawn as
 * a speech bubble: the "talk". Inside sit a plate ring and two seats facing each other.
 */
export const logoPaths = {
  bubble: "M32 8A22 22 0 1 1 21 49.05L10 58L12.95 41A22 22 0 0 1 32 8Z",
  plate: { cx: 32, cy: 30, r: 8.5 },
  seats: [
    { cx: 17.5, cy: 30, r: 2.8 },
    { cx: 46.5, cy: 30, r: 2.8 },
  ],
} as const;

export function LogoMark({ className = "w-10 h-10", size, bubble = "#5B1D2B", accent = "#B8893A", title = "TableTalk" }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 64 64" className={size ? undefined : className} width={size} height={size} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <path d={logoPaths.bubble} fill={bubble} />
      <circle cx={logoPaths.plate.cx} cy={logoPaths.plate.cy} r={logoPaths.plate.r} fill="none" stroke={accent} strokeWidth="3" />
      {logoPaths.seats.map((seat) => (
        <circle key={seat.cx} cx={seat.cx} cy={seat.cy} r={seat.r} fill={accent} />
      ))}
    </svg>
  );
}
