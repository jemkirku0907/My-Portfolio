import type { MetadataRoute } from "next";

const AI_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "GoogleOther",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "Bytespider",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
  "Amazonbot",
  "cohere-ai",
  "Diffbot",
  "YouBot",
  "DuckAssistBot",
  "MistralAI-User",
  "PetalBot",
  "AI2Bot",
  "ImagesiftBot",
  "Omgilibot",
  "Timpibot"
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_USER_AGENTS.map((userAgent) => ({
        userAgent,
        disallow: "/"
      })),
      {
        userAgent: "*",
        allow: "/"
      }
    ]
  };
}
