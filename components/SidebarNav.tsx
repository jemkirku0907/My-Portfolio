"use client";

import { useEffect, useState, type ComponentType, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Briefcase,
  Compass,
  FileText,
  Gamepad2,
  GitCommitHorizontal,
  Github,
  History,
  Layers,
  LayoutGrid,
  Linkedin,
  Mail,
  MessageCircle,
  PanelLeft,
  PanelLeftClose,
  Sparkles,
  User,
  X
} from "lucide-react";
import MiniMeMascot from "@/components/MiniMeMascot";
import { stackGroups } from "@/components/TechStackSection";
import { useVisitorPresence } from "@/components/useVisitorPresence";
import { certificates, profile, projects, services, timeline } from "@/data/portfolio";

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
  };
};

type NavItem = {
  label: string;
  href?: string;
  sectionId?: string;
  external?: boolean;
  onAction?: "ask-palette";
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  count?: number;
  shortcut?: string;
};

const visibleProjectCount = projects.filter(
  (project) => project.name !== "NC III Graphic Design Work"
).length;
const totalStackCount = stackGroups.reduce((sum, group) => sum + group.items.length, 0);

const primaryItems: NavItem[] = [
  {
    label: "Services",
    href: "/#services",
    sectionId: "services",
    icon: Briefcase,
    count: services.length
  },
  {
    label: "Projects",
    href: "/#projects",
    sectionId: "projects",
    icon: LayoutGrid,
    count: visibleProjectCount
  },
  {
    label: "Certificates",
    href: "/#certificates",
    sectionId: "certificates",
    icon: Award,
    count: certificates.length
  },
  {
    label: "Resume",
    href: profile.resume,
    external: true,
    icon: FileText
  }
];

const exploreItems: NavItem[] = [
  {
    label: "Ask anything",
    onAction: "ask-palette",
    icon: Sparkles,
    shortcut: "Ctrl K"
  },
  {
    label: "Avoid Boredom",
    href: "/game",
    icon: Gamepad2,
    count: 2
  },
  {
    label: "Tech Stack",
    href: "/tech-stack",
    icon: Layers,
    count: totalStackCount
  },
  {
    label: "Outside Code",
    href: "/#beyond-code",
    sectionId: "beyond-code",
    icon: Compass,
    count: 6
  }
];

const portfolioItems: NavItem[] = [
  {
    label: "More about me",
    href: "/#about",
    sectionId: "about",
    icon: User
  },
  {
    label: "Experience",
    href: "/#experience",
    sectionId: "experience",
    icon: History,
    count: timeline.length
  },
  {
    label: "GitHub",
    href: "/#github",
    sectionId: "github",
    icon: GitCommitHorizontal
  }
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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [manilaTime, setManilaTime] = useState<string>("");
  const { count, enabled } = useVisitorPresence();

  const githubUser = process.env.NEXT_PUBLIC_GITHUB_USERNAME || profile.github;

  useEffect(() => {
    setMounted(true);

    const savedCollapsed = window.localStorage.getItem("sidebar-collapsed");
    if (savedCollapsed === "1") {
      setCollapsed(true);
    }

    const savedTheme = window.localStorage.getItem("theme-mode");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark =
      savedTheme === "dark" || ((!savedTheme || savedTheme === "system") && systemDark);

    document.documentElement.classList.toggle("dark", initialDark);
    setIsDark(initialDark);

    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Manila",
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }).format(new Date());
        setManilaTime(formatted);
      } catch {
        setManilaTime("");
      }
    };

    updateClock();
    const timer = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(timer);
  }, []);

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
    setCollapsed((prev: boolean) => {
      const next = !prev;
      window.localStorage.setItem("sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  }

  function openAskPalette() {
    setMobileOpen(false);
    window.dispatchEvent(new Event("open-ask-palette"));
  }

  function openCommunityChat() {
    setMobileOpen(false);
    window.dispatchEvent(new Event("open-community-chat"));
  }

  function toggleTheme(event: ReactMouseEvent<HTMLButtonElement>) {
    const nextDark = !isDark;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const transitionDocument = document as DocumentWithViewTransition;

    const commitTheme = () => {
      document.documentElement.classList.toggle("dark", nextDark);
      window.localStorage.setItem("theme-mode", nextDark ? "dark" : "light");
      setIsDark(nextDark);
    };

    if (!transitionDocument.startViewTransition || prefersReducedMotion) {
      commitTheme();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = transitionDocument.startViewTransition(() => {
      commitTheme();
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

  function isItemActive(item: NavItem) {
    if (item.href === "/game") return pathname === "/game";
    if (item.href === "/tech-stack") return pathname === "/tech-stack";
    if (pathname === "/" && item.sectionId) {
      return activeSection === item.sectionId;
    }
    return false;
  }

  function renderNavGroup(items: NavItem[], groupLabel?: string) {
    return (
      <div className="flex flex-col gap-0.5">
        {groupLabel ? (
          <span className="px-3 pb-1.5 text-xs font-medium tracking-[0.01em] text-steel/85 dark:text-paper/55">
            {groupLabel}
          </span>
        ) : null}
        {items.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item);
          const itemClasses = `focus-ring group flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition duration-150 motion-reduce:transition-none ${
            active
              ? "bg-gradient-to-b from-white to-[#eeeae0] text-ink shadow-[inset_0_0_0_1px_#ded9ce,inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(17,17,17,0.06)] dark:from-[#232925] dark:to-[#1b201d] dark:text-paper dark:shadow-[inset_0_0_0_1px_rgba(66,100,81,0.7),0_1px_2px_rgba(0,0,0,0.35)]"
              : "text-steel hover:bg-black/[0.04] hover:text-ink dark:text-paper/80 dark:hover:bg-white/[0.06] dark:hover:text-paper"
          }`;

          const iconClasses = `h-4 w-4 shrink-0 transition-colors ${
            active
              ? "text-moss dark:text-[#8fbc9f]"
              : "text-steel/75 group-hover:text-ink dark:text-paper/55 dark:group-hover:text-paper"
          }`;

          const inner = (
            <>
              <Icon className={iconClasses} aria-hidden />
              <span className="truncate">{item.label}</span>
              {typeof item.count === "number" ? (
                <span className="ml-auto font-mono text-xs font-medium tabular-nums text-steel/75 dark:text-paper/50">
                  {item.count}
                </span>
              ) : null}
              {item.shortcut ? (
                <kbd className="ml-auto rounded-md border border-line/90 bg-white/80 px-1.5 py-0.5 font-mono text-[11px] font-medium text-steel dark:border-moss/60 dark:bg-ink/70 dark:text-paper/75">
                  {item.shortcut}
                </kbd>
              ) : null}
            </>
          );

          if (item.onAction === "ask-palette") {
            return (
              <button
                key={item.label}
                type="button"
                onClick={openAskPalette}
                className={`${itemClasses} text-left`}
              >
                {inner}
              </button>
            );
          }

          if (item.external && item.href) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
                className={itemClasses}
              >
                {inner}
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href || "/"}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
              className={itemClasses}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {/* Mobile sticky top bar (< lg) */}
      <header className="sticky top-0 z-30 flex w-full items-center justify-between gap-2 border-b border-line bg-paper/90 px-3 py-2 backdrop-blur dark:border-moss/60 dark:bg-ink/90 lg:hidden">
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="portfolio-sidebar"
            className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-ink transition hover:bg-black/[0.05] dark:text-paper dark:hover:bg-white/[0.08]"
          >
            <PanelLeft className="h-5 w-5" aria-hidden />
          </button>
          <Link
            href="/"
            className="focus-ring truncate rounded-md px-1 py-1 text-base font-semibold tracking-[-0.01em] text-ink dark:text-paper"
          >
            {profile.name}
          </Link>
        </div>

        <button
          type="button"
          onClick={openAskPalette}
          aria-label="Ask anything"
          className="focus-ring inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-xs font-medium text-ink shadow-sm transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
        >
          <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center">
            <MiniMeMascot size={24} bubble={false} />
          </span>
          <span>Ask AI</span>
        </button>
      </header>

      {/* Desktop floating expand button when sidebar is collapsed */}
      {collapsed ? (
        <button
          type="button"
          onClick={toggleDesktopCollapse}
          aria-label="Expand sidebar"
          title="Expand sidebar"
          className="focus-ring fixed left-4 top-4 z-30 hidden h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper/95 text-ink shadow-[0_2px_10px_rgba(17,17,17,0.08)] backdrop-blur transition hover:border-moss dark:border-moss dark:bg-[#151816] dark:text-paper lg:inline-flex"
        >
          <PanelLeft className="h-[18px] w-[18px]" aria-hidden />
        </button>
      ) : null}

      {/* Mobile drawer backdrop scrim */}
      {mobileOpen ? (
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-ink/45 backdrop-blur-[2px] lg:hidden"
        />
      ) : null}

      {/* Floating rounded left sidebar (sticky on desktop, slide-over drawer on mobile) */}
      <aside
        id="portfolio-sidebar"
        aria-label="Sidebar"
        className={`sidebar-shell fixed left-2.5 top-2.5 z-50 h-[calc(100dvh-20px)] w-[min(292px,calc(100vw-20px))] shrink-0 rounded-[26px] border border-line/95 bg-gradient-to-b from-[#f3f0e8] to-[#e8e3d7] p-[5px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_2px_4px_rgba(17,17,17,0.05),0_24px_56px_rgba(17,17,17,0.22)] transition-transform duration-200 ease-out motion-reduce:transition-none dark:border-moss/60 dark:from-[#181b19] dark:to-[#111412] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_56px_rgba(0,0,0,0.55)] lg:sticky lg:left-auto lg:top-3 lg:z-20 lg:my-3 lg:ml-3 lg:h-[calc(100dvh-24px)] lg:w-[268px] lg:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(17,17,17,0.05),0_18px_40px_rgba(17,17,17,0.08)] ${
          mobileOpen ? "translate-x-0" : "-translate-x-[115%]"
        } ${collapsed ? "lg:hidden" : "lg:translate-x-0"}`}
      >
        <div className="sidebar-grain flex h-full flex-col gap-4 overflow-hidden rounded-[21px] border border-line/80 bg-paper/95 px-3 pt-3.5 shadow-[0_1px_3px_rgba(17,17,17,0.05)] dark:border-moss/45 dark:bg-[#151816]">
          {/* Sidebar top header: Name + Collapse/Close button */}
          <div className="flex shrink-0 items-center justify-between gap-2 pl-2.5 pr-1 pt-0.5">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="focus-ring truncate rounded-md text-[17px] font-semibold tracking-[-0.02em] text-ink transition hover:text-moss dark:text-paper dark:hover:text-[#8fbc9f]"
            >
              {profile.name}
            </Link>

            <button
              type="button"
              onClick={toggleDesktopCollapse}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className="focus-ring hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-steel transition hover:bg-black/[0.05] hover:text-ink dark:text-paper/75 dark:hover:bg-white/[0.08] dark:hover:text-paper lg:inline-flex"
            >
              <PanelLeftClose className="h-[18px] w-[18px]" aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-steel transition hover:bg-black/[0.05] hover:text-ink dark:text-paper/75 dark:hover:bg-white/[0.08] dark:hover:text-paper lg:hidden"
            >
              <X className="h-[18px] w-[18px]" aria-hidden />
            </button>
          </div>

          {/* Primary tactile pill CTA (Contact) */}
          <Link
            href="/#contact"
            onClick={() => setMobileOpen(false)}
            className="focus-ring flex h-[46px] w-full shrink-0 items-center gap-2.5 rounded-full bg-gradient-to-b from-white to-[#f2efe7] px-4 text-[15px] font-medium text-ink shadow-[inset_0_0_0_1px_#ded9ce,inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(17,17,17,0.06),0_4px_10px_rgba(17,17,17,0.04)] transition duration-150 hover:shadow-[inset_0_0_0_1px_#cbc4b5,inset_0_1px_0_rgba(255,255,255,0.95),0_2px_4px_rgba(17,17,17,0.08),0_8px_16px_rgba(17,17,17,0.06)] active:translate-y-px motion-reduce:transition-none dark:from-[#222824] dark:to-[#1a1f1c] dark:text-paper dark:shadow-[inset_0_0_0_1px_rgba(66,100,81,0.65),inset_0_1px_0_rgba(255,255,255,0.06),0_4px_12px_rgba(0,0,0,0.35)] dark:hover:shadow-[inset_0_0_0_1px_rgba(143,188,159,0.55),inset_0_1px_0_rgba(255,255,255,0.08),0_6px_16px_rgba(0,0,0,0.45)]"
          >
            <Mail className="h-4 w-4 shrink-0 text-ink dark:text-paper" aria-hidden />
            <span className="flex-1 truncate">Contact</span>
          </Link>

          {/* Scrollable grouped navigation */}
          <nav
            aria-label="Main"
            className="sidebar-scroll flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-0.5"
          >
            {renderNavGroup(primaryItems)}
            {renderNavGroup(exploreItems, "Explore")}
            {renderNavGroup(portfolioItems, "Portfolio")}
          </nav>

          {/* Live presence & Community Chat strip */}
          <div className="mt-auto flex shrink-0 items-center justify-between gap-2.5 pl-2.5 pr-1 pt-1">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-xs text-steel/85 dark:text-paper/60">Viewing now</span>
              <span
                className="inline-flex items-center gap-1.5 text-[13px] font-medium tabular-nums text-ink dark:text-paper"
                suppressHydrationWarning
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-moss dark:bg-[#8fbc9f]"
                  aria-hidden="true"
                />
                <span className="truncate" suppressHydrationWarning>
                  {mounted && enabled ? `${count} online` : "Live chat"}
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={openCommunityChat}
              className="focus-ring inline-flex h-[36px] shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-b from-white to-[#f2efe7] px-3.5 text-sm font-medium text-ink shadow-[inset_0_0_0_1px_#ded9ce,inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(17,17,17,0.06),0_4px_10px_rgba(17,17,17,0.04)] transition duration-150 hover:shadow-[inset_0_0_0_1px_#cbc4b5,0_4px_12px_rgba(17,17,17,0.08)] active:translate-y-px motion-reduce:transition-none dark:from-[#222824] dark:to-[#1a1f1c] dark:text-paper dark:shadow-[inset_0_0_0_1px_rgba(66,100,81,0.65),inset_0_1px_0_rgba(255,255,255,0.06),0_4px_10px_rgba(0,0,0,0.35)]"
            >
              <MessageCircle className="h-3.5 w-3.5 text-moss dark:text-[#8fbc9f]" aria-hidden />
              <span>Chat</span>
            </button>
          </div>

          {/* Bottom footer bar: Timezone + Theme & Social icon buttons */}
          <div className="-mx-3 flex shrink-0 items-center gap-1.5 border-t border-line/85 px-4 py-3.5 dark:border-moss/45">
            <div
              className="flex min-w-0 flex-1 flex-col pl-1.5 text-xs text-steel dark:text-paper/65"
              title={mounted && manilaTime ? `Manila, Philippines · ${manilaTime}` : "Philippines Time (GMT+8)"}
            >
              <span className="font-medium tabular-nums">GMT+8</span>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={mounted ? isDark : undefined}
              title={mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="focus-ring inline-flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-steel shadow-[inset_0_0_0_1px_#ded9ce] transition hover:bg-black/[0.04] hover:text-ink dark:text-paper/80 dark:shadow-[inset_0_0_0_1px_rgba(66,100,81,0.65)] dark:hover:bg-white/[0.06] dark:hover:text-paper"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="5.75" />
                <path d="M8 2.25a5.75 5.75 0 0 1 0 11.5z" fill="currentColor" />
              </svg>
            </button>

            <a
              href={`mailto:${profile.email}`}
              aria-label="Send email"
              title={`Email ${profile.email}`}
              className="focus-ring inline-flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-steel shadow-[inset_0_0_0_1px_#ded9ce] transition hover:bg-black/[0.04] hover:text-ink dark:text-paper/80 dark:shadow-[inset_0_0_0_1px_rgba(66,100,81,0.65)] dark:hover:bg-white/[0.06] dark:hover:text-paper"
            >
              <Mail className="h-[15px] w-[15px]" aria-hidden />
            </a>

            <a
              href={`https://github.com/${githubUser}`}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              title="GitHub"
              className="focus-ring inline-flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-steel shadow-[inset_0_0_0_1px_#ded9ce] transition hover:bg-black/[0.04] hover:text-ink dark:text-paper/80 dark:shadow-[inset_0_0_0_1px_rgba(66,100,81,0.65)] dark:hover:bg-white/[0.06] dark:hover:text-paper"
            >
              <Github className="h-[15px] w-[15px]" aria-hidden />
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              title="LinkedIn"
              className="focus-ring inline-flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-steel shadow-[inset_0_0_0_1px_#ded9ce] transition hover:bg-black/[0.04] hover:text-ink dark:text-paper/80 dark:shadow-[inset_0_0_0_1px_rgba(66,100,81,0.65)] dark:hover:bg-white/[0.06] dark:hover:text-paper"
            >
              <Linkedin className="h-[15px] w-[15px]" aria-hidden />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
