import { createPublicKey, verify, type KeyObject } from "node:crypto";

/**
 * Telnyx signs every webhook with Ed25519 over `${timestamp}|${rawBody}` and sends
 * the base64 signature in `telnyx-signature-ed25519` and the Unix-seconds timestamp
 * in `telnyx-timestamp`. The public key shown in Mission Control is the raw 32-byte
 * key in base64; Node wants it wrapped in a SubjectPublicKeyInfo DER envelope.
 */

const SPKI_ED25519_PREFIX = Buffer.from("302a300506032b6570032100", "hex");
const ED25519_KEY_BYTES = 32;

export const DEFAULT_TOLERANCE_SECONDS = 300;

export type SignatureFailure = "missing_headers" | "invalid_timestamp" | "stale_timestamp" | "invalid_signature";

export type VerifyResult = { ok: true } | { ok: false; reason: SignatureFailure };

export interface SignatureHeaders {
  signature: string | undefined;
  timestamp: string | undefined;
}

export type WebhookVerifier = (headers: SignatureHeaders, rawBody: Buffer, nowMs?: number) => VerifyResult;

export function publicKeyFromBase64(base64: string): KeyObject {
  const raw = Buffer.from(base64, "base64");
  if (raw.length !== ED25519_KEY_BYTES) {
    throw new Error("Telnyx public key must decode to 32 bytes");
  }
  return createPublicKey({
    key: Buffer.concat([SPKI_ED25519_PREFIX, raw]),
    format: "der",
    type: "spki",
  });
}

export function createTelnyxVerifier(
  publicKeyBase64: string,
  toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
): WebhookVerifier {
  const key = publicKeyFromBase64(publicKeyBase64);

  return (headers, rawBody, nowMs = Date.now()) => {
    if (!headers.signature || !headers.timestamp) return { ok: false, reason: "missing_headers" };

    const timestamp = Number(headers.timestamp);
    if (!Number.isInteger(timestamp)) return { ok: false, reason: "invalid_timestamp" };
    if (Math.abs(nowMs / 1000 - timestamp) > toleranceSeconds) return { ok: false, reason: "stale_timestamp" };

    const message = Buffer.concat([Buffer.from(`${headers.timestamp}|`, "utf8"), rawBody]);
    const signature = Buffer.from(headers.signature, "base64");
    return safeVerify(message, key, signature) ? { ok: true } : { ok: false, reason: "invalid_signature" };
  };
}

/** `crypto.verify` throws on malformed signatures; treat that as a failed check. */
function safeVerify(message: Buffer, key: KeyObject, signature: Buffer): boolean {
  try {
    return verify(null, message, key, signature);
  } catch {
    return false;
  }
}
