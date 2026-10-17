/**
 * Single source of truth for brand identity, contact channels and URLs.
 * Every component, metadata block and JSON-LD graph reads from here.
 *
 * TableTalk is reached by phone only. The booking line is the Telnyx number answered by the voice
 * agent (see voice-agent/). Until the real number is set, the placeholder sits in Ofcom's range
 * reserved for drama (020 7946 0xxx), so it can never ring a real person.
 */

const PLACEHOLDER_PHONE = "+44 20 7946 0123";

export const siteConfig = {
  name: "TableTalk",
  fullName: "TableTalk",
  legalName: "TableTalk (legal entity to be confirmed)",
  tagline: "Find the table worth talking about.",
  description:
    "TableTalk is a dining guide and table-request service for restaurants in London, Edinburgh, New York, Chicago and Philadelphia. Every listing shows verified hours, menu formats, prices as published, booking rules and awards with their source and year.",
  foundedYear: 2026,
  /** Booking and contact phone line, written for display (e.g. "+44 20 7946 0123"). Set NEXT_PUBLIC_BOOKING_PHONE to the Telnyx number. */
  phone: process.env.NEXT_PUBLIC_BOOKING_PHONE?.trim() || PLACEHOLDER_PHONE,
  /** Booking rules the voice agent applies; mirrored in voice-agent/ configuration. */
  phoneBooking: {
    opensAt: "11:00",
    closesAt: "23:00",
    tables: 10,
    slotMinutes: 60,
    collects: ["Your name", "Number of guests", "Day", "Time"],
  },
  /** Optional WhatsApp number in international format without "+" (e.g. 447700900000). Hidden when unset. */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "",
  /** Optional Instagram profile URL. Hidden when unset. */
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "",
  /** Written reply promise shown next to every request form. */
  replyPromise: "We call you back about every table request within one working day.",
  /** ISO date when listing facts (hours, menus, awards) were last checked. Bump when data changes. */
  dataCheckedOn: "2026-10-17",
  /** The site is written in British English; US venues keep their own spellings in names and menus. */
  language: "en-GB",
} as const;

export function isPlaceholderPhone(): boolean {
  return siteConfig.phone === PLACEHOLDER_PHONE;
}

/** tel: link for the booking line (spaces and punctuation stripped). */
export function telUrl(): string {
  return `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
}

const LOCAL_URL = "http://localhost:3000";

/** False only on Vercel preview deployments; local and non-Vercel builds behave as production. */
export function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
}

/**
 * Canonical site origin: the single source of truth for every absolute URL (metadata, sitemap,
 * robots, JSON-LD, social cards). Resolution order:
 * 1. NEXT_PUBLIC_SITE_URL, the configured production origin (always wins when set).
 * 2. On Vercel production, the project production URL.
 * 3. On Vercel preview deployments, the deployment URL (never used for production canonicals).
 * 4. Local development.
 */
export function getBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return new URL(configured).origin;
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return LOCAL_URL;
}

/** Build a wa.me link with an optional prefilled message, or null when no number is configured. */
export function whatsappUrl(message?: string): string | null {
  if (!siteConfig.whatsappNumber) return null;
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

