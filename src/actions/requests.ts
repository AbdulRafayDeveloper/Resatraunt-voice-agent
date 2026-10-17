"use server";

import { headers } from "next/headers";
import type { ZodType } from "zod";
import { contactSchema, listingSchema, newsletterSchema, tableRequestSchema, type FormResult } from "@/lib/validation";

export type RequestKind = "table" | "listing" | "contact" | "newsletter";

const schemas: Record<RequestKind, ZodType> = {
  table: tableRequestSchema,
  listing: listingSchema,
  contact: contactSchema,
  newsletter: newsletterSchema,
};

const prefixes: Record<RequestKind, string> = { table: "TT", listing: "TL", contact: "TC", newsletter: "TN" };

const WEBHOOK_TIMEOUT_MS = 8000;

/** Per-IP sliding window: at most this many submissions per window, kept in process memory. */
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const submissions = new Map<string, number[]>();

async function clientKey(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    submissions.set(key, recent);
    return true;
  }
  recent.push(now);
  submissions.set(key, recent);
  if (submissions.size > 5000) submissions.clear();
  return false;
}

function makeReference(kind: RequestKind): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `${prefixes[kind]}-${stamp}${rand}`;
}

function flattenErrors(issues: Array<{ path: PropertyKey[]; message: string }>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

async function forwardToWebhook(kind: RequestKind, reference: string, data: unknown): Promise<void> {
  const url = process.env.REQUEST_WEBHOOK_URL;
  if (!url) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, reference, receivedAt: new Date().toISOString(), data }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(JSON.stringify({ event: "request_webhook_failed", kind, reference, status: res.status }));
    }
  } catch (error) {
    console.error(JSON.stringify({ event: "request_webhook_error", kind, reference, message: error instanceof Error ? error.message : "unknown" }));
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Validate a submission on the server and forward it to the configured webhook.
 * Never throws; always returns a FormResult the client can render. Personal data is not logged.
 * A table request is a request: nothing here confirms a booking with a restaurant.
 */
export async function submitRequest(kind: RequestKind, raw: unknown): Promise<FormResult> {
  try {
    if (isRateLimited(await clientKey())) {
      return { ok: false, error: "Too many submissions from this connection. Please wait a few minutes and try again." };
    }
    const parsed = schemas[kind].safeParse(raw);
    if (!parsed.success) {
      return { ok: false, error: "Please correct the highlighted fields.", fieldErrors: flattenErrors(parsed.error.issues) };
    }
    const reference = makeReference(kind);
    await forwardToWebhook(kind, reference, parsed.data);
    console.info(JSON.stringify({ event: "request_received", kind, reference }));
    return { ok: true, reference };
  } catch (error) {
    console.error(JSON.stringify({ event: "request_unexpected_error", kind, message: error instanceof Error ? error.message : "unknown" }));
    return { ok: false, error: "Something went wrong on our side. Please try again in a moment or call our booking line." };
  }
}
