import Link from "next/link";
import { TechKeyboard } from "@/components/TechKeyboard";
import { StackChip, stackGroups } from "@/components/TechStackSection";

export default function TechStackPage() {
  return (
    <main className="min-h-[calc(100dvh-3.75rem)] w-full max-w-full overflow-x-clip lg:min-h-dvh">
      <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-[14px] font-medium text-[#6e6e73] dark:text-[#8b8b91]">Stack</p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#ececee] sm:text-4xl">
              Tech Stack
            </h1>
            <p className="max-w-2xl text-[15.5px] leading-7 text-[#4a4a4f] dark:text-[#adadb3]">
              Click or press a keycap on the 3D mechanical keyboard below, or browse the full categorized stack across frontend, backend, AI/Web3, cloud, and design.
            </p>
          </div>
          <Link
            className="focus-ring text-sm font-medium text-[#6e6e73] transition hover:text-[#111113] dark:text-[#8b8b91] dark:hover:text-[#ececee]"
            href="/#skills"
          >
            ← Back
          </Link>
        </div>

        {/* Interactive 3D Mechanical Keyboard */}
        <div className="mt-4">
          <TechKeyboard />
        </div>

        {/* Full Categorized Stack List */}
        <div className="mt-16 space-y-10 border-t border-[#ebebea] pt-12 dark:border-[#232327]">
          {stackGroups.map((group) => (
            <section
              key={group.title}
              className="grid gap-4 md:grid-cols-[12rem_1fr] md:items-start"
            >
              <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-[#6e6e73] dark:text-[#8b8b91]">
                {group.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2.5">
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
