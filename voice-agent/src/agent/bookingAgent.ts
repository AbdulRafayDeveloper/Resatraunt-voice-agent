import type { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
  type AIMessageChunk,
  type BaseMessage,
} from "@langchain/core/messages";
import type { ToolCall } from "@langchain/core/messages/tool";
import type { Runnable } from "@langchain/core/runnables";
import type { StructuredToolInterface, StructuredToolParams } from "@langchain/core/tools";
import { z } from "zod";

import { zonedNow } from "../bookings/dates.js";
import type { BookingStore } from "../bookings/store.js";
import type { NewBooking } from "../bookings/types.js";
import type { SlotRules } from "../config.js";
import { errorMessage, noopLogger, type Logger } from "../logger.js";
import { buildSystemPrompt } from "./prompt.js";
import { createBookingTools } from "./tools.js";

export const END_TURN_TOOL = "end_turn";

const endTurnSchema = z.object({
  reply: z.string().min(1).describe("Exactly what to say to the caller next, as spoken words."),
  endCall: z
    .boolean()
    .describe("true only when you have just said goodbye and the call should be hung up; otherwise false."),
});

const endTurnDefinition: StructuredToolParams = {
  name: END_TURN_TOOL,
  description:
    "Delivers your reply to the caller. Every turn must finish with exactly one end_turn call, made on its own after any other tool results have been read.",
  schema: endTurnSchema,
};

const FALLBACK_REPLY = "Sorry, I did not quite catch that. Could you say it again?";
const DEFAULT_MAX_ITERATIONS = 4;

export interface AgentTurn {
  reply: string;
  endCall: boolean;
  /** Present when the store confirmed a reservation during this turn. */
  booking?: NewBooking;
}

/** What a call session needs from the agent: one spoken reply per caller utterance. */
export interface ConversationAgent {
  respond(userText: string): Promise<AgentTurn>;
}

interface EndTurn {
  reply: string;
  endCall: boolean;
}

export interface BookingAgentOptions {
  model: BaseChatModel;
  tools: StructuredToolInterface[];
  systemPrompt: string;
  /** Hands over the booking reserved since the last turn, if any. */
  takeReservation: () => NewBooking | undefined;
  logger?: Logger;
  maxIterations?: number;
}

/**
 * A controlled tool-calling loop for one phone call. The conversation history
 * lives here; each caller utterance produces one spoken reply and an explicit,
 * machine-readable decision on whether the call should end.
 */
export class BookingAgent implements ConversationAgent {
  private readonly messages: BaseMessage[];
  private readonly runnable: Runnable<BaseLanguageModelInput, AIMessageChunk>;
  private readonly tools: Map<string, StructuredToolInterface>;
  private readonly takeReservation: () => NewBooking | undefined;
  private readonly logger: Logger;
  private readonly maxIterations: number;

  constructor(options: BookingAgentOptions) {
    if (!options.model.bindTools) {
      throw new Error("The configured chat model does not support tool calling");
    }
    this.runnable = options.model.bindTools([...options.tools, endTurnDefinition]);
    this.tools = new Map(options.tools.map((t) => [t.name, t]));
    this.messages = [new SystemMessage(options.systemPrompt)];
    this.takeReservation = options.takeReservation;
    this.logger = options.logger ?? noopLogger;
    this.maxIterations = options.maxIterations ?? DEFAULT_MAX_ITERATIONS;
  }

  get history(): readonly BaseMessage[] {
    return this.messages;
  }

  async respond(userText: string): Promise<AgentTurn> {
    const checkpoint = this.messages.length;
    this.messages.push(new HumanMessage(userText));
    try {
      return await this.runLoop();
    } catch (error) {
      // Leave the history as it was so a failed model call cannot poison the next turn.
      this.messages.length = checkpoint;
      throw error;
    }
  }

  private async runLoop(): Promise<AgentTurn> {
    for (let iteration = 0; iteration < this.maxIterations; iteration++) {
      const ai = await this.runnable.invoke(this.messages);
      const calls = ai.tool_calls ?? [];
      const endTurn = calls.find((call) => call.name === END_TURN_TOOL);
      const work = calls.filter((call) => call.name !== END_TURN_TOOL);

      if (work.length === 0) {
        const turn = endTurn ? parseEndTurn(endTurn) : { reply: ai.text.trim(), endCall: false };
        if (turn) return this.finish(turn);
        this.logger.warn({ iteration }, "model produced neither a reply nor a tool call");
        break;
      }

      this.messages.push(ai);
      for (const [index, call] of work.entries()) {
        this.messages.push(await this.execute(call, `${call.name}-${iteration}-${index}`));
      }
      if (endTurn) {
        this.messages.push(
          new ToolMessage({
            tool_call_id: endTurn.id ?? `${END_TURN_TOOL}-${iteration}`,
            name: END_TURN_TOOL,
            content: "Ignored: call end_turn on its own once you have read the tool results above.",
          }),
        );
      }
    }
    this.logger.warn("agent loop ended without an end_turn; using the fallback reply");
    return this.finish({ reply: FALLBACK_REPLY, endCall: false });
  }

  private finish(turn: EndTurn): AgentTurn {
    this.messages.push(new AIMessage(turn.reply));
    const booking = this.takeReservation();
    return booking ? { ...turn, booking } : turn;
  }

  private async execute(call: ToolCall, fallbackId: string): Promise<ToolMessage> {
    const id = call.id ?? fallbackId;
    const tool = this.tools.get(call.name);
    if (!tool) {
      return new ToolMessage({
        tool_call_id: id,
        name: call.name,
        status: "error",
        content: JSON.stringify({ error: `Unknown tool "${call.name}"` }),
      });
    }
    try {
      const output: unknown = await tool.invoke(call.args);
      const content = typeof output === "string" ? output : JSON.stringify(output);
      this.logger.debug({ tool: call.name, args: call.args, result: content }, "tool call");
      return new ToolMessage({ tool_call_id: id, name: call.name, content });
    } catch (error) {
      this.logger.error({ tool: call.name, err: errorMessage(error) }, "tool call failed");
      return new ToolMessage({
        tool_call_id: id,
        name: call.name,
        status: "error",
        content: JSON.stringify({
          error: "The tool failed. Apologise briefly and ask the caller to try again in a moment.",
        }),
      });
    }
  }
}

function parseEndTurn(call: ToolCall): EndTurn | undefined {
  const parsed = endTurnSchema.safeParse(call.args);
  if (!parsed.success) return undefined;
  const reply = parsed.data.reply.trim();
  return reply ? { reply, endCall: parsed.data.endCall } : undefined;
}

export interface CreateBookingAgentOptions {
  model: BaseChatModel;
  store: BookingStore;
  restaurant: { name: string; timeZone: string; rules: SlotRules };
  now?: () => Date;
  callControlId?: string;
  logger?: Logger;
}

/** Wires prompt, tools and store together for one call. */
export function createBookingAgent(options: CreateBookingAgentOptions): BookingAgent {
  const now = options.now ?? (() => new Date());
  let reserved: NewBooking | undefined;

  const tools = createBookingTools({
    store: options.store,
    rules: options.restaurant.rules,
    timeZone: options.restaurant.timeZone,
    now,
    ...(options.callControlId ? { callControlId: options.callControlId } : {}),
    onReserved: (booking) => {
      reserved = booking;
    },
  });

  const systemPrompt = buildSystemPrompt({
    restaurantName: options.restaurant.name,
    timeZone: options.restaurant.timeZone,
    clock: zonedNow(now(), options.restaurant.timeZone),
    rules: options.restaurant.rules,
  });

  return new BookingAgent({
    model: options.model,
    tools,
    systemPrompt,
    takeReservation: () => {
      const booking = reserved;
      reserved = undefined;
      return booking;
    },
    ...(options.logger ? { logger: options.logger } : {}),
  });
}
