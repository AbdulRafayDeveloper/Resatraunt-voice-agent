import { describe, expect, it } from "vitest";

import { concatPcm16 } from "../src/audio/pcm.js";
import { VoiceActivityDetector, type VadEvent } from "../src/audio/vad.js";

const RATE = 16000;

function silence(seconds: number, noise = 40): Int16Array {
  const out = new Int16Array(Math.round(RATE * seconds));
  for (let i = 0; i < out.length; i++) out[i] = Math.round((Math.random() * 2 - 1) * noise);
  return out;
}

function tone(seconds: number, amplitude = 6000): Int16Array {
  const out = new Int16Array(Math.round(RATE * seconds));
  for (let i = 0; i < out.length; i++) out[i] = Math.round(amplitude * Math.sin((2 * Math.PI * 220 * i) / RATE));
  return out;
}

/** Feeds audio in 20 ms pieces, the way it arrives from the call. */
function feed(vad: VoiceActivityDetector, audio: Int16Array, pieceSamples = 320): VadEvent[] {
  const events: VadEvent[] = [];
  for (let offset = 0; offset < audio.length; offset += pieceSamples) {
    events.push(...vad.push(audio.slice(offset, offset + pieceSamples)));
  }
  return events;
}

describe("VoiceActivityDetector", () => {
  it("segments silence / tone / silence into exactly one utterance", () => {
    const vad = new VoiceActivityDetector();
    const events = feed(vad, concatPcm16([silence(1), tone(1), silence(1)]));

    const starts = events.filter((e) => e.type === "speech_start");
    const utterances = events.filter((e) => e.type === "utterance");
    expect(starts).toHaveLength(1);
    expect(utterances).toHaveLength(1);

    const [utterance] = utterances;
    if (utterance?.type !== "utterance") throw new Error("expected an utterance");
    // Tone (1000 ms) plus up to 240 ms pre-roll and the 700 ms end-of-speech silence.
    expect(utterance.durationMs).toBeGreaterThanOrEqual(1000);
    expect(utterance.durationMs).toBeLessThanOrEqual(1000 + 240 + 700 + 40);
    expect(utterance.audio.length).toBe(Math.round((utterance.durationMs * RATE) / 1000));
  });

  it("emits nothing for silence alone", () => {
    const vad = new VoiceActivityDetector();
    expect(feed(vad, silence(3))).toHaveLength(0);
    expect(vad.isSpeaking).toBe(false);
  });

  it("ignores blips shorter than the speech-start window", () => {
    const vad = new VoiceActivityDetector();
    expect(feed(vad, concatPcm16([silence(0.5), tone(0.1), silence(1)]))).toHaveLength(0);
  });

  it("splits very long speech at the maximum utterance length", () => {
    const vad = new VoiceActivityDetector({ maxUtteranceMs: 2000 });
    const events = feed(vad, concatPcm16([silence(0.5), tone(5), silence(1)]));
    const utterances = events.filter((e) => e.type === "utterance");
    expect(utterances.length).toBeGreaterThanOrEqual(2);
    for (const utterance of utterances) {
      if (utterance.type === "utterance") expect(utterance.durationMs).toBeLessThanOrEqual(2000 + 20);
    }
  });

  it("reset() drops partial state", () => {
    const vad = new VoiceActivityDetector();
    feed(vad, concatPcm16([silence(0.5), tone(0.5)]));
    expect(vad.isSpeaking).toBe(true);
    vad.reset();
    expect(vad.isSpeaking).toBe(false);
    expect(feed(vad, silence(1))).toHaveLength(0);
  });
});
