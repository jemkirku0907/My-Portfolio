import { NextResponse } from "next/server";
import { assistantKnowledge } from "@/data/portfolio";

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
const model = "gemini-2.0-flash";

function fallbackForStatus(status: number, message = "") {
  if (status === 400 || status === 401 || status === 403) {
    return "The assistant key could not be authorized on the server. Please check the Gemini API key in Vercel Environment Variables.";
  }

  if (status === 429) {
    if (message.toLowerCase().includes("quota")) {
      return "The assistant is connected, but the Gemini API quota for this key/project is currently unavailable. Please check Google AI Studio quota or billing, then try again.";
    }

    return "The assistant is getting a lot of questions right now. Please try again shortly.";
  }

  return fallbackAnswer;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        answer:
          "The AI assistant key is set locally, but the deployed server also needs GEMINI_API_KEY added in Vercel Environment Variables."
      },
      { status: 500 }
    );
  }

  try {
    const { prompt } = (await request.json()) as AskAiRequest;
    const question = prompt?.trim();

    if (!question) {
      return NextResponse.json({ answer: "Please type a question about Jeo's portfolio first." }, { status: 400 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: portfolioAssistantInstruction }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: question }]
            }
          ],
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 180
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message ?? "";

      return NextResponse.json({ answer: fallbackForStatus(response.status, errorMessage) }, { status: 200 });
    }

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!answer) {
      return NextResponse.json({ answer: "I could not generate a useful answer just now. Please try rephrasing your question." }, { status: 200 });
    }

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ answer: fallbackAnswer }, { status: 500 });
  }
}
