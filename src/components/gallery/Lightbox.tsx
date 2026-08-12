"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ChevronDown, X } from "@/components/ui/icons";
import type { Plate } from "@/lib/images";

/**
 * The gallery grid, and the viewer it opens into.
 *
 * Arrow keys and Escape work, because a gallery that can only be driven with a
 * mouse is a gallery people look at one picture of. The viewer wraps at both
 * ends so holding an arrow key walks the whole set without stopping.
 *
 * The open picture is deliberately not preloaded for every thumbnail: these are
 * 1800px screenshots and eagerly fetching a dozen of them to save one click is
 * the wrong trade on a page most people scroll past.
 */
export function Gallery({ plates }: { plates: Plate[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const move = useCallback(
    (step: number) => {
      setOpen((current) => {
        if (current === null) return null;
        return (current + step + plates.length) % plates.length;
      });
    },
    [plates.length],
  );

  useEffect(() => {
    if (open === null) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setOpen(null);
      else if (event.key === "ArrowRight") move(1);
      else if (event.key === "ArrowLeft") move(-1);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, move]);

  const shown = open === null ? undefined : plates[open];

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {plates.map((plate, index) => (
          <li key={plate.slug}>
            <button
              type="button"
              onClick={() => setOpen(index)}
              className="group block w-full cursor-zoom-in text-left"
              aria-label={`Open ${plate.title}`}
            >
              <div className="relative text-brand-accent">
                <FrameCorners size={18} />
                <div
                  className="plate-frame relative aspect-[16/10] w-full overflow-hidden"
                  style={{
                    borderWidth: "var(--border-ornate-thin)",
                    borderStyle: "solid",
                    borderColor: "color-mix(in srgb, var(--color-brand-accent) 62%, transparent)",
                  }}
                >
                  <Image
                    src={plate.src}
                    alt={plate.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={plate.blurDataURL}
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="font-display mt-4 text-[0.9rem] tracking-heading text-brand-accent uppercase">
                {plate.title}
              </p>
              <p className="mt-1.5 text-[0.85rem] leading-relaxed text-text-muted">
                {plate.caption}
              </p>
            </button>
          </li>
        ))}
      </ul>

      {shown === undefined ? null : (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={shown.title}
          className="fixed inset-0 z-[var(--z-modal)] flex flex-col items-center justify-center px-4 py-6"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(null)}
            className="absolute inset-0 cursor-zoom-out bg-black/88 backdrop-blur-[var(--blur-modal)]"
          />

          <div className="relative flex max-h-full w-full max-w-6xl flex-col">
            <div className="relative text-brand-accent">
              <FrameCorners size={24} />
              <div
                className="relative overflow-hidden"
                style={{
                  borderWidth: "var(--border-ornate-thin)",
                  borderStyle: "solid",
                  borderColor: "color-mix(in srgb, var(--color-brand-accent) 62%, transparent)",
                }}
              >
                <Image
                  src={shown.src}
                  alt={shown.title}
                  width={shown.width}
                  height={shown.height}
                  placeholder="blur"
                  blurDataURL={shown.blurDataURL}
                  sizes="100vw"
                  className="max-h-[74vh] w-full object-contain"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-6">
              <div className="min-w-0">
                <p className="font-display text-[0.95rem] tracking-heading text-brand-accent uppercase">
                  {shown.title}
                </p>
                <p className="mt-1 text-[0.85rem] text-text-muted">{shown.caption}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="mr-2 text-[0.8rem] tabular-nums text-text-muted">
                  {(open ?? 0) + 1} of {plates.length}
                </span>
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Previous"
                  className="ornate-glow flex h-10 w-10 cursor-pointer items-center justify-center border border-brand-accent/50 bg-black/50 text-brand-accent transition-colors hover:border-brand-accent hover:text-brand-glow"
                >
                  <ChevronDown className="rotate-90 text-lg" />
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Next"
                  className="ornate-glow flex h-10 w-10 cursor-pointer items-center justify-center border border-brand-accent/50 bg-black/50 text-brand-accent transition-colors hover:border-brand-accent hover:text-brand-glow"
                >
                  <ChevronDown className="-rotate-90 text-lg" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  aria-label="Close"
                  className="ornate-glow flex h-10 w-10 cursor-pointer items-center justify-center border border-brand-accent/50 bg-black/50 text-brand-accent transition-colors hover:border-brand-accent hover:text-brand-glow"
                >
                  <X className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
