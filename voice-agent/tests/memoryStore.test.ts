import { describe, expect, it } from "vitest";

import { MemoryBookingStore } from "../src/bookings/memoryStore.js";
import type { NewBooking } from "../src/bookings/types.js";

const booking = (overrides: Partial<NewBooking> = {}): NewBooking => ({
  name: "Sam",
  partySize: 4,
  date: "2026-10-18",
  hour: 19,
  source: "voice",
  ...overrides,
});

describe("MemoryBookingStore", () => {
  it("reserves until the slot is full, then reports full", async () => {
    const store = new MemoryBookingStore(3);
    expect(await store.reserve(booking())).toBe("reserved");
    expect(await store.reserve(booking())).toBe("reserved");
    expect(await store.reserve(booking())).toBe("reserved");
    expect(await store.reserve(booking())).toBe("full");
    expect(await store.countBooked("2026-10-18", 19)).toBe(3);
    expect(await store.listDay("2026-10-18")).toHaveLength(3);
  });

  it("keeps slots independent and reports per-day counts", async () => {
    const store = new MemoryBookingStore(2);
    await store.reserve(booking());
    await store.reserve(booking());
    expect(await store.reserve(booking({ hour: 20 }))).toBe("reserved");
    expect(await store.reserve(booking({ date: "2026-10-19" }))).toBe("reserved");
    expect(await store.countsForDay("2026-10-18")).toEqual(
      new Map([
        [19, 2],
        [20, 1],
      ]),
    );
    expect(await store.countBooked("2026-10-19", 19)).toBe(1);
  });
});
