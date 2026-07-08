"use client";

import { Users } from "lucide-react";
import { useVisitorPresence } from "@/components/useVisitorPresence";

export function VisitorPresence() {
  const { count, enabled } = useVisitorPresence();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-1 text-sm text-ink backdrop-blur">
      <Users className="h-4 w-4 text-moss" aria-hidden />
      <span>{enabled ? `${count} people viewing now` : "Visitor counter ready"}</span>
    </div>
  );
}
