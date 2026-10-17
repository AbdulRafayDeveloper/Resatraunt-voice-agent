import type { SlotRules } from "../config.js";
import { daysBetween, formatDateForSpeech, isCalendarDate, zonedNow } from "./dates.js";

/**
 * Pure booking rules: which slots exist, which are bookable right now, and how
 * to phrase them for a caller. Nothing here touches the database.
 */

export type SlotProblem = "invalid_date" | "invalid_hour" | "outside_hours" | "in_past" | "too_far_ahead";

export type SlotValidation = { ok: true } | { ok: false; reason: SlotProblem; message: string };

/** Hours at which a one-hour slot may start, e.g. 11..22 for 11:00-23:00. */
export function slotHours(rules: SlotRules): number[] {
  const hours: number[] = [];
  for (let hour = rules.openHour; hour < rules.closeHour; hour++) hours.push(hour);
  return hours;
}

export function isWithinOpeningHours(hour: number, rules: SlotRules): boolean {
  return Number.isInteger(hour) && hour >= rules.openHour && hour < rules.closeHour;
}

/** A slot is in the past once its start hour has begun in the restaurant's time zone. */
export function slotIsInPast(date: string, hour: number, now: Date, timeZone: string): boolean {
  const clock = zonedNow(now, timeZone);
  if (date < clock.date) return true;
  if (date > clock.date) return false;
  return hour <= clock.hour;
}

export function isValidSlot(
  date: string,
  hour: number,
  now: Date,
  timeZone: string,
  rules: SlotRules,
): SlotValidation {
  if (!isCalendarDate(date)) {
    return { ok: false, reason: "invalid_date", message: "The date must be a real calendar day in YYYY-MM-DD form." };
  }
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    return { ok: false, reason: "invalid_hour", message: "The hour must be a whole number from 0 to 23." };
  }
  if (!isWithinOpeningHours(hour, rules)) {
    return {
      ok: false,
      reason: "outside_hours",
      message: `The restaurant takes bookings on the hour from ${formatHourForSpeech(rules.openHour)} to ${formatHourForSpeech(rules.closeHour - 1)}; the last table is at ${formatHourForSpeech(rules.closeHour - 1)} because we close at ${formatHourForSpeech(rules.closeHour)}.`,
    };
  }
  if (slotIsInPast(date, hour, now, timeZone)) {
    return { ok: false, reason: "in_past", message: "That time has already passed." };
  }
  const today = zonedNow(now, timeZone).date;
  if (daysBetween(today, date) > rules.maxDaysAhead) {
    return {
      ok: false,
      reason: "too_far_ahead",
      message: `Bookings can only be made up to ${rules.maxDaysAhead} days ahead.`,
    };
  }
  return { ok: true };
}

/**
 * Nearest hours on the same day that still have a free table and are bookable now,
 * closest first (earlier hour wins a tie), up to `max` results.
 */
export function suggestAlternatives(
  date: string,
  hour: number,
  counts: ReadonlyMap<number, number>,
  now: Date,
  timeZone: string,
  rules: SlotRules,
  max = 3,
): number[] {
  return slotHours(rules)
    .filter((candidate) => candidate !== hour)
    .filter((candidate) => (counts.get(candidate) ?? 0) < rules.totalTables)
    .filter((candidate) => !slotIsInPast(date, candidate, now, timeZone))
    .sort((a, b) => Math.abs(a - hour) - Math.abs(b - hour) || a - b)
    .slice(0, max);
}

/** 19 -> "7 pm", 11 -> "11 am", 12 -> "12 noon", 0 -> "12 midnight". */
export function formatHourForSpeech(hour: number): string {
  if (hour === 0 || hour === 24) return "12 midnight";
  if (hour === 12) return "12 noon";
  if (hour < 12) return `${hour} am`;
  return `${hour - 12} pm`;
}

export function formatSlotForSpeech(date: string, hour: number): string {
  return `${formatDateForSpeech(date)} at ${formatHourForSpeech(hour)}`;
}
