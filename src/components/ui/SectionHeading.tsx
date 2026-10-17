import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Section number like "01" rendered in the eyebrow. */
  number?: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "light" | "dark";
  align?: "start" | "center";
  size?: "md" | "lg" | "xl";
  className?: string;
  as?: "h1" | "h2" | "h3";
}

const sizes = {
  md: "text-3xl md:text-4xl",
  lg: "text-4xl md:text-5xl",
  xl: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
};

/**
 * Standard section opener: numbered eyebrow with a brass hairline, Fraunces display title
 * (use <em> for the italic accent word) and a lede.
 */
export function SectionHeading({ number, eyebrow, title, lede, tone = "light", align = "start", size = "lg", className, as: Tag = "h2" }: SectionHeadingProps) {
  const dark = tone === "dark";
  const center = align === "center";
  return (
    <div className={cn(center ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-start", className)}>
      {(number || eyebrow) && (
        <div className={cn("mb-4 flex items-center gap-3", center && "justify-center")}>
          {number && <span className={cn("font-display text-lg italic", dark ? "text-brass" : "text-brass-deep")}>{number}</span>}
          <span className={cn("h-px w-10", dark ? "bg-brass/70" : "bg-brass")} aria-hidden="true" />
          {eyebrow && <span className={cn("eyebrow", dark ? "text-brass-pale/90" : "text-claret")}>{eyebrow}</span>}
        </div>
      )}
      <Tag className={cn("display-title", sizes[size], dark ? "text-cream" : "text-claret-deep")}>{title}</Tag>
      {lede && <p className={cn("lede mt-5", dark ? "text-cream/85" : "text-smoke")}>{lede}</p>}
    </div>
  );
}
