import { NextResponse } from "next/server";

type AskAiRequest = {
  prompt?: string;
};

const portfolioAssistantInstruction = `You are Jeo's concise portfolio assistant.
Use only the public portfolio context below. Answer questions about Jeo's work, projects, skills, certifications, and background.
Politely redirect unrelated or off-topic questions back to Jeo's portfolio.
Keep answers concise because this is a small portfolio command palette.

Portfolio context:
- Name: Jeo
- Role: Intern/Developer
- Stack: PHP/MySQL, Next.js, React, Supabase, TypeScript
- Projects:
  - Marajo Group: real estate site at https://marajogroup.vercel.app
  - PharSayo: medication management PWA at https://pharsayo.netlify.app
  - QUACC: child care center system, not deployed
- Certifications: NC III Graphic Design, Batang Techno Hackathon participant, InfoTechnOlympics participant, Math and Physics Quiz Bee participant, AI Tech 2.0 participant
- Based in the Philippines`;

const fallbackAnswer = "The assistant is temporarily unavailable. Please try asking again in a moment.";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { answer: "The AI assistant needs GEMINI_API_KEY configured on the server before it can answer." },
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    if (response.status === 429) {
      return NextResponse.json(
        { answer: "The assistant is getting a lot of questions right now. Please try again shortly." },
        { status: 429 }
      );
    }

    if (!response.ok) {
      return NextResponse.json({ answer: fallbackAnswer }, { status: 502 });
    }

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!answer) {
      return NextResponse.json({ answer: "I could not generate a useful answer just now. Please try rephrasing your question." }, { status: 502 });
    }

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ answer: fallbackAnswer }, { status: 500 });
  }
}
