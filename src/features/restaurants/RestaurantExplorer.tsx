"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState, useTransition, type ReactNode } from "react";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { cuisines, occasionLabels } from "@/data/restaurants";
import type { City, Occasion, PriceBand, Restaurant, Weekday } from "@/types";
import { cn, priceBandLabels, weekdayLong, weekdays } from "@/lib/utils";

const sortOptions = [
  { value: "name", label: "Name A to Z" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest openings first" },
] as const;
type SortKey = (typeof sortOptions)[number]["value"];
type View = "cards" | "list";

const priceBands: PriceBand[] = [1, 2, 3, 4];
const occasions = Object.keys(occasionLabels) as Occasion[];

interface Filters {
  q: string;
  city: string;
  cuisine: string;
  price: PriceBand | 0;
  occasion: Occasion | "";
  day: Weekday | "";
  lunch: boolean;
  sort: SortKey;
  view: View;
}

const defaults: Filters = { q: "", city: "", cuisine: "", price: 0, occasion: "", day: "", lunch: false, sort: "name", view: "cards" };

function isOneOf<T extends string | number>(value: string | number | null, list: readonly T[]): value is T {
  return value !== null && (list as readonly (string | number)[]).includes(value);
}

/** Read filters from the URL, ignoring anything that is not a known value. */
function parseFilters(params: URLSearchParams, citySlugs: string[]): Filters {
  const price = Number(params.get("price"));
  const sort = params.get("sort");
  const view = params.get("view");
  const city = params.get("city") ?? "";
  const cuisine = params.get("cuisine") ?? "";
  const occasion = params.get("occasion");
  const day = params.get("day");
  return {
    q: params.get("q") ?? "",
    city: citySlugs.includes(city) ? city : "",
    cuisine: cuisines.includes(cuisine) ? cuisine : "",
    price: isOneOf(price, priceBands) ? price : 0,
    occasion: isOneOf(occasion, occasions) ? occasion : "",
    day: isOneOf(day, weekdays) ? day : "",
    lunch: params.get("lunch") === "1",
    sort: isOneOf(sort, sortOptions.map((o) => o.value)) ? sort : "name",
    view: view === "list" ? "list" : "cards",
  };
}

/** Serialise filters to a query string, omitting defaults so the clean URL stays clean. */
function serialiseFilters(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.city) params.set("city", filters.city);
  if (filters.cuisine) params.set("cuisine", filters.cuisine);
  if (filters.price) params.set("price", String(filters.price));
  if (filters.occasion) params.set("occasion", filters.occasion);
  if (filters.day) params.set("day", filters.day);
  if (filters.lunch) params.set("lunch", "1");
  if (filters.sort !== "name") params.set("sort", filters.sort);
  if (filters.view !== "cards") params.set("view", filters.view);
  return params.toString();
}

function hasActiveFilter(filters: Filters): boolean {
  return Boolean(filters.q.trim() || filters.city || filters.cuisine || filters.price || filters.occasion || filters.day || filters.lunch);
}

function applyFilters(restaurants: Restaurant[], cities: City[], filters: Filters): Restaurant[] {
  const cityName = new Map(cities.map((c) => [c.slug, c.name.toLowerCase()]));
  const needle = filters.q.trim().toLowerCase();
  const matched = restaurants.filter((r) => {
    if (needle) {
      const haystack = [r.name, r.cuisine, r.neighbourhood, cityName.get(r.citySlug) ?? "", r.tagline].join(" ").toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    if (filters.city && r.citySlug !== filters.city) return false;
    if (filters.cuisine && r.cuisine !== filters.cuisine) return false;
    if (filters.price && r.priceBand !== filters.price) return false;
    if (filters.occasion && !r.occasions.includes(filters.occasion)) return false;
    if (filters.day && !r.hours.some((h) => h.days.includes(filters.day as Weekday))) return false;
    if (filters.lunch && !r.hours.some((h) => h.service === "Lunch")) return false;
    return true;
  });

  const byName = (a: Restaurant, b: Restaurant) => a.name.localeCompare(b.name, "en");
  const byPrice = (direction: 1 | -1) => (a: Restaurant, b: Restaurant) => {
    if (a.priceFrom === undefined && b.priceFrom === undefined) return byName(a, b);
    if (a.priceFrom === undefined) return 1;
    if (b.priceFrom === undefined) return -1;
    return (a.priceFrom - b.priceFrom) * direction || byName(a, b);
  };
  const byNewest = (a: Restaurant, b: Restaurant) => {
    if (Boolean(a.newOpening) !== Boolean(b.newOpening)) return a.newOpening ? -1 : 1;
    return (b.openedYear ?? 0) - (a.openedYear ?? 0) || byName(a, b);
  };
  const comparators: Record<SortKey, (a: Restaurant, b: Restaurant) => number> = {
    name: byName,
    "price-asc": byPrice(1),
    "price-desc": byPrice(-1),
    newest: byNewest,
  };
  return [...matched].sort(comparators[filters.sort]);
}

interface ChipProps {
  pressed: boolean;
  onClick: () => void;
  title?: string;
  children: ReactNode;
}

function Chip({ pressed, onClick, title, children }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center rounded-lg border px-3.5 text-sm font-semibold transition-colors cursor-pointer",
        pressed ? "border-claret bg-claret text-cream" : "border-line bg-white text-ink hover:border-claret hover:text-claret",
      )}
    >
      {children}
    </button>
  );
}

interface RestaurantExplorerProps {
  restaurants: Restaurant[];
  cities: City[];
}

/**
 * Filterable, sortable catalogue. State lives in component state and is mirrored to the URL so a
 * filtered view can be shared; the initial state is read from the URL on first render.
 */
export function RestaurantExplorer({ restaurants, cities }: RestaurantExplorerProps) {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const citySlugs = useMemo(() => cities.map((c) => c.slug), [cities]);
  const [filters, setFilters] = useState<Filters>(() => parseFilters(new URLSearchParams(searchParams.toString()), citySlugs));
  const [, startTransition] = useTransition();

  const query = serialiseFilters(filters);
  useEffect(() => {
    if (query === searchParams.toString()) return;
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }, [query, pathname, router, searchParams]);

  const results = useMemo(() => applyFilters(restaurants, cities, filters), [restaurants, cities, filters]);
  const active = hasActiveFilter(filters);
  const update = (patch: Partial<Filters>) => setFilters((current) => ({ ...current, ...patch }));
  const clear = () => setFilters((current) => ({ ...defaults, sort: current.sort, view: current.view }));

  return (
    <div>
      <div className="rounded-2xl border border-line bg-white p-4 shadow-card md:p-5 lg:sticky lg:top-28 lg:z-20" role="search" aria-label="Filter restaurants">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <label htmlFor={`${id}-q`} className="sr-only">Search restaurants</label>
            <div className="relative">
              <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-smoke" />
              <Input id={`${id}-q`} type="search" placeholder="Name, cuisine, neighbourhood or city" autoComplete="off" value={filters.q} onChange={(e) => update({ q: e.target.value })} className="ps-11" />
            </div>
          </div>
          <Select aria-label="City" value={filters.city} onChange={(e) => update({ city: e.target.value })}>
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </Select>
          <Select aria-label="Cuisine" value={filters.cuisine} onChange={(e) => update({ cuisine: e.target.value })}>
            <option value="">All cuisines</option>
            {cuisines.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[auto_1fr] lg:items-start">
          <div role="group" aria-label="Price band" className="flex flex-wrap gap-2">
            <Chip pressed={filters.price === 0} onClick={() => update({ price: 0 })}>Any</Chip>
            {priceBands.map((band) => (
              <Chip key={band} pressed={filters.price === band} onClick={() => update({ price: band })} title={priceBandLabels[band]}>
                Band {band}
              </Chip>
            ))}
          </div>
          <div role="group" aria-label="Occasion" className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-wrap">
            {occasions.map((occasion) => (
              <Chip key={occasion} pressed={filters.occasion === occasion} onClick={() => update({ occasion: filters.occasion === occasion ? "" : occasion })}>
                <span className="whitespace-nowrap">{occasionLabels[occasion]}</span>
              </Chip>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto] lg:items-center">
          <Select aria-label="Open on" value={filters.day} onChange={(e) => update({ day: e.target.value as Weekday | "" })}>
            <option value="">Any day</option>
            {weekdays.map((day) => (
              <option key={day} value={day}>{weekdayLong[day]}</option>
            ))}
          </Select>
          <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-ink">
            <input type="checkbox" className="h-4 w-4 accent-claret" checked={filters.lunch} onChange={(e) => update({ lunch: e.target.checked })} />
            Serves lunch
          </label>
          <Select aria-label="Sort" value={filters.sort} onChange={(e) => update({ sort: e.target.value as SortKey })}>
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
          <div role="group" aria-label="View" className="flex gap-2 sm:justify-self-end">
            <Chip pressed={filters.view === "cards"} onClick={() => update({ view: "cards" })}>Cards</Chip>
            <Chip pressed={filters.view === "list"} onClick={() => update({ view: "list" })}>List</Chip>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <p className="font-display text-xl text-claret-deep" aria-live="polite">
          {results.length} of {restaurants.length} restaurants
        </p>
        {active && (
          <Button variant="ghost" size="sm" icon="close" onClick={clear}>
            Clear filters
          </Button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="py-16 text-center">
          <Icon name="restaurant" className="text-[40px] text-brass" />
          <p className="mt-3 font-display text-2xl text-claret-deep">No restaurant matches these filters.</p>
          <p className="mt-2 text-smoke">Try a wider price band or a different city.</p>
          <Button variant="outline" className="mt-6" icon="refresh" onClick={clear}>
            Clear filters
          </Button>
        </div>
      ) : filters.view === "list" ? (
        <div className="mt-2">
          {results.map((r) => (
            <RestaurantCard key={r.slug} restaurant={r} layout="row" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r, index) => (
            <RestaurantCard key={r.slug} restaurant={r} layout="carte" index={String(index + 1).padStart(2, "0")} priority={index < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
