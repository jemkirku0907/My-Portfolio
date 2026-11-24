"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

type ContributionsResponse = {
  total?: {
    lastYear?: number;
  };
  contributions?: ContributionDay[];
  source?: "github-graphql" | "github-profile";
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function buildCalendarDays(contributions: ContributionDay[]) {
  const contributionMap = new Map(contributions.map((day) => [day.date, day]));
  const end = new Date();
  end.setHours(0, 0, 0, 0);

  const start = new Date(end);
  start.setDate(start.getDate() - 371);
  start.setDate(start.getDate() - start.getDay());

  const weeks: ContributionDay[][] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const week: ContributionDay[] = [];

    for (let day = 0; day < 7; day++) {
      const date = formatDate(cursor);
      week.push(contributionMap.get(date) ?? { date, count: 0, level: 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    weeks.push(week);
  }

  return weeks.slice(-53);
}

function contributionLevel(day: Pick<ContributionDay, "count" | "level">) {
  if (day.count <= 0) return 0;
  if (day.level > 0) return day.level;
  if (day.count >= 4) return 4;
  if (day.count >= 3) return 3;
  if (day.count >= 2) return 2;
  return 1;
}

function colorForLevel(level: number) {
  return [
    "bg-[#ededec] dark:bg-[#1c1c20]",
    "bg-[#b7e3c5] dark:bg-[#133b24]",
    "bg-[#69c388] dark:bg-[#1d663a]",
    "bg-[#369b5c] dark:bg-[#2c9353]",
    "bg-[#1e6b3a] dark:bg-[#49c977]"
  ][Math.max(0, Math.min(level, 4))];
}

export function GitHubContributions({
  username,
  verifiedTotal
}: {
  username: string;
  verifiedTotal?: number;
}) {
  const [data, setData] = useState<ContributionsResponse | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    let cancelled = false;

    async function loadContributions() {
      setError(false);

      try {
        const response = await fetch(
          `/api/github-contributions?username=${encodeURIComponent(username)}`
        );

        if (!response.ok) throw new Error("Unable to load GitHub contributions");

        const payload = (await response.json()) as ContributionsResponse;
        if (!cancelled) setData(payload);
      } catch {
        if (!cancelled) {
          setData(null);
          setError(true);
        }
      }
    }

    loadContributions();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const weeks = useMemo(() => {
    if (!mounted) return [];
    return buildCalendarDays(data?.contributions ?? []);
  }, [data, mounted]);

  const apiTotal = data?.total?.lastYear ?? 0;
  const total = Math.max(apiTotal, verifiedTotal ?? 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[14px] font-medium text-[#6e6e73] dark:text-[#8b8b91]">
          GitHub
        </h2>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex items-center gap-1 text-[13px] tabular-nums text-[#6e6e73] transition hover:text-[#111113] dark:text-[#8b8b91] dark:hover:text-[#ececee]"
          suppressHydrationWarning
        >
          <span>
            {error
              ? `@${username} on GitHub`
              : `${total.toLocaleString()} contributions in the last year`}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>

      <div
        role="img"
        aria-label="GitHub contribution graph"
        className="w-full overflow-x-auto pb-1"
      >
        {mounted && weeks.length > 0 ? (
          <div className="flex min-w-[530px] justify-between gap-[3px]">
            {weeks.map((week: ContributionDay[], weekIdx: number) => (
              <div key={week[0]?.date ?? weekIdx} className="flex flex-col gap-[3px]">
                {week.map((day: ContributionDay) => (
                  <span
                    key={day.date}
                    title={`${day.count} on ${day.date}`}
                    className={`h-[9px] w-[9px] rounded-[2px] ${colorForLevel(
                      contributionLevel(day)
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[78px] w-full animate-pulse rounded-[10px] bg-[#ededec] dark:bg-[#1c1c20]" />
        )}
      </div>
    </div>
  );
}
