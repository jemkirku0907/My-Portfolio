import Link from "next/link";
import { AskPalette } from "@/components/AskPalette";
import { HeaderDropdown } from "@/components/HeaderDropdown";
import { StackChip, stackGroups } from "@/components/TechStackSection";
import { profile } from "@/data/portfolio";

export default function TechStackPage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-clip">
      <header className="sticky top-0 z-30 w-full border-b border-line bg-paper/85 backdrop-blur dark:border-moss dark:bg-ink/90">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-3.5 sm:gap-3 sm:px-8 sm:py-4">
          <Link href="/" className="truncate max-w-[170px] text-xs font-semibold tracking-[0.14em] text-ink dark:text-paper sm:max-w-none sm:text-sm">
            {profile.name}
          </Link>
          <div className="hidden items-center gap-5 text-sm text-steel md:flex">
            <Link href="/#projects" className="hover:text-ink dark:text-paper dark:hover:text-moss">Projects</Link>
            <Link href="/#skills" className="hover:text-ink dark:text-paper dark:hover:text-moss">Skills</Link>
            <Link href="/#certificates" className="hover:text-ink dark:text-paper dark:hover:text-moss">Certificates</Link>
            <Link href="/#contact" className="hover:text-ink dark:text-paper dark:hover:text-moss">Contact</Link>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <AskPalette />
            <HeaderDropdown />
          </div>
        </nav>
      </header>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8 sm:py-20">
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
