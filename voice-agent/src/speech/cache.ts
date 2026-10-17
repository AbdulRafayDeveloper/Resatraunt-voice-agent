import type { TextToSpeech } from "./types.js";

/**
 * Remembers synthesised audio for recently spoken phrases, so fixed lines such as
 * the greeting and "Are you still there?" cost one API call per process rather
 * than one per call. Oldest entries are evicted once the cache is full.
 */
export function withPhraseCache(inner: TextToSpeech, maxEntries = 64): TextToSpeech {
  const cache = new Map<string, Promise<Buffer>>();

  return {
    synthesise(text) {
      const cached = cache.get(text);
      if (cached) return cached;

      const pending = inner.synthesise(text).catch((error: unknown) => {
        cache.delete(text);
        throw error;
      });
      cache.set(text, pending);
      if (cache.size > maxEntries) {
        const oldest = cache.keys().next().value;
        if (oldest !== undefined) cache.delete(oldest);
      }
      return pending;
    },
  };
}
