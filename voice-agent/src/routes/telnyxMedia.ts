import type { FastifyInstance } from "fastify";

import { attachMediaStream, type MediaStreamDeps } from "../telnyx/mediaStream.js";

/** WebSocket endpoint Telnyx connects to for bidirectional call audio. Requires @fastify/websocket. */
export function registerTelnyxMedia(app: FastifyInstance, deps: MediaStreamDeps): void {
  app.get("/telnyx/media", { websocket: true }, (socket, request) => {
    attachMediaStream(socket, { sessions: deps.sessions, logger: request.log });
  });
}
