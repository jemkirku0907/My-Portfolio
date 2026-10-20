"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, ExternalLink, Gamepad2, Trophy } from "lucide-react";
import { projects } from "@/data/portfolio";

const INITIAL_VISIBLE_COUNT = 4;

export function ProjectsSection({ sectionClass }: { sectionClass: string }) {
  const [showAll, setShowAll] = useState(false);

  // Filter out design samples if already handled elsewhere, or keep all
  const validProjects = projects.filter(
    (project) => project.name !== "NC III Graphic Design Work"
  );

  const visibleProjects = showAll ? validProjects : validProjects.slice(0, INITIAL_VISIBLE_COUNT);
  const remainingCount = validProjects.length - INITIAL_VISIBLE_COUNT;

  return (
    <section id="projects" className={sectionClass}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">Selected work</p>
          <h2 className="text-3xl font-semibold text-ink dark:text-paper sm:text-4xl">Projects</h2>
        </div>
        <p className="text-sm text-steel dark:text-paper">
          Showing {visibleProjects.length} of {validProjects.length} projects
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>

      {validProjects.length > INITIAL_VISIBLE_COUNT && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="focus-ring group inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-moss hover:shadow-soft dark:border-moss dark:bg-ink dark:text-paper dark:hover:border-paper"
            aria-expanded={showAll}
          >
            <span>{showAll ? "Show Less" : `See More Projects (+${remainingCount})`}</span>
            {showAll ? (
              <ChevronUp className="h-4 w-4 transition duration-300 group-hover:-translate-y-0.5" aria-hidden />
            ) : (
              <ChevronDown className="h-4 w-4 transition duration-300 group-hover:translate-y-0.5" aria-hidden />
            )}
          </button>
        </div>
      )}
    </section>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const isHackathonWinner = project.status.toLowerCase().includes("runner up");
  const isMiniGame = project.status.toLowerCase().includes("mini game");
  const hasExternalLink = Boolean(project.href && project.href.startsWith("http"));
  const hasInternalLink = Boolean(project.href && project.href.startsWith("/"));

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-xl border border-line bg-white text-ink shadow-sm transition duration-300 hover:-translate-y-1 hover:border-moss hover:shadow-soft dark:border-moss dark:bg-ink dark:text-paper">
      <div>
        <div className="relative aspect-[16/10] overflow-hidden bg-[#ebe6da] dark:bg-[#1a201c] p-3">
          <Image
            src={project.image}
            alt={`${project.name} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              {isHackathonWinner ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 shadow-sm dark:border-amber-400/30 dark:bg-amber-950/40 dark:text-amber-300">
                  <Trophy className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  {project.status}
                </span>
              ) : isMiniGame ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/60 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-400/30 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Gamepad2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  {project.status}
                </span>
              ) : (
                <p className="text-sm font-medium text-moss">{project.status}</p>
              )}
              <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink dark:text-paper">
                {project.name}
              </h3>
            </div>

            {hasExternalLink ? (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-1 rounded-full border border-line bg-paper/50 px-3 py-1 text-xs font-medium text-steel transition hover:border-moss hover:text-ink dark:border-moss dark:bg-ink dark:text-paper dark:hover:text-moss"
              >
                <span>Live</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : hasInternalLink ? (
              <Link
                href={project.href}
                className="focus-ring inline-flex items-center gap-1 rounded-full border border-line bg-paper/50 px-3 py-1 text-xs font-medium text-steel transition hover:border-moss hover:text-ink dark:border-moss dark:bg-ink dark:text-paper dark:hover:text-moss"
              >
                <span>Play</span>
                <Gamepad2 className="h-3 w-3" />
              </Link>
            ) : (
              <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-steel dark:border-moss dark:text-paper">
                Preview
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-steel dark:text-paper sm:text-base">
            {project.description}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 sm:p-6 sm:pt-0">
        <div className="flex flex-wrap gap-2 pt-2 border-t border-line/60 dark:border-moss/40">
          {project.stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-steel dark:border-moss dark:text-paper"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}