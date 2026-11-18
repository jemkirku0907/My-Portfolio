"use client";

import { FormEvent, useState } from "react";
import { Check, Copy, Github, Linkedin, Loader2, Mail, Send } from "lucide-react";
import { profile } from "@/data/portfolio";

const INQUIRY_TYPES = [
  "Full-Stack Web App",
  "Landing Page / UI",
  "AI / Web3 Prototype",
  "Internship / Job Role"
] as const;

export function ContactSection({
  sectionClass,
  githubUser
}: {
  sectionClass: string;
  githubUser: string;
}) {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState<string>(INQUIRY_TYPES[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim() || submitting) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, inquiryType, message })
      });
      const data = await res.json();

      if (res.ok && data?.ok) {
        setStatus({
          ok: true,
          text: data.saved
            ? "Inquiry received! I'll get back to you soon."
            : "Message prepared! Click below if you'd also like to send via your email app."
        });
        if (data.saved) {
          setName("");
          setEmail("");
          setMessage("");
        }
      } else {
        setStatus({ ok: false, text: data?.error || "Could not send right now." });
      }
    } catch {
      setStatus({ ok: false, text: "Network error—please use the Copy Email or Mail button." });
    } finally {
      setSubmitting(false);
    }
  }

  const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
    `[${inquiryType}] Inquiry from ${name || "Portfolio Visitor"}`
  )}&body=${encodeURIComponent(message ? `${message}\n\nFrom: ${name} (${email})` : "")}`;

  return (
    <footer id="contact" className={sectionClass}>
      <div className="grid gap-10 border-t border-line pt-12 dark:border-moss lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss dark:text-[#8fbc9f]">
              Get in touch
            </p>
            <h2 className="text-3xl font-semibold text-ink dark:text-paper sm:text-4xl">
              Let&apos;s build something useful.
            </h2>
            <p className="max-w-md text-base leading-7 text-steel dark:text-paper/85">
              Open for freelance projects, full-stack builds, and internships based in {profile.location} or remote.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 font-mono text-xs text-ink shadow-sm transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper sm:text-sm"
            >
              {copied ? <Check className="h-4 w-4 text-moss" aria-hidden /> : <Copy className="h-4 w-4 text-steel" aria-hidden />}
              <span>{copied ? "Copied email!" : profile.email}</span>
            </button>
          </div>

          <div className="flex gap-3 pt-1">
            <a
              className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white p-3 text-ink transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
              href={`mailto:${profile.email}`}
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white p-3 text-ink transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
              href={`https://github.com/${githubUser}`}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white p-3 text-ink transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-line bg-white/85 p-6 shadow-sm dark:border-moss dark:bg-ink/85"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="font-mono text-xs uppercase tracking-wider text-steel dark:text-paper/75">
                Name
              </label>
              <input
                id="contact-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-line bg-paper/50 px-3 py-2 text-sm text-ink outline-none focus:border-moss dark:border-moss/60 dark:bg-ink dark:text-paper"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="font-mono text-xs uppercase tracking-wider text-steel dark:text-paper/75">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-line bg-paper/50 px-3 py-2 text-sm text-ink outline-none focus:border-moss dark:border-moss/60 dark:bg-ink dark:text-paper"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-type" className="font-mono text-xs uppercase tracking-wider text-steel dark:text-paper/75">
              Project / Inquiry Type
            </label>
            <select
              id="contact-type"
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              className="w-full rounded-lg border border-line bg-paper/50 px-3 py-2 text-sm text-ink outline-none focus:border-moss dark:border-moss/60 dark:bg-ink dark:text-paper"
            >
              {INQUIRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="font-mono text-xs uppercase tracking-wider text-steel dark:text-paper/75">
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me about your project, timeline, or role..."
              className="w-full resize-y rounded-lg border border-line bg-paper/50 px-3 py-2 text-sm text-ink outline-none focus:border-moss dark:border-moss/60 dark:bg-ink dark:text-paper"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-paper dark:text-ink"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span>Send Inquiry</span>
            </button>

            <a
              href={mailtoHref}
              className="font-mono text-xs text-steel underline decoration-line underline-offset-4 transition hover:text-ink dark:text-paper/75 dark:hover:text-paper"
            >
              or open in Mail app →
            </a>
          </div>

          {status ? (
            <p className={`text-xs font-medium ${status.ok ? "text-moss dark:text-[#8fbc9f]" : "text-coral"}`}>
              {status.text}
            </p>
          ) : null}
        </form>
      </div>
    </footer>
  );
}
