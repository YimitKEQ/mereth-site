"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The living backdrop: one looping plate behind the whole document.
 *
 * Sits at the very back on its own layer and never moves in the flow, which is
 * what lets every section stay transparent and only the panels carry a surface.
 *
 * Four things this handles that a bare <video> does not:
 *
 *   1. Autoplay is only permitted when muted and inline, and it can still be
 *      refused. The promise is caught and the still plate simply stays visible,
 *      so a refusal degrades instead of leaving a black rectangle.
 *   2. `prefers-reduced-motion` means the video is never attached at all. Not
 *      paused, not hidden: never fetched, because 24 MB for motion somebody
 *      asked not to see is the wrong trade.
 *   3. It pauses when the tab is hidden. A looping video in a background tab is
 *      a battery bug nobody attributes to the site.
 *   4. The still plate is always painted underneath, so there is no flash of
 *      empty page while the first frame decodes.
 */
export function BackgroundStage({
  poster,
  video,
}: {
  poster: string;
  video: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [motion, setMotion] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = (): void => setMotion(!query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!motion) return;
    const element = ref.current;
    if (element === null) return;

    const play = (): void => {
      const started = element.play();
      if (started !== undefined) {
        // Refused autoplay is an expected outcome, not an error worth throwing.
        started.catch(() => setReady(false));
      }
    };
    play();

    const onVisibility = (): void => {
      if (document.hidden) element.pause();
      else play();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [motion]);

  return (
    <div className="background-stage" aria-hidden="true">
      {/* Still plate. Always painted, so the video only ever fades in over it. */}
      <div
        className="background-stage__plate"
        style={{ backgroundImage: `url(${poster})` }}
      />

      {motion ? (
        <video
          ref={ref}
          className="background-stage__video"
          style={{ opacity: ready ? 1 : 0 }}
          src={video}
          poster={poster}
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
          onError={() => setReady(false)}
        />
      ) : null}

      {/* Grade: cools the plate to the palette and keeps text legible over it. */}
      <div className="background-stage__grade" />
    </div>
  );
}
