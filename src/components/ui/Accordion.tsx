"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { FaqItem } from "@/types";
import { cn } from "@/lib/utils";

interface AccordionProps {
  items: FaqItem[];
  /** Index opened on first render; -1 for none. */
  defaultOpen?: number;
  tone?: "light" | "dark";
  className?: string;
}

/** Stacked, hairline-divided accordion. Answers are always in the DOM for SEO; only visibility toggles. */
export function Accordion({ items, defaultOpen = 0, tone = "light", className }: AccordionProps) {
  const [open, setOpen] = useState<number>(defaultOpen);
  const baseId = useId();
  const dark = tone === "dark";

  return (
    <div className={cn("divide-y", dark ? "divide-cream/15" : "divide-line", className)}>
      {items.map((item, index) => {
        const expanded = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={item.q} className="py-1">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? -1 : index)}
                className={cn(
                  "flex w-full items-start justify-between gap-4 py-4 text-start transition-colors cursor-pointer",
                  dark ? "text-cream hover:text-brass-pale" : "text-claret-deep hover:text-claret",
                )}
              >
                <span className="text-base font-bold md:text-lg">{item.q}</span>
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform",
                    dark ? "border-brass/60 text-brass" : "border-claret/30 text-claret",
                    expanded && "rotate-45",
                  )}
                >
                  <Icon name="add" className="text-[18px]" />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!expanded} className={cn("pb-5 pe-10 leading-relaxed", dark ? "text-cream/80" : "text-smoke")}>
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
