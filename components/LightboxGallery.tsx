"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink, X } from "lucide-react";

type GalleryItem = {
  title?: string;
  name?: string;
  issuer?: string;
  date?: string;
  category?: string;
  image: string;
  fileUrl?: string;
  verifyUrl?: string;
};

export function LightboxGallery({ items, type }: { items: GalleryItem[]; type: "certificates" | "design" }) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <button
            key={`${item.name ?? item.title}-${item.image}`}
            onClick={() => setActive(item)}
            className="focus-ring group overflow-hidden rounded-lg border border-line bg-white text-left text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-moss dark:bg-ink dark:text-paper"
          >
            <div className="relative aspect-[4/3] bg-[#ebe6da]">
              <Image src={item.image} alt={item.name ?? item.title ?? type} fill className="object-cover" />
            </div>
            <div className="space-y-2 p-4">
              <p className="text-base font-semibold">{item.name ?? item.title}</p>
              <p className="text-sm text-steel dark:text-paper">{item.issuer ?? item.category} {item.date ? `- ${item.date}` : ""}</p>
              <div className="flex flex-wrap gap-3">
                {item.fileUrl ? (
                  <a className="inline-flex items-center gap-1 text-sm font-medium text-moss" href={item.fileUrl} target="_blank" rel="noreferrer">
                    Open certificate <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
                {item.verifyUrl ? (
                  <a className="inline-flex items-center gap-1 text-sm font-medium text-moss" href={item.verifyUrl} target="_blank" rel="noreferrer">
                    Verify <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </div>

      {active ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={() => setActive(null)}>
          <div className="relative w-full max-w-4xl rounded-lg bg-paper p-3 shadow-soft dark:bg-ink" onClick={(event) => event.stopPropagation()}>
            <button className="focus-ring absolute right-4 top-4 z-10 min-h-11 min-w-11 rounded-full bg-white p-2 text-ink dark:bg-paper" onClick={() => setActive(null)} aria-label="Close preview">
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-[#ebe6da]">
              <Image src={active.image} alt={active.name ?? active.title ?? "Gallery item"} fill className="object-contain" />
            </div>
            {active.fileUrl ? (
              <a
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-moss dark:border-moss dark:bg-ink"
                href={active.fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open certificate <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
