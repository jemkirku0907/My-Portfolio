import { NextResponse } from "next/server";
import { assistantKnowledge } from "@/data/portfolio";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const systemPrompt = `You are a concise portfolio assistant for a developer portfolio website.
Answer only from the portfolio context below. If a visitor asks about private details, say you can only speak about public portfolio information.
Keep answers under 120 words unless the user asks for more detail.

${assistantKnowledge}`;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { answer: "The AI assistant is configured in the UI, but GEMINI_API_KEY still needs to be added on the server." },
      { status: 200 }
    );
  }

  try {
    const { messages = [] } = (await request.json()) as { messages: Message[] };
    const recentMessages = messages.slice(-8);
    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      ...recentMessages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }]
      }))
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 220
          }
        })
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        answer: "The assistant is temporarily unavailable, likely due to a free-tier limit. Please try again shortly."
      });
    }

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({
      answer: answer ?? "I could not find an answer from the portfolio context."
    });
  } catch {
    return NextResponse.json({
      answer: "Something went wrong while reaching the assistant. Please try again in a moment."
    });
  }
}
