"use client";

import { useEffect, useState } from "react";

import { fetchNewReleases } from "@/lib/live-changelog";
import type { Release } from "@/lib/mereth";

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

  const latest = extra[0] ?? releases[0];
  const total = bakedCount + extra.length;

  const facts = [
    { label: "Latest", value: latest?.version ?? "?" },
    { label: "Shipped", value: latest?.date ?? "?" },
    { label: "Releases", value: String(total) },
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
