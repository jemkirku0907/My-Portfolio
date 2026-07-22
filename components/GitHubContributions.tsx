"use client";

import { useEffect, useMemo, useState } from "react";

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
};

const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
const monthFormatter = new Intl.DateTimeFormat("en", { month: "short" });

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

function monthLabels(weeks: ContributionDay[][]) {
  return weeks.map((week, index) => {
    const firstDay = new Date(`${week[0].date}T00:00:00`);
    const previousWeek = weeks[index - 1];
    const previousMonth = previousWeek ? new Date(`${previousWeek[0].date}T00:00:00`).getMonth() : -1;

    return firstDay.getMonth() !== previousMonth ? monthFormatter.format(firstDay) : "";
  });
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
    "bg-[#ebedf0] dark:bg-[#161b22]",
    "bg-[#9be9a8] dark:bg-[#0e4429]",
    "bg-[#40c463] dark:bg-[#006d32]",
    "bg-[#30a14e] dark:bg-[#26a641]",
    "bg-[#216e39] dark:bg-[#39d353]"
  ][Math.max(0, Math.min(level, 4))];
}

export function GitHubContributions({ username }: { username: string }) {
  const [data, setData] = useState<ContributionsResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadContributions() {
      try {
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
          next: { revalidate: 60 * 60 * 6 }
        });

        if (!response.ok) throw new Error("Unable to load GitHub contributions");

        const payload = (await response.json()) as ContributionsResponse;
        if (!cancelled) setData(payload);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    loadContributions();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const weeks = useMemo(() => buildCalendarDays(data?.contributions ?? []), [data]);
  const months = useMemo(() => monthLabels(weeks), [weeks]);
  const total = data?.total?.lastYear ?? 0;

  return (
    <a
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noreferrer"
      className="block rounded-lg border border-line bg-white p-4 text-ink transition duration-300 hover:-translate-y-1 hover:border-moss hover:shadow-soft dark:border-moss/70 dark:bg-ink dark:text-paper"
      aria-label={`${username} GitHub contributions`}
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-medium">{error ? "GitHub contributions" : `${total} contributions in the last year`}</p>
        <span className="text-sm text-steel dark:text-paper">Contribution settings</span>
      </div>

      <div className="overflow-x-auto rounded-md border border-line bg-white p-4 dark:border-moss/70 dark:bg-[#0d1117]">
        <div className="min-w-[760px]">
          <div className="ml-9 grid grid-cols-[repeat(53,12px)] gap-[3px] text-xs text-steel dark:text-paper">
            {months.map((month, index) => (
              <span key={`${month}-${index}`} className="h-5">
                {month}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="grid grid-rows-7 gap-[3px] pt-[2px] text-xs text-steel dark:text-paper">
              {dayLabels.map((label, index) => (
                <span key={`${label}-${index}`} className="h-3 leading-3">
                  {label}
                </span>
              ))}
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
              {weeks.flat().map((day) => (
                <span
                  key={day.date}
                  title={`${day.count} contributions on ${day.date}`}
                  className={`h-3 w-3 rounded-[2px] border border-black/5 dark:border-white/5 ${colorForLevel(contributionLevel(day))}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-steel dark:text-paper sm:flex-row sm:items-center sm:justify-between">
            <span>Learn how we count contributions</span>
            <div className="flex items-center gap-1">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <span key={level} className={`h-3 w-3 rounded-[2px] border border-black/5 dark:border-white/5 ${colorForLevel(level)}`} />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
