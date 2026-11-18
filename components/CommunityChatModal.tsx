"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, Send, Users, X } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useVisitorPresence } from "@/components/useVisitorPresence";

type ChatMessage = {
  id: string;
  sender: string;
  body: string;
  createdAt: string;
};

const NAME_STORAGE_KEY = "portfolio-chat-name";

function createGuestName() {
  const num = Math.floor(100 + Math.random() * 900);
  return `Visitor #${num}`;
}

export function CommunityChatModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nickname, setNickname] = useState<string>("Visitor");
  const [draft, setDraft] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const { count } = useVisitorPresence();

  useEffect(() => {
    setMounted(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null);
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(NAME_STORAGE_KEY);
    if (saved && saved.trim()) {
      setNickname(saved.trim().slice(0, 24));
    } else {
      const guest = createGuestName();
      window.localStorage.setItem(NAME_STORAGE_KEY, guest);
      setNickname(guest);
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
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    inputRef.current?.focus();

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;

    // Load persisted history if `community_messages` table exists
    (async () => {
      try {
        const { data, error } = await supabase
          .from("community_messages")
          .select("id, sender, body, created_at")
          .order("created_at", { ascending: true })
          .limit(40);
        if (!cancelled && !error && Array.isArray(data)) {
          setMessages(
            data.map((row) => ({
              id: String(row.id),
              sender: String(row.sender ?? "Visitor"),
              body: String(row.body ?? ""),
              createdAt: String(row.created_at ?? new Date().toISOString())
            }))
          );
        }
      } catch {
        // Table not configured; live broadcast still works
      }
    })();

    const channel = supabase.channel("portfolio-community-chat", {
      config: { broadcast: { self: false } }
    });

    channel
      .on("broadcast", { event: "chat-message" }, ({ payload }: { payload: ChatMessage }) => {
        if (!payload?.id || !payload?.body) return;
        setMessages((prev) => (prev.some((m) => m.id === payload.id) ? prev : [...prev.slice(-49), payload]));
      })
      .subscribe((status: string) => {
        if (!cancelled) {
          setConnected(status === "SUBSCRIBED");
        }
      });

    channelRef.current = channel;

    return () => {
      cancelled = true;
      setConnected(false);
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (open) {
      listEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleNicknameChange = (value: string) => {
    const clean = value.slice(0, 24);
    setNickname(clean);
    if (clean.trim()) {
      window.localStorage.setItem(NAME_STORAGE_KEY, clean.trim());
    }
  };

  async function handleSubmit(e: FormEvent) {
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
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev.slice(-49), msg]);
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

    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        await supabase.from("community_messages").insert({
          id: msg.id,
          sender: msg.sender,
          body: msg.body
        });
      } catch {
        // Table optional; broadcast already delivered live
      }
    }
  }

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-ink/40 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        className="mx-auto mt-10 sm:mt-16 flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-line bg-paper text-ink shadow-soft dark:border-moss dark:bg-ink dark:text-paper"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-4 py-3 dark:border-moss">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-moss shadow-sm dark:bg-paper/10">
              <MessageCircle className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Community Chat</p>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                  <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                  {connected ? "Live" : "Connecting"}
                </span>
              </div>
              <p className="flex items-center gap-1 text-xs text-steel dark:text-paper/70">
                <Users className="h-3 w-3" aria-hidden />
                {count} online now
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close community chat"
            className="focus-ring min-h-10 min-w-10 rounded-lg p-2 text-steel hover:text-ink dark:text-paper"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nickname bar */}
        <div className="flex items-center gap-2 border-b border-line bg-white/60 px-4 py-2 text-xs dark:border-moss dark:bg-ink/60">
          <label htmlFor="chat-nickname" className="font-mono uppercase tracking-wider text-steel dark:text-paper/70">
            Name:
          </label>
          <input
            id="chat-nickname"
            value={nickname}
            onChange={(e) => handleNicknameChange(e.target.value)}
            maxLength={24}
            className="w-full bg-transparent font-medium text-ink outline-none dark:text-paper"
            placeholder="Your name..."
          />
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-2.5 overflow-y-auto p-4 text-sm">
          {messages.length === 0 ? (
            <p className="py-8 text-center text-xs text-steel dark:text-paper/70">
              No messages yet — say hi to everyone online!
            </p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender === (nickname.trim() || "Visitor");
              return (
                <div
                  key={msg.id}
                  className={`rounded-lg border px-3 py-2 ${
                    isMe
                      ? "ml-8 border-moss/40 bg-white dark:border-moss dark:bg-paper/10"
                      : "mr-8 border-line bg-white/75 dark:border-moss/50 dark:bg-ink/60"
                  }`}
                >
                  <div className="mb-0.5 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-moss dark:text-[#8fbc9f]">{msg.sender}</span>
                    <span className="font-mono text-[10px] text-steel dark:text-paper/60">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap break-words text-ink dark:text-paper">{msg.body}</p>
                </div>
              );
            })
          )}
          <div ref={listEndRef} />
        </div>

        {/* Composer */}
        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-line p-3 dark:border-moss">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => playTypeSound(e.key)}
            maxLength={280}
            placeholder="Say hi to the community..."
            className="w-full rounded-md bg-white/80 px-3 py-2 text-sm outline-none ring-1 ring-line focus:ring-moss dark:bg-paper/10 dark:text-paper dark:ring-moss/60"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send message"
            className="focus-ring inline-flex min-h-10 min-w-10 items-center justify-center rounded-md bg-ink px-3 text-white transition disabled:opacity-40 dark:bg-paper dark:text-ink"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
