"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { fetchNewReleases } from "@/lib/live-changelog";
import type { Release } from "@/lib/mereth";
import { mergeLive } from "@/lib/release-notes";

/**
 * The three newest patches on the home page, corrected live.
 *
 * These used to render straight off the baked bundle, which freezes at build
 * time. We ship more than one patch a day, so the front page was quietly
 * advertising a version older than the one the changelog page was already
 * showing, and the only fix was for somebody to remember to rebuild the site.
 *
 * Same source and same shared request as the changelog: `fetchNewReleases` asks
 * GitHub's releases API for anything newer than the newest baked release and
 * caches the promise for the page view, so this costs nothing extra when both
 * pages are open in a session.
 *
 * The baked three render on the server and are what a reader without JavaScript
 * keeps, so nothing here is load bearing. It can only ever move the list
 * forward: every failure path in `fetchNewReleases` returns an empty array.
 */
export function LatestReleases({
  releases: baked,
  bakedCount,
}: {
  releases: Release[];
  bakedCount: number;
}) {
  const [live, setLive] = useState<Release[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    void fetchNewReleases(baked, controller.signal).then((found) => {
      if (!cancelled && found.length > 0) setLive(found);
    });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [baked]);

  const latest = useMemo(() => mergeLive(baked, live).slice(0, 3), [live, baked]);

  /* Counted the same way the changelog's fact row counts it, so the two pages
     never disagree about how many patches there have been. Only patches count:
     an entry still in testing is shown, because the work is real, but nobody
     has received it. */
  const known = new Set(baked.map((release) => release.version));
  const total =
    bakedCount +
    live.filter((release) => release.shipped !== false && !known.has(release.version)).length;

  return (
    <>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {latest.map((release) => (
          <article
            key={release.version}
            className="relative border border-brand-accent/25 bg-black/35 p-6"
          >
            <FrameCorners size={14} />
            <h3 className="relative flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-[1.05rem] tracking-heading text-brand-accent">
                {release.version}
              </span>
              {release.shipped === false ? (
                <span className="font-display border border-brand-accent/40 px-2 py-[0.15rem] text-[9px] tracking-[1.6px] text-brand-accent/80 uppercase">
                  In testing
                </span>
              ) : null}
              {release.date !== null ? (
                <span className="text-[0.78rem] tabular-nums text-text-muted">{release.date}</span>
              ) : null}
            </h3>
            <ul className="relative mt-4 space-y-2">
              {release.notes.slice(0, 5).map((note, i) => (
                <li key={i} className="text-[0.85rem] leading-relaxed text-text-muted">
                  {note.text}
                </li>
              ))}
            </ul>
            {/* A patch that collected a fortnight of work carries a hundred notes.
                Five of them with no hint of the rest reads as the whole patch. */}
            {release.notes.length > 5 ? (
              <p className="relative mt-3 text-[0.78rem] tabular-nums text-text-muted/70">
                and {release.notes.length - 5} more
              </p>
            ) : null}
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-[0.9rem] text-text-muted">
        <Link
          href="/changelog"
          className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
        >
          All {total} patches since launch
        </Link>
        <span className="mx-3 text-text-muted/50">&middot;</span>
        <Link
          href="/roadmap"
          className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
        >
          What is being built next
        </Link>
      </p>
    </>
  );
}
