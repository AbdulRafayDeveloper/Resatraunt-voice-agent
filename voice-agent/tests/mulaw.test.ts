import { describe, expect, it } from "vitest";

import { decodeMuLaw, decodeMuLawSample, encodeMuLaw, encodeMuLawSample, MULAW_SILENCE } from "../src/audio/mulaw.js";

describe("mu-law codec", () => {
  it("encodes silence to 0xFF and decodes it back to zero", () => {
    expect(encodeMuLawSample(0)).toBe(MULAW_SILENCE);
    expect(decodeMuLawSample(MULAW_SILENCE)).toBe(0);
  });

  it("round-trips samples within the quantisation step of their segment", () => {
    for (let sample = -32768; sample < 32768; sample += 97) {
      const decoded = decodeMuLawSample(encodeMuLawSample(sample));
      const magnitude = Math.min(Math.abs(sample), 32635);
      // Step size doubles per segment; the largest segment quantises in steps of 1024.
      const step = magnitude < 256 ? 8 : 2 ** (Math.floor(Math.log2(magnitude + 132)) - 4);
      expect(Math.abs(decoded - sample)).toBeLessThanOrEqual(step + 132);
    }
  });

  it("preserves sign and ordering", () => {
    expect(decodeMuLawSample(encodeMuLawSample(8000))).toBeGreaterThan(0);
    expect(decodeMuLawSample(encodeMuLawSample(-8000))).toBeLessThan(0);
    expect(decodeMuLawSample(encodeMuLawSample(20000))).toBeGreaterThan(decodeMuLawSample(encodeMuLawSample(2000)));
  });

  it("decode(encode(buffer)) keeps the length and shape of a tone", () => {
    const samples = new Int16Array(800);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.round(8000 * Math.sin((2 * Math.PI * 440 * i) / 8000));
    const encoded = encodeMuLaw(samples);
    expect(encoded.length).toBe(samples.length);
    const decoded = decodeMuLaw(encoded);
    expect(decoded.length).toBe(samples.length);
    let maxError = 0;
    for (let i = 0; i < samples.length; i++) {
      maxError = Math.max(maxError, Math.abs((decoded[i] ?? 0) - (samples[i] ?? 0)));
    }
    expect(maxError).toBeLessThan(600);
  });
});
