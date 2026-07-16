"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BeyondCodePhoto = {
  src: string;
  alt: string;
  label: string;
  note: string;
};

type BeyondCodeSliderProps = {
  photos: BeyondCodePhoto[];
};

export function BeyondCodeSlider({ photos }: BeyondCodeSliderProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToSlide = (index: number) => {
    const nextIndex = (index + photos.length) % photos.length;
    const scroller = scrollerRef.current;
    const slide = scroller?.children.item(nextIndex) as HTMLElement | null;

    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActiveIndex(nextIndex);
  };

  return (
    <div className="space-y-4">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(event) => {
          const scroller = event.currentTarget;
          const slideWidth = scroller.firstElementChild?.clientWidth || 1;
          setActiveIndex(Math.round(scroller.scrollLeft / (slideWidth + 16)));
        }}
      >
        {photos.map((photo) => (
          <article
            key={photo.label}
            className="group relative aspect-[4/5] w-[78%] shrink-0 snap-center overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-soft transition duration-300 hover:-translate-y-1 dark:border-moss dark:bg-ink sm:w-[46%] lg:w-[58%]"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 46vw, 78vw"
              className="rounded-xl object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/20 bg-ink/70 p-4 text-white shadow-soft backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{photo.note}</p>
              <h3 className="mt-1 text-xl font-semibold">{photo.label}</h3>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {photos.map((photo, index) => (
            <button
              key={photo.label}
              type="button"
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index ? "w-8 bg-moss" : "w-2.5 bg-line dark:bg-steel"
              }`}
              aria-label={`Show ${photo.label}`}
              onClick={() => scrollToSlide(index)}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:-translate-y-0.5 dark:border-moss dark:bg-ink dark:text-paper"
            aria-label="Previous outside the editor photo"
            onClick={() => scrollToSlide(activeIndex - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:-translate-y-0.5 dark:border-moss dark:bg-ink dark:text-paper"
            aria-label="Next outside the editor photo"
            onClick={() => scrollToSlide(activeIndex + 1)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
