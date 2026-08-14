"use client";

import { useEffect, useRef, useState } from "react";

import { asset } from "@/lib/asset";

/**
 * One looping clip, inline in the page.
 *
 * Carries the same four rules as the backdrop in `BackgroundStage`: autoplay is
 * only allowed muted and inline and can still be refused, `prefers-reduced-motion`
 * means the video is never fetched at all, playback stops when the tab is hidden,
 * and the poster is painted underneath so nothing ever shows an empty rectangle.
 *
 * The rule a backdrop does not need, and this does: it only plays while it is on
 * screen. A backdrop is always behind the reader, but a clip halfway down a page
 * would otherwise decode two megabytes and keep a decoder busy for somebody who
 * scrolled past it, or who never scrolled to it at all.
 *
 * There is a pause control rather than browser chrome. Full controls on a silent
 * ambient loop invite a scrub bar and a volume slider that do nothing, but motion
 * a reader cannot stop is a genuine accessibility failure, so the one control that
 * means something is the one that is there.
 */
export function Clip({
  slug,
  title,
  caption,
  credit,
  align = "left",
}: {
  slug: string;
  title: string;
  caption: string;
  credit?: string;
  /**
   * Where the clip sits in its container.
   *
   * Left by default, because inside a chapter it is one block among paragraphs
   * and has to share their left edge or the text appears to step around it.
   * Centred is for a page that gives it a band of its own.
   */
  align?: "left" | "center";
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  const video = asset(`/art/${slug}.mp4`);
  const poster = asset(`/art/${slug}.webp`);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = (): void => setMotion(!query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!motion) return undefined;
    const element = ref.current;
    const box = frame.current;
    if (element === null || box === null) return undefined;

    let onScreen = false;

    const play = (): void => {
      if (!onScreen || paused || document.hidden) return;
      if (element.preload !== "auto") element.preload = "auto";
      const started = element.play();
      // A refused autoplay is an expected outcome, not an error worth throwing.
      if (started !== undefined) started.catch(() => undefined);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          onScreen = entry.isIntersecting;
          if (onScreen) play();
          else element.pause();
        }
      },
      // A little margin so it is already running by the time it is properly in view.
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    observer.observe(box);

    const onVisibility = (): void => {
      if (document.hidden) element.pause();
      else play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motion, paused]);

  const toggle = (): void => {
    const element = ref.current;
    if (element === null) return;
    if (element.paused) {
      setPaused(false);
      void element.play().catch(() => undefined);
    } else {
      setPaused(true);
      element.pause();
    }
  };

  return (
    /*
     * Held to the width of the reading column rather than the container.
     *
     * At full width this sat at about 1340px, three times a gallery tile and wider
     * than every line of text on the page, so the one moving thing was also the
     * largest thing by a distance and read as a banner rather than as a piece of
     * the page. The source is 1280 wide, so this also stops it being scaled up.
     */
    <figure className={`relative max-w-3xl ${align === "center" ? "mx-auto" : ""}`}>
      {/*
        No `plate-frame` here, deliberately.

        That class is what gives the stills their mounted look: a drop shadow and a
        blurred backdrop, so each one reads as a plate hung on the page. On a still
        it frames the composition. On a moving picture it draws a ring around the
        one thing already holding the eye, and the shadow reads as an edge the
        footage does not have. The clip sits flush instead.

        The background stays. It is never seen once the poster paints, and it is what
        stops a transparent hole if the poster is the thing that fails.
      */}
      <div
        ref={frame}
        className="relative aspect-[16/9] w-full overflow-hidden bg-bg-stone"
      >
        {/* Always painted, so the video only ever fades in over it. */}
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {motion ? (
          <video
            ref={ref}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: ready ? 1 : 0 }}
            src={video}
            poster={poster}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            aria-label={title}
            onCanPlay={() => setReady(true)}
            onError={() => setReady(false)}
          />
        ) : null}

        {motion ? (
          <button
            type="button"
            onClick={toggle}
            aria-label={paused ? "Play the clip" : "Pause the clip"}
            className="font-display absolute right-3 bottom-3 border border-brand-accent/30 bg-black/55 px-3 py-1.5 text-[10px] tracking-[2px] text-text-primary/80 uppercase backdrop-blur-sm transition-colors hover:border-brand-accent hover:text-text-primary"
          >
            {paused ? "Play" : "Pause"}
          </button>
        ) : null}
      </div>

      <figcaption className="mt-4 max-w-3xl">
        <p className="font-display text-[11px] tracking-[2.5px] text-brand-accent uppercase">
          {title}
        </p>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-text-muted">{caption}</p>
        {credit === undefined ? null : (
          <p className="mt-1 text-[0.8rem] text-text-muted/70">{credit}</p>
        )}
      </figcaption>
    </figure>
  );
}
