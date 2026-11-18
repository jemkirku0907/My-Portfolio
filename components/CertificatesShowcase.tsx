"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Award, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { certificates } from "@/data/portfolio";

function getShortIssuer(issuer: string) {
  if (issuer.includes("DICT")) return "DICT 13";
  if (issuer.includes("TESDA")) return "TESDA";
  if (issuer.includes("Batangas")) return "BatStateU";
  if (issuer.includes("Makati")) return "UMak";
  return issuer.split("-")[0].trim();
}

export function CertificatesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const total = certificates.length;

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [isPaused, total]);

  useEffect(() => {
    const container = trackRef.current;
    if (!container) return;
    const card = container.children[activeIndex] as HTMLElement | undefined;
    if (!card) return;
    const targetLeft = card.offsetLeft - container.offsetLeft - 12;
    container.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  return (
    <div
      className="mt-8 space-y-5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredIndex(null);
      }}
    >
      {/* Controls & hint */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-steel dark:text-paper/80">
          Credentials &amp; hackathons — hover or slide any card to preview.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous certificate"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next certificate"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sliding tilted card track */}
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto pb-6 pt-3 px-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {certificates.map((cert, idx) => {
          const isActive = idx === activeIndex;
          const isHovered = idx === hoveredIndex;
          const showPreview = isHovered || isActive;
          const tiltClass = idx % 2 === 0 ? "-rotate-1" : "rotate-1";

          return (
            <a
              key={`${cert.name}-${cert.date}`}
              href={cert.fileUrl || cert.image}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => {
                setHoveredIndex(idx);
                setActiveIndex(idx);
              }}
              className={`focus-ring group relative flex w-[275px] shrink-0 snap-start flex-col justify-between rounded-2xl border bg-white p-5 text-center shadow-sm transition-all duration-300 dark:bg-ink sm:w-[300px] ${
                showPreview
                  ? "rotate-0 -translate-y-1.5 border-ink shadow-soft dark:border-paper"
                  : `${tiltClass} border-line hover:rotate-0 hover:-translate-y-1 hover:border-moss dark:border-moss`
              }`}
            >
              {/* Top badge + date */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex w-full items-center justify-between text-[11px] font-mono uppercase tracking-wider text-steel dark:text-paper/70">
                  <span>{getShortIssuer(cert.issuer)}</span>
                  <span>{cert.date}</span>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper text-moss shadow-sm dark:border-moss dark:bg-ink">
                  <Award className="h-5 w-5" aria-hidden />
                </span>
              </div>

              {/* Title + issuer */}
              <div className="mt-4 space-y-1.5">
                <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink dark:text-paper">
                  {cert.name}
                </h3>
                <p className="line-clamp-1 font-mono text-[11px] uppercase tracking-wider text-steel dark:text-paper/70">
                  {cert.issuer}
                </p>
              </div>

              {/* Mini thumbnail preview + caption revealed on active/hover */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  showPreview ? "mt-4 max-h-40 opacity-100" : "mt-0 max-h-0 opacity-0"
                }`}
              >
                <div className="relative h-28 w-full overflow-hidden rounded-lg border border-line bg-[#ebe6da] dark:border-moss dark:bg-[#1a201c]">
                  <Image
                    src={cert.image}
                    alt={`${cert.name} preview`}
                    fill
                    sizes="280px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 text-[11px] text-steel dark:text-paper/80">
                  Issued {cert.date} · Click to open full certificate
                </p>
              </div>

              {/* Bottom action */}
              <div className="mt-4 flex items-center justify-center gap-1.5 font-mono text-xs tracking-wider text-steel transition group-hover:text-ink dark:text-paper/75 dark:group-hover:text-paper">
                <span>&lt; VIEW CERT &gt;</span>
                <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
              </div>
            </a>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2">
        {certificates.map((cert, idx) => (
          <button
            key={cert.name}
            type="button"
            onClick={() => setActiveIndex(idx)}
            aria-label={`Show certificate ${idx + 1}: ${cert.name}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? "w-6 bg-ink dark:bg-paper"
                : "w-2 bg-line hover:bg-moss dark:bg-moss/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
