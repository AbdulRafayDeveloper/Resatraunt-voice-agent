import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  /** Decorative by default; pass a label to expose it to screen readers. */
  label?: string;
}

/** Material Symbols Outlined glyph. */
export function Icon({ name, className, filled = false, label }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined select-none", filled && "icon-fill", className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      {name}
    </span>
  );
}
