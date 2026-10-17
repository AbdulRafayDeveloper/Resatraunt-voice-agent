import { describe, expect, it } from "vitest";

import { bufferToPcm16, pcm16ToBuffer } from "../src/audio/pcm.js";
import { resampleLinear } from "../src/audio/resample.js";
import { pcm16ToWav } from "../src/audio/wav.js";

function tone(sampleRate: number, seconds: number, frequency: number, amplitude = 8000): Int16Array {
  const out = new Int16Array(Math.round(sampleRate * seconds));
  for (let i = 0; i < out.length; i++) {
    out[i] = Math.round(amplitude * Math.sin((2 * Math.PI * frequency * i) / sampleRate));
  }
  return out;
}

describe("resampleLinear", () => {
  it("doubles the length going from 8 kHz to 16 kHz and interpolates between samples", () => {
    const input = Int16Array.from([0, 1000, 2000, 3000]);
    const output = resampleLinear(input, 8000, 16000);
    expect(output.length).toBe(8);
    expect(output[0]).toBe(0);
    expect(output[1]).toBe(500);
    expect(output[2]).toBe(1000);
  });

  it("divides the length by three going from 24 kHz to 8 kHz", () => {
    const output = resampleLinear(tone(24000, 0.5, 300), 24000, 8000);
    expect(output.length).toBe(4000);
  });

  it("keeps a low-frequency tone's amplitude roughly intact when downsampling", () => {
    const output = resampleLinear(tone(24000, 0.2, 300), 24000, 8000);
    const peak = output.reduce((max, s) => Math.max(max, Math.abs(s)), 0);
    expect(peak).toBeGreaterThan(7000);
    expect(peak).toBeLessThanOrEqual(8000);
  });

  it("returns a copy when the rates are equal", () => {
    const input = Int16Array.from([1, 2, 3]);
    const output = resampleLinear(input, 8000, 8000);
    expect(output).toEqual(input);
    expect(output).not.toBe(input);
  });

  it("rejects non-positive rates", () => {
    expect(() => resampleLinear(new Int16Array(4), 0, 8000)).toThrow(RangeError);
  });
});

describe("pcm helpers and wav", () => {
  it("round-trips PCM16 through a buffer", () => {
    const samples = Int16Array.from([-32768, -1, 0, 1, 32767]);
    expect(bufferToPcm16(pcm16ToBuffer(samples))).toEqual(samples);
  });

  it("writes a 44-byte RIFF header with the right sizes", () => {
    const samples = new Int16Array(100);
    const wav = pcm16ToWav(samples, 16000);
    expect(wav.length).toBe(44 + 200);
    expect(wav.toString("ascii", 0, 4)).toBe("RIFF");
    expect(wav.toString("ascii", 8, 12)).toBe("WAVE");
    expect(wav.readUInt32LE(4)).toBe(36 + 200);
    expect(wav.readUInt16LE(22)).toBe(1);
    expect(wav.readUInt32LE(24)).toBe(16000);
    expect(wav.readUInt32LE(28)).toBe(32000);
    expect(wav.readUInt16LE(34)).toBe(16);
    expect(wav.readUInt32LE(40)).toBe(200);
  });
});
