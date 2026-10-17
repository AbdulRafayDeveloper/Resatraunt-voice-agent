import type { WebSocket } from "@fastify/websocket";
import type { RawData } from "ws";

import type { CallRegistry } from "../call/registry.js";
import type { CallSession } from "../call/session.js";
import { errorMessage, type Logger } from "../logger.js";
import { MEDIA_CODEC, mediaMessageSchema } from "./types.js";

/** What a call session needs from the media connection; implemented here over the Telnyx WebSocket. */
export interface MediaTransport {
  /** Sends one chunk of mu-law audio to the caller. */
  sendAudio(mulaw: Buffer): void;
  /** Tells Telnyx to drop any audio it has buffered but not yet played (barge-in). */
  clear(): void;
  close(): void;
}

export interface MediaStreamDeps {
  sessions: CallRegistry;
  logger: Logger;
}

function rawToString(data: RawData): string {
  if (Array.isArray(data)) return Buffer.concat(data).toString("utf8");
  if (data instanceof ArrayBuffer) return Buffer.from(data).toString("utf8");
  return data.toString("utf8");
}

function createTransport(socket: WebSocket, streamId: () => string | undefined): MediaTransport {
  const send = (message: Record<string, unknown>): void => {
    if (socket.readyState !== socket.OPEN) return;
    const id = streamId();
    socket.send(JSON.stringify(id ? { ...message, stream_id: id } : message));
  };
  return {
    sendAudio: (mulaw) => send({ event: "media", media: { payload: mulaw.toString("base64") } }),
    clear: () => send({ event: "clear" }),
    close: () => {
      if (socket.readyState === socket.OPEN || socket.readyState === socket.CONNECTING) socket.close();
    },
  };
}

/**
 * Handles one Telnyx media-streaming WebSocket: `start` binds it to a call session,
 * `media` feeds caller audio in, and `stop` or a socket close ends the session.
 */
export function attachMediaStream(socket: WebSocket, deps: MediaStreamDeps): void {
  let session: CallSession | undefined;
  let streamId: string | undefined;
  const log = deps.logger;
  const transport = createTransport(socket, () => streamId);

  const handle = (text: string): void => {
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      log.warn("ignoring non-JSON media message");
      return;
    }
    const parsed = mediaMessageSchema.safeParse(json);
    if (!parsed.success) {
      log.warn("ignoring malformed media message");
      return;
    }
    const message = parsed.data;

    switch (message.event) {
      case "connected":
        log.debug("media stream connected");
        return;
      case "start": {
        streamId = message.stream_id;
        const encoding = message.start.media_format?.encoding.toUpperCase();
        if (encoding && encoding !== MEDIA_CODEC) {
          log.error({ encoding }, `unsupported media encoding; only ${MEDIA_CODEC} is handled`);
          socket.close();
          return;
        }
        session = deps.sessions.start(message.start.call_control_id, transport);
        return;
      }
      case "media":
        if (session && (message.media.track === undefined || message.media.track === "inbound")) {
          session.handleInboundAudio(Buffer.from(message.media.payload, "base64"));
        }
        return;
      case "stop":
        session?.end("stream_stopped");
        return;
      case "unknown":
        log.debug({ name: message.name }, "ignoring media event");
    }
  };

  socket.on("message", (data: RawData) => handle(rawToString(data)));
  socket.on("close", () => session?.end("socket_closed"));
  socket.on("error", (error: Error) => log.warn({ err: errorMessage(error) }, "media socket error"));
}
