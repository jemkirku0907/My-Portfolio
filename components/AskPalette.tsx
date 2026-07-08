"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Command, Loader2, Send, X } from "lucide-react";

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
        className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-sm font-medium text-ink shadow-sm transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper sm:px-4"
      >
        <Command className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Ask anything</span>
        <span className="hidden rounded border border-line px-1.5 py-0.5 text-xs text-steel dark:border-moss dark:text-paper sm:inline">Ctrl K</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 bg-ink/35 p-4 backdrop-blur-sm" onMouseDown={() => setOpen(false)}>
          <div
            className="mx-auto mt-20 w-full max-w-2xl overflow-hidden rounded-lg border border-line bg-paper shadow-soft dark:border-moss dark:bg-ink dark:text-paper"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3 dark:border-moss">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Command className="h-4 w-4 text-moss" aria-hidden />
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
                placeholder="Ask about Marajo, PharSayo, skills..."
                className="focus-ring min-h-11 min-w-0 flex-1 rounded-md border border-line bg-white px-3 py-2 text-base text-ink outline-none dark:border-moss dark:bg-ink dark:text-paper"
              />
              <button className="focus-ring min-h-11 rounded-md bg-ink px-3 text-white disabled:opacity-50 dark:bg-paper dark:text-ink" disabled={loading} aria-label="Send question">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </form>
            <div className="max-h-[50vh] space-y-3 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={message.role === "user" ? "text-right" : "text-left"}>
                  <p
                    className={`inline-block max-w-[88%] rounded-lg px-3 py-2 text-sm leading-6 ${
                      message.role === "user" ? "bg-ink text-white dark:bg-paper dark:text-ink" : "border border-line bg-white text-ink dark:border-moss dark:bg-ink dark:text-paper"
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
