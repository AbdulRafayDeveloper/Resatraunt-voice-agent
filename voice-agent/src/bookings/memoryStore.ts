import type { BookingStore } from "./store.js";
import { slotId, type Booking, type NewBooking, type ReserveResult } from "./types.js";

/** In-memory BookingStore with the same semantics as the Mongo one; used by tests. */
export class MemoryBookingStore implements BookingStore {
  private readonly slots = new Map<string, number>();
  private readonly bookings: Booking[] = [];

  constructor(private readonly totalTables: number) {}

  countBooked(date: string, hour: number): Promise<number> {
    return Promise.resolve(this.slots.get(slotId(date, hour)) ?? 0);
  }

  countsForDay(date: string): Promise<Map<number, number>> {
    const counts = new Map<number, number>();
    for (const booking of this.bookings) {
      if (booking.date === date) counts.set(booking.hour, (counts.get(booking.hour) ?? 0) + 1);
    }
    return Promise.resolve(counts);
  }

  reserve(booking: NewBooking): Promise<ReserveResult> {
    const id = slotId(booking.date, booking.hour);
    const booked = this.slots.get(id) ?? 0;
    if (booked >= this.totalTables) return Promise.resolve("full");
    this.slots.set(id, booked + 1);
    this.bookings.push({ ...booking, createdAt: new Date() });
    return Promise.resolve("reserved");
  }

  listDay(date: string): Promise<Booking[]> {
    return Promise.resolve(this.bookings.filter((booking) => booking.date === date));
  }
}
