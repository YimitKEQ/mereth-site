"use client";

import { useEffect, useState } from "react";

import { fetchNewReleases } from "@/lib/live-changelog";
import type { Release } from "@/lib/mereth";
import { mergeLive } from "@/lib/release-notes";

/**
 * The three facts above the changelog, corrected live.
 *
 * These used to be rendered straight from the baked bundle, which was fine until
 * the list below them started picking up releases published since the build. A
 * header reading "Latest 0.68.28" above a list opening with 0.68.31 reads as a
 * broken page, so the same lookup feeds both. It is one request either way: the
 * fetch is shared inside `live-changelog`.
 *
 * The baked values render first and are what a reader without JavaScript keeps,
 * so nothing here is load bearing. It only ever moves the numbers forward.
 *
 * "Patches", not "releases", and the difference is the point: a third of the
 * tags upstream are internal builds that are collected into the next patch
 * rather than shipped on their own. Counting those made the figure roughly
 * double what players had actually received.
 */
export function LatestRelease({
  releases,
  bakedCount,
}: {
  releases: Release[];
  bakedCount: number;
}) {
  const [extra, setExtra] = useState<Release[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    void fetchNewReleases(releases, controller.signal).then((found) => {
      if (!cancelled && found.length > 0) setExtra(found);
    });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [releases]);

  /*
   * The newest patch, which is not always the first row. An entry still in
   * testing sits above the patches and is not something anybody has received,
   * so it must not be what "Latest" and "Shipped" report.
   */
  const merged = mergeLive(releases, extra);
  const latest = merged.find((release) => release.shipped !== false) ?? merged[0];

  /* Baked count plus whatever the live answer added that the bundle did not
     already carry, counting patches only. */
  const known = new Set(releases.map((release) => release.version));
  const added = extra.filter(
    (release) => release.shipped !== false && !known.has(release.version),
  ).length;

  const facts = [
    { label: "Latest", value: latest?.version ?? "?" },
    { label: "Shipped", value: latest?.date ?? "?" },
    { label: "Patches", value: String(bakedCount + added) },
  ];

  return (
    <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt className="font-display text-[10px] tracking-[2px] text-text-muted uppercase">
            {fact.label}
          </dt>
          <dd className="font-display mt-1 text-2xl tabular-nums text-brand-accent">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
