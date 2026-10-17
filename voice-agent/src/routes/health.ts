import type { FastifyInstance } from "fastify";

export interface HealthDeps {
  pingMongo: () => Promise<boolean>;
  activeCalls: () => number;
}

/** Liveness and readiness in one: always 200 so the host does not restart us for a Mongo blip. */
export function registerHealthRoute(app: FastifyInstance, deps: HealthDeps): void {
  app.get("/health", async () => {
    const mongoUp = await deps.pingMongo();
    return {
      status: mongoUp ? "ok" : "degraded",
      mongo: mongoUp ? "up" : "down",
      activeCalls: deps.activeCalls(),
      uptimeSeconds: Math.round(process.uptime()),
    };
  });
}
