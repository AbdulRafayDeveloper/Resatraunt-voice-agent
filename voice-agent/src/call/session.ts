import type { AgentTurn, ConversationAgent } from "../agent/bookingAgent.js";
import { decodeMuLaw } from "../audio/mulaw.js";
import { resampleLinear } from "../audio/resample.js";
import { VoiceActivityDetector, type VadEvent } from "../audio/vad.js";
import { errorMessage, type Logger } from "../logger.js";
import { STT_SAMPLE_RATE, TELEPHONY_SAMPLE_RATE, type SpeechToText, type TextToSpeech } from "../speech/types.js";
import type { TelnyxCallControl } from "../telnyx/client.js";
import type { MediaTransport } from "../telnyx/mediaStream.js";
import { AudioPlayer, type PlaybackResult } from "./player.js";

export type EndReason =
  | "hangup"
  | "stream_stopped"
  | "socket_closed"
  | "agent_end"
  | "idle"
  | "timeout"
  | "error"
  | "replaced"
  | "shutdown";

export interface CallPhrases {
  greeting: string;
  stillThere: string;
  apology: string;
  timeout: string;
  idleGoodbye: string;
}

export interface CallLimits {
  maxCallMs: number;
  idleMs: number;
  maxIdlePrompts: number;
}

export const DEFAULT_CALL_LIMITS: CallLimits = {
  maxCallMs: 6 * 60_000,
  idleMs: 8_000,
  maxIdlePrompts: 2,
};

export function defaultPhrases(restaurantName: string): CallPhrases {
  return {
    greeting: `Thanks for calling ${restaurantName}. I can book a table for you. What name should I put it under?`,
    stillThere: "Are you still there?",
    apology: "Sorry, I had a problem with that. Could you say it again?",
    timeout: "I'm sorry, we have run out of time on this call. Please call back to finish your booking. Goodbye.",
    idleGoodbye: "I haven't heard anything, so I'll let you go. Please call back whenever you like. Goodbye.",
  };
}

export interface CallSessionDeps {
  callControlId: string;
  transport: MediaTransport;
  stt: SpeechToText;
  tts: TextToSpeech;
  agent: ConversationAgent;
  telnyx: TelnyxCallControl;
  logger: Logger;
  phrases: CallPhrases;
  limits?: Partial<CallLimits>;
  vad?: VoiceActivityDetector;
}

type SpeakOutcome = PlaybackResult | "failed" | "skipped";

/**
 * Orchestrates one phone call: greeting, caller audio -> VAD -> STT -> agent ->
 * TTS -> call, with barge-in, idle prompts, a hard call timeout and polite
 * recovery when a speech or model request fails.
 */
export class CallSession {
  readonly callControlId: string;
  readonly whenEnded: Promise<void>;

  private readonly deps: CallSessionDeps;
  private readonly limits: CallLimits;
  private readonly log: Logger;
  private readonly player: AudioPlayer;
  private readonly vad: VoiceActivityDetector;
  private resolveEnded: () => void = () => undefined;
  private ended = false;
  private hangingUp = false;
  private callTimer: NodeJS.Timeout | undefined;
  private idleTimer: NodeJS.Timeout | undefined;
  private idlePrompts = 0;
  private turnChain: Promise<void> = Promise.resolve();
  private turnCount = 0;

  constructor(deps: CallSessionDeps) {
    this.deps = deps;
    this.callControlId = deps.callControlId;
    this.limits = { ...DEFAULT_CALL_LIMITS, ...deps.limits };
    this.log = deps.logger.child({ callControlId: deps.callControlId });
    this.player = new AudioPlayer(deps.transport);
    this.vad = deps.vad ?? new VoiceActivityDetector({ sampleRate: STT_SAMPLE_RATE });
    this.whenEnded = new Promise((resolve) => {
      this.resolveEnded = resolve;
    });
  }

  get isEnded(): boolean {
    return this.ended;
  }

  start(): void {
    this.callTimer = setTimeout(() => void this.onCallTimeout(), this.limits.maxCallMs);
    void this.speakAndListen(this.deps.phrases.greeting);
  }

  /** Feeds caller audio (mu-law, 8 kHz) from the media stream. */
  handleInboundAudio(mulaw: Buffer): void {
    if (this.ended) return;
    const pcm16k = resampleLinear(decodeMuLaw(mulaw), TELEPHONY_SAMPLE_RATE, STT_SAMPLE_RATE);
    for (const event of this.vad.push(pcm16k)) {
      if (event.type === "speech_start") this.onSpeechStart();
      else this.enqueueUtterance(event);
    }
  }

  /** Hangs up through Telnyx and ends the session. */
  async hangUp(reason: EndReason): Promise<void> {
    if (this.ended || this.hangingUp) return;
    this.hangingUp = true;
    await this.deps.telnyx.hangup(this.callControlId);
    this.end(reason);
  }

  /** Ends the session locally (the call is already gone or being torn down). Safe to call twice. */
  end(reason: EndReason): void {
    if (this.ended) return;
    this.ended = true;
    if (this.callTimer) clearTimeout(this.callTimer);
    this.clearIdleTimer();
    this.player.dispose();
    this.deps.transport.close();
    this.log.info({ reason, turns: this.turnCount }, "call session ended");
    this.resolveEnded();
  }

  private onSpeechStart(): void {
    this.clearIdleTimer();
    this.idlePrompts = 0;
    if (this.player.isPlaying) {
      this.log.debug("caller barged in; stopping playback");
      this.player.stop();
    }
  }

  private enqueueUtterance(event: Extract<VadEvent, { type: "utterance" }>): void {
    this.turnChain = this.turnChain
      .then(() => this.handleUtterance(event))
      .catch((error: unknown) => this.log.error({ err: errorMessage(error) }, "unhandled error in turn"));
  }

  private async handleUtterance(event: Extract<VadEvent, { type: "utterance" }>): Promise<void> {
    if (this.ended || this.hangingUp) return;
    const turn = ++this.turnCount;
    const log = this.log.child({ turn });

    let transcript: string;
    try {
      transcript = await this.deps.stt.transcribe(event.audio);
    } catch (error) {
      log.error({ err: errorMessage(error) }, "speech-to-text failed");
      await this.recover();
      return;
    }
    if (this.ended) return;
    if (!transcript) {
      log.debug({ durationMs: Math.round(event.durationMs) }, "utterance produced no transcript");
      this.armIdleTimer();
      return;
    }
    log.info({ transcript, durationMs: Math.round(event.durationMs) }, "caller said");

    let reply: AgentTurn;
    try {
      reply = await this.deps.agent.respond(transcript);
    } catch (error) {
      log.error({ err: errorMessage(error) }, "agent failed");
      await this.recover();
      return;
    }
    log.info(
      {
        reply: reply.reply,
        endCall: reply.endCall,
        ...(reply.booking
          ? { booking: { date: reply.booking.date, hour: reply.booking.hour, partySize: reply.booking.partySize } }
          : {}),
      },
      "agent replied",
    );

    const outcome = await this.speak(reply.reply);
    if (outcome === "failed") {
      await this.recover();
      return;
    }
    if (outcome === "completed" && reply.endCall) {
      await this.hangUp("agent_end");
      return;
    }
    if (outcome === "completed") this.armIdleTimer();
  }

  /** Apologises and keeps listening; hangs up if even that cannot be spoken. */
  private async recover(): Promise<void> {
    const outcome = await this.speak(this.deps.phrases.apology);
    if (outcome === "failed") {
      this.log.error("could not speak the apology; hanging up");
      await this.hangUp("error");
      return;
    }
    if (outcome === "completed") this.armIdleTimer();
  }

  private async speak(text: string): Promise<SpeakOutcome> {
    if (this.ended) return "skipped";
    let audio: Buffer;
    try {
      audio = await this.deps.tts.synthesise(text);
    } catch (error) {
      this.log.error({ err: errorMessage(error) }, "text-to-speech failed");
      return "failed";
    }
    if (this.ended) return "skipped";
    return this.player.play(audio);
  }

  private async speakAndListen(text: string): Promise<void> {
    const outcome = await this.speak(text);
    if (outcome === "failed") await this.hangUp("error");
    else if (outcome === "completed") this.armIdleTimer();
  }

  private armIdleTimer(): void {
    this.clearIdleTimer();
    if (this.ended) return;
    this.idleTimer = setTimeout(() => void this.onIdle(), this.limits.idleMs);
  }

  private clearIdleTimer(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = undefined;
  }

  private async onIdle(): Promise<void> {
    if (this.ended || this.hangingUp) return;
    if (this.vad.isSpeaking) {
      this.armIdleTimer();
      return;
    }
    this.idlePrompts++;
    if (this.idlePrompts > this.limits.maxIdlePrompts) {
      this.log.info("caller silent after idle prompts; ending call");
      await this.speak(this.deps.phrases.idleGoodbye);
      await this.hangUp("idle");
      return;
    }
    this.log.info({ prompt: this.idlePrompts }, "caller idle; prompting");
    await this.speakAndListen(this.deps.phrases.stillThere);
  }

  private async onCallTimeout(): Promise<void> {
    if (this.ended || this.hangingUp) return;
    this.log.warn("call reached the maximum duration");
    this.player.stop();
    await this.speak(this.deps.phrases.timeout);
    await this.hangUp("timeout");
  }
}
