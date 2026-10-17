/**
 * Linear-interpolation resampler for mono PCM16.
 * Good enough for telephone-band speech (8 kHz -> 16 kHz for STT, 24 kHz -> 8 kHz for TTS).
 * When downsampling by an integer factor the input is box-averaged first so
 * high frequencies alias less.
 */

function clampToInt16(value: number): number {
  return Math.max(-32768, Math.min(32767, Math.round(value)));
}

function boxAverage(input: Int16Array, width: number): Int16Array {
  const out = new Int16Array(input.length);
  const half = Math.floor(width / 2);
  for (let i = 0; i < input.length; i++) {
    let sum = 0;
    let count = 0;
    for (let k = -half; k <= half; k++) {
      const index = i + k;
      if (index >= 0 && index < input.length) {
        sum += input[index] ?? 0;
        count++;
      }
    }
    out[i] = clampToInt16(sum / count);
  }
  return out;
}

export function resampleLinear(input: Int16Array, fromRate: number, toRate: number): Int16Array {
  if (fromRate <= 0 || toRate <= 0) throw new RangeError("sample rates must be positive");
  if (fromRate === toRate || input.length === 0) return Int16Array.from(input);

  const ratio = fromRate / toRate;
  const source = ratio > 1 && Number.isInteger(ratio) ? boxAverage(input, ratio) : input;
  const outputLength = Math.round(input.length / ratio);
  const out = new Int16Array(outputLength);
  const last = source.length - 1;

  for (let i = 0; i < outputLength; i++) {
    const position = i * ratio;
    const index = Math.min(Math.floor(position), last);
    const next = Math.min(index + 1, last);
    const fraction = position - index;
    const a = source[index] ?? 0;
    const b = source[next] ?? a;
    out[i] = clampToInt16(a + (b - a) * fraction);
  }
  return out;
}
