/**
 * Seeds MongoDB with dummy bookings so availability can be tested:
 *   tomorrow 19:00     fully booked (TOTAL_TABLES bookings)
 *   tomorrow 20:00     7 bookings
 *   day after 13:00    3 bookings
 *   plus 1-4 bookings in a few more slots across the next 7 days.
 *
 * Usage: npm run seed            (adds to whatever is there)
 *        npm run seed -- --reset (clears bookings and slots first)
 */
import { slotHours } from "../src/bookings/availability.js";
import { addDays, zonedNow } from "../src/bookings/dates.js";
import { MongoBookingStore } from "../src/bookings/mongoStore.js";
import { slotId, type NewBooking } from "../src/bookings/types.js";
import { loadConfig } from "../src/config.js";
import { connectMongo } from "../src/db/mongo.js";
import { loadDotEnv } from "../src/env.js";
import { errorMessage, noopLogger } from "../src/logger.js";

const NAMES = [
  "Olivia Bennett",
  "Harry Patel",
  "Amelia Clarke",
  "Noah Williams",
  "Isla Hughes",
  "Oscar Khan",
  "Freya Murphy",
  "Leo Thompson",
  "Grace Robinson",
  "Arthur Evans",
  "Sophie Walker",
  "Daniel Ahmed",
];

interface SeedSlot {
  date: string;
  hour: number;
  count: number;
}

/** Small deterministic generator so every run seeds the same scatter. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function buildPlan(today: string, hours: number[], totalTables: number): SeedSlot[] {
  const tomorrow = addDays(today, 1);
  const dayAfter = addDays(today, 2);
  const plan: SeedSlot[] = [
    { date: tomorrow, hour: 19, count: totalTables },
    { date: tomorrow, hour: 20, count: 7 },
    { date: dayAfter, hour: 13, count: 3 },
  ];
  const taken = new Set(plan.map((slot) => slotId(slot.date, slot.hour)));
  const random = createRandom(42);

  for (let offset = 1; offset <= 7; offset++) {
    const date = addDays(today, offset);
    const slotsToday = 2 + Math.floor(random() * 2);
    for (let i = 0; i < slotsToday; i++) {
      const hour = hours[Math.floor(random() * hours.length)] ?? hours[0] ?? 12;
      const id = slotId(date, hour);
      if (taken.has(id)) continue;
      taken.add(id);
      plan.push({ date, hour, count: 1 + Math.floor(random() * 4) });
    }
  }
  return plan.sort((a, b) => a.date.localeCompare(b.date) || a.hour - b.hour);
}

function printTable(rows: { date: string; hour: number; booked: number }[], totalTables: number): void {
  const line = "+------------+-------+--------+-------------+";
  console.log(line);
  console.log("| date       | hour  | booked | status      |");
  console.log(line);
  for (const row of rows) {
    const status = row.booked >= totalTables ? "FULL" : `${totalTables - row.booked} left`;
    console.log(
      `| ${row.date} | ${String(row.hour).padStart(2, "0")}:00 | ${String(row.booked).padStart(6)} | ${status.padEnd(11)} |`,
    );
  }
  console.log(line);
}

async function main(): Promise<void> {
  loadDotEnv();
  const config = loadConfig();
  const reset = process.argv.includes("--reset");
  const { rules, timeZone } = config.restaurant;

  const mongo = await connectMongo(config.mongo, noopLogger);
  try {
    const store = new MongoBookingStore(mongo.db, rules.totalTables);
    await store.ensureIndexes();
    if (reset) {
      await store.clearAll();
      console.log("Cleared bookings and slots.");
    }

    const today = zonedNow(new Date(), timeZone).date;
    const plan = buildPlan(today, slotHours(rules), rules.totalTables);
    const random = createRandom(7);
    let inserted = 0;
    let skipped = 0;

    for (const slot of plan) {
      for (let i = 0; i < slot.count; i++) {
        const booking: NewBooking = {
          name: NAMES[Math.floor(random() * NAMES.length)] ?? "Guest",
          partySize: 2 + Math.floor(random() * 5),
          date: slot.date,
          hour: slot.hour,
          source: "seed",
        };
        const result = await store.reserve(booking);
        if (result === "reserved") inserted++;
        else skipped++;
      }
    }
    console.log(`Inserted ${inserted} bookings${skipped ? `, skipped ${skipped} (slot already full)` : ""}.`);

    const rows: { date: string; hour: number; booked: number }[] = [];
    for (const date of [...new Set(plan.map((slot) => slot.date))]) {
      const counts = await store.countsForDay(date);
      for (const [hour, booked] of [...counts.entries()].sort((a, b) => a[0] - b[0])) {
        rows.push({ date, hour, booked });
      }
    }
    printTable(rows, rules.totalTables);
  } finally {
    await mongo.close();
  }
}

main().catch((error: unknown) => {
  console.error(`Seed failed: ${errorMessage(error)}`);
  process.exit(1);
});
