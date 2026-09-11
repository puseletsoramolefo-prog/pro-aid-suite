import { generateAi } from "./ai.functions";

export type AiSource = "cloud" | "demo";
export type AiResult<T> = { data: T; source: AiSource };

function stripFences(text: string) {
  return text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
}

/** Ask the model for JSON; fall back to the local demo generator on any failure. */
export async function askJson<T>(args: {
  system: string;
  prompt: string;
  fallback: () => T;
  validate?: (value: unknown) => value is T;
}): Promise<AiResult<T>> {
  try {
    const { text } = await generateAi({
      data: { system: args.system, prompt: args.prompt, json: true },
    });
    const parsed = JSON.parse(stripFences(text)) as unknown;
    if (args.validate && !args.validate(parsed)) throw new Error("SHAPE");
    return { data: parsed as T, source: "cloud" };
  } catch {
    return { data: args.fallback(), source: "demo" };
  }
}

/** Ask the model for plain text/markdown; fall back to the local generator. */
export async function askText(args: {
  system: string;
  prompt: string;
  fallback: () => string;
}): Promise<AiResult<string>> {
  try {
    const { text } = await generateAi({
      data: { system: args.system, prompt: args.prompt },
    });
    return { data: text, source: "cloud" };
  } catch {
    return { data: args.fallback(), source: "demo" };
  }
}

export const SYSTEM = {
  email: `You are a workplace email writing assistant. Rewrite the user's notes into a complete, professional email.
Rules: preserve the exact meaning of every supplied point; never invent facts, names, dates, figures or commitments that are not in the notes; adapt tone and length exactly as requested; keep bracketed placeholders where information is genuinely missing.`,
  meeting: `You are a meeting notes summariser. Use only information present in the notes.
Never infer owners or deadlines that are not stated — use "Unassigned" or "Not specified" instead.`,
  planner: `You are a workplace task planning assistant. Produce a realistic schedule that includes breaks, flags overload and scheduling conflicts honestly, and never promises more capacity than the day allows.`,
  research: `You are a workplace research assistant. Be balanced and explicit about uncertainty. Never fabricate statistics, citations, studies or sources. Where evidence is needed, say what the reader should verify.`,
  chat: `You are a helpful, safe workplace productivity assistant. Stay strictly on workplace topics (writing, planning, meetings, process, professional communication, careers). Politely decline anything outside that scope. Use clear Markdown. Never invent facts about the user's organisation; use bracketed placeholders instead.`,
};
