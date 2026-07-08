"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Command, Mail, MessageCircle, Monitor, Moon, Sun, Users } from "lucide-react";
import { profile } from "@/data/portfolio";
import { useVisitorPresence } from "@/components/useVisitorPresence";

type ThemeMode = "system" | "light" | "dark";

export function HeaderDropdown() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("system");
  const menuRef = useRef<HTMLDivElement>(null);
  const { count, enabled } = useVisitorPresence();

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme-mode") as ThemeMode | null;
    setTheme(savedTheme ?? "system");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = theme === "dark" || (theme === "system" && systemDark);

    root.classList.toggle("dark", shouldUseDark);
    if (theme === "system") {
      window.localStorage.removeItem("theme-mode");
    } else {
      window.localStorage.setItem("theme-mode", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (!open) return;

    const onMouseDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  function openAskPalette() {
    window.dispatchEvent(new Event("open-ask-palette"));
    setOpen(false);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
        aria-label="Open header menu"
        aria-expanded={open}
      >
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-line bg-paper text-ink shadow-soft dark:border-moss dark:bg-ink dark:text-paper">
          <button
            type="button"
            onClick={openAskPalette}
            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium hover:bg-white/70 dark:hover:bg-paper/10"
          >
            <span className="inline-flex items-center gap-2">
              <Command className="h-4 w-4 text-moss" aria-hidden />
              Ask anything
            </span>
            <span className="rounded border border-line px-2 py-0.5 text-xs text-steel dark:border-moss dark:text-paper">Ctrl K</span>
          </button>

          <div className="border-y border-line px-4 py-3 dark:border-moss">
            <div className="flex items-center gap-3 text-sm">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-moss dark:bg-paper">
                <Users className="h-4 w-4" aria-hidden />
              </span>
              <span>{enabled ? `${count} people viewing now` : "Visitor counter ready"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-steel dark:text-paper">
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4" aria-hidden />
                community chat
              </span>
              <span className="rounded-full border border-line px-2 py-0.5 text-xs dark:border-moss">Coming soon</span>
            </div>
          </div>

          <div className="px-4 py-3">
            <div className="flex gap-2">
              {[
                { mode: "system" as const, label: "System", icon: Monitor },
                { mode: "light" as const, label: "Light", icon: Sun },
                { mode: "dark" as const, label: "Dark", icon: Moon }
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setTheme(item.mode)}
                    className={`focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border ${
                      theme === item.mode ? "border-moss text-moss" : "border-line text-steel dark:border-moss dark:text-paper"
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm leading-6 text-steel dark:text-paper">
              For work, collabs &amp; everything else, reach me at{" "}
              <a className="font-mono text-ink underline decoration-line underline-offset-4 dark:text-paper" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </p>
            <a className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-moss" href={`mailto:${profile.email}`}>
              <Mail className="h-4 w-4" aria-hidden />
              Email me
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
