/** Calendar helpers that work on YYYY-MM-DD strings without any date library. */

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 86_400_000;

export interface ZonedClock {
  /** Today's date in the time zone, YYYY-MM-DD. */
  date: string;
  weekday: string;
  hour: number;
  minute: number;
}

function parseUtc(date: string): number | undefined {
  const match = DATE_PATTERN.exec(date);
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const time = Date.UTC(year, month - 1, day);
  const roundTrip = new Date(time);
  const valid =
    roundTrip.getUTCFullYear() === year &&
    roundTrip.getUTCMonth() === month - 1 &&
    roundTrip.getUTCDate() === day;
  return valid ? time : undefined;
}

export function isCalendarDate(date: string): boolean {
  return parseUtc(date) !== undefined;
}

function toIsoDate(time: number): string {
  return new Date(time).toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  const time = parseUtc(date);
  if (time === undefined) throw new RangeError(`invalid date: ${date}`);
  return toIsoDate(time + days * MS_PER_DAY);
}

/** Whole days from `from` to `to` (negative when `to` is earlier). */
export function daysBetween(from: string, to: string): number {
  const a = parseUtc(from);
  const b = parseUtc(to);
  if (a === undefined || b === undefined) throw new RangeError(`invalid date range: ${from} -> ${to}`);
  return Math.round((b - a) / MS_PER_DAY);
}

/** The current wall-clock date and time in an IANA time zone. */
export function zonedNow(now: Date, timeZone: string): ZonedClock {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "long",
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    weekday: get("weekday"),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

/** "Friday 24 October" style wording for speech. */
export function formatDateForSpeech(date: string): string {
  const time = parseUtc(date);
  if (time === undefined) return date;
  return new Date(time).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}
