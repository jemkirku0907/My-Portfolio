"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

type TechDetail = {
  id: string;
  label: string;
  role: string;
  summary: string;
  projects: { name: string; href: string }[];
};

const TECH_DETAILS: TechDetail[] = [
  {
    id: "nextjs",
    label: "Next.js",
    role: "Full-Stack React Framework",
    summary: "App Router, server actions, API routes, and SSR/ISR across production apps and hackathons.",
    projects: [
      { name: "OrgVault", href: "https://orgvault-eosin.vercel.app/" },
      { name: "TAGA-asK AI", href: "https://taga-askai.vercel.app" },
      { name: "Marajo Group", href: "#projects" },
      { name: "Suri.AI", href: "#projects" }
    ]
  },
  {
    id: "react",
    label: "React",
    role: "Interactive UI & PWAs",
    summary: "Component architecture, state management, responsive dashboards, and offline-capable PWAs.",
    projects: [
      { name: "PharSayo", href: "#projects" },
      { name: "OrgVault", href: "https://orgvault-eosin.vercel.app/" },
      { name: "TAGA-asK AI", href: "https://taga-askai.vercel.app" }
    ]
  },
  {
    id: "supabase",
    label: "Supabase",
    role: "PostgreSQL, Auth & Realtime",
    summary: "Relational schemas, row-level security, real-time presence, and storage workflows.",
    projects: [
      { name: "Marajo Group", href: "#projects" },
      { name: "Portfolio Presence", href: "#about" }
    ]
  },
  {
    id: "csharp",
    label: "C# / .NET",
    role: "Desktop & Game Logic",
    summary: "Object-oriented .NET WinForms applications, real-time combat physics, and CPU AI.",
    projects: [{ name: "Street Fighter Arcade", href: "/game" }]
  },
  {
    id: "php",
    label: "PHP/MySQL",
    role: "Relational Web Backends",
    summary: "Multi-role session auth, OTP verification, password hashing, and CRUD dashboards.",
    projects: [{ name: "Queen of Angels (QUACC)", href: "#projects" }]
  }
];

const FOCUS_AREAS = ["Frontend", "Backend", "Databases", "Deployment"] as const;

export function HeroIntro() {
  const [activeTechId, setActiveTechId] = useState<string>("nextjs");
  const [activeFocus, setActiveFocus] = useState<(typeof FOCUS_AREAS)[number] | null>(null);

  const activeTech = TECH_DETAILS.find((t) => t.id === activeTechId) ?? TECH_DETAILS[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-light leading-snug text-ink dark:text-paper sm:text-4xl md:text-5xl">
          <span className="font-normal">Full-Stack Web Developer</span>
        </h2>
        <div className="flex flex-wrap items-center gap-1.5">
          {FOCUS_AREAS.map((area) => {
            const isSelected = activeFocus === area;
            return (
              <button
                key={area}
                type="button"
                onClick={() => setActiveFocus(isSelected ? null : area)}
                className={`focus-ring rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider transition ${
                  isSelected
                    ? "border-moss bg-moss/15 text-ink dark:bg-moss/30 dark:text-paper"
                    : "border-line/80 bg-white/70 text-steel hover:border-moss hover:text-ink dark:border-moss/60 dark:bg-ink/70 dark:text-paper/80"
                }`}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>

      <p className="max-w-4xl text-base leading-7 text-steel dark:text-paper sm:text-xl sm:leading-8">
        I build practical web systems across{" "}
        <span className={activeFocus === "Frontend" ? "font-medium text-ink underline decoration-moss underline-offset-4 dark:text-paper" : ""}>
          frontend
        </span>
        ,{" "}
        <span className={activeFocus === "Backend" ? "font-medium text-ink underline decoration-moss underline-offset-4 dark:text-paper" : ""}>
          backend
        </span>
        ,{" "}
        <span className={activeFocus === "Databases" ? "font-medium text-ink underline decoration-moss underline-offset-4 dark:text-paper" : ""}>
          databases
        </span>
        , and{" "}
        <span className={activeFocus === "Deployment" ? "font-medium text-ink underline decoration-moss underline-offset-4 dark:text-paper" : ""}>
          deployment
        </span>{" "}
        with{" "}
        {TECH_DETAILS.map((tech, idx) => {
          const isActive = tech.id === activeTechId;
          const isLast = idx === TECH_DETAILS.length - 1;
          return (
            <span key={tech.id}>
              {isLast ? "and " : ""}
              <button
                type="button"
                onClick={() => setActiveTechId(tech.id)}
                aria-pressed={isActive}
                className={`focus-ring inline-flex items-center rounded-full border px-3 py-0.5 text-sm sm:text-base transition duration-200 cursor-pointer ${
                  isActive
                    ? "border-moss bg-ink text-white shadow-sm -translate-y-0.5 dark:bg-paper dark:text-ink"
                    : "border-line bg-white text-ink hover:-translate-y-0.5 hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
                }`}
              >
                {tech.label}
              </button>
              {isLast ? "." : ", "}
            </span>
          );
        })}
      </p>

      <div
        key={activeTech.id}
        className="max-w-3xl rounded-xl border border-line bg-white/85 px-4 py-3 shadow-sm backdrop-blur-sm transition-all dark:border-moss dark:bg-ink/85"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-moss" aria-hidden />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink dark:text-paper">
              {activeTech.label}
            </span>
            <span className="text-xs text-steel dark:text-paper/75">· {activeTech.role}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {activeTech.projects.map((proj) =>
              proj.href.startsWith("http") ? (
                <a
                  key={proj.name}
                  href={proj.href}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-0.5 rounded-full border border-line bg-paper/60 px-2.5 py-0.5 text-xs font-medium text-ink transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
                >
                  {proj.name}
                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                </a>
              ) : (
                <Link
                  key={proj.name}
                  href={proj.href}
                  className="focus-ring inline-flex items-center rounded-full border border-line bg-paper/60 px-2.5 py-0.5 text-xs font-medium text-ink transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
                >
                  {proj.name}
                </Link>
              )
            )}
          </div>
        </div>
        <p className="mt-1.5 text-xs leading-5 text-steel dark:text-paper/85 sm:text-sm">
          {activeTech.summary}
        </p>
      </div>
    </div>
  );
}
