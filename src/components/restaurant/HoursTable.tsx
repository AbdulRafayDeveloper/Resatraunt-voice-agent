import type { ServiceHours } from "@/types";
import { cn, formatDays, formatTime } from "@/lib/utils";

interface HoursTableProps {
  hours: ServiceHours[];
  tone?: "light" | "dark";
  className?: string;
}

/** Opening hours as a ledger with dotted leaders, one row per service block. */
export function HoursTable({ hours, tone = "light", className }: HoursTableProps) {
  const dark = tone === "dark";
  return (
    <ul className={cn("space-y-2 text-sm", className)} aria-label="Opening hours">
      {hours.map((h, i) => (
        <li key={`${h.service}-${i}`} className={cn("leader", dark && "on-dark")}>
          <span className={cn("font-semibold", dark ? "text-cream" : "text-ink")}>
            {h.service} · {formatDays(h.days)}
          </span>
          <span className={cn("whitespace-nowrap", dark ? "text-cream/85" : "text-smoke")}>
            {formatTime(h.opens)} to {formatTime(h.closes)}
            {h.note && <span className="sr-only">. {h.note}</span>}
          </span>
        </li>
      ))}
      {hours.some((h) => h.note) && (
        <li className={cn("pt-1 text-xs", dark ? "text-cream/65" : "text-smoke")} aria-hidden="true">
          {hours.filter((h) => h.note).map((h) => h.note).join(" · ")}
        </li>
      )}
    </ul>
  );
}
