import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { AgentTurn, ConversationAgent } from "../src/agent/bookingAgent.js";
import { encodeMuLaw } from "../src/audio/mulaw.js";
import { CallSession, defaultPhrases, type CallLimits } from "../src/call/session.js";
import { noopLogger } from "../src/logger.js";
import type { SpeechToText, TextToSpeech } from "../src/speech/types.js";
import type { TelnyxCallControl } from "../src/telnyx/client.js";
import type { MediaTransport } from "../src/telnyx/mediaStream.js";

const RATE = 8000;

function mulawTone(seconds: number): Buffer {
  const samples = new Int16Array(Math.round(RATE * seconds));
  for (let i = 0; i < samples.length; i++) samples[i] = Math.round(6000 * Math.sin((2 * Math.PI * 300 * i) / RATE));
  return encodeMuLaw(samples);
}

function mulawSilence(seconds: number): Buffer {
  return Buffer.alloc(Math.round(RATE * seconds), 0xff);
}

interface Harness {
  session: CallSession;
  sent: () => number;
  clears: () => number;
  hungUp: string[];
  spoken: string[];
  transcribed: number;
  feed: (audio: Buffer) => void;
}

function harness(
  turns: AgentTurn[],
  options: { sttFails?: boolean; limits?: Partial<CallLimits> } = {},
): Harness {
  let sent = 0;
  let clears = 0;
  const hungUp: string[] = [];
  const spoken: string[] = [];
  const state = { transcribed: 0 };

  const transport: MediaTransport = {
    sendAudio: () => {
      sent++;
    },
    clear: () => {
      clears++;
    },
    close: () => undefined,
  };
  const stt: SpeechToText = {
    transcribe: () => {
      state.transcribed++;
      return options.sttFails ? Promise.reject(new Error("stt down")) : Promise.resolve("A table for four please");
    },
  };
  const tts: TextToSpeech = {
    synthesise: (text) => {
      spoken.push(text);
      return Promise.resolve(Buffer.alloc(160 * 5, 0xff)); // 100 ms of audio
    },
  };
  const agent: ConversationAgent = {
    respond: () => {
      const turn = turns.shift();
      return turn ? Promise.resolve(turn) : Promise.reject(new Error("no scripted turn"));
    },
  };
  const telnyx: TelnyxCallControl = {
    answer: () => Promise.resolve(true),
    hangup: (id) => {
      hungUp.push(id);
      return Promise.resolve(true);
    },
  };

  const session = new CallSession({
    callControlId: "cc-1",
    transport,
    stt,
    tts,
    agent,
    telnyx,
    logger: noopLogger,
    phrases: defaultPhrases("TableTalk"),
    limits: { idleMs: 2000, maxIdlePrompts: 1, maxCallMs: 60_000, ...options.limits },
  });

  const feed = (audio: Buffer): void => {
    for (let offset = 0; offset < audio.length; offset += 160) {
      session.handleInboundAudio(audio.subarray(offset, offset + 160));
    }
  };

  return {
    session,
    sent: () => sent,
    clears: () => clears,
    hungUp,
    spoken,
    get transcribed() {
      return state.transcribed;
    },
    feed,
  };
}

describe("CallSession", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("greets, transcribes an utterance, speaks the reply and hangs up when the agent ends the call", async () => {
    const h = harness([{ reply: "Booked. Goodbye!", endCall: true }]);
    h.session.start();
    await vi.advanceTimersByTimeAsync(200);
    expect(h.spoken[0]).toMatch(/Thanks for calling TableTalk/);
    expect(h.sent()).toBe(5);

    h.feed(mulawTone(1));
    h.feed(mulawSilence(1));
    await vi.advanceTimersByTimeAsync(300);

    expect(h.transcribed).toBe(1);
    expect(h.spoken[1]).toBe("Booked. Goodbye!");
    expect(h.hungUp).toEqual(["cc-1"]);
    expect(h.session.isEnded).toBe(true);
  });

  it("stops playback and clears the Telnyx buffer when the caller barges in", async () => {
    const h = harness([{ reply: "Sure.", endCall: false }]);
    h.session.start();
    await vi.advanceTimersByTimeAsync(10); // greeting is mid-playback
    h.feed(mulawTone(0.5));
    expect(h.clears()).toBe(1);
    h.session.end("hangup");
  });

  it("prompts after silence and then says goodbye", async () => {
    const h = harness([]);
    h.session.start();
    await vi.advanceTimersByTimeAsync(2500);
    expect(h.spoken).toContain("Are you still there?");
    await vi.advanceTimersByTimeAsync(2500);
    expect(h.spoken.at(-1)).toMatch(/Goodbye/);
    expect(h.hungUp).toEqual(["cc-1"]);
  });

  it("apologises and keeps going when speech-to-text fails", async () => {
    const h = harness([], { sttFails: true });
    h.session.start();
    await vi.advanceTimersByTimeAsync(200);
    h.feed(mulawTone(1));
    h.feed(mulawSilence(1));
    await vi.advanceTimersByTimeAsync(300);
    expect(h.spoken.at(-1)).toMatch(/Sorry/);
    expect(h.session.isEnded).toBe(false);
    h.session.end("hangup");
  });

  it("ends the call at the maximum duration", async () => {
    const h = harness([], { limits: { idleMs: 30_000, maxCallMs: 5_000 } });
    h.session.start();
    await vi.advanceTimersByTimeAsync(6_000);
    expect(h.spoken.at(-1)).toMatch(/run out of time/);
    expect(h.hungUp).toEqual(["cc-1"]);
  });
});
