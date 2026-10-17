/** Little-endian 16-bit PCM helpers shared by the codec, resampler and WAV writer. */

export function bufferToPcm16(buffer: Buffer): Int16Array {
  const sampleCount = Math.floor(buffer.length / 2);
  const samples = new Int16Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    samples[i] = buffer.readInt16LE(i * 2);
  }
  return samples;
}

export function pcm16ToBuffer(samples: Int16Array): Buffer {
  const buffer = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    buffer.writeInt16LE(samples[i] ?? 0, i * 2);
  }
  return buffer;
}

export function concatPcm16(chunks: readonly Int16Array[]): Int16Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Int16Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

/** Root mean square amplitude of a PCM16 frame. */
export function rms(samples: Int16Array): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i] ?? 0;
    sum += s * s;
  }
  return Math.sqrt(sum / samples.length);
}
