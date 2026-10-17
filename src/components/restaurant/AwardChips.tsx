import { Icon } from "@/components/ui/Icon";
import type { Award } from "@/types";
import { cn } from "@/lib/utils";

interface AwardChipsProps {
  awards: Award[];
  /** Compact: title and year only; full: adds a source link. */
  mode?: "compact" | "full";
  tone?: "light" | "dark";
  className?: string;
}

function iconFor(award: Award): string {
  if (award.body === "Michelin Guide") return award.title.includes("Green") ? "eco" : "star";
  if (award.body === "James Beard Foundation") return "workspace_premium";
  return "verified";
}

/** Awards as chips: each shows the body, the year and (in full mode) a link to its source. Nothing is shown without a year and a source. */
export function AwardChips({ awards, mode = "compact", tone = "light", className }: AwardChipsProps) {
  const listed = awards.filter((a) => a.year && a.sourceUrl);
  if (listed.length === 0) return null;
  const dark = tone === "dark";
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Awards and recognition">
      {listed.map((award) => (
        <li
          key={`${award.body}-${award.title}-${award.year}`}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold",
            dark ? "border-brass/50 bg-cream/5 text-brass-pale" : "border-brass/50 bg-brass-pale text-brass-deep",
          )}
        >
          <Icon name={iconFor(award)} filled className="text-[15px]" />
          <span>
            {award.title} · {award.year}
          </span>
          {mode === "full" && (
            <a href={award.sourceUrl} target="_blank" rel="noopener noreferrer" className="ms-1 underline underline-offset-2 hover:no-underline" aria-label={`Source for ${award.title} ${award.year}: ${award.sourceLabel}`}>
              Source
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
