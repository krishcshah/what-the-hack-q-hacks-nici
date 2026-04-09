import "server-only";
import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI | null {
  if (client) {
    return client;
  }
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}
