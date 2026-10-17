/**
 * Single source of truth for brand identity, contact channels and URLs.
 * Every component, metadata block and JSON-LD graph reads from here.
 *
 * Contact details are placeholders until the business supplies real ones. The `.example` domain
 * is reserved by the IETF and can never deliver mail, so a placeholder can never reach a stranger.
 */

const PLACEHOLDER_EMAIL = "hello@tabletalk.example";

export const siteConfig = {
  name: "TableTalk",
  fullName: "TableTalk",
  legalName: "TableTalk (legal entity to be confirmed)",
  tagline: "Find the table worth talking about.",
  description:
    "TableTalk is a dining guide and table-request service for restaurants in London, Edinburgh, New York, Chicago and Philadelphia. Every listing shows verified hours, menu formats, prices as published, booking rules and awards with their source and year.",
  foundedYear: 2026,
  /** Contact email; override with NEXT_PUBLIC_CONTACT_EMAIL once the real inbox exists. */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || PLACEHOLDER_EMAIL,
  /** Optional WhatsApp number in international format without "+" (e.g. 447700900000). Hidden when unset. */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "",
  /** Optional Instagram profile URL. Hidden when unset. */
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "",
  /** Written reply promise shown next to every request form. */
  replyPromise: "We reply to every table request by email within one working day.",
  /** ISO date when listing facts (hours, menus, awards) were last checked. Bump when data changes. */
  dataCheckedOn: "2026-10-17",
  /** The site is written in British English; US venues keep their own spellings in names and menus. */
  language: "en-GB",
} as const;

export function isPlaceholderEmail(): boolean {
  return siteConfig.email === PLACEHOLDER_EMAIL;
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

/** mailto: link with an optional subject and body. */
export function mailtoUrl(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return `mailto:${siteConfig.email}${query ? `?${query}` : ""}`;
}
