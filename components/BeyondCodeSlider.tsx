"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const [activePhoto, setActivePhoto] = useState<BeyondCodePhoto | null>(null);

  const updateActiveIndex = useCallback((scroller: HTMLDivElement) => {
    const slides = Array.from(scroller.children) as HTMLElement[];

    if (slides.length === 0) {
      return;
    }

    const scrollerCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    const closestIndex = slides.reduce((closest, slide, index) => {
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      const closestSlide = slides[closest];
      const closestCenter = closestSlide.offsetLeft + closestSlide.clientWidth / 2;

      return Math.abs(slideCenter - scrollerCenter) < Math.abs(closestCenter - scrollerCenter) ? index : closest;
    }, 0);

    setActiveIndex(closestIndex);
  }, []);

  const scrollToSlide = useCallback((index: number) => {
    if (photos.length === 0) {
      return;
    }

    const nextIndex = (index + photos.length) % photos.length;
    const scroller = scrollerRef.current;
    const slide = scroller?.children.item(nextIndex) as HTMLElement | null;

    if (scroller && slide) {
      const left = slide.offsetLeft - (scroller.clientWidth - slide.clientWidth) / 2;

      scroller.scrollTo({ left, behavior: "smooth" });
    }

    setActiveIndex(nextIndex);
  }, [photos.length]);

  return (
    <>
      <div className="w-full min-w-0 max-w-full overflow-hidden space-y-4 lg:max-w-xl">
        <div
          ref={scrollerRef}
          className="flex w-full min-w-0 max-w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(event) => {
            updateActiveIndex(event.currentTarget);
          }}
          onWheel={(event) => {
            const scroller = event.currentTarget;
            const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
            const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
            const canScroll =
              (delta < 0 && scroller.scrollLeft > 0) ||
              (delta > 0 && scroller.scrollLeft < maxScrollLeft);

            if (!canScroll) {
              return;
            }

            event.preventDefault();
            scroller.scrollLeft += delta;
          }}
        >
          {photos.map((photo) => (
            <button
              key={photo.label}
              type="button"
              className="focus-ring group relative aspect-[4/5] w-36 shrink-0 snap-center overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft dark:border-moss dark:bg-ink sm:w-44 lg:w-48"
              onClick={() => setActivePhoto(photo)}
              aria-label={`Open ${photo.label} photo`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 192px, (min-width: 640px) 176px, 144px"
                className="rounded-lg object-cover transition duration-500 group-hover:scale-105"
              />
            </button>
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
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:-translate-y-0.5 dark:border-moss dark:bg-ink dark:text-paper"
              aria-label="Previous outside the editor photo"
              onClick={() => scrollToSlide(activeIndex - 1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:-translate-y-0.5 dark:border-moss dark:bg-ink dark:text-paper"
              aria-label="Next outside the editor photo"
              onClick={() => scrollToSlide(activeIndex + 1)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {activePhoto ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4" onClick={() => setActivePhoto(null)}>
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-paper p-3 shadow-soft dark:bg-ink" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="focus-ring absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-sm"
              onClick={() => setActivePhoto(null)}
              aria-label="Close photo preview"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#ebe6da]">
              <Image src={activePhoto.src} alt={activePhoto.alt} fill sizes="90vw" className="object-contain" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
