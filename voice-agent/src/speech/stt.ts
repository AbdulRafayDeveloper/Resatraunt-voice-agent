import { toFile, type OpenAI } from "openai";

import { pcm16ToWav } from "../audio/wav.js";
import { STT_SAMPLE_RATE, type SpeechToText } from "./types.js";

/** Nudges the recogniser towards the vocabulary of a booking call. */
const CONTEXT_PROMPT = "A phone call booking a restaurant table: a name, the number of people, a day and a time.";

export function createOpenAiSpeechToText(client: OpenAI, model: string): SpeechToText {
  return {
    async transcribe(pcm16k) {
      const wav = pcm16ToWav(pcm16k, STT_SAMPLE_RATE);
      const file = await toFile(wav, "utterance.wav", { type: "audio/wav" });
      const result = await client.audio.transcriptions.create({
        file,
        model,
        language: "en",
        prompt: CONTEXT_PROMPT,
        response_format: "json",
      });
      return result.text.trim();
    },
  };
}
