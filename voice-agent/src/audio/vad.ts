import { concatPcm16, rms } from "./pcm.js";

/**
 * Energy-based voice activity detector.
 *
 * Audio is cut into fixed frames; a frame is active when its RMS exceeds a
 * threshold derived from an adaptive noise floor. Speech starts after enough
 * consecutive active frames and an utterance ends after enough silence (or at
 * the maximum length). Complete utterances are emitted as PCM16 buffers that
 * include a little pre-roll so the first syllable is not clipped.
 */

export interface VadOptions {
  sampleRate: number;
  frameMs: number;
  speechStartMs: number;
  silenceEndMs: number;
  maxUtteranceMs: number;
  preRollMs: number;
  /** Absolute RMS below which nothing counts as speech. */
  minRms: number;
  /** Speech must be this many times louder than the noise floor. */
  noiseRatio: number;
  initialNoiseFloor: number;
  /** The noise floor never adapts above this, so steady loud noise cannot mask speech. */
  maxNoiseFloor: number;
  /** Exponential smoothing factor for noise floor adaptation during silence. */
  noiseAdaptation: number;
}

export const DEFAULT_VAD_OPTIONS: VadOptions = {
  sampleRate: 16000,
  frameMs: 20,
  speechStartMs: 200,
  silenceEndMs: 700,
  maxUtteranceMs: 15000,
  preRollMs: 240,
  minRms: 500,
  noiseRatio: 2.5,
  initialNoiseFloor: 150,
  maxNoiseFloor: 2000,
  noiseAdaptation: 0.05,
};

export type VadEvent =
  | { type: "speech_start" }
  | { type: "utterance"; audio: Int16Array; durationMs: number };

export class VoiceActivityDetector {
  private readonly options: VadOptions;
  private readonly frameSamples: number;
  private readonly startFrames: number;
  private readonly endFrames: number;
  private readonly maxFrames: number;
  private readonly preRollFrames: number;

  private pending: Int16Array = new Int16Array(0);
  private noiseFloor: number;
  private speaking = false;
  private speechRun = 0;
  private silenceRun = 0;
  private recent: Int16Array[] = [];
  private utterance: Int16Array[] = [];

  constructor(options: Partial<VadOptions> = {}) {
    this.options = { ...DEFAULT_VAD_OPTIONS, ...options };
    const { sampleRate, frameMs } = this.options;
    this.frameSamples = Math.round((sampleRate * frameMs) / 1000);
    this.startFrames = Math.max(1, Math.ceil(this.options.speechStartMs / frameMs));
    this.endFrames = Math.max(1, Math.ceil(this.options.silenceEndMs / frameMs));
    this.maxFrames = Math.max(this.startFrames, Math.ceil(this.options.maxUtteranceMs / frameMs));
    this.preRollFrames = Math.ceil(this.options.preRollMs / frameMs);
    this.noiseFloor = this.options.initialNoiseFloor;
  }

  get isSpeaking(): boolean {
    return this.speaking;
  }

  reset(): void {
    this.pending = new Int16Array(0);
    this.speaking = false;
    this.speechRun = 0;
    this.silenceRun = 0;
    this.recent = [];
    this.utterance = [];
  }

  /** Feeds PCM16 samples at the configured sample rate and returns the events they completed. */
  push(samples: Int16Array): VadEvent[] {
    const events: VadEvent[] = [];
    const buffer = concatPcm16([this.pending, samples]);
    let offset = 0;
    while (buffer.length - offset >= this.frameSamples) {
      const frame = buffer.slice(offset, offset + this.frameSamples);
      offset += this.frameSamples;
      this.processFrame(frame, events);
    }
    this.pending = buffer.slice(offset);
    return events;
  }

  private threshold(): number {
    return Math.max(this.options.minRms, this.noiseFloor * this.options.noiseRatio);
  }

  private processFrame(frame: Int16Array, events: VadEvent[]): void {
    const level = rms(frame);
    const active = level > this.threshold();

    if (!this.speaking) {
      this.recent.push(frame);
      const keep = this.preRollFrames + this.startFrames;
      if (this.recent.length > keep) this.recent.splice(0, this.recent.length - keep);

      if (active) {
        this.speechRun++;
        if (this.speechRun >= this.startFrames) {
          this.speaking = true;
          this.silenceRun = 0;
          this.utterance = this.recent;
          this.recent = [];
          events.push({ type: "speech_start" });
        }
      } else {
        this.speechRun = 0;
        this.adaptNoiseFloor(level);
      }
      return;
    }

    this.utterance.push(frame);
    this.silenceRun = active ? 0 : this.silenceRun + 1;

    if (this.silenceRun >= this.endFrames || this.utterance.length >= this.maxFrames) {
      events.push(this.finishUtterance());
    }
  }

  private finishUtterance(): VadEvent {
    const audio = concatPcm16(this.utterance);
    this.utterance = [];
    this.speaking = false;
    this.speechRun = 0;
    this.silenceRun = 0;
    return {
      type: "utterance",
      audio,
      durationMs: (audio.length / this.options.sampleRate) * 1000,
    };
  }

  private adaptNoiseFloor(level: number): void {
    const { noiseAdaptation, maxNoiseFloor } = this.options;
    const next = this.noiseFloor + (level - this.noiseFloor) * noiseAdaptation;
    this.noiseFloor = Math.min(maxNoiseFloor, Math.max(1, next));
  }
}
