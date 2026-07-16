import Link from "next/link";

export const featuredStack = ["TypeScript", "React", "Next.js", "PHP", "MySQL", "PostgreSQL", "Supabase", "Tailwind CSS", "GitHub", "Vercel", "Netlify", "Figma", "Adobe Photoshop", "Adobe Illustrator", "Canva"];

export const stackGroups = [
  {
    title: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "React"]
  },
  {
    title: "Backend",
    items: ["PHP", "MySQL", "PostgreSQL", "Java", "Node.js", "C++", "Visual Basic", "VB.NET"]
  },
  {
    title: "AI",
    items: ["Gemini API", "Codex", "Anthropic", "WordPress"]
  },
  {
    title: "Developer Tools",
    items: ["Git", "GitHub", "GitHub Actions", "VS Code", "ClickUp", "Monday", "Discord", "IntelliJ IDEA"]
  }
];

export function StackChip({ item, muted = false }: { item: string; muted?: boolean }) {
  return (
    <span
      className={`rounded-lg border px-4 py-2 font-mono text-sm shadow-sm transition hover:-translate-y-0.5 hover:border-moss sm:text-base ${
        muted
          ? "border-dashed border-line text-steel dark:border-moss dark:text-paper"
          : "border-line bg-white text-steel hover:text-ink dark:border-moss dark:bg-ink dark:text-paper dark:hover:text-moss"
      }`}
    >
      {item}
    </span>
  );
}

export function TechStackSection() {
  return (
    <section id="skills" className="mx-auto w-full max-w-6xl border-y border-line px-5 py-16 dark:border-moss sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">Stack</p>
          <h2 className="text-3xl font-semibold text-ink dark:text-paper sm:text-4xl">Technologies</h2>
        </div>
        <Link
          href="/tech-stack"
          className="focus-ring text-sm font-medium uppercase tracking-[0.16em] text-steel transition hover:text-moss dark:text-paper"
        >
          View All →
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {featuredStack.map((item) => (
          <StackChip key={item} item={item} />
        ))}
        <StackChip item="+ more" muted />
      </div>
    </section>
  );
}
