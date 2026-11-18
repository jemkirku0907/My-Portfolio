"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Send, X } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AskPalette() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ask me about projects, skills, certificates, or experience." }
  ]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const openPalette = () => setOpen(true);

    window.addEventListener("open-ask-palette", openPalette);
    return () => window.removeEventListener("open-ask-palette", openPalette);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: question })
      });
      const data = await response.json();

      setMessages([...nextMessages, { role: "assistant", content: data.answer ?? "I could not answer that just now." }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "The assistant is taking a quick breather. Please try again in a moment."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI assistant (Ctrl+K)"
        className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-2.5 py-1.5 text-sm font-medium text-ink shadow-sm transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper sm:px-3.5 shrink-0"
      >
        <span className="relative h-6 w-6 overflow-hidden rounded-full border border-line dark:border-moss">
          <Image
            src="/profile/ai-mascot.png"
            alt="Jem's AI mascot"
            fill
            sizes="24px"
            className="object-cover"
          />
        </span>
        <span className="hidden sm:inline">Ask anything</span>
        <span className="hidden rounded border border-line px-1.5 py-0.5 text-xs text-steel dark:border-moss dark:text-paper sm:inline">Ctrl K</span>
      </button>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Chat with Jem's AI Assistant"
          className="focus-ring group fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full border border-line bg-[#0d101b] p-1.5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-moss dark:border-moss"
        >
          <span className="relative h-12 w-12 overflow-hidden rounded-full sm:h-14 sm:w-14">
            <Image
              src="/profile/ai-mascot.png"
              alt="Ask Jem's AI Assistant"
              fill
              sizes="56px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </span>
        </button>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-40 bg-ink/35 p-4 backdrop-blur-sm" onMouseDown={() => setOpen(false)}>
          <div
            className="mx-auto mt-14 sm:mt-20 w-full max-w-2xl overflow-hidden rounded-lg border border-line bg-paper shadow-soft dark:border-moss dark:bg-ink dark:text-paper"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3 dark:border-moss">
              <div className="flex items-center gap-2.5 text-sm font-medium">
                <span className="relative h-7 w-7 overflow-hidden rounded-full border border-line dark:border-moss">
                  <Image
                    src="/profile/ai-mascot.png"
                    alt="Jem's AI mascot"
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </span>
                Ask Anything
              </div>
              <button className="focus-ring min-h-11 min-w-11 rounded p-1" onClick={() => setOpen(false)} aria-label="Close assistant">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submit} className="flex gap-2 border-b border-line p-3 dark:border-moss">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about my projects, stack, or certificates..."
                className="w-full bg-transparent px-2 py-1 text-sm outline-none dark:text-paper"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-md bg-ink px-3 text-white transition disabled:opacity-50 dark:bg-paper dark:text-ink"
                aria-label="Send question"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
            <div className="max-h-72 space-y-3 overflow-y-auto p-4 text-sm">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-3 ${
                    message.role === "user"
                      ? "ml-8 bg-white dark:bg-ink/80 border border-line dark:border-moss"
                      : "mr-8 bg-white/70 dark:bg-ink/40 border border-line/60 dark:border-moss/40"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    {message.role === "assistant" ? (
                      <span className="relative h-5 w-5 overflow-hidden rounded-full border border-line dark:border-moss">
                        <Image
                          src="/profile/ai-mascot.png"
                          alt="Jem's Assistant"
                          fill
                          sizes="20px"
                          className="object-cover"
                        />
                      </span>
                    ) : null}
                    <p className="font-semibold text-xs uppercase tracking-wider text-moss">
                      {message.role === "user" ? "You" : "Jem's Assistant"}
                    </p>
                  </div>
                  <p className="whitespace-pre-wrap text-steel dark:text-paper leading-relaxed">{message.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
