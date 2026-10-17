import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatOpenAI } from "@langchain/openai";

import type { LlmProvider } from "../config.js";

export interface LlmConfig {
  provider: LlmProvider;
  openai: { apiKey: string; model: string };
}

/** Thrown when LLM_PROVIDER names a provider whose LangChain package is not installed. */
export class LlmProviderNotInstalledError extends Error {
  constructor(provider: LlmProvider, packageName: string, className: string, envVar: string) {
    super(
      `LLM provider "${provider}" is not installed. Run \`npm install ${packageName}\`, set ${envVar}, ` +
        `and return \`new ${className}({ ... })\` from createChatModel() in src/agent/llm.ts. ` +
        "No other file needs to change.",
    );
    this.name = "LlmProviderNotInstalledError";
  }
}

/**
 * The single place that knows which chat model backs the agent. The agent only
 * sees a LangChain BaseChatModel, so swapping providers is a change to this file.
 */
export function createChatModel(config: LlmConfig): BaseChatModel {
  switch (config.provider) {
    case "openai":
      return new ChatOpenAI({
        model: config.openai.model,
        apiKey: config.openai.apiKey,
        temperature: 0.2,
        maxRetries: 2,
        timeout: 20_000,
      });
    case "google":
      throw new LlmProviderNotInstalledError(
        "google",
        "@langchain/google-genai",
        "ChatGoogleGenerativeAI",
        "GOOGLE_API_KEY",
      );
    case "xai":
      throw new LlmProviderNotInstalledError("xai", "@langchain/xai", "ChatXAI", "XAI_API_KEY");
  }
}
