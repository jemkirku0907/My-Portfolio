"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ExternalLink, Gamepad2, X } from "lucide-react";
import type { projects } from "@/data/portfolio";

type ProjectItem = (typeof projects)[number];

export function ProjectCaseStudyModal() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const customEvent = event as CustomEvent<ProjectItem>;
      if (customEvent.detail) {
        setSelectedProject(customEvent.detail);
      }
    };

    window.addEventListener("open-project-details", onOpen);
    return () => window.removeEventListener("open-project-details", onOpen);
  }, []);

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

  if (!selectedProject) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-ink/55 p-4 backdrop-blur-sm sm:p-6"
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
  );
}
