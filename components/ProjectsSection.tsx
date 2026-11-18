"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronUp, ExternalLink, FileText, Gamepad2, Trophy, X } from "lucide-react";
import { projects } from "@/data/portfolio";

type ProjectItem = (typeof projects)[number];

const INITIAL_VISIBLE_COUNT = 4;

export function ProjectsSection({ sectionClass }: { sectionClass: string }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const validProjects = projects;
  const visibleProjects = showAll ? validProjects : validProjects.slice(0, INITIAL_VISIBLE_COUNT);
  const remainingCount = validProjects.length - INITIAL_VISIBLE_COUNT;

  useEffect(() => {
    if (!selectedProject) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedProject]);

  return (
    <section id="projects" className={sectionClass}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss dark:text-[#8fbc9f]">Selected work</p>
          <h2 className="text-3xl font-semibold text-ink dark:text-paper sm:text-4xl">Projects</h2>
        </div>
        <p className="text-sm text-steel dark:text-paper">
          Showing {visibleProjects.length} of {validProjects.length} projects · Click any card for details
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {visibleProjects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            onOpenDetails={() => setSelectedProject(project)}
          />
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

      {selectedProject ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-ink/50 p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={() => setSelectedProject(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            className="flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-paper text-ink shadow-soft dark:border-moss dark:bg-ink dark:text-paper"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-line bg-[#ebe6da] dark:border-moss dark:bg-[#1a201c]">
              <Image
                src={selectedProject.image}
                alt={`${selectedProject.name} preview`}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain p-3"
              />
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                className="focus-ring absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper/90 text-ink shadow-sm transition hover:border-moss dark:border-moss dark:bg-ink/90 dark:text-paper"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-moss dark:text-[#8fbc9f]">
                    {selectedProject.status} · {selectedProject.role}
                  </p>
                  <h3 id="case-study-title" className="mt-1 text-2xl font-semibold text-ink dark:text-paper">
                    {selectedProject.name}
                  </h3>
                </div>

                {selectedProject.href.startsWith("http") ? (
                  <a
                    href={selectedProject.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 dark:bg-paper dark:text-ink"
                  >
                    <span>Visit Live</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                ) : selectedProject.href.startsWith("/") ? (
                  <Link
                    href={selectedProject.href}
                    onClick={() => setSelectedProject(null)}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 dark:bg-paper dark:text-ink"
                  >
                    <span>Play Mini Game</span>
                    <Gamepad2 className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <p className="font-mono text-xs uppercase tracking-wider text-steel dark:text-paper/70">
                  Problem &amp; Context
                </p>
                <p className="text-sm leading-6 text-steel dark:text-paper/90">
                  {selectedProject.problem}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="font-mono text-xs uppercase tracking-wider text-steel dark:text-paper/70">
                  Overview
                </p>
                <p className="text-sm leading-6 text-steel dark:text-paper/90">
                  {selectedProject.description}
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-mono text-xs uppercase tracking-wider text-steel dark:text-paper/70">
                  What I Built
                </p>
                <ul className="space-y-2">
                  {selectedProject.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink dark:text-paper">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-moss dark:text-[#8fbc9f]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-line pt-4 dark:border-moss">
                {selectedProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-steel dark:border-moss dark:text-paper"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ProjectCard({
  project,
  onOpenDetails
}: {
  project: ProjectItem;
  onOpenDetails: () => void;
}) {
  const isHackathonWinner = project.status.toLowerCase().includes("runner up");
  const isMiniGame = project.status.toLowerCase().includes("mini game");
  const hasExternalLink = Boolean(project.href && project.href.startsWith("http"));
  const hasInternalLink = Boolean(project.href && project.href.startsWith("/"));

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-xl border border-line bg-white text-ink shadow-sm transition duration-300 hover:-translate-y-1 hover:border-moss hover:shadow-soft dark:border-moss dark:bg-ink dark:text-paper">
      <div>
        <button
          type="button"
          onClick={onOpenDetails}
          aria-label={`View case study for ${project.name}`}
          className="focus-ring relative block aspect-[16/10] w-full overflow-hidden bg-[#ebe6da] p-3 text-left dark:bg-[#1a201c]"
        >
          <Image
            src={project.image}
            alt={`${project.name} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
          />
        </button>

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
                <p className="text-sm font-medium text-moss dark:text-[#8fbc9f]">{project.status}</p>
              )}
              <button
                type="button"
                onClick={onOpenDetails}
                className="focus-ring mt-1.5 block text-left text-xl font-semibold tracking-tight text-ink transition hover:text-moss dark:text-paper dark:hover:text-[#8fbc9f]"
              >
                {project.name}
              </button>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenDetails}
                className="focus-ring inline-flex items-center gap-1 rounded-full border border-line bg-paper/50 px-3 py-1 text-xs font-medium text-steel transition hover:border-moss hover:text-ink dark:border-moss dark:bg-ink dark:text-paper dark:hover:text-[#8fbc9f]"
              >
                <FileText className="h-3 w-3" aria-hidden />
                <span>Details</span>
              </button>
              {hasExternalLink ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-1 rounded-full border border-line bg-paper/50 px-3 py-1 text-xs font-medium text-steel transition hover:border-moss hover:text-ink dark:border-moss dark:bg-ink dark:text-paper dark:hover:text-[#8fbc9f]"
                >
                  <span>Live</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : hasInternalLink ? (
                <Link
                  href={project.href}
                  className="focus-ring inline-flex items-center gap-1 rounded-full border border-line bg-paper/50 px-3 py-1 text-xs font-medium text-steel transition hover:border-moss hover:text-ink dark:border-moss dark:bg-ink dark:text-paper dark:hover:text-[#8fbc9f]"
                >
                  <span>Play</span>
                  <Gamepad2 className="h-3 w-3" />
                </Link>
              ) : null}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-steel dark:text-paper sm:text-base">
            {project.description}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 sm:p-6 sm:pt-0">
        <div className="flex flex-wrap gap-2 border-t border-line/60 pt-2 dark:border-moss/40">
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
