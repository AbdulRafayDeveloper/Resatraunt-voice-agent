import { describe, expect, it } from "vitest";

import { CallRegistry } from "../src/call/registry.js";
import { noopLogger } from "../src/logger.js";
import type { TelnyxCallControl } from "../src/telnyx/client.js";
import { telnyxWebhookSchema } from "../src/telnyx/types.js";
import { handleTelnyxEvent } from "../src/telnyx/webhook.js";

function fakeTelnyx() {
  const answered: { id: string; streamUrl: string }[] = [];
  const hungUp: string[] = [];
  const client: TelnyxCallControl = {
    answer: (id, { streamUrl }) => {
      answered.push({ id, streamUrl });
      return Promise.resolve(true);
    },
    hangup: (id) => {
      hungUp.push(id);
      return Promise.resolve(true);
    },
  };
  return { client, answered, hungUp };
}

function event(type: string, payload: Record<string, unknown>) {
  return telnyxWebhookSchema.parse({ data: { event_type: type, payload } });
}

const mediaStreamUrl = "wss://agent.example.com/telnyx/media";

describe("handleTelnyxEvent", () => {
  it("answers an incoming call with the media stream URL", async () => {
    const telnyx = fakeTelnyx();
    const sessions = new CallRegistry(() => {
      throw new Error("no session expected");
    }, noopLogger);

    await handleTelnyxEvent(
      event("call.initiated", { call_control_id: "cc-1", direction: "incoming", from: "+441234567890" }),
      { telnyx: telnyx.client, sessions, mediaStreamUrl, logger: noopLogger },
    );

    expect(telnyx.answered).toEqual([{ id: "cc-1", streamUrl: mediaStreamUrl }]);
  });

  it("ignores outgoing legs and unknown events", async () => {
    const telnyx = fakeTelnyx();
    const sessions = new CallRegistry(() => {
      throw new Error("no session expected");
    }, noopLogger);
    const deps = { telnyx: telnyx.client, sessions, mediaStreamUrl, logger: noopLogger };

    await handleTelnyxEvent(event("call.initiated", { call_control_id: "cc-2", direction: "outgoing" }), deps);
    await handleTelnyxEvent(event("call.recording.saved", { call_control_id: "cc-2" }), deps);
    await handleTelnyxEvent(event("call.hangup", { call_control_id: "cc-unknown" }), deps);

    expect(telnyx.answered).toEqual([]);
    expect(telnyx.hungUp).toEqual([]);
  });

  it("rejects envelopes without the expected shape", () => {
    expect(telnyxWebhookSchema.safeParse({ data: { payload: {} } }).success).toBe(false);
    expect(telnyxWebhookSchema.safeParse({ hello: "world" }).success).toBe(false);
  });
});
