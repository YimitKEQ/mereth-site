"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { asset } from "@/lib/asset";

/**
 * The one joke on the site.
 *
 * A single interlace knot at the end of the footer's build stamp, drawn at the
 * same weight as every other piece of chrome and sitting at a third opacity. It
 * is the site's own ornament vocabulary, in the least looked at row on the page,
 * which is the only reason it hides at all: a novel icon would read as a control
 * and get clicked immediately.
 *
 * Kept honest in two ways. It carries a real accessible name rather than an empty
 * one, because a screen reader user hunting a mystery button is not the joke, and
 * it is not announced anywhere in the visible copy, because then it would not be
 * a mystery.
 */

/** Where the picture lives. Not in `plates`, so it never reaches the gallery. */
const PICTURE = "/img/chudmor.webp";
const CAPTION = "Chudmor is watching you";

export function Chudmor() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  /*
   * The portal target only exists in the browser. Rendering the dialog on the
   * server and hydrating it would mean `document` is read during the static
   * export, which throws the build rather than failing at runtime.
   */
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // The page behind a modal should not scroll under it.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const dialog = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={CAPTION}
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-5 backdrop-blur-sm"
    >
      <figure
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-full w-full max-w-[30rem] overflow-hidden border border-brand-accent/40 bg-bg-stone shadow-2xl"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute top-2 right-3 z-10 text-2xl leading-none text-text-primary/70 transition-colors hover:text-brand-accent"
        >
          &times;
        </button>

        {/* A plain img, not next/image: this is one fixed asset with no srcset and
            no blur, and next/image does not apply the base path to an unoptimised
            source anyway. */}
        <img
          src={asset(PICTURE)}
          alt="A very well fed Dunmer lord slouched on a throne with a goblet"
          className="block max-h-[70vh] w-full object-contain"
        />

        <figcaption className="font-display border-t border-brand-accent/20 px-5 py-4 text-center text-lg tracking-heading text-brand-accent">
          {CAPTION}
        </figcaption>
      </figure>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={CAPTION}
        title=""
        className="ml-1 inline-flex shrink-0 cursor-default opacity-30 transition-opacity duration-500 hover:opacity-100"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="butt"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M3 16 L11 8" />
          <path d="M21 8 L29 16" />
          <path d="M3 16 L11 24" />
          <path d="M21 24 L29 16" />
          <path d="M11 8 L21 24" />
          <path d="M11 24 L21 8" />
        </svg>
      </button>
      {mounted && open ? createPortal(dialog, document.body) : null}
    </>
  );
}
