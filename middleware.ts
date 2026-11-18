import { NextRequest, NextResponse } from "next/server";

const AI_AND_SCRAPER_UA_PATTERN =
  /(gptbot|chatgpt-user|oai-searchbot|claudebot|claude-user|claude-web|anthropic-ai|perplexitybot|perplexity-user|google-extended|googleother|meta-externalagent|meta-externalfetcher|facebookbot|applebot-extended|amazonbot|bytespider|ccbot|cohere-ai|diffbot|youbot|duckassistbot|mistralai-user|ai2bot|imagesiftbot|omgilibot|timpibot|petalbot|scrapy|headlesschrome|playwright|puppeteer|selenium|phantomjs|python-requests|python-urllib|httpx|aiohttp|curl\/|wget\/|node-fetch|axios\/|undici|go-http-client)/i;

const ALLOWED_PREVIEW_OR_AUDIT_PATTERN =
  /(chrome-lighthouse|googlebot(?!-extended)|bingbot|facebookexternalhit|facebot|twitterbot|linkedinbot|discordbot|slackbot|whatsapp|telegrambot)/i;

function timingSafeEqualString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function middleware(request: NextRequest) {
  const bypassSecret = process.env.AGENT_BYPASS_TOKEN;
  const headerToken = request.headers.get("x-agent-key") ?? "";
  const queryToken = request.nextUrl.searchParams.get("agent_key") ?? "";
  const cookieToken = request.cookies.get("agent_bypass")?.value ?? "";

  const isAuthorizedAgent =
    Boolean(bypassSecret) &&
    (timingSafeEqualString(headerToken, bypassSecret!) ||
      timingSafeEqualString(queryToken, bypassSecret!) ||
      timingSafeEqualString(cookieToken, bypassSecret!));

  if (isAuthorizedAgent) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noai, noimageai");
    if (queryToken && bypassSecret && timingSafeEqualString(queryToken, bypassSecret)) {
      response.cookies.set("agent_bypass", bypassSecret, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 6
      });
    }
    return response;
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const isAllowedPreviewOrAudit = ALLOWED_PREVIEW_OR_AUDIT_PATTERN.test(userAgent);
  const isBlockedBot =
    !userAgent.trim() || (!isAllowedPreviewOrAudit && AI_AND_SCRAPER_UA_PATTERN.test(userAgent));

  if (isBlockedBot) {
    return new NextResponse("Access restricted for automated AI crawlers and scrapers.", {
      status: 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noai, noimageai",
        "Cache-Control": "no-store"
      }
    });
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noai, noimageai");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"]
};
