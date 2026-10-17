import { tool, type StructuredToolInterface } from "@langchain/core/tools";
import { z } from "zod";

import {
  formatHourForSpeech,
  formatSlotForSpeech,
  isValidSlot,
  suggestAlternatives,
} from "../bookings/availability.js";
import { zonedNow } from "../bookings/dates.js";
import type { BookingStore } from "../bookings/store.js";
import type { NewBooking } from "../bookings/types.js";
import type { SlotRules } from "../config.js";

export interface BookingToolDeps {
  store: BookingStore;
  rules: SlotRules;
  timeZone: string;
  now: () => Date;
  callControlId?: string;
  /** Called with every booking the store confirmed, so the caller of the agent can see it. */
  onReserved: (booking: NewBooking) => void;
}

export const CHECK_AVAILABILITY_TOOL = "check_availability";
export const CREATE_BOOKING_TOOL = "create_booking";
export const CURRENT_DATETIME_TOOL = "get_current_datetime";

const dateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .describe("Calendar day as YYYY-MM-DD, resolved from what the caller said using today's date.");

const hourField = z
  .number()
  .int()
  .min(0)
  .max(23)
  .describe("Start hour of the one-hour slot on the 24-hour clock, e.g. 19 for 7 pm.");

interface Alternative {
  hour: number;
  spoken: string;
}

async function alternativesFor(deps: BookingToolDeps, date: string, hour: number): Promise<Alternative[]> {
  const counts = await deps.store.countsForDay(date);
  return suggestAlternatives(date, hour, counts, deps.now(), deps.timeZone, deps.rules).map((h) => ({
    hour: h,
    spoken: formatHourForSpeech(h),
  }));
}

function serialise(result: Record<string, unknown>): string {
  return JSON.stringify(result);
}

export function createBookingTools(deps: BookingToolDeps): StructuredToolInterface[] {
  const checkAvailability = tool(
    async ({ date, hour }) => {
      const validation = isValidSlot(date, hour, deps.now(), deps.timeZone, deps.rules);
      if (!validation.ok) {
        const alternatives = validation.reason === "invalid_date" ? [] : await alternativesFor(deps, date, hour);
        return serialise({ status: "invalid", reason: validation.reason, message: validation.message, alternatives });
      }
      const booked = await deps.store.countBooked(date, hour);
      const tablesLeft = Math.max(0, deps.rules.totalTables - booked);
      return serialise({
        status: tablesLeft > 0 ? "available" : "full",
        date,
        hour,
        spoken: formatSlotForSpeech(date, hour),
        booked,
        tablesLeft,
        alternatives: tablesLeft > 0 ? [] : await alternativesFor(deps, date, hour),
      });
    },
    {
      name: CHECK_AVAILABILITY_TOOL,
      description:
        "Checks whether a one-hour slot still has a free table. Returns the number of tables left, or nearby free times when the slot is full or invalid.",
      schema: z.object({ date: dateField, hour: hourField }),
    },
  );

  const createBooking = tool(
    async ({ name, partySize, date, hour }) => {
      const validation = isValidSlot(date, hour, deps.now(), deps.timeZone, deps.rules);
      if (!validation.ok) {
        return serialise({ status: "invalid", reason: validation.reason, message: validation.message });
      }
      const booking: NewBooking = {
        name: name.trim(),
        partySize,
        date,
        hour,
        source: "voice",
        ...(deps.callControlId ? { callControlId: deps.callControlId } : {}),
      };
      const result = await deps.store.reserve(booking);
      if (result === "full") {
        return serialise({ status: "full", alternatives: await alternativesFor(deps, date, hour) });
      }
      deps.onReserved(booking);
      return serialise({
        status: "reserved",
        booking: { name: booking.name, partySize, date, hour, spoken: formatSlotForSpeech(date, hour) },
      });
    },
    {
      name: CREATE_BOOKING_TOOL,
      description:
        "Reserves one table for the caller. Call it only after the caller has confirmed the name, number of people, day and time. The table is booked only if the result status is \"reserved\".",
      schema: z.object({
        name: z.string().trim().min(1).max(80).describe("The name the booking is under."),
        partySize: z.number().int().min(1).max(50).describe("How many people will be dining."),
        date: dateField,
        hour: hourField,
      }),
    },
  );

  const currentDateTime = tool(
    () => {
      const clock = zonedNow(deps.now(), deps.timeZone);
      return serialise({ ...clock, timeZone: deps.timeZone });
    },
    {
      name: CURRENT_DATETIME_TOOL,
      description: "Returns today's date, weekday and the current time in the restaurant's time zone.",
      schema: z.object({}),
    },
  );

  return [checkAvailability, createBooking, currentDateTime];
}
