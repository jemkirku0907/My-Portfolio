import Link from "next/link";
import { StackChip, stackGroups } from "@/components/TechStackSection";

export default function TechStackPage() {
  return (
    <main className="min-h-[calc(100dvh-3.75rem)] w-full max-w-full overflow-x-clip lg:min-h-dvh">
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss dark:text-[#8fbc9f]">Stack</p>
            <h1 className="text-3xl font-semibold text-ink dark:text-paper sm:text-5xl">Tech Stack</h1>
            <p className="max-w-2xl text-base leading-7 text-steel dark:text-paper">
              The tools, frameworks, and platforms I use across frontend, backend, AI, CMS, design, and developer workflows.
            </p>
          </div>
          <Link className="focus-ring text-sm font-medium uppercase tracking-[0.16em] text-steel transition hover:text-moss dark:text-paper" href="/#skills">
            Back →
          </Link>
        </div>

        <div className="mt-12 space-y-12 sm:mt-14 sm:space-y-14">
          {stackGroups.map((group) => (
            <section key={group.title} className="grid gap-4 md:grid-cols-[13rem_1fr] md:items-start">
              <h2 className="font-mono text-sm uppercase tracking-[0.16em] text-steel dark:text-paper">{group.title}</h2>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {group.items.map((item) => (
                  <StackChip key={`${group.title}-${item}`} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
