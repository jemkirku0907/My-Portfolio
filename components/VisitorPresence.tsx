"use client";

import { Users } from "lucide-react";
import { useVisitorPresence } from "@/components/useVisitorPresence";

export function VisitorPresence() {
  const { count, enabled } = useVisitorPresence();
  const displayCount = enabled ? count : 0;

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-line bg-white/70 px-3 py-1.5 text-sm text-ink backdrop-blur dark:border-moss dark:bg-ink dark:text-paper">
      <div className="flex -space-x-2" aria-hidden>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-paper text-[0.65rem] font-semibold text-moss shadow-sm dark:border-ink dark:bg-paper"
          >
            {["J", "M", "A"][index]}
          </span>
        ))}
      </div>
      <Users className="h-4 w-4 text-moss" aria-hidden />
      <span>{enabled ? `${displayCount} people viewing now` : "Visitor counter ready"}</span>
    </div>
  );
}
