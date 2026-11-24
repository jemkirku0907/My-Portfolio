import Link from "next/link";
import { TechKeyboard } from "@/components/TechKeyboard";

export const featuredStack = ["TypeScript", "React", "Next.js", "C#", "PHP", "MySQL", "PostgreSQL", "Supabase", "Tailwind CSS", "GitHub", "Vercel", "Figma", "Canva"];

export const stackGroups = [
  {
    title: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"]
  },
  {
    title: "Backend",
    items: ["C#", ".NET", "PHP", "Laravel", "MySQL", "PostgreSQL", "Supabase", "Solidity", "EIP-712", "BNB Smart Chain", "Java", "Node.js", "C++", "Visual Basic", "VB.NET", "REST APIs"]
  },
  {
    title: "DevOps & Cloud",
    items: ["Vercel", "Netlify", "GitHub Actions"]
  },
  {
    title: "AI",
    items: ["Gemini API", "Codex", "Anthropic"]
  },
  {
    title: "CMS & Design",
    items: ["WordPress", "Figma", "Canva", "Adobe Photoshop", "Adobe Illustrator"]
  },
  {
    title: "Developer Tools",
    items: ["Visual Studio", "Git", "GitHub", "VS Code", "IntelliJ IDEA", "ClickUp", "Monday", "Discord"]
  }
];

export function StackChip({ item, muted = false }: { item: string; muted?: boolean }) {
  return (
    <span
      className={`inline-flex min-h-10 items-center rounded-lg border px-3.5 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 hover:border-moss ${
        muted
          ? "border-dashed border-[#dcdcda] text-[#6e6e73] dark:border-[#2c2c31] dark:text-[#adadb3]"
          : "border-[#ebebea] bg-white text-[#111113] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[#252529] dark:bg-[#161619] dark:text-[#ececee]"
      }`}
    >
      {item}
    </span>
  );
}

export function TechStackSection() {
  return (
    <section id="skills" className="mx-auto w-full max-w-5xl scroll-mt-16 border-y border-line px-4 py-14 dark:border-moss sm:px-8 sm:py-16 lg:scroll-mt-6 lg:px-12">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss dark:text-[#8fbc9f]">Stack</p>
          <h2 className="text-3xl font-semibold text-ink dark:text-paper sm:text-4xl">Technologies</h2>
        </div>
        <Link
          href="/tech-stack"
          className="focus-ring text-sm font-medium uppercase tracking-[0.16em] text-steel transition hover:text-moss dark:text-paper"
        >
          View All →
        </Link>
      </div>

      <TechKeyboard />
    </section>
  );
}