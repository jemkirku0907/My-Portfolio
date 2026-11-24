"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
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
  const [copied, setCopied] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [inquiryType, setInquiryType] = useState<string>(INQUIRY_TYPES[0]);
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard restrictions
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
      setStatus({ ok: false, text: "Network error—please use Copy Email or Mail below." });
    } finally {
      setSubmitting(false);
    }
  }

  const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(
    `[${inquiryType}] Inquiry from ${name || "Portfolio Visitor"}`
  )}&body=${encodeURIComponent(message ? `${message}\n\nFrom: ${name} (${email})` : "")}`;

  return (
    <footer id="contact" className={`${sectionClass} flex flex-col gap-5`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-[#ebebea] pt-10 dark:border-[#232327]">
        <div>
          <h2 className="text-[14px] font-medium text-[#6e6e73] dark:text-[#8b8b91]">
            Contact
          </h2>
          <p className="mt-1.5 text-[18px] font-medium tracking-[-0.01em] text-[#111113] dark:text-[#ececee]">
            Let&apos;s build something useful.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#ebebea] bg-white px-3 font-mono text-xs text-[#111113] transition hover:border-[#c8c8c4] dark:border-[#252529] dark:bg-[#161619] dark:text-[#ececee]"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-moss" aria-hidden />
            ) : (
              <Copy className="h-3.5 w-3.5 text-[#6e6e73]" aria-hidden />
            )}
            <span>{copied ? "Copied!" : profile.email}</span>
          </button>

          <a
            href={`https://github.com/${githubUser}`}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#ebebea] bg-white text-[#3a3a3f] transition hover:border-[#c8c8c4] hover:text-[#111113] dark:border-[#252529] dark:bg-[#161619] dark:text-[#c6c6cb]"
          >
            <Github className="h-4 w-4" aria-hidden />
          </a>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#ebebea] bg-white text-[#3a3a3f] transition hover:border-[#c8c8c4] hover:text-[#111113] dark:border-[#252529] dark:bg-[#161619] dark:text-[#c6c6cb]"
          >
            <Linkedin className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3.5 rounded-[14px] border border-[#ebebea] bg-white p-5 dark:border-[#232327] dark:bg-[#161619]"
      >
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="space-y-1">
            <label
              htmlFor="contact-name"
              className="text-[12.5px] font-medium text-[#6e6e73] dark:text-[#8b8b91]"
            >
              Name
            </label>
            <input
              id="contact-name"
              required
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-[9px] border border-[#e5e5e3] bg-[#fcfcfb] px-3 py-2 text-[14px] text-[#111113] outline-none transition focus:border-[#111113] dark:border-[#2c2c31] dark:bg-[#111113] dark:text-[#ececee] dark:focus:border-[#8fbc9f]"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="contact-email"
              className="text-[12.5px] font-medium text-[#6e6e73] dark:text-[#8b8b91]"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-[9px] border border-[#e5e5e3] bg-[#fcfcfb] px-3 py-2 text-[14px] text-[#111113] outline-none transition focus:border-[#111113] dark:border-[#2c2c31] dark:bg-[#111113] dark:text-[#ececee] dark:focus:border-[#8fbc9f]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="contact-type"
            className="text-[12.5px] font-medium text-[#6e6e73] dark:text-[#8b8b91]"
          >
            Inquiry type
          </label>
          <select
            id="contact-type"
            value={inquiryType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setInquiryType(e.target.value)}
            className="w-full rounded-[9px] border border-[#e5e5e3] bg-[#fcfcfb] px-3 py-2 text-[14px] text-[#111113] outline-none transition focus:border-[#111113] dark:border-[#2c2c31] dark:bg-[#111113] dark:text-[#ececee] dark:focus:border-[#8fbc9f]"
          >
            {INQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="contact-message"
            className="text-[12.5px] font-medium text-[#6e6e73] dark:text-[#8b8b91]"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={3}
            value={message}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            placeholder="Tell me about your project, timeline, or role..."
            className="w-full resize-y rounded-[9px] border border-[#e5e5e3] bg-[#fcfcfb] px-3 py-2 text-[14px] text-[#111113] outline-none transition focus:border-[#111113] dark:border-[#2c2c31] dark:bg-[#111113] dark:text-[#ececee] dark:focus:border-[#8fbc9f]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-[9px] bg-[#111113] px-4 py-2 text-[13.5px] font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-[#ececee] dark:text-[#111113]"
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Send className="h-3.5 w-3.5" aria-hidden />
            )}
            <span>Send inquiry</span>
          </button>

          <a
            href={mailtoHref}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-[#6e6e73] underline decoration-[#dcdcda] underline-offset-4 transition hover:text-[#111113] dark:decoration-[#34343a] dark:text-[#8b8b91] dark:hover:text-[#ececee]"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden />
            <span>Open in Mail app</span>
          </a>
        </div>

        {status ? (
          <p className={`text-xs font-medium ${status.ok ? "text-moss dark:text-[#8fbc9f]" : "text-coral"}`}>
            {status.text}
          </p>
        ) : null}
      </form>
    </footer>
  );
}
