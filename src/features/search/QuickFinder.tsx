"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Select } from "@/components/ui/Field";
import { siteConfig, telUrl } from "@/config/site";
import type { Occasion } from "@/types";

interface QuickFinderProps {
  cities: Array<{ slug: string; name: string }>;
  occasions: Array<{ value: Occasion; label: string }>;
}

/** Two-field finder in the hero. Hands off to /restaurants with the choices as URL filters. */
export function QuickFinder({ cities, occasions }: QuickFinderProps) {
  const router = useRouter();
  const [city, setCity] = useState<string>("");
  const [occasion, setOccasion] = useState<string>("");
  // The finder renders twice on the home page (desktop hero + phone card), so ids must be unique.
  const titleId = useId();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (occasion) params.set("occasion", occasion);
    const query = params.toString();
    router.push(query ? `/restaurants?${query}` : "/restaurants");
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-cream/95 p-4 shadow-soft backdrop-blur sm:p-5" aria-labelledby={titleId} data-testid="quick-finder">
      <div className="mb-3 flex items-center justify-between">
        <p id={titleId} className="flex items-center gap-2 text-sm font-bold text-claret-deep">
          <Icon name="search" className="text-[20px] text-brass-deep" /> Find a table
        </p>
        <span className="hidden text-xs text-smoke sm:inline">No account needed</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-bold text-smoke">
          City
          <Select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City" className="!py-2.5 text-sm">
            <option value="">Any city</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold text-smoke">
          Occasion
          <Select value={occasion} onChange={(e) => setOccasion(e.target.value)} aria-label="Occasion" className="!py-2.5 text-sm">
            <option value="">Any occasion</option>
            {occasions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </label>
      </div>
      <Button type="submit" variant="brass" fullWidth className="mt-3" icon="arrow_forward">
        Show restaurants
      </Button>
      <a href={telUrl()} className="mt-3 flex items-center justify-center gap-2 text-sm font-bold text-claret underline-offset-2 hover:underline">
        <Icon name="call" className="text-[18px] text-brass-deep" /> Or call to book: {siteConfig.phone}
      </a>
    </form>
  );
}
