"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import MiniMeMascot from "@/components/MiniMeMascot";
import { TechKeyboard } from "@/components/TechKeyboard";
import { certificates, profile, projects, services } from "@/data/portfolio";

type ProjectItem = (typeof projects)[number];

type ExperienceRole = {
  role: string;
  org: string;
  period: string;
  lead: string;
  more: string[];
};

const experienceRoles: ExperienceRole[] = [
  {
    role: "Full-Stack Web Developer",
    org: "Officium Inc. / Marajo Group",
    period: "2026 to Present",
    lead: "Migrate and build production real estate web platforms from legacy PHP/MySQL/XAMPP stacks to Next.js, Supabase, PostgreSQL, and Vercel.",
    more: [
      "Implement property listing workflows, client booking flows, admin CRUD dashboards, and third-party service integrations",
      "Own responsive UI polish, database schema updates, and deployment checks across staging and production"
    ]
  },
  {
    role: "Full-Stack & Web3 Developer",
    org: "OrgVault · Binance Hackathon",
    period: "Nov 2026",
    lead: "Built a guarded AI treasury platform for student organizations on BNB Smart Chain Testnet (Chain ID 97) with public ledger transparency.",
    more: [
      "Integrated Gemini AI receipt extraction paired with backend EIP-712 typed cryptographic attestations",
      "Enforced on-chain category spending caps and allowlisted vendor payouts via OrgVault.sol"
    ]
  },
  {
    role: "Full-Stack & AI Developer",
    org: "TAGA-asK AI · Hackathon 2nd Runner Up",
    period: "Oct 2026",
    lead: "Created a verified campus AI companion and interactive map for the University of Makati with Team DoErrorIn, winning 2nd Runner Up.",
    more: [
      "Grounded Taglish natural-language answers strictly in official UMak Student Handbook citations using RAG and vector search",
      "Designed fast mobile-friendly campus navigation for students and faculty"
    ]
  },
  {
    role: "Certified Graphic Designer",
    org: "TESDA NC III Visual Graphic Design",
    period: "May 2025",
    lead: "Earned national certification in layout systems, brand identity, typography, and print/digital production.",
    more: [
      "Apply visual hierarchy, grid discipline, and custom asset design directly into full-stack product interfaces"
    ]
  }
];

const stackRows = [
  {
    category: "Frontend",
    items: "Next.js, React, TypeScript, JavaScript, Tailwind CSS, HTML5, CSS3"
  },
  {
    category: "Backend & DB",
    items: "Supabase, PostgreSQL, C# / .NET, PHP, Laravel, MySQL, Node.js, Express, REST APIs"
  },
  {
    category: "AI & Web3",
    items: "Gemini API, Anthropic API, RAG / Vector Search, Solidity, EIP-712, BNB Smart Chain"
  },
  {
    category: "Cloud & Tools",
    items: "Vercel, Netlify, GitHub Actions, Git, Visual Studio, VS Code, IntelliJ IDEA"
  },
  {
    category: "Design & CMS",
    items: "Figma, Adobe Illustrator, Adobe Photoshop, Canva, WordPress (TESDA NC III)"
  }
];

const projectTags: Record<string, string> = {
  "Marajo Group": "Real estate",
  "TAGA-asK AI": "2nd Runner Up",
  OrgVault: "Web3 · BSC",
  "Suri.AI": "AI Fact-Check",
  "Queen of Angels (QUACC)": "PHP · MySQL",
  "Street Fighter Arcade (.NET / C#)": "Playable Game",
  PharSayo: "Health PWA",
  Assignify: "Web App",
  BasuCash: "Finance App"
};

const projectSubtitles: Record<string, string> = {
  "Marajo Group": "Real estate listings, booking flows, and admin dashboard on Next.js & Supabase",
  "TAGA-asK AI": "Citation-backed campus RAG assistant and interactive map for University of Makati",
  OrgVault: "Guarded student-org treasury on BNB Smart Chain with Gemini AI receipt checks",
  "Suri.AI": "AI claim verification platform surfacing credible sources and debunked news",
  "Queen of Angels (QUACC)": "Multi-role childcare & scholarship portal with OTP auth and MySQL",
  "Street Fighter Arcade (.NET / C#)": "2D retro fighting game built in C#/.NET and ported to HTML5 Canvas",
  PharSayo: "Barangay medication adherence PWA with AI-assisted prescription scanning",
  Assignify: "Focused academic task and submission deadline dashboard for students",
  BasuCash: "Lightweight personal cash-flow, expense, and budget tracker"
};

const avatarSlices = Array.from({ length: 8 }, (_, index) => index);

export function HeroIdentityBlock() {
  const [bioExpanded, setBioExpanded] = useState<boolean>(false);
  const [animeToggled, setAnimeToggled] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
      {/* Large Monochrome Editorial Avatar -> 8-Slice Anime Portrait Reveal on Hover / Tap */}
      <button
        type="button"
        onClick={() => setAnimeToggled((prev: boolean) => !prev)}
        data-anime={animeToggled ? "true" : "false"}
        aria-pressed={animeToggled}
        aria-label="Toggle anime portrait style"
        className="focus-ring avatar-swap group relative h-[188px] w-[188px] shrink-0 overflow-hidden rounded-full bg-[#e4e4e2] dark:bg-[#222226] [contain:paint] sm:h-[236px] sm:w-[236px]"
      >
        <Image
          src="/profile/hero-face.jpg"
          alt={`${profile.name} portrait`}
          fill
          priority
          sizes="(max-width: 640px) 188px, 236px"
          className="scale-[1.06] object-cover object-top grayscale contrast-[1.08] brightness-[1.03] transition duration-700 group-hover:scale-[1.12] group-focus-within:scale-[1.12]"
        />
        <div className="absolute inset-0" aria-hidden="true">
          {avatarSlices.map((slice: number) => (
            <span
              key={slice}
              className="avatar-slice absolute top-0 h-full"
              style={{
                left: `${slice * 12.5}%`,
                width: "12.5%",
                backgroundImage: "url('/profile/avatar.jpg')",
                backgroundPosition: `${slice === 0 ? 0 : (slice / 7) * 100}% center`,
                transitionDelay: `${slice * 45}ms`
              }}
            />
          ))}
        </div>
        <span
          className="avatar-scan pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 rotate-12 bg-white/25 blur-md"
          aria-hidden="true"
        />
      </button>

      {/* Name, Role, Resume Pill Icon, and Fading Lead Bio */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-[22px] font-semibold tracking-[-0.015em] text-[#111113] dark:text-[#ececee]">
              {profile.name}
            </h1>
            <p className="text-[16.5px] text-[#6e6e73] dark:text-[#8b8b91]">
              Full-Stack Web Developer
            </p>
          </div>

          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            aria-label="Open Resume PDF"
            title="View Resume / CV"
            className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e5e5e3] bg-white text-[#3a3a3f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:border-[#c8c8c4] hover:text-[#111113] dark:border-[#2c2c31] dark:bg-[#19191c] dark:text-[#c6c6cb] dark:hover:border-[#426451] dark:hover:text-white"
          >
            <FileText className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <p
            className={`max-w-[540px] text-[16.5px] leading-[1.65] text-[#4a4a4f] transition-all dark:text-[#adadb3] ${
              bioExpanded
                ? ""
                : "max-h-[6.6em] overflow-hidden [mask-image:linear-gradient(#000_calc(100%-1.65em),transparent)] [-webkit-mask-image:linear-gradient(#000_calc(100%-1.65em),transparent)]"
            }`}
          >
            I&apos;m a full-stack web developer and TESDA NC III designer in the Philippines building practical web apps, custom dashboards, and AI/Web3 prototypes. I work across Next.js, React, TypeScript, Supabase, C#/.NET, and PHP/MySQL—turning manual workflows into clean, reliable software for real teams and hackathons.
          </p>

          <button
            type="button"
            onClick={() => setBioExpanded((prev: boolean) => !prev)}
            aria-expanded={bioExpanded}
            className="focus-ring inline-flex min-h-9 w-fit items-center gap-1.5 text-[14px] text-[#6e6e73] transition hover:text-[#111113] dark:text-[#8b8b91] dark:hover:text-[#ececee]"
          >
            <ArrowDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                bioExpanded ? "rotate-180" : ""
              }`}
              aria-hidden
            />
            <span>{bioExpanded ? "Show less" : "More about me"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function HeroMetricsAndSpotlights() {
  const validProjectsCount = projects.filter(
    (p) => p.name !== "NC III Graphic Design Work"
  ).length;

  return (
    <div className="relative flex flex-col gap-9">
      {/* 3-Column Metrics Row */}
      <div className="relative grid grid-cols-3 gap-3 sm:gap-6">
        <a
          href="#projects"
          className="focus-ring group relative flex flex-col gap-1 text-left"
        >
          <span className="text-[26px] font-medium tracking-[-0.03em] tabular-nums text-[#111113] dark:text-[#ececee] sm:text-[30px]">
            {validProjectsCount}+
          </span>
          <span className="text-[13px] text-[#6e6e73] dark:text-[#8b8b91] sm:text-[14px]">
            Shipped builds
          </span>
          <ArrowUpRight
            className="absolute right-0 top-1 h-4 w-4 text-[#8a8a8f] transition duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#111113] dark:text-[#737379] dark:group-hover:text-[#ececee]"
            aria-hidden
          />
        </a>

        <a
          href="https://taga-askai.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="focus-ring group relative flex flex-col gap-1 text-left"
        >
          <span className="text-[26px] font-medium tracking-[-0.03em] tabular-nums text-[#111113] dark:text-[#ececee] sm:text-[30px]">
            2nd
          </span>
          <span className="text-[13px] text-[#6e6e73] dark:text-[#8b8b91] sm:text-[14px]">
            AI Hackathon
          </span>
          <ArrowUpRight
            className="absolute right-0 top-1 h-4 w-4 text-[#8a8a8f] transition duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#111113] dark:text-[#737379] dark:group-hover:text-[#ececee]"
            aria-hidden
          />
        </a>

        <a
          href="#certificates"
          className="focus-ring group relative flex flex-col gap-1 text-left"
        >
          <span className="text-[26px] font-medium tracking-[-0.03em] tabular-nums text-[#111113] dark:text-[#ececee] sm:text-[30px]">
            2+ yrs
          </span>
          <span className="text-[13px] text-[#6e6e73] dark:text-[#8b8b91] sm:text-[14px]">
            Building &amp; design
          </span>
          <ArrowUpRight
            className="absolute right-0 top-1 h-4 w-4 text-[#8a8a8f] transition duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#111113] dark:text-[#737379] dark:group-hover:text-[#ececee]"
            aria-hidden
          />
        </a>
      </div>

      {/* 2 Spotlight Banner Cards (Crimson Mesh + Sky Pixel Mascot) */}
      <div className="relative flex flex-col gap-3.5">
        {/* Card 1: Deep Crimson Mesh Banner */}
        <a
          href="https://taga-askai.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="focus-ring group relative flex items-center gap-4 overflow-hidden rounded-[14px] border border-white/15 bg-gradient-to-br from-[#b42c20] via-[#8f241b] to-[#461714] px-5 py-5 text-white shadow-[0_8px_24px_rgba(143,36,27,0.18)] transition hover:shadow-[0_12px_30px_rgba(143,36,27,0.26)] sm:px-6"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[#ff5a43]/30 blur-2xl"
          />
          <span className="relative flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-[11.5px] font-bold uppercase tracking-[0.07em] text-white/80">
              2nd Runner Up · UMak Hackathon
            </span>
            <span className="text-[17px] font-medium leading-snug text-white group-hover:underline group-hover:underline-offset-4">
              Ask campus rules. Get cited answers.
            </span>
            <span className="max-w-[420px] text-[13.5px] leading-[1.5] text-white/85">
              Verified RAG student assistant &amp; interactive campus map grounded in the UMak Student Handbook.
            </span>
          </span>

          <span className="relative hidden shrink-0 items-center gap-1.5 text-[14px] font-bold tracking-[0.03em] text-white sm:inline-flex">
            <span>TAGA-asK</span>
            <span className="rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase">
              AI
            </span>
          </span>

          <ArrowRight
            className="relative h-4 w-4 shrink-0 text-white/85 transition-transform duration-150 group-hover:translate-x-1"
            aria-hidden
          />
        </a>

        {/* Card 2: Sky-Blue Halftone Mascot Banner */}
        <a
          href="https://orgvault-eosin.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="focus-ring group relative flex items-center gap-4 overflow-hidden rounded-[14px] border border-[#bdd9f0] bg-[#d2e8fa] px-5 py-5 text-[#111113] transition hover:border-[#9fc7e8] sm:px-6"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-64 opacity-45 [background-image:radial-gradient(#5b9bd5_1.35px,transparent_1.35px)] [background-size:8px_8px] [mask-image:linear-gradient(to_left,#000,transparent)]"
          />

          <span className="relative flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-[17px] font-medium leading-snug text-[#111113] group-hover:underline group-hover:underline-offset-4">
              OrgVault — Guarded AI Web3 Treasury
            </span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#3a4a58]">
              Binance Hackathon · BNB Smart Chain
            </span>
            <span className="text-[13px] text-[#4a5968]">
              Gemini AI receipt extraction + EIP-712 on-chain spending caps
            </span>
          </span>

          <span
            aria-hidden="true"
            className="relative hidden h-12 w-12 shrink-0 items-center justify-center sm:flex"
          >
            <MiniMeMascot size={46} bubble={false} />
          </span>

          <ArrowRight
            className="relative h-4 w-4 shrink-0 text-[#3a4a58] transition-transform duration-150 group-hover:translate-x-1"
            aria-hidden
          />
        </a>
      </div>
    </div>
  );
}

export function ExperienceListSection() {
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  function toggleRole(key: string) {
    setExpandedMap((prev: Record<string, boolean>) => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  return (
    <section id="experience" className="scroll-mt-16 flex flex-col gap-4 lg:scroll-mt-10">
      <h2 className="text-[14px] font-medium text-[#6e6e73] dark:text-[#8b8b91]">
        Experience
      </h2>

      <div className="flex flex-col">
        {experienceRoles.map((item) => {
          const key = `${item.role}-${item.period}`;
          const isOpen = Boolean(expandedMap[key]);

          return (
            <div
              key={key}
              className="flex flex-col gap-2 border-t border-[#ebebea] py-4 dark:border-[#232327]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[15.5px] font-medium text-[#111113] dark:text-[#ececee]">
                  {item.role}{" "}
                  <span className="font-normal text-[#6e6e73] dark:text-[#8b8b91]">
                    · {item.org}
                  </span>
                </span>
                <span className="text-[13px] tabular-nums text-[#8a8a8f] dark:text-[#737379]">
                  {item.period}
                </span>
              </div>

              <ul className="list-disc space-y-2 pl-[18px] text-[14.5px] leading-[1.6] text-[#4a4a4f] dark:text-[#adadb3]">
                <li>{item.lead}</li>
              </ul>

              {item.more.length > 0 ? (
                <>
                  <div
                    className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="list-disc space-y-2 pl-[18px] pt-2 text-[14.5px] leading-[1.6] text-[#4a4a4f] dark:text-[#adadb3]">
                        {item.more.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleRole(key)}
                    aria-expanded={isOpen}
                    className="focus-ring w-fit text-[13px] font-medium text-[#6e6e73] transition hover:text-[#111113] dark:text-[#8b8b91] dark:hover:text-[#ececee]"
                  >
                    {isOpen ? "Show less" : `+ ${item.more.length} more`}
                  </button>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ProjectsRowsSection() {
  const [showAllFeatured, setShowAllFeatured] = useState<boolean>(false);
  const [showAllPersonal, setShowAllPersonal] = useState<boolean>(false);

  const validProjects = projects.filter(
    (project) => project.name !== "NC III Graphic Design Work"
  );

  const featuredProjects = validProjects.slice(0, 4);
  const personalProjects = validProjects.slice(4);

  const visibleFeatured = showAllFeatured ? featuredProjects : featuredProjects.slice(0, 3);
  const visiblePersonal = showAllPersonal ? personalProjects : personalProjects.slice(0, 3);

  function openProjectModal(project: ProjectItem) {
    window.dispatchEvent(new CustomEvent("open-project-details", { detail: project }));
  }

  function renderProjectRow(project: ProjectItem) {
    const subtitle = projectSubtitles[project.name] || project.problem || project.description;
    const tag = projectTags[project.name] || project.status;

    return (
      <button
        key={project.name}
        type="button"
        onClick={() => openProjectModal(project)}
        className="focus-ring group flex w-full items-center gap-4 border-t border-[#ebebea] py-4 text-left transition dark:border-[#232327]"
      >
        <div className="relative h-12 w-[72px] shrink-0 overflow-hidden rounded-[8px] border border-[#ebebea] bg-[#ededec] dark:border-[#252529] dark:bg-[#1c1c20]">
          <Image
            src={project.image}
            alt={`${project.name} thumbnail`}
            fill
            sizes="72px"
            className="object-cover object-top transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[15.5px] font-medium text-[#111113] group-hover:underline group-hover:underline-offset-[3px] dark:text-[#ececee]">
              {project.name}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[13.5px] text-[#6e6e73] dark:text-[#8b8b91]">
            {subtitle}
          </p>
        </div>

        <span className=" hidden shrink-0 text-[12.5px] text-[#8a8a8f] dark:text-[#737379] sm:inline">
          {tag}
        </span>
      </button>
    );
  }

  return (
    <section id="projects" className="scroll-mt-16 flex flex-col gap-12 lg:scroll-mt-10">
      {/* Group 1: Client & Hackathon Projects */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-[14px] font-medium text-[#6e6e73] dark:text-[#8b8b91]">
            Client &amp; hackathon projects
          </h2>
          <span className="text-[13px] tabular-nums text-[#9a9a9e] dark:text-[#66666c]">
            0{featuredProjects.length}
          </span>
        </div>

        <div className="flex flex-col">
          {visibleFeatured.map((project) => renderProjectRow(project))}
        </div>

        {featuredProjects.length > 3 ? (
          <button
            type="button"
            onClick={() => setShowAllFeatured((prev: boolean) => !prev)}
            aria-expanded={showAllFeatured}
            className="focus-ring w-fit text-[13px] font-medium text-[#6e6e73] transition hover:text-[#111113] dark:text-[#8b8b91] dark:hover:text-[#ececee]"
          >
            {showAllFeatured ? "Show less" : `+ ${featuredProjects.length - 3} more`}
          </button>
        ) : null}
      </div>

      {/* Group 2: Personal Systems & Arcade */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[14px] font-medium text-[#6e6e73] dark:text-[#8b8b91]">
              Systems &amp; mini-games
            </h2>
            <span className="text-[13px] tabular-nums text-[#9a9a9e] dark:text-[#66666c]">
              0{personalProjects.length}
            </span>
          </div>
          <Link
            href="/game"
            className="focus-ring text-[13px] text-[#6e6e73] transition hover:text-[#111113] dark:text-[#8b8b91] dark:hover:text-[#ececee]"
          >
            Play arcade →
          </Link>
        </div>

        <div className="flex flex-col">
          {visiblePersonal.map((project) => renderProjectRow(project))}
        </div>

        {personalProjects.length > 3 ? (
          <button
            type="button"
            onClick={() => setShowAllPersonal((prev: boolean) => !prev)}
            aria-expanded={showAllPersonal}
            className="focus-ring w-fit text-[13px] font-medium text-[#6e6e73] transition hover:text-[#111113] dark:text-[#8b8b91] dark:hover:text-[#ececee]"
          >
            {showAllPersonal ? "Show less" : `+ ${personalProjects.length - 3} more`}
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function ServicesAndAboutSection() {
  return (
    <section id="about" className="scroll-mt-16 flex flex-col gap-4 lg:scroll-mt-10">
      <div id="services" className="scroll-mt-16 flex items-baseline justify-between lg:scroll-mt-10">
        <h2 className="text-[14px] font-medium text-[#6e6e73] dark:text-[#8b8b91]">
          Services &amp; focus
        </h2>
        <span className="text-[13px] tabular-nums text-[#9a9a9e] dark:text-[#66666c]">
          0{services.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.title}
            className="flex flex-col gap-1.5 rounded-[14px] border border-[#ebebea] bg-white p-4 dark:border-[#232327] dark:bg-[#161619]"
          >
            <h3 className="text-[15px] font-medium text-[#111113] dark:text-[#ececee]">
              {service.title}
            </h3>
            <p className="text-[13.5px] leading-[1.55] text-[#6e6e73] dark:text-[#8b8b91]">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StackKeyValueSection() {
  return (
    <section id="skills" className="scroll-mt-16 flex flex-col gap-5 lg:scroll-mt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[14px] font-medium text-[#6e6e73] dark:text-[#8b8b91]">
          Stack
        </h2>
        <Link
          href="/tech-stack"
          className="focus-ring text-[13px] text-[#6e6e73] transition hover:text-[#111113] dark:text-[#8b8b91] dark:hover:text-[#ececee]"
        >
          View all →
        </Link>
      </div>

      {/* Interactive 3D Mechanical Keyboard */}
      <TechKeyboard compact />

      <div className="flex flex-col">
        {stackRows.map((row) => (
          <div
            key={row.category}
            className="grid grid-cols-1 gap-1 border-t border-[#ebebea] py-3.5 text-[14.5px] dark:border-[#232327] sm:grid-cols-[152px_minmax(0,1fr)] sm:gap-5"
          >
            <span className="text-[#6e6e73] dark:text-[#8b8b91]">{row.category}</span>
            <span className="leading-[1.55] text-[#111113] dark:text-[#ececee]">
              {row.items}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CertificatesRowsSection() {
  const [showAll, setShowAll] = useState<boolean>(false);
  const visible = showAll ? certificates : certificates.slice(0, 4);

  return (
    <section id="certificates" className="scroll-mt-16 flex flex-col gap-3 lg:scroll-mt-10">
      <div className="flex items-baseline gap-2">
        <h2 className="text-[14px] font-medium text-[#6e6e73] dark:text-[#8b8b91]">
          Certificates
        </h2>
        <span className="text-[13px] tabular-nums text-[#9a9a9e] dark:text-[#66666c]">
          0{certificates.length}
        </span>
      </div>

      <div className="flex flex-col">
        {visible.map((cert) => (
          <a
            key={cert.name}
            href={cert.fileUrl || cert.image}
            target="_blank"
            rel="noreferrer"
            className="focus-ring group flex items-center gap-4 border-t border-[#ebebea] py-3.5 text-left dark:border-[#232327]"
          >
            <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-[7px] border border-[#ebebea] bg-[#ededec] dark:border-[#252529] dark:bg-[#1c1c20]">
              <Image
                src={cert.image}
                alt={cert.name}
                fill
                sizes="64px"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium text-[#111113] group-hover:underline group-hover:underline-offset-[3px] dark:text-[#ececee]">
                {cert.name}
              </p>
              <p className="mt-0.5 truncate text-[13px] text-[#6e6e73] dark:text-[#8b8b91]">
                {cert.issuer}
              </p>
            </div>

            <span className="shrink-0 text-xs tabular-nums text-[#8a8a8f] dark:text-[#737379]">
              {cert.date}
            </span>
          </a>
        ))}
      </div>

      {certificates.length > 4 ? (
        <button
          type="button"
          onClick={() => setShowAll((prev: boolean) => !prev)}
          aria-expanded={showAll}
          className="focus-ring w-fit text-[13px] font-medium text-[#6e6e73] transition hover:text-[#111113] dark:text-[#8b8b91] dark:hover:text-[#ececee]"
        >
          {showAll ? "Show less" : `+ ${certificates.length - 4} more`}
        </button>
      ) : null}
    </section>
  );
}
