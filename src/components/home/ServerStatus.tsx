"use client";

import { useEffect, useState } from "react";

import type { Status } from "@/app/api/status/route";

/**
 * The status block under the hero, in the reference's shape: a small label, a
 * large value, repeated.
 *
 * Fetched rather than rendered on the server so the number stays fresh on a
 * page that is otherwise static, and refreshed on the same 45 second cadence
 * the live site uses. While it is loading the labels are already in place and
 * the values are dashes, so the block never changes height and the page does
 * not jump under the reader.
 *
 * If a feed cannot be read the figure is dropped rather than shown as zero. A
 * confident "0 online" when the truth is "we could not ask" is worse than no
 * number at all.
 */

const REFRESH_MS = 45_000;

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

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <p className="font-display text-[10px] tracking-[3px] text-brand-accent/80 uppercase text-shadow-drop">
        {label}
      </p>
      <p className="font-display mt-2 text-3xl tabular-nums text-text-primary text-shadow-heading md:text-4xl">
        {value}
      </p>
    </div>
  );
}

export function ServerStatus() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = (): void => {
      fetch("/api/status")
        .then((response) => {
          if (!response.ok) throw new Error(`status responded ${response.status}`);
          return response.json();
        })
        .then((data: Status) => {
          if (!cancelled) setStatus(data);
        })
        .catch(() => {
          if (!cancelled) {
            setStatus({
              state: "unknown",
              online: null,
              maxPlayers: null,
              discordMembers: null,
              discordOnline: null,
            });
          }
        });
    };

    load();
    const timer = window.setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const state = status?.state ?? "unknown";
  const dash = "—";

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
            status?.online === null || status?.online === undefined
              ? dash
              : `${status.online}${status.maxPlayers ? ` / ${status.maxPlayers}` : ""}`
          }
        />
        <Figure
          label="In the Discord"
          value={
            status?.discordMembers === null || status?.discordMembers === undefined
              ? dash
              : status.discordMembers.toLocaleString("en-GB")
          }
        />
        <Figure
          label="Online now"
          value={
            status?.discordOnline === null || status?.discordOnline === undefined
              ? dash
              : status.discordOnline.toLocaleString("en-GB")
          }
        />
      </div>
    </div>
  );
}
