import { BaseChatModel, type BindToolsInput } from "@langchain/core/language_models/chat_models";
import { AIMessage, SystemMessage, ToolMessage, type BaseMessage } from "@langchain/core/messages";
import type { ChatResult } from "@langchain/core/outputs";
import { describe, expect, it } from "vitest";

import { createBookingAgent, END_TURN_TOOL } from "../src/agent/bookingAgent.js";
import { MemoryBookingStore } from "../src/bookings/memoryStore.js";
import type { SlotRules } from "../src/config.js";

/** A chat model that replays scripted AI messages and records what it was asked. */
class ScriptedChatModel extends BaseChatModel {
  readonly requests: BaseMessage[][] = [];
  boundTools: BindToolsInput[] = [];

  constructor(private readonly script: AIMessage[]) {
    super({});
  }

  _llmType(): string {
    return "scripted";
  }

  override bindTools(tools: BindToolsInput[]): this {
    this.boundTools = tools;
    return this;
  }

  _generate(messages: BaseMessage[]): Promise<ChatResult> {
    this.requests.push([...messages]);
    const message = this.script.shift();
    if (!message) return Promise.reject(new Error("script exhausted"));
    return Promise.resolve({ generations: [{ message, text: message.text }] });
  }
}

let nextId = 0;
function toolCall(name: string, args: Record<string, unknown>): AIMessage {
  nextId++;
  return new AIMessage({ content: "", tool_calls: [{ name, args, id: `call_${nextId}`, type: "tool_call" }] });
}

function endTurn(reply: string, endCall: boolean): AIMessage {
  return toolCall(END_TURN_TOOL, { reply, endCall });
}

function toolName(tool: BindToolsInput): string | undefined {
  return typeof tool === "object" && tool !== null && "name" in tool && typeof tool.name === "string"
    ? tool.name
    : undefined;
}

const rules: SlotRules = { openHour: 11, closeHour: 23, totalTables: 10, maxDaysAhead: 90 };
const restaurant = { name: "TableTalk", timeZone: "Europe/London", rules };
// Saturday 17 October 2026, 11:00 BST.
const now = () => new Date("2026-10-17T10:00:00Z");

function setup(script: AIMessage[], store = new MemoryBookingStore(rules.totalTables)) {
  const model = new ScriptedChatModel(script);
  const agent = createBookingAgent({ model, store, restaurant, now });
  return { model, agent, store };
}

function lastToolMessage(messages: BaseMessage[]): ToolMessage {
  const message = messages.at(-1);
  if (!(message instanceof ToolMessage)) throw new Error("expected the last message to be a ToolMessage");
  return message;
}

describe("BookingAgent", () => {
  it("binds the booking tools plus end_turn and seeds the system prompt with today's date", () => {
    const { model, agent } = setup([]);
    expect(model.boundTools.map(toolName)).toEqual([
      "check_availability",
      "create_booking",
      "get_current_datetime",
      END_TURN_TOOL,
    ]);
    const [system] = agent.history;
    expect(system).toBeInstanceOf(SystemMessage);
    expect(system?.text).toContain("TableTalk");
    expect(system?.text).toContain("Saturday 17 October (2026-10-17)");
    expect(system?.text).toContain("11 am");
  });

  it("runs a check_availability call, feeds the result back and returns the end_turn reply", async () => {
    const { model, agent } = setup([
      toolCall("check_availability", { date: "2026-10-18", hour: 19 }),
      endTurn("Tomorrow at 7 pm is free. Shall I book it for Sam, four people?", false),
    ]);

    const turn = await agent.respond("Hi, it's Sam, a table for four tomorrow at seven.");

    expect(turn).toEqual({ reply: "Tomorrow at 7 pm is free. Shall I book it for Sam, four people?", endCall: false });
    expect(model.requests).toHaveLength(2);
    const toolResult = JSON.parse(lastToolMessage(model.requests[1] ?? []).text) as Record<string, unknown>;
    expect(toolResult).toMatchObject({ status: "available", booked: 0, tablesLeft: 10, hour: 19 });
    // History ends with the plain spoken reply, ready for the next turn.
    expect(agent.history.at(-1)).toBeInstanceOf(AIMessage);
    expect(agent.history.at(-1)?.text).toBe(turn.reply);
  });

  it("reserves through the store and reports the booking with endCall", async () => {
    const { agent, store } = setup([
      toolCall("create_booking", { name: "Sam", partySize: 4, date: "2026-10-18", hour: 19 }),
      endTurn("All booked. Goodbye!", true),
    ]);

    const turn = await agent.respond("Yes, please book it.");

    expect(turn.endCall).toBe(true);
    expect(turn.booking).toMatchObject({ name: "Sam", partySize: 4, date: "2026-10-18", hour: 19, source: "voice" });
    expect(await store.countBooked("2026-10-18", 19)).toBe(1);
  });

  it("tells the model a slot is full and suggests alternatives instead of claiming a booking", async () => {
    const store = new MemoryBookingStore(rules.totalTables);
    for (let i = 0; i < rules.totalTables; i++) {
      await store.reserve({ name: "Seed", partySize: 2, date: "2026-10-18", hour: 19, source: "seed" });
    }
    const { model, agent } = setup(
      [
        toolCall("create_booking", { name: "Sam", partySize: 4, date: "2026-10-18", hour: 19 }),
        endTurn("Sorry, 7 pm is full. I can do 6 pm or 8 pm. Which would you like?", false),
      ],
      store,
    );

    const turn = await agent.respond("Yes, book it.");

    expect(turn.booking).toBeUndefined();
    const toolResult = JSON.parse(lastToolMessage(model.requests[1] ?? []).text) as {
      status: string;
      alternatives: { hour: number }[];
    };
    expect(toolResult.status).toBe("full");
    expect(toolResult.alternatives.map((a) => a.hour)).toEqual([18, 20, 17]);
    expect(await store.countBooked("2026-10-18", 19)).toBe(rules.totalTables);
  });

  it("refuses invalid slots before touching the store", async () => {
    const { model, agent, store } = setup([
      toolCall("check_availability", { date: "2026-10-18", hour: 23 }),
      endTurn("We close at 11 pm, so the last table is at 10 pm. Would 10 pm suit you?", false),
    ]);

    await agent.respond("Eleven at night tomorrow.");

    const toolResult = JSON.parse(lastToolMessage(model.requests[1] ?? []).text) as Record<string, unknown>;
    expect(toolResult).toMatchObject({ status: "invalid", reason: "outside_hours" });
    expect(await store.listDay("2026-10-18")).toHaveLength(0);
  });

  it("executes other tools first when end_turn arrives in the same message", async () => {
    const both = new AIMessage({
      content: "",
      tool_calls: [
        { name: "check_availability", args: { date: "2026-10-18", hour: 19 }, id: "a", type: "tool_call" },
        { name: END_TURN_TOOL, args: { reply: "premature", endCall: false }, id: "b", type: "tool_call" },
      ],
    });
    const { model, agent } = setup([both, endTurn("7 pm tomorrow is free.", false)]);

    const turn = await agent.respond("Is seven tomorrow free?");

    expect(turn.reply).toBe("7 pm tomorrow is free.");
    const second = model.requests[1] ?? [];
    expect(second.filter((m) => m instanceof ToolMessage)).toHaveLength(2);
    expect(lastToolMessage(second).text).toContain("Ignored");
  });

  it("falls back to plain text when the model replies without tools", async () => {
    const { agent } = setup([new AIMessage("Could you tell me the name for the booking?")]);
    expect(await agent.respond("Hello?")).toEqual({
      reply: "Could you tell me the name for the booking?",
      endCall: false,
    });
  });

  it("gives up with a fallback reply after too many tool rounds", async () => {
    const { agent } = setup(
      Array.from({ length: 5 }, () => toolCall("get_current_datetime", {})),
    );
    const turn = await agent.respond("What day is it?");
    expect(turn.endCall).toBe(false);
    expect(turn.reply).toMatch(/say it again/i);
  });

  it("rolls the history back when the model fails", async () => {
    const { agent } = setup([]);
    await expect(agent.respond("Hello")).rejects.toThrow("script exhausted");
    expect(agent.history).toHaveLength(1);
  });
});
