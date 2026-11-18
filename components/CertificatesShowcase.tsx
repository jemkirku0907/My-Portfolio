"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Award, ChevronLeft, ChevronRight, ExternalLink, LayoutGrid, SlidersHorizontal } from "lucide-react";
import { certificates } from "@/data/portfolio";

type CertificateItem = (typeof certificates)[number];

const CATEGORIES = ["All", "Hackathons", "Seminars & Webinars", "Certifications"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

function getShortIssuer(issuer: string) {
  if (issuer.includes("DICT")) return "DICT 13";
  if (issuer.includes("TESDA")) return "TESDA";
  if (issuer.includes("Batangas")) return "BatStateU";
  if (issuer.includes("Makati")) return "UMak";
  return issuer.split("-")[0].trim();
}

function CertificateCard({
  cert,
  idx,
  showPreview,
  onHover,
  className = ""
}: {
  cert: CertificateItem;
  idx: number;
  showPreview: boolean;
  onHover: () => void;
  className?: string;
}) {
  const tiltClass = idx % 2 === 0 ? "-rotate-1" : "rotate-1";

  return (
    <a
      href={cert.fileUrl || cert.image}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={onHover}
      className={`focus-ring group relative flex flex-col justify-between rounded-2xl border bg-white p-5 text-center shadow-sm transition-all duration-300 dark:bg-ink ${
        showPreview
          ? "rotate-0 -translate-y-1.5 border-ink shadow-soft dark:border-paper"
          : `${tiltClass} border-line hover:rotate-0 hover:-translate-y-1 hover:border-moss dark:border-moss`
      } ${className}`}
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

      {/* Mini thumbnail preview + caption revealed on hover/active */}
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
}

export function CertificatesShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");
  const [viewAll, setViewAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const filteredCertificates =
    selectedCategory === "All"
      ? certificates
      : certificates.filter((cert) => cert.category === selectedCategory);

  const total = filteredCertificates.length;
  const safeActiveIndex = Math.min(activeIndex, Math.max(0, total - 1));

  const slideTo = (nextIndex: number) => {
    setActiveIndex(nextIndex);
    const container = trackRef.current;
    if (!container) return;
    const card = container.children[nextIndex] as HTMLElement | undefined;
    if (!card) return;
    const targetLeft = card.offsetLeft - container.offsetLeft - 12;
    container.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  };

  const handleCategoryChange = (category: CategoryFilter) => {
    setSelectedCategory(category);
    setActiveIndex(0);
    setHoveredKey(null);
    trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (total === 0) return;
    slideTo((safeActiveIndex - 1 + total) % total);
  };

  const handleNext = () => {
    if (total === 0) return;
    slideTo((safeActiveIndex + 1) % total);
  };

  const groupedSections = CATEGORIES.filter((cat) => cat !== "All").filter(
    (cat) => selectedCategory === "All" || selectedCategory === cat
  );

  return (
    <div className="mt-8 space-y-6" onMouseLeave={() => setHoveredKey(null)}>
      {/* Category filter tabs + View All toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((category) => {
            const count =
              category === "All"
                ? certificates.length
                : certificates.filter((c) => c.category === category).length;
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`focus-ring rounded-full border px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
                  isSelected
                    ? "border-ink bg-ink text-white shadow-sm dark:border-paper dark:bg-paper dark:text-ink"
                    : "border-line bg-white text-steel hover:border-moss hover:text-ink dark:border-moss dark:bg-ink dark:text-paper"
                }`}
              >
                {category} <span className="ml-1 font-mono text-[11px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewAll((prev) => !prev)}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-ink shadow-sm transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
          >
            {viewAll ? (
              <>
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
                <span>Slide View</span>
              </>
            ) : (
              <>
                <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
                <span>View All →</span>
              </>
            )}
          </button>

          {!viewAll ? (
            <>
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
            </>
          ) : null}
        </div>
      </div>

      {viewAll ? (
        /* Organized by category sections */
        <div className="space-y-10 pt-2">
          {groupedSections.map((sectionName) => {
            const items = certificates.filter((c) => c.category === sectionName);
            if (items.length === 0) return null;

            return (
              <div key={sectionName} className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel dark:text-paper/75">
                  {sectionName}
                </p>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((cert, idx) => {
                    const key = `${sectionName}-${cert.name}-${cert.date}`;
                    return (
                      <CertificateCard
                        key={key}
                        cert={cert}
                        idx={idx}
                        showPreview={hoveredKey === key}
                        onHover={() => setHoveredKey(key)}
                        className="w-full"
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Horizontal tilted carousel */
        <>
          <div
            ref={trackRef}
            className="flex gap-5 overflow-x-auto pb-6 pt-3 px-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filteredCertificates.map((cert, idx) => {
              const key = `${cert.name}-${cert.date}`;
              const isActive = idx === safeActiveIndex;
              const showPreview = hoveredKey !== null ? hoveredKey === key : isActive;

              return (
                <CertificateCard
                  key={key}
                  cert={cert}
                  idx={idx}
                  showPreview={showPreview}
                  onHover={() => setHoveredKey(key)}
                  className="w-[275px] shrink-0 snap-start sm:w-[300px]"
                />
              );
            })}
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2">
            {filteredCertificates.map((cert, idx) => (
              <button
                key={cert.name}
                type="button"
                onClick={() => slideTo(idx)}
                aria-label={`Show certificate ${idx + 1}: ${cert.name}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === safeActiveIndex
                    ? "w-6 bg-ink dark:bg-paper"
                    : "w-2 bg-line hover:bg-moss dark:bg-moss/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
