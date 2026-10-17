import { describe, expect, it } from "vitest";

import { loadConfig, mediaStreamUrlFor } from "../src/config.js";

const publicKey = Buffer.alloc(32, 7).toString("base64");

const minimalEnv = {
  PUBLIC_BASE_URL: "https://agent.example.com",
  TELNYX_API_KEY: "key",
  TELNYX_PUBLIC_KEY: publicKey,
  OPENAI_API_KEY: "sk-test",
  MONGODB_URI: "mongodb://localhost:27017",
};

describe("loadConfig", () => {
  it("applies defaults and derives the media stream URL", () => {
    const config = loadConfig(minimalEnv);
    expect(config.server.port).toBe(8080);
    expect(config.openai.chatModel).toBe("gpt-4o-mini");
    expect(config.restaurant.rules).toEqual({ openHour: 11, closeHour: 23, totalTables: 10, maxDaysAhead: 90 });
    expect(config.restaurant.timeZone).toBe("Europe/London");
    expect(config.telnyx.mediaStreamUrl).toBe("wss://agent.example.com/telnyx/media");
  });

  it("rejects missing secrets, bad time zones and inverted opening hours", () => {
    expect(() => loadConfig({ ...minimalEnv, OPENAI_API_KEY: undefined })).toThrow(/OPENAI_API_KEY/);
    expect(() => loadConfig({ ...minimalEnv, RESTAURANT_TIMEZONE: "Mars/Olympus" })).toThrow(/time zone/);
    expect(() => loadConfig({ ...minimalEnv, OPEN_HOUR: "20", CLOSE_HOUR: "9" })).toThrow(/OPEN_HOUR/);
    expect(() => loadConfig({ ...minimalEnv, TELNYX_PUBLIC_KEY: "short" })).toThrow(/TELNYX_PUBLIC_KEY/);
  });

  it("maps http to ws for local tunnels", () => {
    expect(mediaStreamUrlFor("http://localhost:8080")).toBe("ws://localhost:8080/telnyx/media");
  });
});
