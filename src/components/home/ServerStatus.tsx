"use client";

import { useEffect, useState } from "react";

import { fetchStatus, type Status } from "@/lib/status";

/**
 * The status block under the hero, in the reference's shape: a small label, a
 * large value, repeated.
 *
 * Fetched in the browser rather than rendered on the server, so the figures
 * stay live on a site that ships as static files, and refreshed on the same 45
 * second cadence the live site uses. A held figure and a real one reserve the same height, so
 * the block never resizes and the page does not jump under the reader.
 *
 * If a feed cannot be read the figure is held rather than shown as zero. A
 * confident "0 online" when the truth is "we could not ask" is worse than no
 * number at all.
 */

const REFRESH_MS = 45_000;

/**
 * Whether the three counts are shown or held.
 *
 * Held while the figures were not yet worth publishing. Turned on once each one
 * had a source that is actually live: the two Discord counts come from the public
 * invite endpoint, and the player count from the proxy on our own origin.
 *
 * This is not the only guard. A figure with no readable source arrives as null and
 * the row draws a rule in its place, so a feed going down shows a blank rather
 * than a zero, and the count that used to come from a static file is not read at
 * all. See `src/lib/status.ts`.
 */
const SHOW_FIGURES = true;

const STATE_LABEL: Record<Status["state"], string> = {
  online: "Open, and taking applications",
  offline: "Offline for maintenance",
  unknown: "Status unavailable",
};

const STATE_COLOUR: Record<Status["state"], string> = {
  online: "text-text-primary",
  offline: "text-[#d08a76]",
  unknown: "text-text-muted",
};

/**
 * One label with its figure, or a drawn rule where the figure will go.
 *
 * The held state is a rule rather than a typed hyphen. In the display face a
 * hyphen sits low and narrow and reads as a stray mark rather than as a
 * deliberate blank, and the obvious alternative is an em-dash, which is banned
 * throughout this codebase. Drawing it solves both and sits at the right
 * optical height for the digits it is standing in for.
 */
function Figure({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | null;
  tone: "community" | "live";
}) {
  return (
    <div className="flex flex-col items-center">
      <p className="font-display text-[10px] tracking-[3px] text-brand-accent/80 uppercase text-shadow-drop">
        {label}
      </p>
      {value === null ? (
        <span
          aria-label="not published yet"
          role="img"
          className="mt-2 flex h-[2.25rem] items-center md:h-[2.5rem]"
        >
          <span
            aria-hidden="true"
            className="block h-[3px] w-9 rounded-full bg-text-muted/50"
          />
        </span>
      ) : (
        <p
          className={`font-display mt-2 text-3xl tabular-nums text-shadow-heading md:text-4xl ${
            tone === "community" ? "text-stat-community" : "text-stat-live"
          }`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

export function ServerStatus() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    let timer = 0;

    /*
     * Re-armed after each cycle settles rather than run on a fixed interval.
     *
     * With setInterval a slow upstream gets a fresh request every 45 seconds
     * whether or not the last one finished, and the answers then land in
     * whatever order they complete: a stale reply from two cycles ago can
     * overwrite a fresh one. Chaining the next wait to the previous result
     * makes both impossible.
     */
    const load = (): void => {
      void fetchStatus(controller.signal).then((data) => {
        if (cancelled) return;
        setStatus(data);
        timer = window.setTimeout(load, REFRESH_MS);
      });
    };

    load();
    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);

  const state = status?.state ?? "unknown";

  /** Null means "hold it": the Figure draws a rule instead of a number. */
  const held = <T,>(value: T | null | undefined): T | null =>
    !SHOW_FIGURES || value === null || value === undefined ? null : value;

  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-display text-[10px] tracking-[3px] text-brand-accent/80 uppercase text-shadow-drop">
        Server status
      </p>
      <p
        className={`font-display mt-2 text-xl text-shadow-heading md:text-2xl ${
          status === null ? "text-text-muted" : STATE_COLOUR[state]
        }`}
      >
        {status === null ? "Checking..." : STATE_LABEL[state]}
      </p>

      {/*
        Ordered as a funnel, which is the reading Bruin gave them and the reason all
        three earn their place: everyone who has joined, then who is at their desk,
        then who is actually in Skyrim. Souls abroad used to sit first, directly
        beside Online now, and the two were read as the same number twice. Last is
        where it stops competing and where the sequence lands.

        No capacity beside the player count, on request. "119 / 1000" invites the
        reader to divide, and a tenth of a cap they have no feel for reads as a quiet
        room rather than as a busy one.
      */}
      <div className="mt-10 flex flex-wrap items-start justify-center gap-x-14 gap-y-8">
        <Figure
          label="In the Discord"
          tone="community"
          value={held(status?.discordMembers)?.toLocaleString("en-GB") ?? null}
        />
        <Figure
          label="Online now"
          tone="live"
          value={held(status?.discordOnline)?.toLocaleString("en-GB") ?? null}
        />
        <Figure
          label="Souls abroad"
          tone="live"
          value={held(status?.online)?.toLocaleString("en-GB") ?? null}
        />
      </div>
    </div>
  );
}
