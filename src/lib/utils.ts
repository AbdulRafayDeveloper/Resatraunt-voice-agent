import type { Currency, PriceBand, Weekday } from "@/types";

/** Join class names, skipping falsy values. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const currencyFormatters: Record<Currency, Intl.NumberFormat> = {
  GBP: new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }),
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
};

export function formatMoney(amount: number, currency: Currency): string {
  return currencyFormatters[currency].format(amount);
}

export const currencySymbol: Record<Currency, string> = { GBP: "£", USD: "$" };

/** "££" style band marker in the venue's own currency symbol. */
export function priceBandSymbol(band: PriceBand, currency: Currency): string {
  return currencySymbol[currency].repeat(band);
}

export const priceBandLabels: Record<PriceBand, string> = {
  1: "Under 40 per person",
  2: "40 to 90 per person",
  3: "90 to 200 per person",
  4: "200 and above per person",
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const longDateFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00`));
}

export function formatLongDate(iso: string): string {
  return longDateFormatter.format(new Date(`${iso}T00:00:00`));
}

function toIso(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Today as YYYY-MM-DD in the local zone. */
export function todayIso(): string {
  return toIso(new Date());
}

export function addDaysIso(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toIso(date);
}

export const weekdays: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const weekdayLong: Record<Weekday, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

/** "17:30" -> "5:30 pm" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Collapse a day list into ranges: ["Tue","Wed","Thu","Fri","Sat"] -> "Tue to Sat". */
export function formatDays(days: Weekday[]): string {
  const ordered = weekdays.filter((d) => days.includes(d));
  if (ordered.length === 7) return "Every day";
  const groups: Weekday[][] = [];
  for (const day of ordered) {
    const last = groups[groups.length - 1];
    if (last && weekdays.indexOf(day) === weekdays.indexOf(last[last.length - 1]) + 1) last.push(day);
    else groups.push([day]);
  }
  return groups.map((g) => (g.length >= 3 ? `${g[0]} to ${g[g.length - 1]}` : g.join(", "))).join(", ");
}

/** Human wording for a restaurant's published walk-in policy. */
export const walkInLabels: Record<"yes" | "limited" | "no" | "unknown", string> = {
  yes: "Walk-ins welcome",
  limited: "Some walk-in seats",
  no: "Reservations only",
  unknown: "Not stated by the restaurant",
};

export function pluralise(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
