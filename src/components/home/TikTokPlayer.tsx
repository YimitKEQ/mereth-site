"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { readable, type TikTokVideo } from "@/lib/tiktok";

/**
 * A clip playing on our own page, in an overlay, without sending anybody to
 * TikTok.
 *
 * This is TikTok's `embed/v2` player in an iframe, which is the only way to do
 * it. Their video files are served from a signed CDN with an empty `playAddr`
 * in the feed, so there is nothing to put in a `<video>` of our own, and going
 * after the file behind their player is neither stable nor ours to do. The
 * player was tested rather than assumed: it loads, and the clip runs in place.
 *
 * Two things about it are TikTok's and cannot be styled away, so they are worth
 * knowing before anybody asks:
 *
 *   The panel under the video, with the handle, the caption and the sound
 *   credit, is white. `music_info=0` and `description=0` are widely repeated as
 *   the way to remove it and they do nothing on this embed: both were tried.
 *
 *   A visitor in the EU or UK gets TikTok's cookie prompt inside the player the
 *   first time it opens. It is their consent banner in their iframe, it appears
 *   only after somebody has asked to watch something, and once answered it
 *   stays answered.
 *
 * Which is exactly why this is an overlay and not something sitting on the page.
 * `DESIGN.md` makes floating overlays the one place depth is allowed, because
 * they are meant to read as detached, and detached is the right register for a
 * piece of somebody else's site. The row itself stays ours.
 *
 * The iframe is built when the overlay opens and destroyed when it closes, so a
 * reader who never presses play never loads a byte of TikTok, which is the same
 * bargain the trailer makes with YouTube.
 */

/*
 * The player's own minimum is 325px wide, and it lays out as a 9:16 video with
 * roughly a further 180px of panel underneath. Capped against the viewport so a
 * laptop in a short window trims the panel rather than the picture.
 */
const PANEL_WIDTH = "min(340px, 92vw)";
const PANEL_HEIGHT = "min(742px, 86vh)";

export function TikTokPlayer({
  videos,
  index,
  onClose,
  onMove,
}: {
  videos: TikTokVideo[];
  /** Which clip is open, or null when the overlay is shut. */
  index: number | null;
  onClose: () => void;
  onMove: (next: number) => void;
}) {
  /* A portal needs a real node, and `document` does not exist while this
     renders on the server. Same reason as the search palette. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const open = index !== null;
  const video = index === null ? undefined : videos[index];

  const step = useCallback(
    (delta: number) => {
      if (index === null || videos.length === 0) return;
      onMove((index + delta + videos.length) % videos.length);
    },
    [index, videos.length, onMove],
  );

  useEffect(() => {
    if (!open) return;

    /* Hand focus back to the card that opened this. Dumping the reader at the
       top of the document on close is disorienting on a page this long. */
    const opener = document.activeElement;

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    /* Compensate for the scrollbar the line above removes, or the page jumps
       sideways as the overlay opens. */
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    /*
     * Keys at the document rather than on the panel.
     *
     * Focus moves into TikTok's iframe the moment somebody presses their play
     * button, and a cross-origin frame does not hand keystrokes back. An
     * overlay that stops answering Escape as soon as the video starts is worse
     * than one that never answered at all, and this is the only place the key
     * still arrives.
     */
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") {
        step(1);
      } else if (event.key === "ArrowLeft") {
        step(-1);
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [open, onClose, step]);

  if (!mounted || !open || video === undefined) return null;

  const caption = readable(video.caption);
  const many = videos.length > 1;

  return createPortal(
    <div
      className="clip-overlay fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      style={{ background: "color-mix(in srgb, var(--color-bg-overlay) 88%, transparent)" }}
      /* The backdrop closes, the panel does not. Anything that starts inside the
         panel is the reader using the player, not dismissing it. */
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={caption === "" ? "A clip from Mereth on TikTok" : caption}
        className="clip-panel relative flex flex-col items-center"
      >
        <div className="relative text-brand-accent">
          <FrameCorners size={20} />
          <iframe
            /* Keyed on the id so moving to the next clip builds a new frame
               rather than reusing one that is still playing the last. */
            key={video.id}
            src={`https://www.tiktok.com/embed/v2/${video.id}?lang=en`}
            title={caption === "" ? "A clip from Mereth on TikTok" : caption}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            className="block border-0 bg-black"
            style={{ width: PANEL_WIDTH, height: PANEL_HEIGHT }}
          />
        </div>

        {/* Close sits above the frame rather than in the row below it, because
            the row below is where the player's own controls end and a second
            set of controls in the same place reads as one confusing set. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-9 right-0 cursor-pointer p-1 text-brand-accent transition-colors hover:text-brand-glow"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="square"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M5 5 L19 19 M19 5 L5 19" />
          </svg>
        </button>

        <div className="mt-5 flex items-center justify-center gap-6">
          {many ? (
            <button
              type="button"
              onClick={() => step(-1)}
              className="font-display cursor-pointer text-[0.8rem] tracking-heading text-brand-accent uppercase transition-colors hover:text-brand-glow"
            >
              <span aria-hidden="true">&larr;</span> Previous
            </button>
          ) : null}

          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.82rem] text-brand-accent/75 underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:text-brand-glow"
          >
            Open on TikTok
          </a>

          {many ? (
            <button
              type="button"
              onClick={() => step(1)}
              className="font-display cursor-pointer text-[0.8rem] tracking-heading text-brand-accent uppercase transition-colors hover:text-brand-glow"
            >
              Next <span aria-hidden="true">&rarr;</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
