import fastifyWebsocket from "@fastify/websocket";
import Fastify, { type FastifyInstance } from "fastify";

import type { CallRegistry } from "./call/registry.js";
import type { AppConfig } from "./config.js";
import { registerHealthRoute } from "./routes/health.js";
import { registerTelnyxMedia } from "./routes/telnyxMedia.js";
import { registerTelnyxWebhook } from "./routes/telnyxWebhook.js";
import type { TelnyxCallControl } from "./telnyx/client.js";
import type { WebhookVerifier } from "./telnyx/signature.js";

export interface AppDeps {
  config: AppConfig;
  telnyx: TelnyxCallControl;
  sessions: CallRegistry;
  verify: WebhookVerifier;
  pingMongo: () => Promise<boolean>;
}

/** Creates the Fastify instance with logging and WebSocket support; routes are added by `registerRoutes`. */
export async function buildApp(config: AppConfig): Promise<FastifyInstance> {
  const app = Fastify({
    trustProxy: true,
    logger: {
      level: config.server.logLevel,
      redact: {
        paths: ["req.headers.authorization", 'req.headers["telnyx-signature-ed25519"]'],
        remove: true,
      },
    },
  });
  await app.register(fastifyWebsocket, { options: { maxPayload: 1024 * 1024 } });
  return app;
}

export async function registerRoutes(app: FastifyInstance, deps: AppDeps): Promise<void> {
  registerHealthRoute(app, { pingMongo: deps.pingMongo, activeCalls: () => deps.sessions.activeCount });
  await registerTelnyxWebhook(app, {
    telnyx: deps.telnyx,
    sessions: deps.sessions,
    mediaStreamUrl: deps.config.telnyx.mediaStreamUrl,
    logger: app.log,
    verify: deps.verify,
  });
  registerTelnyxMedia(app, { sessions: deps.sessions, logger: app.log });
}
