import { generateKeyPairSync, sign } from "node:crypto";
import { describe, expect, it } from "vitest";

import { createTelnyxVerifier } from "../src/telnyx/signature.js";

const { publicKey, privateKey } = generateKeyPairSync("ed25519");
const spki = publicKey.export({ format: "der", type: "spki" });
// The last 32 bytes of the SPKI DER are the raw key, which is what Telnyx publishes in base64.
const publicKeyBase64 = spki.subarray(spki.length - 32).toString("base64");

const body = Buffer.from(JSON.stringify({ data: { event_type: "call.initiated", payload: {} } }));
const nowMs = Date.UTC(2026, 9, 17, 12, 0, 0);
const timestamp = String(Math.floor(nowMs / 1000));

function signBody(ts: string, raw: Buffer): string {
  return sign(null, Buffer.concat([Buffer.from(`${ts}|`), raw]), privateKey).toString("base64");
}

describe("Telnyx webhook signature", () => {
  const verify = createTelnyxVerifier(publicKeyBase64);

  it("accepts a valid signature within the time window", () => {
    expect(verify({ signature: signBody(timestamp, body), timestamp }, body, nowMs)).toEqual({ ok: true });
  });

  it("rejects a tampered body", () => {
    const tampered = Buffer.from(body.toString("utf8").replace("call.initiated", "call.hangup"));
    expect(verify({ signature: signBody(timestamp, body), timestamp }, tampered, nowMs)).toEqual({
      ok: false,
      reason: "invalid_signature",
    });
  });

  it("rejects a signature from another key", () => {
    const other = generateKeyPairSync("ed25519").privateKey;
    const forged = sign(null, Buffer.concat([Buffer.from(`${timestamp}|`), body]), other).toString("base64");
    expect(verify({ signature: forged, timestamp }, body, nowMs)).toEqual({ ok: false, reason: "invalid_signature" });
  });

  it("rejects stale or malformed timestamps", () => {
    const old = String(Math.floor(nowMs / 1000) - 600);
    expect(verify({ signature: signBody(old, body), timestamp: old }, body, nowMs)).toEqual({
      ok: false,
      reason: "stale_timestamp",
    });
    expect(verify({ signature: signBody("abc", body), timestamp: "abc" }, body, nowMs)).toEqual({
      ok: false,
      reason: "invalid_timestamp",
    });
  });

  it("rejects missing headers and garbage signatures without throwing", () => {
    expect(verify({ signature: undefined, timestamp }, body, nowMs)).toEqual({ ok: false, reason: "missing_headers" });
    expect(verify({ signature: "not-base64!!", timestamp }, body, nowMs)).toEqual({
      ok: false,
      reason: "invalid_signature",
    });
  });

  it("refuses a public key of the wrong length", () => {
    expect(() => createTelnyxVerifier(Buffer.alloc(16).toString("base64"))).toThrow(/32 bytes/);
  });
});
