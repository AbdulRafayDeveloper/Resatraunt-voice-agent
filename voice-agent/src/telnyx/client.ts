import { errorMessage, noopLogger, type Logger } from "../logger.js";
import { MEDIA_CODEC } from "./types.js";

export interface AnswerOptions {
  /** ws(s):// URL Telnyx should open a bidirectional media stream to. */
  streamUrl: string;
}

/** The two Call Control commands this service needs. Both log failures and return false rather than throwing. */
export interface TelnyxCallControl {
  answer(callControlId: string, options: AnswerOptions): Promise<boolean>;
  hangup(callControlId: string): Promise<boolean>;
}

export interface TelnyxClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
  logger?: Logger;
  fetchImpl?: typeof fetch;
}

const DEFAULT_BASE_URL = "https://api.telnyx.com/v2";
const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_LOGGED_BODY = 500;

export function createTelnyxClient(options: TelnyxClientOptions): TelnyxCallControl {
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const logger = options.logger ?? noopLogger;
  const fetchImpl = options.fetchImpl ?? fetch;

  async function command(callControlId: string, action: string, body: Record<string, unknown>): Promise<boolean> {
    const url = `${baseUrl}/calls/${encodeURIComponent(callControlId)}/actions/${action}`;
    try {
      const response = await fetchImpl(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${options.apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (response.ok) return true;
      const detail = (await response.text()).slice(0, MAX_LOGGED_BODY);
      logger.error({ action, callControlId, status: response.status, detail }, "Telnyx rejected call command");
      return false;
    } catch (error) {
      logger.error({ action, callControlId, err: errorMessage(error) }, "Telnyx call command failed");
      return false;
    }
  }

  return {
    answer: (callControlId, { streamUrl }) =>
      command(callControlId, "answer", {
        stream_url: streamUrl,
        stream_track: "inbound_track",
        stream_bidirectional_mode: "rtp",
        stream_bidirectional_codec: MEDIA_CODEC,
      }),
    hangup: (callControlId) => command(callControlId, "hangup", {}),
  };
}
