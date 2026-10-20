"use client";

import { useState } from "react";
import { StreetFighterGame } from "@/components/StreetFighterGame";
import { RunnerGame } from "@/components/RunnerGame";
import { Gamepad2, Play } from "lucide-react";

export function GamePageContent() {
  const [activeGame, setActiveGame] = useState<"street-fighter" | "runner">("street-fighter");

  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* Switcher Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-line bg-white/80 p-1 shadow-sm backdrop-blur dark:border-moss dark:bg-ink">
          <button
            type="button"
            onClick={() => setActiveGame("street-fighter")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition ${
              activeGame === "street-fighter"
                ? "bg-ink text-white shadow-sm dark:bg-paper dark:text-ink"
                : "text-steel hover:text-ink dark:text-paper dark:hover:text-moss"
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>Street Fighter Arena</span>
            <span className="rounded-full bg-amber-400/20 px-1.5 py-0.2 text-[10px] text-amber-700 dark:text-amber-300">
              C# Port
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGame("runner")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition ${
              activeGame === "runner"
                ? "bg-ink text-white shadow-sm dark:bg-paper dark:text-ink"
                : "text-steel hover:text-ink dark:text-paper dark:hover:text-moss"
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            <span>Dino Runner</span>
          </button>
        </div>
      </div>

      {/* Active Game Display */}
      {activeGame === "street-fighter" ? (
        <StreetFighterGame />
      ) : (
        <div className="grid place-items-center">
          <RunnerGame />
        </div>
      )}
    </div>
  );
}