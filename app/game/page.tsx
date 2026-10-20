import { AskPalette } from "@/components/AskPalette";
import { HeaderDropdown } from "@/components/HeaderDropdown";
import { GamePageContent } from "@/components/GamePageContent";
import { profile } from "@/data/portfolio";

export default function GamePage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-clip">
      <header className="sticky top-0 z-30 w-full border-b border-line bg-paper/85 backdrop-blur dark:border-moss dark:bg-ink/90">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-3.5 sm:gap-3 sm:px-8 sm:py-4">
          <a href="/" className="truncate max-w-[170px] text-xs font-semibold tracking-[0.14em] text-ink dark:text-paper sm:max-w-none sm:text-sm">
            {profile.name}
          </a>
          <div className="hidden items-center gap-5 text-sm text-steel md:flex">
            <a href="/#projects" className="hover:text-ink dark:text-paper dark:hover:text-moss">Projects</a>
            <a href="/#skills" className="hover:text-ink dark:text-paper dark:hover:text-moss">Skills</a>
            <a href="/#certificates" className="hover:text-ink dark:text-paper dark:hover:text-moss">Certificates</a>
            <a href="/#contact" className="hover:text-ink dark:text-paper dark:hover:text-moss">Contact</a>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <AskPalette />
            <HeaderDropdown />
          </div>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-76px)] w-full max-w-4xl place-items-center px-4 py-8 sm:px-8 sm:py-10">
        <GamePageContent />
      </section>
    </main>
  );
}
