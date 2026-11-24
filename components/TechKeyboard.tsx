"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Volume2, VolumeX } from "lucide-react";

type KeyCap = {
  id: string;
  label: string;
  short: string;
  category: string;
  description: string;
  hotkey: string;
  faceClass: string;
  skirtClass: string;
  textClass?: string;
};

const KEYCAPS: KeyCap[] = [
  // Row 1 - Frontend
  {
    id: "js",
    label: "JavaScript",
    short: "JS",
    category: "Frontend",
    description: "Core scripting for interactive web apps, DOM logic, and async API flows.",
    hotkey: "1",
    faceClass: "bg-[#f59e0b] border-[#fbbf24]",
    skirtClass: "bg-[#b45309]",
    textClass: "text-white"
  },
  {
    id: "ts",
    label: "TypeScript",
    short: "TS",
    category: "Frontend",
    description: "Type-safe full-stack code across Next.js apps, APIs, and smart contract integrations.",
    hotkey: "2",
    faceClass: "bg-[#2563eb] border-[#60a5fa]",
    skirtClass: "bg-[#1e40af]",
    textClass: "text-white"
  },
  {
    id: "react",
    label: "React",
    short: "React",
    category: "Frontend",
    description: "Component architecture, hooks, state management, and responsive PWAs like PharSayo.",
    hotkey: "3",
    faceClass: "bg-[#06b6d4] border-[#67e8f9]",
    skirtClass: "bg-[#0e7490]",
    textClass: "text-white"
  },
  {
    id: "nextjs",
    label: "Next.js",
    short: "Next",
    category: "Full-Stack",
    description: "App Router, SSR, and API routes powering OrgVault, TAGA-asK AI, Marajo Group, and Suri.AI.",
    hotkey: "4",
    faceClass: "bg-[#18181b] border-[#3f3f46]",
    skirtClass: "bg-[#09090b]",
    textClass: "text-white"
  },
  {
    id: "tailwind",
    label: "Tailwind CSS",
    short: "TW",
    category: "Frontend",
    description: "Utility-first styling for fast, consistent, dark-mode-ready interfaces.",
    hotkey: "5",
    faceClass: "bg-[#0ea5e9] border-[#7dd3fc]",
    skirtClass: "bg-[#0369a1]",
    textClass: "text-white"
  },

  // Row 2 - Core & .NET / PHP
  {
    id: "html",
    label: "HTML5",
    short: "HTML",
    category: "Frontend",
    description: "Semantic markup and accessible structure for SEO and screen readers.",
    hotkey: "Q",
    faceClass: "bg-[#ea580c] border-[#fb923c]",
    skirtClass: "bg-[#9a3412]",
    textClass: "text-white"
  },
  {
    id: "css",
    label: "CSS3",
    short: "CSS",
    category: "Frontend",
    description: "Custom animations, grid/flex layouts, and 3D transforms.",
    hotkey: "W",
    faceClass: "bg-[#3b82f6] border-[#93c5fd]",
    skirtClass: "bg-[#1d4ed8]",
    textClass: "text-white"
  },
  {
    id: "csharp",
    label: "C#",
    short: "C#",
    category: "Backend & Game",
    description: "Object-oriented programming for .NET apps and Street Fighter Arcade combat logic.",
    hotkey: "E",
    faceClass: "bg-[#7c3aed] border-[#a78bfa]",
    skirtClass: "bg-[#5b21b6]",
    textClass: "text-white"
  },
  {
    id: "dotnet",
    label: ".NET",
    short: ".NET",
    category: "Backend & Desktop",
    description: "Windows Forms & Visual Studio desktop builds with real-time game loops.",
    hotkey: "R",
    faceClass: "bg-[#4f46e5] border-[#818cf8]",
    skirtClass: "bg-[#3730a3]",
    textClass: "text-white"
  },
  {
    id: "php",
    label: "PHP",
    short: "PHP",
    category: "Backend",
    description: "Server-side authentication, OTP flows, and CRUD systems like QUACC.",
    hotkey: "T",
    faceClass: "bg-[#6366f1] border-[#a5b4fc]",
    skirtClass: "bg-[#4338ca]",
    textClass: "text-white"
  },

  // Row 3 - Backend & Databases
  {
    id: "laravel",
    label: "Laravel",
    short: "Lv",
    category: "Backend",
    description: "Structured PHP MVC routing, Eloquent models, and blade/API backends.",
    hotkey: "A",
    faceClass: "bg-[#ef4444] border-[#fca5a5]",
    skirtClass: "bg-[#b91c1c]",
    textClass: "text-white"
  },
  {
    id: "nodejs",
    label: "Node.js",
    short: "Node",
    category: "Backend",
    description: "Express APIs, backend services, and AI-assisted endpoints.",
    hotkey: "S",
    faceClass: "bg-[#16a34a] border-[#4ade80]",
    skirtClass: "bg-[#15803d]",
    textClass: "text-white"
  },
  {
    id: "supabase",
    label: "Supabase",
    short: "Supa",
    category: "Database & Auth",
    description: "PostgreSQL, row-level security, realtime presence, and storage.",
    hotkey: "D",
    faceClass: "bg-[#10b981] border-[#6ee7b7]",
    skirtClass: "bg-[#047857]",
    textClass: "text-white"
  },
  {
    id: "postgresql",
    label: "PostgreSQL",
    short: "PG",
    category: "Database",
    description: "Relational schemas, indexing, and production queries.",
    hotkey: "F",
    faceClass: "bg-[#1d4ed8] border-[#60a5fa]",
    skirtClass: "bg-[#1e3a8a]",
    textClass: "text-white"
  },
  {
    id: "mysql",
    label: "MySQL",
    short: "SQL",
    category: "Database",
    description: "Structured relational databases for PHP/XAMPP and community systems.",
    hotkey: "G",
    faceClass: "bg-[#0284c7] border-[#38bdf8]",
    skirtClass: "bg-[#0369a1]",
    textClass: "text-white"
  },

  // Row 4 - Cloud, Web3, AI & Design
  {
    id: "vercel",
    label: "Vercel",
    short: "▲",
    category: "DevOps & Cloud",
    description: "Production deployments, preview URLs, and serverless edge functions.",
    hotkey: "Z",
    faceClass: "bg-[#27272a] border-[#52525b]",
    skirtClass: "bg-[#09090b]",
    textClass: "text-white"
  },
  {
    id: "github",
    label: "GitHub",
    short: "Git",
    category: "DevOps",
    description: "Version control, CI/CD workflows, and collaborative team shipping.",
    hotkey: "X",
    faceClass: "bg-[#334155] border-[#64748b]",
    skirtClass: "bg-[#0f172a]",
    textClass: "text-white"
  },
  {
    id: "solidity",
    label: "Solidity / BSC",
    short: "Web3",
    category: "Blockchain",
    description: "Smart contracts (OrgVault.sol) & EIP-712 attestations on BNB Smart Chain.",
    hotkey: "C",
    faceClass: "bg-[#d97706] border-[#fbbf24]",
    skirtClass: "bg-[#92400e]",
    textClass: "text-white"
  },
  {
    id: "gemini",
    label: "Gemini AI",
    short: "AI",
    category: "AI",
    description: "Receipt verification, RAG knowledge search, and portfolio assistant integrations.",
    hotkey: "V",
    faceClass: "bg-[#8b5cf6] border-[#c4b5fd]",
    skirtClass: "bg-[#5b21b6]",
    textClass: "text-white"
  },
  {
    id: "figma",
    label: "Figma",
    short: "Fig",
    category: "Design",
    description: "UI wireframes, design systems, and NC III Graphic Design workflows.",
    hotkey: "B",
    faceClass: "bg-[#ec4899] border-[#f9a8d4]",
    skirtClass: "bg-[#be185d]",
    textClass: "text-white"
  }
];

export function TechKeyboard({ compact = false }: { compact?: boolean }) {
  const [selectedId, setSelectedId] = useState<string>("nextjs");
  const [pressedId, setPressedId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const audioCtxRef = useRef<AudioContext | null>(null);

  const selectedKey = KEYCAPS.find((k) => k.id === selectedId) ?? KEYCAPS[3];

  const playClick = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.045);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.055);
    } catch {
      // Ignore audio errors if blocked by browser autoplay policy
    }
  }, [soundEnabled]);

  const triggerKey = useCallback(
    (key: KeyCap) => {
      setSelectedId(key.id);
      setPressedId(key.id);
      playClick();
      window.setTimeout(() => {
        setPressedId((prev: string | null) => (prev === key.id ? null : prev));
      }, 140);
    },
    [playClick]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const pressedChar = e.key.toUpperCase();
      const matched = KEYCAPS.find((k) => k.hotkey === pressedChar);
      if (matched) {
        triggerKey(matched);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [triggerKey]);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: nx * 10, y: ny * -10 });
  };

  return (
    <div
      className={
        compact
          ? "mt-2 grid grid-cols-1 gap-5 rounded-[16px] border border-[#ebebea] bg-white p-5 dark:border-[#232327] dark:bg-[#161619]"
          : "mt-8 grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:items-center"
      }
    >
      {/* Readout panel */}
      <div
        className={
          compact
            ? "space-y-3 border-b border-[#ebebea] pb-4 dark:border-[#232327]"
            : "space-y-4 rounded-2xl border border-[#ebebea] bg-white p-6 shadow-sm dark:border-[#232327] dark:bg-[#161619]"
        }
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-moss" aria-hidden />
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#6e6e73] dark:text-[#8b8b91]">
              (hint: click or press a key)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSoundEnabled((prev: boolean) => !prev)}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-[#e5e5e3] px-2.5 py-1 font-mono text-[11px] text-[#6e6e73] transition hover:border-[#111113] hover:text-[#111113] dark:border-[#2c2c31] dark:text-[#adadb3] dark:hover:border-[#8fbc9f] dark:hover:text-white"
            aria-label={soundEnabled ? "Mute key sound" : "Enable key sound"}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>{soundEnabled ? "Sound On" : "Muted"}</span>
          </button>
        </div>

        <div className="space-y-1.5 pt-0.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3
              className={
                compact
                  ? "text-2xl font-semibold tracking-tight text-[#111113] dark:text-[#ececee]"
                  : "text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#ececee] sm:text-4xl"
              }
            >
              {selectedKey.label}
            </h3>
            <span className="rounded-full border border-[#e5e5e3] bg-[#fcfcfb] px-2.5 py-0.5 font-mono text-xs font-medium text-moss dark:border-[#2c2c31] dark:bg-[#111113] dark:text-[#8fbc9f]">
              {selectedKey.category}
            </span>
            <kbd className="ml-auto rounded border border-[#e5e5e3] bg-[#fcfcfb] px-2 py-0.5 font-mono text-xs font-semibold text-[#111113] dark:border-[#2c2c31] dark:bg-[#111113] dark:text-[#ececee]">
              Key: {selectedKey.hotkey}
            </kbd>
          </div>
          <p className="text-sm leading-6 text-[#6e6e73] dark:text-[#adadb3]">
            {selectedKey.description}
          </p>
        </div>
      </div>

      {/* Right 3D Isometric Mechanical Keyboard */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="flex items-center justify-center py-4 sm:py-6"
        style={{ perspective: "1100px" }}
      >
        <div
          className="relative w-full max-w-[460px] rounded-[24px] border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-3.5 shadow-[0_28px_50px_-15px_rgba(0,0,0,0.45)] transition-transform duration-200 ease-out sm:p-4"
          style={{
            transform: `rotateX(${26 + tilt.y}deg) rotateZ(${-12 + tilt.x * 0.4}deg)`,
            transformStyle: "preserve-3d"
          }}
        >
          {/* Keyboard outer rim depth */}
          <div
            className="pointer-events-none absolute inset-x-1 -bottom-2.5 h-3 rounded-b-[22px] bg-zinc-950/90"
            aria-hidden
          />

          <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
            {KEYCAPS.map((key) => {
              const isSelected = selectedId === key.id;
              const isPressed = pressedId === key.id;

              return (
                <button
                  key={key.id}
                  type="button"
                  onMouseEnter={() => setSelectedId(key.id)}
                  onClick={() => triggerKey(key)}
                  aria-label={`${key.label} (${key.category})`}
                  aria-pressed={isSelected}
                  className="focus-ring group relative h-14 w-full cursor-pointer select-none rounded-xl text-left outline-none sm:h-16"
                >
                  {/* Keycap 3D skirt */}
                  <span
                    className={`absolute inset-x-0 bottom-0 top-1.5 rounded-xl transition-all duration-100 ${key.skirtClass}`}
                    aria-hidden
                  />

                  {/* Keycap top face */}
                  <span
                    className={`relative flex h-[calc(100%-6px)] w-full flex-col justify-between rounded-xl border px-2 py-1.5 shadow-inner transition-transform duration-100 ${key.faceClass} ${
                      key.textClass ?? "text-white"
                    } ${
                      isPressed
                        ? "translate-y-[5px]"
                        : isSelected
                          ? "translate-y-[2px] ring-2 ring-white/80"
                          : "group-hover:translate-y-[1px]"
                    }`}
                  >
                    <span className="font-mono text-[9px] leading-none opacity-75">
                      {key.hotkey}
                    </span>
                    <span className="truncate font-mono text-xs font-bold tracking-tight sm:text-sm">
                      {key.short}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
