import type { Booking, NewBooking, ReserveResult } from "./types.js";

export interface BookingStore {
  /** Tables already booked for one slot. */
  countBooked(date: string, hour: number): Promise<number>;
  /** Booked counts for every slot on a day that has at least one booking, keyed by hour. */
  countsForDay(date: string): Promise<Map<number, number>>;
  /** Atomically takes one table in the slot, or reports that the slot is full. */
  reserve(booking: NewBooking): Promise<ReserveResult>;
  listDay(date: string): Promise<Booking[]>;
}
