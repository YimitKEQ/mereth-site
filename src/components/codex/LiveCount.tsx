"use client";

import { useEffect, useState } from "react";

import { fetchChronicle, mergeChronicle } from "@/lib/live-chronicle";
import type { Chronicle } from "@/lib/world/calendar";

/**
 * One figure from the register, corrected in the browser.
 *
 * The list of annals already corrects itself from the lore office, but the
 * count above it was baked at build time, so the page said "in the annals 9"
 * over a list of ten. A figure that disagrees with the thing it counts is worse
 * than no figure: it is the page telling a reader, in its own words, that one
 * of its two answers is wrong.
 *
 * The fetch is shared. `fetchChronicle` keeps one request in flight per page
 * view however many components ask, so this costs nothing beyond the request
 * the board already makes.
 */
export function LiveCount({ baked, kind }: { baked: Chronicle; kind: "annals" | "events" }) {
  const [count, setCount] = useState(baked[kind].length);

  useEffect(() => {
    const controller = new AbortController();
    void fetchChronicle(controller.signal).then((live) => {
      if (controller.signal.aborted || live === null) return;
      setCount(mergeChronicle(baked, live)[kind].length);
    });
    return () => controller.abort();
  }, [baked, kind]);

  return <>{count}</>;
}
