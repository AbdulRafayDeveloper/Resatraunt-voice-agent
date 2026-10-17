import { MongoServerError, type Collection, type Db } from "mongodb";

import type { BookingStore } from "./store.js";
import { slotId, type Booking, type NewBooking, type ReserveResult } from "./types.js";

export const BOOKINGS_COLLECTION = "bookings";
export const SLOTS_COLLECTION = "slots";

const DUPLICATE_KEY = 11000;

interface SlotDocument {
  _id: string;
  date: string;
  hour: number;
  booked: number;
}

type BookingDocument = Booking;

function isDuplicateKeyError(error: unknown): boolean {
  return error instanceof MongoServerError && error.code === DUPLICATE_KEY;
}

/**
 * MongoDB-backed store. Capacity lives in a `slots` document per day+hour whose
 * `booked` counter is incremented with a filtered upsert, so two callers can never
 * both take the last table: the filter `booked < totalTables` rejects the eleventh
 * increment, and the resulting upsert collides on `_id` with a duplicate-key error.
 */
export class MongoBookingStore implements BookingStore {
  private readonly slots: Collection<SlotDocument>;
  private readonly bookings: Collection<BookingDocument>;

  constructor(db: Db, private readonly totalTables: number) {
    this.slots = db.collection<SlotDocument>(SLOTS_COLLECTION);
    this.bookings = db.collection<BookingDocument>(BOOKINGS_COLLECTION);
  }

  async ensureIndexes(): Promise<void> {
    await this.bookings.createIndexes([
      { key: { date: 1, hour: 1 }, name: "date_hour" },
      { key: { createdAt: 1 }, name: "createdAt" },
    ]);
    await this.slots.createIndex({ date: 1 }, { name: "date" });
  }

  async countBooked(date: string, hour: number): Promise<number> {
    const slot = await this.slots.findOne({ _id: slotId(date, hour) }, { projection: { booked: 1 } });
    return slot?.booked ?? 0;
  }

  async countsForDay(date: string): Promise<Map<number, number>> {
    const counts = new Map<number, number>();
    const cursor = this.slots.find({ date }, { projection: { hour: 1, booked: 1 } });
    for await (const slot of cursor) counts.set(slot.hour, slot.booked);
    return counts;
  }

  async reserve(booking: NewBooking): Promise<ReserveResult> {
    const taken = await this.takeTable(booking.date, booking.hour);
    if (!taken) return "full";
    await this.bookings.insertOne({ ...booking, createdAt: new Date() });
    return "reserved";
  }

  async listDay(date: string): Promise<Booking[]> {
    return this.bookings.find({ date }).sort({ hour: 1, createdAt: 1 }).toArray();
  }

  /** Clears both collections. Used by the seed script's --reset flag. */
  async clearAll(): Promise<void> {
    await this.bookings.deleteMany({});
    await this.slots.deleteMany({});
  }

  private async takeTable(date: string, hour: number, attempt = 0): Promise<boolean> {
    const id = slotId(date, hour);
    try {
      await this.slots.updateOne(
        { _id: id, booked: { $lt: this.totalTables } },
        { $inc: { booked: 1 }, $setOnInsert: { date, hour } },
        { upsert: true },
      );
      return true;
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error;
      // Either the slot is full, or two first bookings for a new slot raced on the
      // insert. Re-read once to tell the two apart.
      if (attempt === 0 && (await this.countBooked(date, hour)) < this.totalTables) {
        return this.takeTable(date, hour, attempt + 1);
      }
      return false;
    }
  }
}
