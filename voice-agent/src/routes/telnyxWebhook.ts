import type { FastifyInstance, FastifyRequest } from "fastify";

import { errorMessage } from "../logger.js";
import type { WebhookVerifier } from "../telnyx/signature.js";
import { telnyxWebhookSchema } from "../telnyx/types.js";
import { handleTelnyxEvent, type WebhookDeps } from "../telnyx/webhook.js";

export interface WebhookRouteDeps extends WebhookDeps {
  verify: WebhookVerifier;
}

const SIGNATURE_HEADER = "telnyx-signature-ed25519";
const TIMESTAMP_HEADER = "telnyx-timestamp";

function headerValue(request: FastifyRequest, name: string): string | undefined {
  const value = request.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

/**
 * POST /telnyx/webhook. The body is kept raw so the Ed25519 signature can be
 * checked over the exact bytes Telnyx signed; it is parsed only afterwards.
 * Events are handled asynchronously so Telnyx always gets a fast 200.
 */
export async function registerTelnyxWebhook(app: FastifyInstance, deps: WebhookRouteDeps): Promise<void> {
  await app.register((instance, _options, ready) => {
    instance.addContentTypeParser("application/json", { parseAs: "buffer" }, (_request, body, done) => {
      done(null, body);
    });

    instance.post("/telnyx/webhook", async (request, reply) => {
      const raw = request.body;
      if (!Buffer.isBuffer(raw)) {
        return reply.code(400).send({ error: "expected a JSON body" });
      }

      const verdict = deps.verify(
        { signature: headerValue(request, SIGNATURE_HEADER), timestamp: headerValue(request, TIMESTAMP_HEADER) },
        raw,
      );
      if (!verdict.ok) {
        request.log.warn({ reason: verdict.reason }, "rejected webhook");
        const status = verdict.reason === "missing_headers" ? 400 : 401;
        return reply.code(status).send({ error: "invalid signature" });
      }

      let json: unknown;
      try {
        json = JSON.parse(raw.toString("utf8"));
      } catch {
        return reply.code(400).send({ error: "invalid JSON" });
      }
      const parsed = telnyxWebhookSchema.safeParse(json);
      if (!parsed.success) {
        return reply.code(400).send({ error: "unrecognised event shape" });
      }

      void handleTelnyxEvent(parsed.data, deps).catch((error: unknown) => {
        request.log.error({ err: errorMessage(error) }, "webhook handling failed");
      });
      return reply.code(200).send({ received: true });
    });
    ready();
  });
}
