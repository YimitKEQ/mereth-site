"use client";

import { useState } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { PlateImage } from "@/components/ui/Plate";
import { TRAILER_ID } from "@/lib/site";

/**
 * The trailer, click to play.
 *
 * Deliberately not an iframe on page load. YouTube's embed pulls roughly half a
 * megabyte and sets cookies before anyone has asked to watch anything, which on
 * a landing page is a cost paid by every visitor for a feature most of them
 * skip. So the poster is one of our own pictures, and the iframe is only
 * created once somebody presses play.
 *
 * `youtube-nocookie` for the same reason: no tracking until it is wanted.
 */
export function Trailer() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative text-brand-accent">
      <FrameCorners size={26} />
      <div className="plate-frame relative aspect-video w-full overflow-hidden">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${TRAILER_ID}?autoplay=1&rel=0`}
            title="Adventures in Mereth, the trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Play the Mereth trailer"
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            <PlateImage
              slug="aurora"
              aspect="h-full"
              sizes="(max-width: 1024px) 100vw, 64rem"
              className="h-full [&_.plate-frame]:border-0 [&_.plate-frame]:shadow-none"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, #0b101359 0%, #0b1013b3 100%)" }}
            />
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-accent/70 bg-black/50 transition-all duration-[var(--duration-normal)] group-hover:border-brand-glow group-hover:bg-black/70">
                <svg
                  viewBox="0 0 24 24"
                  className="ml-1 h-6 w-6 fill-current text-brand-accent transition-colors group-hover:text-brand-glow"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="font-display text-sm tracking-heading text-text-primary uppercase text-shadow-drop">
                Adventures in Mereth
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
