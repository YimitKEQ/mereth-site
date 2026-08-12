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
 * Held for now, on request: the labels and the layout are in place and each
 * figure sits as a drawn rule until the team is ready to publish it. Flip this to
 * `true` and the live values appear; nothing else has to change, because the
 * route and the fetch are already working and the reserved space is identical
 * either way.
 *
 * The status line above them is not affected. It is a state rather than a
 * count, and it is worth showing from the first day.
 */
const SHOW_FIGURES = false;

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
function Figure({ label, value }: { label: string; value: string | null }) {
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
        <p className="font-display mt-2 text-3xl tabular-nums text-text-primary text-shadow-heading md:text-4xl">
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

    const load = (): void => {
      void fetchStatus(controller.signal).then((data) => {
        if (!cancelled) setStatus(data);
      });
    };

    load();
    const timer = window.setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(timer);
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

      <div className="mt-10 flex flex-wrap items-start justify-center gap-x-14 gap-y-8">
        <Figure
          label="Souls abroad"
          value={
            held(status?.online) === null
              ? null
              : `${status?.online}${status?.maxPlayers ? ` / ${status.maxPlayers}` : ""}`
          }
        />
        <Figure
          label="In the Discord"
          value={held(status?.discordMembers)?.toLocaleString("en-GB") ?? null}
        />
        <Figure
          label="Online now"
          value={held(status?.discordOnline)?.toLocaleString("en-GB") ?? null}
        />
      </div>
    </div>
  );
}
