"use client";

import { useState } from "react";

const TECH_ITEMS = ["Next.js", "React", "Supabase", "C# / .NET", "PHP/MySQL"] as const;

export function HeroIntro() {
  const [activeTech, setActiveTech] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-light leading-snug text-ink dark:text-paper sm:text-4xl md:text-5xl">
        Full-Stack Web Developer
      </h2>

      <p className="max-w-4xl text-base leading-7 text-steel dark:text-paper sm:text-xl sm:leading-8">
        I build practical web systems across frontend, backend, databases, and deployment with{" "}
        {TECH_ITEMS.map((tech, idx) => {
          const isActive = activeTech === tech;
          const isLast = idx === TECH_ITEMS.length - 1;
          return (
            <span key={tech}>
              {isLast ? "and " : ""}
              <button
                type="button"
                onClick={() => setActiveTech(isActive ? null : tech)}
                aria-pressed={isActive}
                className={`focus-ring inline-flex items-center rounded-full border px-3 py-0.5 text-sm sm:text-base transition duration-200 cursor-pointer ${
                  isActive
                    ? "border-moss bg-ink text-white shadow-sm -translate-y-0.5 dark:bg-paper dark:text-ink"
                    : "border-line bg-white text-ink hover:-translate-y-0.5 hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
                }`}
              >
                {tech}
              </button>
              {isLast ? "." : ", "}
            </span>
          );
        })}
      </p>
    </div>
  );
}
