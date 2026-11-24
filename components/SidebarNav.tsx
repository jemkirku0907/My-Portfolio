"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type MouseEvent as ReactMouseEvent
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Gamepad2,
  Laptop,
  Mail,
  MessageSquare,
  Monitor,
  Moon,
  PanelLeft,
  PanelLeftClose,
  Sun,
  Users,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import MiniMeMascot from "@/components/MiniMeMascot";
import { useVisitorPresence } from "@/components/useVisitorPresence";
import { profile } from "@/data/portfolio";

type ThemeMode = "system" | "light" | "dark";

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
  };
};

type IconNavItem = {
  label: string;
  href: string;
  external?: boolean;
  sectionId?: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

type SectionNavItem = {
  label: string;
  href: string;
  sectionId: string;
};

const topIconLinks: IconNavItem[] = [
  {
    label: "Tech Stack",
    href: "/tech-stack",
    icon: Laptop
  },
  {
    label: "Avoid Boredom",
    href: "/game",
    icon: Gamepad2
  },
  {
    label: "Resume",
    href: profile.resume,
    external: true,
    icon: BookOpen
  }
];

const workIconLinks: IconNavItem[] = [
  {
    label: "Services",
    href: "/#services",
    sectionId: "services",
    icon: Briefcase
  },
  {
    label: "Contact",
    href: "/#contact",
    sectionId: "contact",
    icon: Users
  }
];

const sectionLinks: SectionNavItem[] = [
  { label: "Projects", href: "/#projects", sectionId: "projects" },
  { label: "Experience", href: "/#experience", sectionId: "experience" },
  { label: "Skills", href: "/#skills", sectionId: "skills" },
  { label: "Certificates", href: "/#certificates", sectionId: "certificates" },
  { label: "GitHub", href: "/#github", sectionId: "github" },
  { label: "About", href: "/#about", sectionId: "about" },
  { label: "Outside Code", href: "/#beyond-code", sectionId: "beyond-code" }
];

const OBSERVED_SECTIONS = [
  "about",
  "services",
  "beyond-code",
  "projects",
  "skills",
  "certificates",
  "github",
  "experience",
  "contact"
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("projects");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const { count, enabled } = useVisitorPresence();

  const playClickSound = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.035);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Ignore audio policy restrictions
    }
  }, [soundEnabled]);

  function resolveTheme(nextTheme: ThemeMode) {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return nextTheme === "dark" || (nextTheme === "system" && systemDark);
  }

  function applyTheme(nextTheme: ThemeMode) {
    const root = document.documentElement;
    const shouldUseDark = resolveTheme(nextTheme);
    root.classList.toggle("dark", shouldUseDark);
    if (nextTheme === "system") {
      window.localStorage.removeItem("theme-mode");
    } else {
      window.localStorage.setItem("theme-mode", nextTheme);
    }
  }

  useEffect(() => {
    setMounted(true);

    const savedCollapsed = window.localStorage.getItem("sidebar-collapsed");
    if (savedCollapsed === "1") {
      setCollapsed(true);
    }

    const savedSound = window.localStorage.getItem("sidebar-sound");
    if (savedSound === "1") {
      setSoundEnabled(true);
    }

    const savedTheme = window.localStorage.getItem("theme-mode") as ThemeMode | null;
    const initialTheme: ThemeMode =
      savedTheme === "light" || savedTheme === "dark" ? savedTheme : "system";
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === "g") {
        event.preventDefault();
        router.push("/game");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const elements = OBSERVED_SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-18% 0px -55% 0px",
        threshold: [0.05, 0.2, 0.5]
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  function toggleDesktopCollapse() {
    playClickSound();
    setCollapsed((prev: boolean) => {
      const next = !prev;
      window.localStorage.setItem("sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  }

  function toggleSound() {
    setSoundEnabled((prev: boolean) => {
      const next = !prev;
      window.localStorage.setItem("sidebar-sound", next ? "1" : "0");
      return next;
    });
  }

  function openAskPalette() {
    playClickSound();
    setMobileOpen(false);
    window.dispatchEvent(new Event("open-ask-palette"));
  }

  function openCommunityChat() {
    playClickSound();
    setMobileOpen(false);
    window.dispatchEvent(new Event("open-community-chat"));
  }

  function setThemeWithReveal(nextTheme: ThemeMode, event: ReactMouseEvent<HTMLButtonElement>) {
    playClickSound();
    if (nextTheme === theme) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const currentIsDark = document.documentElement.classList.contains("dark");
    const nextIsDark = resolveTheme(nextTheme);

    if (currentIsDark === nextIsDark) {
      applyTheme(nextTheme);
      setTheme(nextTheme);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const transitionDocument = document as DocumentWithViewTransition;

    if (!transitionDocument.startViewTransition || prefersReducedMotion) {
      applyTheme(nextTheme);
      setTheme(nextTheme);
      return;
    }

    const transition = transitionDocument.startViewTransition(() => {
      applyTheme(nextTheme);
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
        },
        {
          duration: 460,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)"
        }
      );
    });
  }

  function renderIconLink(item: IconNavItem) {
    const Icon = item.icon;
    const isRouteActive =
      (item.href === "/game" && pathname === "/game") ||
      (item.href === "/tech-stack" && pathname === "/tech-stack") ||
      (pathname === "/" && Boolean(item.sectionId) && activeSection === item.sectionId);

    const linkClasses = `focus-ring group flex items-center gap-3 py-1.5 text-sm transition-colors ${
      isRouteActive
        ? "font-medium text-ink dark:text-paper"
        : "text-steel hover:text-ink dark:text-paper/70 dark:hover:text-paper"
    }`;

    const content = (
      <>
        <Icon
          className={`h-[15px] w-[15px] shrink-0 transition-colors ${
            isRouteActive
              ? "text-ink dark:text-paper"
              : "text-steel/80 group-hover:text-ink dark:text-paper/60 dark:group-hover:text-paper"
          }`}
          aria-hidden
        />
        <span className="truncate">{item.label}</span>
      </>
    );

    if (item.external) {
      return (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            playClickSound();
            setMobileOpen(false);
          }}
          className={linkClasses}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href}
        aria-current={isRouteActive ? "page" : undefined}
        onClick={() => {
          playClickSound();
          setMobileOpen(false);
        }}
        className={linkClasses}
      >
        {content}
      </Link>
    );
  }

  const viewerCount = mounted && enabled ? count : 1;

  return (
    <>
      {/* Mobile sticky top bar (< lg) — straight flush bar */}
      <header className="sticky top-0 z-30 flex w-full items-center justify-between gap-2 border-b border-line bg-white/95 px-3 py-2 backdrop-blur dark:border-moss/60 dark:bg-ink/95 lg:hidden">
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="portfolio-sidebar"
            className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center text-ink transition hover:bg-black/[0.04] dark:text-paper dark:hover:bg-white/[0.08]"
          >
            <PanelLeft className="h-5 w-5" aria-hidden />
          </button>
          <Link
            href="/"
            className="focus-ring truncate px-1 py-1 text-[15px] font-semibold tracking-[-0.01em] text-ink dark:text-paper"
          >
            {profile.name}
          </Link>
        </div>
      </header>

      {/* Desktop expand button when sidebar is collapsed */}
      {collapsed ? (
        <button
          type="button"
          onClick={toggleDesktopCollapse}
          aria-label="Expand sidebar"
          title="Expand sidebar"
          className="focus-ring fixed left-3 top-3 z-30 hidden h-9 w-9 items-center justify-center rounded border border-line bg-white text-ink shadow-sm transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper lg:inline-flex"
        >
          <PanelLeft className="h-4 w-4" aria-hidden />
        </button>
      ) : null}

      {/* Mobile drawer scrim */}
      {mobileOpen ? (
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[1px] lg:hidden"
        />
      ) : null}

      {/* Straight, flush full-height left sidebar (no outer card border-radius) */}
      <aside
        id="portfolio-sidebar"
        aria-label="Sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[264px] shrink-0 flex-col rounded-none border-r border-line bg-white text-ink transition-transform duration-200 ease-out motion-reduce:transition-none dark:border-moss/60 dark:bg-[#121212] dark:text-paper lg:sticky lg:top-0 lg:z-20 lg:w-[252px] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:hidden" : "lg:translate-x-0"}`}
      >
        {/* Top Name Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 px-7 pb-5 pt-7">
          <Link
            href="/"
            onClick={() => {
              playClickSound();
              setMobileOpen(false);
            }}
            className="focus-ring truncate text-[17px] font-semibold tracking-[-0.015em] text-ink transition hover:text-moss dark:text-paper dark:hover:text-[#8fbc9f]"
          >
            {profile.name}
          </Link>

          <button
            type="button"
            onClick={toggleDesktopCollapse}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="focus-ring -mr-2 hidden h-8 w-8 shrink-0 items-center justify-center rounded text-steel/70 transition hover:bg-black/[0.04] hover:text-ink dark:text-paper/60 dark:hover:bg-white/[0.06] dark:hover:text-paper lg:inline-flex"
          >
            <PanelLeftClose className="h-4 w-4" aria-hidden />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="focus-ring -mr-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded text-steel transition hover:bg-black/[0.04] hover:text-ink dark:text-paper/75 dark:hover:bg-white/[0.08] lg:hidden"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {/* Scrollable Vertical Navigation */}
        <nav
          aria-label="Main"
          className="sidebar-scroll flex min-h-0 flex-1 flex-col overflow-y-auto px-7 py-1"
        >
          <div className="flex flex-col gap-1">
            {topIconLinks.map((item) => renderIconLink(item))}
          </div>

          <div className="mt-5 flex flex-col gap-1">
            {workIconLinks.map((item) => renderIconLink(item))}
          </div>

          <div className="mt-5 flex flex-col gap-1 pb-2">
            {sectionLinks.map((item) => {
              const active = pathname === "/" && activeSection === item.sectionId;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    playClickSound();
                    setActiveSection(item.sectionId);
                    setMobileOpen(false);
                  }}
                  className={`focus-ring flex items-center gap-2 py-1.5 text-sm transition-colors ${
                    active
                      ? "font-medium text-ink dark:text-paper"
                      : "text-steel hover:text-ink dark:text-paper/70 dark:hover:text-paper"
                  }`}
                >
                  {active ? (
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink dark:text-paper" aria-hidden />
                  ) : null}
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Fixed Sections */}
        <div className="shrink-0 px-7 pb-6 pt-3">
          {/* Keyboard Shortcut Rows */}
          <div className="space-y-2 pb-4 text-[13px]">
            <button
              type="button"
              onClick={openAskPalette}
              className="focus-ring flex w-full items-center gap-2 text-left text-steel transition hover:text-ink dark:text-paper/70 dark:hover:text-paper"
            >
              <span>Ask anything</span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                <kbd className="rounded-[4px] border border-line bg-paper/60 px-1.5 py-0.5 text-steel dark:border-moss/60 dark:bg-white/[0.04] dark:text-paper/80">
                  Ctrl
                </kbd>
                <span className="text-steel/60 dark:text-paper/45">+</span>
                <kbd className="rounded-[4px] border border-line bg-paper/60 px-1.5 py-0.5 text-steel dark:border-moss/60 dark:bg-white/[0.04] dark:text-paper/80">
                  K
                </kbd>
              </span>
            </button>

            <Link
              href="/game"
              onClick={() => {
                playClickSound();
                setMobileOpen(false);
              }}
              className="focus-ring flex w-full items-center gap-2 text-left text-steel transition hover:text-ink dark:text-paper/70 dark:hover:text-paper"
            >
              <span>Avoid boredom</span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                <kbd className="rounded-[4px] border border-line bg-paper/60 px-1.5 py-0.5 text-steel dark:border-moss/60 dark:bg-white/[0.04] dark:text-paper/80">
                  Alt
                </kbd>
                <span className="text-steel/60 dark:text-paper/45">+</span>
                <kbd className="rounded-[4px] border border-line bg-paper/60 px-1.5 py-0.5 text-steel dark:border-moss/60 dark:bg-white/[0.04] dark:text-paper/80">
                  G
                </kbd>
              </span>
            </Link>
          </div>

          {/* Live Presence & Community Chat */}
          <div className="border-t border-line/80 py-4 dark:border-moss/45">
            <div className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-line bg-paper dark:border-moss/60 dark:bg-white/[0.05]">
              <MiniMeMascot size={26} bubble={false} />
            </div>

            <p className="mt-2 text-xs text-steel dark:text-paper/65" suppressHydrationWarning>
              <strong className="font-semibold tabular-nums text-ink dark:text-paper" suppressHydrationWarning>
                {viewerCount}
              </strong>{" "}
              {viewerCount === 1 ? "person viewing now" : "people viewing now"}
            </p>

            <button
              type="button"
              onClick={openCommunityChat}
              className="focus-ring mt-2.5 inline-flex items-center gap-2.5 text-sm text-steel transition hover:text-ink dark:text-paper/75 dark:hover:text-paper"
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>Community chat</span>
            </button>
          </div>

          {/* Theme Switcher + Sound Toggle + Email Footer */}
          <div className="border-t border-line/80 pt-4 dark:border-moss/45">
            <div className="flex items-center gap-2">
              <div
                role="group"
                aria-label="Theme mode"
                className="inline-flex items-center gap-0.5 rounded-full border border-line p-1 dark:border-moss/60"
              >
                {(
                  [
                    { mode: "system" as const, label: "System theme", icon: Monitor },
                    { mode: "light" as const, label: "Light theme", icon: Sun },
                    { mode: "dark" as const, label: "Dark theme", icon: Moon }
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  const active = mounted && theme === item.mode;
                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={(event: ReactMouseEvent<HTMLButtonElement>) =>
                        setThemeWithReveal(item.mode, event)
                      }
                      aria-label={item.label}
                      aria-pressed={active}
                      className={`focus-ring inline-flex h-7 w-7 items-center justify-center rounded-full transition ${
                        active
                          ? "bg-black/[0.08] text-ink dark:bg-white/[0.14] dark:text-paper"
                          : "text-steel/80 hover:text-ink dark:text-paper/60 dark:hover:text-paper"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={toggleSound}
                aria-label={soundEnabled ? "Mute UI sounds" : "Enable UI sounds"}
                aria-pressed={soundEnabled}
                title={soundEnabled ? "Sound effects on" : "Sound effects muted"}
                className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-steel transition hover:text-ink dark:border-moss/60 dark:text-paper/70 dark:hover:text-paper"
              >
                {soundEnabled ? (
                  <Volume2 className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <VolumeX className="h-3.5 w-3.5" aria-hidden />
                )}
              </button>
            </div>

            <p className="mt-4 text-[12px] leading-5 text-steel/85 dark:text-paper/60">
              For work, collabs &amp; everything else, reach me at
            </p>

            <a
              href={`mailto:${profile.email}`}
              className="focus-ring mt-1.5 inline-flex max-w-full items-center gap-2 text-[13px] font-medium text-ink transition hover:text-moss dark:text-paper dark:hover:text-[#8fbc9f]"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{profile.email}</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
