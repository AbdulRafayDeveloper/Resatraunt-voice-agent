/**
 * G.711 mu-law codec (the PCMU format Telnyx media streams carry).
 * Encodes 16-bit linear PCM to 8-bit mu-law and back.
 */

const BIAS = 0x84;
const CLIP = 32635;

/** The mu-law byte that represents digital silence. */
export const MULAW_SILENCE = 0xff;

export function encodeMuLawSample(sample: number): number {
  let value = sample;
  const sign = (value >> 8) & 0x80;
  if (sign !== 0) value = -value;
  if (value > CLIP) value = CLIP;
  value += BIAS;

  // Position of the highest set bit decides the exponent (segment).
  let exponent = 7;
  let mask = 0x4000;
  while ((value & mask) === 0 && exponent > 0) {
    exponent--;
    mask >>= 1;
  }
  const mantissa = (value >> (exponent + 3)) & 0x0f;
  return ~(sign | (exponent << 4) | mantissa) & 0xff;
}

export function decodeMuLawSample(byte: number): number {
  const value = ~byte & 0xff;
  const sign = value & 0x80;
  const exponent = (value >> 4) & 0x07;
  const mantissa = value & 0x0f;
  const magnitude = (((mantissa << 3) + BIAS) << exponent) - BIAS;
  return sign !== 0 ? -magnitude : magnitude;
}

export function encodeMuLaw(samples: Int16Array): Buffer {
  const out = Buffer.alloc(samples.length);
  for (let i = 0; i < samples.length; i++) {
    out[i] = encodeMuLawSample(samples[i] ?? 0);
  }
  return out;
}

export function decodeMuLaw(bytes: Buffer): Int16Array {
  const out = new Int16Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    out[i] = decodeMuLawSample(bytes[i] ?? MULAW_SILENCE);
  }
  return out;
}
