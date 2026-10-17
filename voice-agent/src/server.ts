import { OpenAI } from "openai";

import { createBookingAgent } from "./agent/bookingAgent.js";
import { createChatModel } from "./agent/llm.js";
import { buildApp, registerRoutes } from "./app.js";
import { MongoBookingStore } from "./bookings/mongoStore.js";
import { CallRegistry } from "./call/registry.js";
import { CallSession, defaultPhrases } from "./call/session.js";
import { loadConfig } from "./config.js";
import { connectMongo } from "./db/mongo.js";
import { loadDotEnv } from "./env.js";
import { errorMessage } from "./logger.js";
import { withPhraseCache } from "./speech/cache.js";
import { createOpenAiSpeechToText } from "./speech/stt.js";
import { createOpenAiTextToSpeech } from "./speech/tts.js";
import { createTelnyxClient } from "./telnyx/client.js";
import { createTelnyxVerifier } from "./telnyx/signature.js";

async function main(): Promise<void> {
  loadDotEnv();
  const config = loadConfig();
  const app = await buildApp(config);
  const log = app.log;

  const mongo = await connectMongo(config.mongo, log);
  const store = new MongoBookingStore(mongo.db, config.restaurant.rules.totalTables);
  await store.ensureIndexes();

  const openai = new OpenAI({ apiKey: config.openai.apiKey });
  const stt = createOpenAiSpeechToText(openai, config.openai.sttModel);
  const tts = withPhraseCache(
    createOpenAiTextToSpeech(openai, { model: config.openai.ttsModel, voice: config.openai.ttsVoice }),
  );
  const model = createChatModel({
    provider: config.llm.provider,
    openai: { apiKey: config.openai.apiKey, model: config.openai.chatModel },
  });
  const telnyx = createTelnyxClient({ apiKey: config.telnyx.apiKey, logger: log });
  const phrases = defaultPhrases(config.restaurant.name);

  const sessions = new CallRegistry(
    (callControlId, transport) =>
      new CallSession({
        callControlId,
        transport,
        stt,
        tts,
        telnyx,
        phrases,
        logger: log,
        agent: createBookingAgent({
          model,
          store,
          restaurant: config.restaurant,
          callControlId,
          logger: log.child({ callControlId }),
        }),
      }),
    log,
  );

  await registerRoutes(app, {
    config,
    telnyx,
    sessions,
    verify: createTelnyxVerifier(config.telnyx.publicKey),
    pingMongo: () => mongo.ping(),
  });

  await app.listen({ port: config.server.port, host: "0.0.0.0" });
  log.info({ mediaStreamUrl: config.telnyx.mediaStreamUrl, provider: config.llm.provider }, "voice agent ready");

  let shuttingDown = false;
  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;
    log.info({ signal, activeCalls: sessions.activeCount }, "shutting down");
    try {
      await sessions.hangUpAll("shutdown");
      await app.close();
      await mongo.close();
      process.exit(0);
    } catch (error) {
      log.error({ err: errorMessage(error) }, "shutdown failed");
      process.exit(1);
    }
  };
  process.once("SIGINT", (signal) => void shutdown(signal));
  process.once("SIGTERM", (signal) => void shutdown(signal));
  process.on("unhandledRejection", (reason) => {
    log.error({ err: errorMessage(reason) }, "unhandled promise rejection");
  });
}

main().catch((error: unknown) => {
  console.error(`Fatal: ${errorMessage(error)}`);
  process.exit(1);
});
