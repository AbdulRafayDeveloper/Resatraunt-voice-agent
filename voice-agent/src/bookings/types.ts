export type BookingSource = "voice" | "seed";

export interface Booking {
  name: string;
  partySize: number;
  /** Calendar day in the restaurant's time zone, formatted YYYY-MM-DD. */
  date: string;
  /** Start hour of the one-hour slot (24h clock), e.g. 19 for 7 pm. */
  hour: number;
  createdAt: Date;
  source: BookingSource;
  callControlId?: string;
}

export type NewBooking = Omit<Booking, "createdAt">;

export type ReserveResult = "reserved" | "full";

/** Builds the slot key shared by the store and the seed script. */
export function slotId(date: string, hour: number): string {
  return `${date}-${String(hour).padStart(2, "0")}`;
}
