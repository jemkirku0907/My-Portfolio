import { NextResponse } from "next/server";
import { assistantKnowledge } from "@/data/portfolio";
import { answerPortfolioQuestion } from "@/lib/local-assistant";

type AskAiRequest = {
  prompt?: string;
};

const portfolioAssistantInstruction = `You are Jeo's concise portfolio assistant.
Use only the public portfolio context below. Answer questions about Jeo's work, projects, skills, certifications, and background.
Project cards are preview-only for privacy, so do not send visitors to live company or private project links.
Politely redirect unrelated or off-topic questions back to Jeo's portfolio.
Keep answers under 90 words because this is a small portfolio command palette.

${assistantKnowledge}`;

const fallbackAnswer = "The assistant is temporarily unavailable. Please try asking again in a moment.";
const model = "gemini-3.6-flash";

function fallbackForStatus(status: number, message = "") {
  if (status === 400 || status === 401 || status === 403) {
    return "The assistant key could not be authorized on the server. Please check the Gemini API key in Vercel Environment Variables.";
  }

  if (status === 429) {
    if (message.toLowerCase().includes("quota")) {
      return "Gemini is rate-limited right now, so I answered from Jemkirk's local portfolio data instead.";
    }

    return "The assistant is getting a lot of questions right now. Please try again shortly.";
  }

  return fallbackAnswer;
}

function cleanAssistantText(answer: string) {
  return answer
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .trim();
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;

  try {
    const { prompt } = (await request.json()) as AskAiRequest;
    const question = prompt?.trim();

    if (!question) {
      return NextResponse.json({ answer: "Please type a question about Jeo's portfolio first." }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ answer: answerPortfolioQuestion(question), source: "local" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          model,
          input: `${portfolioAssistantInstruction}\n\nVisitor question: ${question}`
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message ?? "";

      return NextResponse.json(
        {
          answer: cleanAssistantText(`${answerPortfolioQuestion(question)}\n\n${fallbackForStatus(response.status, errorMessage)}`),
          source: "local"
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const answer =
      data?.output_text?.trim() ??
      data?.steps
        ?.flatMap((step: { content?: { text?: string }[] }) => step.content ?? [])
        ?.map((content: { text?: string }) => content.text)
        ?.filter(Boolean)
        ?.join("")
        ?.trim();

    if (!answer) {
      return NextResponse.json({ answer: answerPortfolioQuestion(question), source: "local" }, { status: 200 });
    }

    return NextResponse.json({ answer: cleanAssistantText(answer), source: "gemini" });
  } catch {
    return NextResponse.json({ answer: fallbackAnswer }, { status: 500 });
  }
}
