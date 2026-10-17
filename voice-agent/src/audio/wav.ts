import { pcm16ToBuffer } from "./pcm.js";

const HEADER_BYTES = 44;

/** Wraps PCM16 samples in a RIFF/WAVE container (what the OpenAI transcription API accepts). */
export function pcm16ToWav(samples: Int16Array, sampleRate: number, channels = 1): Buffer {
  const data = pcm16ToBuffer(samples);
  const bytesPerSample = 2;
  const blockAlign = channels * bytesPerSample;
  const header = Buffer.alloc(HEADER_BYTES);

  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(HEADER_BYTES - 8 + data.length, 4);
  header.write("WAVE", 8, "ascii");
  header.write("fmt ", 12, "ascii");
  header.writeUInt32LE(16, 16); // size of the PCM format chunk
  header.writeUInt16LE(1, 20); // audio format 1 = PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * blockAlign, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bytesPerSample * 8, 34);
  header.write("data", 36, "ascii");
  header.writeUInt32LE(data.length, 40);

  return Buffer.concat([header, data]);
}
