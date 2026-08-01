import { NextResponse } from "next/server";

type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

type ContributionsPayload = {
  total: {
    lastYear: number;
  };
  contributions: ContributionDay[];
  source: "github-graphql" | "github-profile";
};

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const USERNAME_PATTERN = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;
const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4
};

export const revalidate = 21600;

function textFromHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function attributeValue(attributes: string, name: string) {
  const match = attributes.match(new RegExp(`${name}="([^"]*)"`, "i"));
  return match?.[1];
}

function countFromTooltip(tooltip: string) {
  const text = textFromHtml(tooltip);
  if (/^No contributions\b/i.test(text)) return 0;

  const match = text.match(/^([\d,]+)\s+contributions?\b/i);
  return match ? Number(match[1].replace(/,/g, "")) : 0;
}

function parseGitHubProfileContributions(html: string): ContributionsPayload {
  const totalMatch = html.match(/<h2[^>]*id="js-contribution-activity-description"[^>]*>([\s\S]*?)<\/h2>/i);
  const totalText = totalMatch ? textFromHtml(totalMatch[1]) : "";
  const total = Number(totalText.match(/([\d,]+)\s+contributions?/i)?.[1]?.replace(/,/g, "") ?? 0);

  const contributions: ContributionDay[] = [];
  const dayPattern =
    /<td\b([^>]*)\bclass="ContributionCalendar-day"([^>]*)><\/td>\s*<tool-tip\b[^>]*>([\s\S]*?)<\/tool-tip>/gi;

  for (const match of html.matchAll(dayPattern)) {
    const attributes = `${match[1]} ${match[2]}`;
    const date = attributeValue(attributes, "data-date");
    if (!date) continue;

    contributions.push({
      date,
      count: countFromTooltip(match[3]),
      level: Number(attributeValue(attributes, "data-level") ?? 0)
    });
  }

  if (!contributions.length) {
    throw new Error("GitHub contribution calendar markup was not recognized");
  }

  return {
    total: { lastYear: total || contributions.reduce((sum, day) => sum + day.count, 0) },
    contributions,
    source: "github-profile"
  };
}

async function fetchGraphQlContributions(username: string, token: string): Promise<ContributionsPayload> {
  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "jemkirk-portfolio"
    },
    next: { revalidate },
    body: JSON.stringify({
      query: `
        query PortfolioContributions($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `,
      variables: { login: username }
    })
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL returned ${response.status}`);
  }

  const payload = await response.json();
  const calendar = payload?.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar) {
    throw new Error(payload?.errors?.[0]?.message ?? "GitHub GraphQL response did not include a contribution calendar");
  }

  return {
    total: { lastYear: calendar.totalContributions },
    contributions: calendar.weeks.flatMap((week: { contributionDays: Array<{
      date: string;
      contributionCount: number;
      contributionLevel: string;
    }> }) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVELS[day.contributionLevel] ?? 0
      }))
    ),
    source: "github-graphql"
  };
}

async function fetchProfileContributions(username: string): Promise<ContributionsPayload> {
  const response = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: {
      Accept: "text/html",
      "User-Agent": "jemkirk-portfolio"
    },
    next: { revalidate }
  });

  if (!response.ok) {
    throw new Error(`GitHub profile contributions returned ${response.status}`);
  }

  return parseGitHubProfileContributions(await response.text());
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.trim() ?? "";

  if (!USERNAME_PATTERN.test(username)) {
    return NextResponse.json({ error: "Invalid GitHub username" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;

  try {
    const payload = token
      ? await fetchGraphQlContributions(username, token)
      : await fetchProfileContributions(username);

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400"
      }
    });
  } catch (error) {
    if (token) {
      try {
        const payload = await fetchProfileContributions(username);
        return NextResponse.json(payload, {
          headers: {
            "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400"
          }
        });
      } catch {
        // Return the original token-backed error below because it is usually more actionable.
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load GitHub contributions" },
      { status: 502 }
    );
  }
}
