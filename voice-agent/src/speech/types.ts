/** Speech-to-text: takes a complete utterance as PCM16 at 16 kHz and returns the transcript. */
export interface SpeechToText {
  transcribe(pcm16k: Int16Array): Promise<string>;
}

/** Text-to-speech: returns the spoken text as mu-law bytes at 8 kHz, ready for the call. */
export interface TextToSpeech {
  synthesise(text: string): Promise<Buffer>;
}

export const STT_SAMPLE_RATE = 16000;
export const TELEPHONY_SAMPLE_RATE = 8000;
