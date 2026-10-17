import type { CallRegistry } from "../call/registry.js";
import type { Logger } from "../logger.js";
import type { TelnyxCallControl } from "./client.js";
import type { TelnyxWebhookEvent } from "./types.js";

export interface WebhookDeps {
  telnyx: TelnyxCallControl;
  sessions: CallRegistry;
  mediaStreamUrl: string;
  logger: Logger;
}

/** Keeps only the last few digits of a phone number so logs are not full of callers' numbers. */
function maskNumber(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.length <= 3 ? "***" : `***${value.slice(-3)}`;
}

/** Reacts to one Call Control event. Unknown events are ignored; nothing here throws. */
export async function handleTelnyxEvent(event: TelnyxWebhookEvent, deps: WebhookDeps): Promise<void> {
  const { event_type: type, payload } = event.data;
  const callControlId = payload.call_control_id;
  const log = deps.logger.child({ event: type, callControlId });

  switch (type) {
    case "call.initiated": {
      if (!callControlId) {
        log.warn("call.initiated without a call_control_id");
        return;
      }
      if (payload.direction === "outgoing") {
        log.debug("ignoring outgoing call leg");
        return;
      }
      log.info({ from: maskNumber(payload.from), to: payload.to }, "incoming call; answering with media stream");
      const answered = await deps.telnyx.answer(callControlId, { streamUrl: deps.mediaStreamUrl });
      if (!answered) log.error("could not answer the call");
      return;
    }
    case "call.answered":
      log.info("call answered");
      return;
    case "call.hangup":
      log.info({ cause: payload.hangup_cause }, "call hung up");
      if (callControlId) deps.sessions.end(callControlId, "hangup");
      return;
    case "streaming.started":
    case "streaming.stopped":
    case "streaming.failed":
      log.info("media streaming event");
      return;
    default:
      log.debug("ignoring event");
  }
}
