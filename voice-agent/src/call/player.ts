import { MULAW_SILENCE } from "../audio/mulaw.js";
import type { MediaTransport } from "../telnyx/mediaStream.js";

export type PlaybackResult = "completed" | "interrupted";

export interface PlayerOptions {
  /** Bytes per outbound chunk; 160 bytes of mu-law at 8 kHz is 20 ms. */
  chunkBytes: number;
  chunkMs: number;
  /** How many chunks to send ahead of real time so the far end never starves. */
  leadChunks: number;
}

export const DEFAULT_PLAYER_OPTIONS: PlayerOptions = { chunkBytes: 160, chunkMs: 20, leadChunks: 5 };

interface Playback {
  resolve: (result: PlaybackResult) => void;
  timer: NodeJS.Timeout | undefined;
}

function splitIntoChunks(mulaw: Buffer, chunkBytes: number): Buffer[] {
  const chunks: Buffer[] = [];
  for (let offset = 0; offset < mulaw.length; offset += chunkBytes) {
    const chunk = mulaw.subarray(offset, offset + chunkBytes);
    chunks.push(
      chunk.length === chunkBytes
        ? chunk
        : Buffer.concat([chunk, Buffer.alloc(chunkBytes - chunk.length, MULAW_SILENCE)]),
    );
  }
  return chunks;
}

/**
 * Paces mu-law audio onto the call in real time (20 ms chunks) so that a `clear`
 * on barge-in actually stops playback instead of leaving seconds of audio queued
 * at Telnyx.
 */
export class AudioPlayer {
  private readonly options: PlayerOptions;
  private current: Playback | undefined;

  constructor(
    private readonly transport: MediaTransport,
    options: Partial<PlayerOptions> = {},
  ) {
    this.options = { ...DEFAULT_PLAYER_OPTIONS, ...options };
  }

  get isPlaying(): boolean {
    return this.current !== undefined;
  }

  /** Starts playing, interrupting anything already playing. Resolves when the audio has finished or was stopped. */
  play(mulaw: Buffer): Promise<PlaybackResult> {
    this.stop();
    const { chunkMs, leadChunks } = this.options;
    const chunks = splitIntoChunks(mulaw, this.options.chunkBytes);
    if (chunks.length === 0) return Promise.resolve("completed");

    return new Promise((resolve) => {
      const playback: Playback = { resolve, timer: undefined };
      this.current = playback;
      const startedAt = Date.now();
      let sent = 0;

      const tick = (): void => {
        if (this.current !== playback) return;
        const elapsed = Date.now() - startedAt;
        const due = Math.min(chunks.length, Math.floor(elapsed / chunkMs) + leadChunks + 1);
        while (sent < due) {
          this.transport.sendAudio(chunks[sent] ?? Buffer.alloc(0));
          sent++;
        }
        if (sent >= chunks.length) {
          const finishesAt = startedAt + chunks.length * chunkMs;
          playback.timer = setTimeout(() => this.finish(playback, "completed"), Math.max(0, finishesAt - Date.now()));
          return;
        }
        playback.timer = setTimeout(tick, chunkMs);
      };
      tick();
    });
  }

  /** Interrupts playback and tells Telnyx to drop buffered audio. */
  stop(): void {
    const playback = this.current;
    if (!playback) return;
    this.finish(playback, "interrupted");
    this.transport.clear();
  }

  /** Interrupts playback without sending `clear` (the stream is already gone). */
  dispose(): void {
    if (this.current) this.finish(this.current, "interrupted");
  }

  private finish(playback: Playback, result: PlaybackResult): void {
    if (this.current !== playback) return;
    if (playback.timer) clearTimeout(playback.timer);
    this.current = undefined;
    playback.resolve(result);
  }
}
