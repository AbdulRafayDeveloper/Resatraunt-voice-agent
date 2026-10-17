import { describe, expect, it } from "vitest";

import {
  formatHourForSpeech,
  formatSlotForSpeech,
  isValidSlot,
  slotHours,
  slotIsInPast,
  suggestAlternatives,
} from "../src/bookings/availability.js";
import { addDays, daysBetween, formatDateForSpeech, isCalendarDate, zonedNow } from "../src/bookings/dates.js";
import type { SlotRules } from "../src/config.js";

const rules: SlotRules = { openHour: 11, closeHour: 23, totalTables: 10, maxDaysAhead: 90 };
const TZ = "Europe/London";
// 2026-10-17 is a Saturday; London is on BST (UTC+1) until 25 October, so this is 15:30 local.
const now = new Date("2026-10-17T14:30:00Z");

describe("dates", () => {
  it("validates calendar dates", () => {
    expect(isCalendarDate("2026-10-17")).toBe(true);
    expect(isCalendarDate("2026-02-30")).toBe(false);
    expect(isCalendarDate("17/10/2026")).toBe(false);
  });

  it("adds days and measures gaps", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(daysBetween("2026-10-17", "2026-10-20")).toBe(3);
    expect(daysBetween("2026-10-20", "2026-10-17")).toBe(-3);
  });

  it("reports the wall clock in the restaurant's time zone", () => {
    const clock = zonedNow(now, TZ);
    expect(clock).toEqual({ date: "2026-10-17", weekday: "Saturday", hour: 15, minute: 30 });
    expect(zonedNow(new Date("2026-10-17T23:30:00Z"), "Asia/Karachi").date).toBe("2026-10-18");
  });

  it("formats dates for speech", () => {
    expect(formatDateForSpeech("2026-10-24")).toBe("Saturday 24 October");
  });
});

describe("slot rules", () => {
  it("lists one-hour slots from opening until the hour before closing", () => {
    const hours = slotHours(rules);
    expect(hours[0]).toBe(11);
    expect(hours.at(-1)).toBe(22);
    expect(hours).toHaveLength(12);
  });

  it("accepts a valid future slot", () => {
    expect(isValidSlot("2026-10-18", 19, now, TZ, rules)).toEqual({ ok: true });
    expect(isValidSlot("2026-10-17", 16, now, TZ, rules)).toEqual({ ok: true });
  });

  it("rejects slots outside opening hours", () => {
    expect(isValidSlot("2026-10-18", 23, now, TZ, rules)).toMatchObject({ ok: false, reason: "outside_hours" });
    expect(isValidSlot("2026-10-18", 10, now, TZ, rules)).toMatchObject({ ok: false, reason: "outside_hours" });
  });

  it("rejects slots in the past, including the current hour", () => {
    expect(slotIsInPast("2026-10-16", 19, now, TZ)).toBe(true);
    expect(slotIsInPast("2026-10-17", 15, now, TZ)).toBe(true);
    expect(slotIsInPast("2026-10-17", 16, now, TZ)).toBe(false);
    expect(isValidSlot("2026-10-17", 12, now, TZ, rules)).toMatchObject({ ok: false, reason: "in_past" });
  });

  it("rejects nonsense dates, hours and far-future bookings", () => {
    expect(isValidSlot("2026-13-01", 19, now, TZ, rules)).toMatchObject({ ok: false, reason: "invalid_date" });
    expect(isValidSlot("2026-10-18", 19.5, now, TZ, rules)).toMatchObject({ ok: false, reason: "invalid_hour" });
    expect(isValidSlot("2027-06-01", 19, now, TZ, rules)).toMatchObject({ ok: false, reason: "too_far_ahead" });
  });

  it("suggests the nearest free hours, earlier first on a tie", () => {
    const counts = new Map<number, number>([
      [19, 10],
      [18, 10],
      [20, 3],
    ]);
    expect(suggestAlternatives("2026-10-18", 19, counts, now, TZ, rules)).toEqual([20, 17, 21]);
  });

  it("never suggests hours that have already passed today", () => {
    const counts = new Map<number, number>([[16, 10]]);
    expect(suggestAlternatives("2026-10-17", 16, counts, now, TZ, rules)).toEqual([17, 18, 19]);
  });

  it("formats hours and slots for speech", () => {
    expect(formatHourForSpeech(11)).toBe("11 am");
    expect(formatHourForSpeech(12)).toBe("12 noon");
    expect(formatHourForSpeech(19)).toBe("7 pm");
    expect(formatSlotForSpeech("2026-10-24", 19)).toBe("Saturday 24 October at 7 pm");
  });
});
