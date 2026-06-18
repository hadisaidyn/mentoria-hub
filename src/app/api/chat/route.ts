import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Defaults to Claude Haiku 4.5 — the fastest, most cost-effective model.
// Override with ANTHROPIC_MODEL (e.g. "claude-opus-4-8" for max capability).
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface OppLite {
  title: string;
  direction: string;
  type: string;
  deadline: string;
  grades: number[];
}

interface Profile {
  name: string;
  grade: number;
  country: string;
  interests: string[];
  goals: string[];
}

const LANG_NAME: Record<string, string> = {
  en: "English",
  ru: "Russian",
  kk: "Kazakh",
};

function buildSystem(profile: Profile | null, opps: OppLite[], lang: string): string {
  const language = LANG_NAME[lang] || "English";
  const profileBlock = profile
    ? `The student's profile:
- Name: ${profile.name}
- Grade: ${profile.grade}
- Country: ${profile.country}
- Interests: ${profile.interests.join(", ") || "not specified"}
- Goals: ${profile.goals.join(", ") || "not specified"}`
    : `The student has NOT completed their profile yet. Gently encourage them to tap "Personalize" to set their grade, interests and goals so you can tailor advice.`;

  const oppBlock = opps.length
    ? opps
        .slice(0, 40)
        .map(
          (o) =>
            `- ${o.title} — ${o.direction}, ${o.type}, deadline ${o.deadline}, grades ${o.grades.join("/")}`,
        )
        .join("\n")
    : "(no opportunities loaded)";

  return `You are Mentoria Hub's AI College Counselor — a warm, encouraging mentor for students in grades 8–11 who are pursuing competitions, scholarships, summer schools and university admission.

${profileBlock}

Opportunities currently available on the platform (recommend from THIS list — never invent programs or deadlines):
${oppBlock}

Guidelines:
- Reply in ${language}.
- Be concise and friendly: 2–5 short sentences or a tight bullet list. Use **bold** for key names and deadlines.
- Ground every recommendation in the student's grade, interests and goals, and in the opportunities list above. Prioritize the nearest relevant deadlines.
- If the profile is missing, give general guidance and nudge them to personalize.
- Respond with your final answer only — do not narrate your reasoning or list options you won't recommend.
- Never ask for or reveal personal data beyond what's in the profile. Stay on topic (education, opportunities, study planning).`;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    // Signal the client to use its built-in offline fallback.
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  let body: { messages?: ChatMessage[]; profile?: Profile | null; opportunities?: OppLite[]; lang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = (body.messages || [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12); // keep the last few turns
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Expected a trailing user message" }, { status: 400 });
  }

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: buildSystem(body.profile ?? null, body.opportunities ?? [], body.lang || "en"),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({ reply, configured: true });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "Invalid ANTHROPIC_API_KEY" }, { status: 502 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Rate limited — try again in a moment." }, { status: 429 });
    }
    const message = error instanceof Anthropic.APIError ? error.message : "Upstream error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
