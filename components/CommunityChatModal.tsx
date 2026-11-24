"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Laptop, MessageSquare, Smartphone, X } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useVisitorPresence } from "@/components/useVisitorPresence";

type ChatMessage = {
  id: string;
  sender: string;
  body: string;
  location?: string;
  device?: "mobile" | "desktop";
  createdAt: string;
};

const NAME_STORAGE_KEY = "portfolio-chat-name";
const MESSAGES_STORAGE_KEY = "portfolio-community-messages-v1";
const DAY_MS = 24 * 60 * 60 * 1000;

function filterLastDay(items: ChatMessage[]) {
  const cutoff = Date.now() - DAY_MS;
  return items.filter((item) => {
    const ts = Date.parse(item.createdAt);
    return Number.isFinite(ts) ? ts >= cutoff : true;
  });
}

function mergeMessages(base: ChatMessage[], incoming: ChatMessage[]) {
  const map = new Map<string, ChatMessage>();
  for (const m of [...base, ...incoming]) {
    map.set(m.id, m);
  }
  return filterLastDay(Array.from(map.values()))
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    .slice(-80);
}

function formatRelativeTime(iso: string) {
  const diffMs = Math.max(0, Date.now() - Date.parse(iso));
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function MinimalAvatar({ name }: { name: string }) {
  const initial = (name.trim()[0] || "V").toUpperCase();
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-xs font-semibold text-ink shadow-sm dark:border-moss dark:bg-ink dark:text-paper"
      aria-hidden
    >
      {initial}
    </span>
  );
}

export function CommunityChatModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nickname, setNickname] = useState<string>("");
  const [nameConfirmed, setNameConfirmed] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>("");
  const [location, setLocation] = useState<string>("Manila, PH");
  const [device, setDevice] = useState<"mobile" | "desktop">("desktop");
  const [hydrated, setHydrated] = useState<boolean>(false);
  const { count } = useVisitorPresence();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null);
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const msgInputRef = useRef<HTMLInputElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-community-chat", onOpen);
    return () => window.removeEventListener("open-community-chat", onOpen);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(NAME_STORAGE_KEY);
    if (saved && saved.trim()) {
      setNickname(saved.trim().slice(0, 24));
      setNameConfirmed(true);
    }

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    setDevice(isMobile ? "mobile" : "desktop");

    fetch("/api/visitor-geo")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.location) setLocation(data.location);
      })
      .catch(() => {});

    try {
      const rawMessages = window.localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (rawMessages) {
        const parsed = JSON.parse(rawMessages);
        if (Array.isArray(parsed)) {
          setMessages((prev) => mergeMessages(prev, parsed));
        }
      }
    } catch {
      // Ignore malformed local storage
    } finally {
      setHydrated(true);
    }
  }, []);

  const playTypeSound = useCallback((key: string) => {
    if (typeof window === "undefined") return;
    if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab", "Escape"].includes(key)) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(key === " " || key === "Enter" ? 175 : 240, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore audio errors
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    if (nameConfirmed) {
      msgInputRef.current?.focus();
    } else {
      nameInputRef.current?.focus();
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, nameConfirmed]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/community-chat", { cache: "no-store" });
        if (!res.ok) return;
        const payload = await res.json();
        if (!cancelled && Array.isArray(payload?.messages) && payload.messages.length > 0) {
          setMessages((prev) => mergeMessages(prev, payload.messages));
        }
      } catch {
        // localStorage + live broadcast still work
      }
    })();

    const channel = supabase.channel("portfolio-community-chat", {
      config: { broadcast: { self: false } }
    });

    channel
      .on("broadcast", { event: "chat-message" }, ({ payload }: { payload: ChatMessage }) => {
        if (!payload?.id || !payload?.body) return;
        setMessages((prev) => mergeMessages(prev, [payload]));
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const recent = filterLastDay(messages);
      window.localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(recent));
    } catch {
      // Ignore storage quota errors
    }
  }, [messages, hydrated]);

  useEffect(() => {
    if (open) {
      listEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleConfirmName = (e: FormEvent) => {
    e.preventDefault();
    const clean = nickname.trim().slice(0, 24);
    if (!clean) return;
    setNickname(clean);
    window.localStorage.setItem(NAME_STORAGE_KEY, clean);
    setNameConfirmed(true);
  };

  async function handleSubmitMessage(e: FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;

    const sender = nickname.trim() || "Visitor";
    const msg: ChatMessage = {
      id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      sender,
      body: body.slice(0, 280),
      location,
      device,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => mergeMessages(prev, [msg]));
    setDraft("");

    if (channelRef.current) {
      try {
        await channelRef.current.send({
          type: "broadcast",
          event: "chat-message",
          payload: msg
        });
      } catch {
        // Ignore broadcast errors
      }
    }

    try {
      await fetch("/api/community-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, sender: msg.sender, body: msg.body })
      });
    } catch {
      // Table optional
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 p-4 backdrop-blur-sm" onMouseDown={() => setOpen(false)}>
      <div
        className="mx-auto mt-8 sm:mt-14 flex max-h-[82vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-paper text-ink shadow-soft dark:border-moss dark:bg-ink dark:text-paper"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Minimal top bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2 text-xs tabular-nums text-steel dark:text-paper/70">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden />
            <span>{messages.length} messages</span>
            <span>·</span>
            <span>{count} online</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close community chat"
            className="focus-ring rounded-lg p-1.5 text-steel transition hover:text-ink dark:text-paper/75 dark:hover:text-paper"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message feed */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-3">
          {messages.length === 0 ? (
            <p className="py-10 text-center text-xs text-steel dark:text-paper/65">
              No messages yet — say hi below!
            </p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3.5">
                <MinimalAvatar name={msg.sender} />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-steel dark:text-paper/70">
                    <span className="font-medium text-ink dark:text-paper">{msg.sender}</span>
                    {msg.location ? (
                      <>
                        <span>·</span>
                        <span>{msg.location}</span>
                      </>
                    ) : null}
                    {msg.device === "mobile" ? (
                      <Smartphone className="h-3 w-3 opacity-70" aria-hidden />
                    ) : (
                      <Laptop className="h-3 w-3 opacity-70" aria-hidden />
                    )}
                    <span>·</span>
                    <span className="tabular-nums">{formatRelativeTime(msg.createdAt)}</span>
                  </div>
                  <div className="inline-block max-w-full rounded-2xl bg-[#e7e5df] px-4 py-2 text-sm leading-relaxed text-ink dark:bg-white/10 dark:text-paper">
                    <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={listEndRef} />
        </div>

        {/* Two-step minimal bottom prompt */}
        <div className="border-t border-line/70 px-6 py-5 dark:border-moss/60">
          {!nameConfirmed ? (
            <form onSubmit={handleConfirmName} className="space-y-3">
              <label
                htmlFor="chat-name-step"
                className="block text-sm text-steel dark:text-paper/75"
              >
                What&apos;s your name?
              </label>
              <div className="flex items-center justify-between gap-4">
                <input
                  id="chat-name-step"
                  ref={nameInputRef}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onKeyDown={(e) => playTypeSound(e.key)}
                  maxLength={24}
                  placeholder="Your name"
                  className="w-full bg-transparent text-base text-ink placeholder:text-steel/50 outline-none dark:text-paper dark:placeholder:text-paper/40"
                />
                <button
                  type="submit"
                  disabled={!nickname.trim()}
                  className="focus-ring shrink-0 text-sm font-medium text-steel transition hover:text-ink disabled:opacity-40 dark:text-paper/75 dark:hover:text-paper"
                >
                  Next ↵
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitMessage} className="space-y-3">
              <div className="flex items-center justify-between text-xs text-steel dark:text-paper/70">
                <span>Chatting as {nickname}</span>
                <button
                  type="button"
                  onClick={() => setNameConfirmed(false)}
                  className="underline decoration-line underline-offset-4 hover:text-ink dark:hover:text-paper"
                >
                  Change name
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <input
                  ref={msgInputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => playTypeSound(e.key)}
                  maxLength={280}
                  placeholder="Write a message..."
                  className="w-full bg-transparent text-sm text-ink placeholder:text-steel/50 outline-none dark:text-paper dark:placeholder:text-paper/40"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="focus-ring shrink-0 text-sm font-medium text-steel transition hover:text-ink disabled:opacity-40 dark:text-paper/75 dark:hover:text-paper"
                >
                  Send ↵
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
