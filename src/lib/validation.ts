import { boolean, config, enum as zodEnum, literal, number, object, string, type infer as Infer } from "zod";
import { addDaysIso, todayIso } from "@/lib/utils";

// Zod 4 probes Function("") to enable its compiled fast path. Our Content Security Policy forbids
// eval, so run Zod without JIT. Named imports (rather than the `z` namespace) let the bundler drop
// the `locales` namespace that zod re-exports, which otherwise adds ~350 KB to the client bundle.
config({ jitless: true });

/** How far ahead a table can be requested. Most restaurants release tables 1 to 3 months out. */
export const MAX_REQUEST_DAYS_AHEAD = 120;
export const MAX_ONLINE_PARTY = 12;

export const nameSchema = string().trim().min(2, "Please enter your name").max(80, "Name is too long");

export const emailSchema = string().trim().email("Enter a valid email address").max(120);

/** International phone, loosely validated: digits, spaces, dashes, brackets, optional leading +. */
export const phoneSchema = string()
  .trim()
  .transform((v) => v.replace(/[\s\-().]/g, ""))
  .refine((v) => v === "" || /^\+?\d{7,15}$/.test(v), "Enter a valid phone number with country code, e.g. +44 20 7946 0000");

/** Honeypot: real visitors never see or fill this field. */
const honeypotSchema = string().max(0, "Spam check failed").optional();

/** A checkbox that must be ticked; typed as boolean so forms can default it to false. */
const consentSchema = (message: string) => boolean().refine((v) => v === true, { message });

export const occasionOptions = [
  { value: "none", label: "No special occasion" },
  { value: "date-night", label: "Date night" },
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "celebration", label: "Celebration" },
  { value: "business", label: "Business dinner" },
  { value: "other", label: "Something else" },
] as const;

export type OccasionValue = (typeof occasionOptions)[number]["value"];
const occasionValues = occasionOptions.map((o) => o.value) as [OccasionValue, ...OccasionValue[]];

/** Half-hour slots from midday to 10 pm, in 24-hour local time of the restaurant. */
export const timeSlots = Array.from({ length: 21 }, (_, i) => {
  const minutes = 12 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

const timeValues = timeSlots as [string, ...string[]];

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

export const dateSchema = string()
  .trim()
  .refine(isIsoDate, "Choose a date")
  .refine((v) => v >= todayIso(), "Choose a date from today onwards")
  .refine((v) => v <= addDaysIso(todayIso(), MAX_REQUEST_DAYS_AHEAD), `We take requests up to ${MAX_REQUEST_DAYS_AHEAD} days ahead`);

export const tableRequestSchema = object({
  restaurantSlug: string().trim().min(1, "Choose a restaurant").max(80),
  date: dateSchema,
  time: zodEnum(timeValues, { message: "Choose a time" }),
  flexible: boolean(),
  partySize: number({ message: "Enter the number of guests" }).int().min(1, "At least one guest").max(MAX_ONLINE_PARTY, `For parties above ${MAX_ONLINE_PARTY}, use the notes and we will contact the restaurant's events team`),
  occasion: zodEnum(occasionValues, { message: "Choose an occasion" }),
  dietary: string().trim().max(300, "Please keep dietary notes under 300 characters"),
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  notes: string().trim().max(500, "Please keep notes under 500 characters"),
  consent: consentSchema("Please confirm you understand this is a request, not a confirmed booking"),
  fax: honeypotSchema,
});

export type TableRequestInput = Infer<typeof tableRequestSchema>;

export const roleOptions = [
  { value: "owner", label: "Owner or partner" },
  { value: "gm", label: "General manager" },
  { value: "reservations", label: "Reservations or events" },
  { value: "marketing", label: "Marketing or PR" },
  { value: "other", label: "Other" },
] as const;
const roleValues = roleOptions.map((o) => o.value) as [string, ...string[]];

export const coversOptions = ["under-30", "30-60", "60-120", "120+"] as const;

export const listingSchema = object({
  restaurantName: string().trim().min(2, "Enter the restaurant name").max(100),
  city: string().trim().min(2, "Enter the city").max(60),
  website: string().trim().max(200).url("Enter a full URL starting with https://").or(literal("")),
  contactName: nameSchema,
  role: zodEnum(roleValues, { message: "Choose your role" }),
  email: emailSchema,
  phone: phoneSchema,
  covers: zodEnum(coversOptions, { message: "Choose a size" }),
  message: string().trim().min(10, "Tell us a little about the restaurant").max(1000),
  consent: consentSchema("Please agree to be contacted about your enquiry"),
  fax: honeypotSchema,
});

export type ListingInput = Infer<typeof listingSchema>;

export const topicOptions = [
  { value: "request", label: "An existing table request" },
  { value: "listing", label: "A listing correction" },
  { value: "restaurant", label: "Listing my restaurant" },
  { value: "press", label: "Press" },
  { value: "privacy", label: "Privacy or data" },
  { value: "other", label: "Something else" },
] as const;
const topicValues = topicOptions.map((o) => o.value) as [string, ...string[]];

export const contactSchema = object({
  name: nameSchema,
  email: emailSchema,
  topic: zodEnum(topicValues, { message: "Choose a topic" }),
  reference: string().trim().max(30),
  message: string().trim().min(10, "Tell us a little more").max(1500),
  fax: honeypotSchema,
});

export type ContactInput = Infer<typeof contactSchema>;

export const cityInterestOptions = ["all", "london", "edinburgh", "new-york", "chicago", "philadelphia"] as const;

export const newsletterSchema = object({
  email: emailSchema,
  cityInterest: zodEnum(cityInterestOptions, { message: "Choose a city" }),
  consent: consentSchema("Please agree to receive the newsletter"),
  fax: honeypotSchema,
});

export type NewsletterInput = Infer<typeof newsletterSchema>;

export type FormResult = { ok: true; reference: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };
