import type { OpenAI } from "openai";

import { encodeMuLaw } from "../audio/mulaw.js";
import { bufferToPcm16 } from "../audio/pcm.js";
import { resampleLinear } from "../audio/resample.js";
import { TELEPHONY_SAMPLE_RATE, type TextToSpeech } from "./types.js";

/** The OpenAI speech endpoint returns raw PCM16 mono at this rate when response_format is "pcm". */
const OPENAI_PCM_SAMPLE_RATE = 24000;

export interface OpenAiTtsOptions {
  model: string;
  voice: string;
}

export function createOpenAiTextToSpeech(client: OpenAI, options: OpenAiTtsOptions): TextToSpeech {
  return {
    async synthesise(text) {
      const response = await client.audio.speech.create({
        model: options.model,
        voice: options.voice,
        input: text,
        response_format: "pcm",
      });
      const pcm24k = bufferToPcm16(Buffer.from(await response.arrayBuffer()));
      const pcm8k = resampleLinear(pcm24k, OPENAI_PCM_SAMPLE_RATE, TELEPHONY_SAMPLE_RATE);
      return encodeMuLaw(pcm8k);
    },
  };
}
