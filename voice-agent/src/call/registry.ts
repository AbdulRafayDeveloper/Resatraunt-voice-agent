import type { Logger } from "../logger.js";
import type { MediaTransport } from "../telnyx/mediaStream.js";
import type { CallSession, EndReason } from "./session.js";

export type SessionFactory = (callControlId: string, transport: MediaTransport) => CallSession;

/** Tracks the live call sessions by Telnyx call_control_id. */
export class CallRegistry {
  private readonly sessions = new Map<string, CallSession>();

  constructor(
    private readonly factory: SessionFactory,
    private readonly logger: Logger,
  ) {}

  get activeCount(): number {
    return this.sessions.size;
  }

  get(callControlId: string): CallSession | undefined {
    return this.sessions.get(callControlId);
  }

  /** Creates and starts a session for a call whose media stream has just begun. */
  start(callControlId: string, transport: MediaTransport): CallSession {
    this.sessions.get(callControlId)?.end("replaced");
    const session = this.factory(callControlId, transport);
    this.sessions.set(callControlId, session);
    void session.whenEnded.then(() => {
      if (this.sessions.get(callControlId) === session) this.sessions.delete(callControlId);
    });
    session.start();
    this.logger.info({ callControlId, activeCalls: this.sessions.size }, "call session started");
    return session;
  }

  end(callControlId: string, reason: EndReason): void {
    this.sessions.get(callControlId)?.end(reason);
  }

  /** Hangs up every live call; used on graceful shutdown. */
  async hangUpAll(reason: EndReason): Promise<void> {
    await Promise.all([...this.sessions.values()].map((session) => session.hangUp(reason)));
  }
}
