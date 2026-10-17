import { z } from "zod";

const LOG_LEVELS = ["fatal", "error", "warn", "info", "debug", "trace", "silent"] as const;
const LLM_PROVIDERS = ["openai", "google", "xai"] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];
export type LlmProvider = (typeof LLM_PROVIDERS)[number];

const ED25519_KEY_BYTES = 32;

/** Bookings further ahead than this are refused. */
export const MAX_DAYS_AHEAD = 90;

function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone });
    return true;
  } catch {
    return false;
  }
}

const hour = z.coerce.number().int().min(0).max(24);

const envSchema = z
  .object({
    PORT: z.coerce.number().int().min(1).max(65535).default(8080),
    PUBLIC_BASE_URL: z.url({ protocol: /^https?$/ }),
    TELNYX_API_KEY: z.string().min(1),
    TELNYX_PUBLIC_KEY: z
      .base64()
      .refine((key) => Buffer.from(key, "base64").length === ED25519_KEY_BYTES, {
        message: "must be a base64 Ed25519 public key (32 bytes)",
      }),
    OPENAI_API_KEY: z.string().min(1),
    OPENAI_CHAT_MODEL: z.string().min(1).default("gpt-4o-mini"),
    OPENAI_STT_MODEL: z.string().min(1).default("gpt-4o-mini-transcribe"),
    OPENAI_TTS_MODEL: z.string().min(1).default("gpt-4o-mini-tts"),
    OPENAI_TTS_VOICE: z.string().min(1).default("alloy"),
    LLM_PROVIDER: z.enum(LLM_PROVIDERS).default("openai"),
    MONGODB_URI: z
      .string()
      .regex(/^mongodb(\+srv)?:\/\//, "must start with mongodb:// or mongodb+srv://"),
    MONGODB_DB: z.string().min(1).default("tabletalk"),
    RESTAURANT_NAME: z.string().min(1).default("TableTalk"),
    RESTAURANT_TIMEZONE: z.string().min(1).default("Europe/London").refine(isValidTimeZone, {
      message: "must be a valid IANA time zone such as Europe/London",
    }),
    OPEN_HOUR: hour.default(11),
    CLOSE_HOUR: hour.default(23),
    TOTAL_TABLES: z.coerce.number().int().min(1).max(1000).default(10),
    LOG_LEVEL: z.enum(LOG_LEVELS).default("info"),
  })
  .refine((env) => env.OPEN_HOUR < env.CLOSE_HOUR, {
    message: "OPEN_HOUR must be earlier than CLOSE_HOUR",
    path: ["CLOSE_HOUR"],
  });

export interface SlotRules {
  /** First slot starts at this hour (24h clock). */
  openHour: number;
  /** The restaurant closes at this hour; the last slot starts one hour earlier. */
  closeHour: number;
  /** Tables available in every one-hour slot. */
  totalTables: number;
  /** Bookings further ahead than this are refused. */
  maxDaysAhead: number;
}

export interface AppConfig {
  server: { port: number; publicBaseUrl: string; logLevel: LogLevel };
  telnyx: { apiKey: string; publicKey: string; mediaStreamUrl: string };
  openai: { apiKey: string; chatModel: string; sttModel: string; ttsModel: string; ttsVoice: string };
  llm: { provider: LlmProvider };
  mongo: { uri: string; dbName: string };
  restaurant: { name: string; timeZone: string; rules: SlotRules };
}

/** Turns the public http(s) base URL into the ws(s):// URL Telnyx should stream media to. */
export function mediaStreamUrlFor(publicBaseUrl: string): string {
  const url = new URL("/telnyx/media", publicBaseUrl);
  url.protocol = url.protocol === "http:" ? "ws:" : "wss:";
  return url.toString();
}

export function loadConfig(env: Record<string, string | undefined> = process.env): AppConfig {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    throw new Error(`Invalid environment configuration:\n${z.prettifyError(parsed.error)}`);
  }
  const e = parsed.data;
  return {
    server: { port: e.PORT, publicBaseUrl: e.PUBLIC_BASE_URL, logLevel: e.LOG_LEVEL },
    telnyx: {
      apiKey: e.TELNYX_API_KEY,
      publicKey: e.TELNYX_PUBLIC_KEY,
      mediaStreamUrl: mediaStreamUrlFor(e.PUBLIC_BASE_URL),
    },
    openai: {
      apiKey: e.OPENAI_API_KEY,
      chatModel: e.OPENAI_CHAT_MODEL,
      sttModel: e.OPENAI_STT_MODEL,
      ttsModel: e.OPENAI_TTS_MODEL,
      ttsVoice: e.OPENAI_TTS_VOICE,
    },
    llm: { provider: e.LLM_PROVIDER },
    mongo: { uri: e.MONGODB_URI, dbName: e.MONGODB_DB },
    restaurant: {
      name: e.RESTAURANT_NAME,
      timeZone: e.RESTAURANT_TIMEZONE,
      rules: {
        openHour: e.OPEN_HOUR,
        closeHour: e.CLOSE_HOUR,
        totalTables: e.TOTAL_TABLES,
        maxDaysAhead: MAX_DAYS_AHEAD,
      },
    },
  };
}
