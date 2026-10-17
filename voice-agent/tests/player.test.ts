import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AudioPlayer } from "../src/call/player.js";
import type { MediaTransport } from "../src/telnyx/mediaStream.js";

function fakeTransport() {
  const sent: Buffer[] = [];
  let clears = 0;
  const transport: MediaTransport = {
    sendAudio: (chunk) => {
      sent.push(chunk);
    },
    clear: () => {
      clears++;
    },
    close: () => undefined,
  };
  return { transport, sent, clears: () => clears };
}

describe("AudioPlayer", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("paces 20 ms chunks in real time with a small lead and pads the last chunk", async () => {
    const { transport, sent } = fakeTransport();
    const player = new AudioPlayer(transport);
    const audio = Buffer.alloc(160 * 20 + 40, 0x55); // 20 full chunks plus a partial one

    const done = player.play(audio);
    expect(player.isPlaying).toBe(true);
    expect(sent).toHaveLength(6); // leadChunks + 1 sent immediately

    await vi.advanceTimersByTimeAsync(100);
    expect(sent).toHaveLength(11);

    await vi.advanceTimersByTimeAsync(21 * 20);
    expect(await done).toBe("completed");
    expect(sent).toHaveLength(21);
    expect(sent.every((chunk) => chunk.length === 160)).toBe(true);
    expect(sent[20]?.subarray(40).every((byte) => byte === 0xff)).toBe(true);
    expect(player.isPlaying).toBe(false);
  });

  it("stop() interrupts playback and asks Telnyx to clear its buffer", async () => {
    const { transport, sent, clears } = fakeTransport();
    const player = new AudioPlayer(transport);

    const done = player.play(Buffer.alloc(160 * 50));
    await vi.advanceTimersByTimeAsync(40);
    player.stop();

    expect(await done).toBe("interrupted");
    expect(clears()).toBe(1);
    const sentSoFar = sent.length;
    await vi.advanceTimersByTimeAsync(500);
    expect(sent).toHaveLength(sentSoFar);
  });

  it("starting new audio interrupts the previous playback", async () => {
    const { transport } = fakeTransport();
    const player = new AudioPlayer(transport);
    const first = player.play(Buffer.alloc(160 * 50));
    const second = player.play(Buffer.alloc(160));
    expect(await first).toBe("interrupted");
    await vi.advanceTimersByTimeAsync(40);
    expect(await second).toBe("completed");
  });
});
