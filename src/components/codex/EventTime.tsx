"use client";

import { useEffect, useState } from "react";

/**
 * An event's time, rendered where the reader actually is.
 *
 * Mereth is played from several continents and an event announced as "eight in
 * the evening" is useless to two thirds of the people reading it. Every instant
 * is stored as UTC and shown twice: the reader's own zone, named, with UTC
 * beside it so a screenshot of this page means the same thing to everybody.
 *
 * **Why this is a client component and starts on UTC.** The site is a static
 * export, so the HTML is rendered once, months before somebody reads it, on a
 * machine in a zone nobody is in. Formatting to a local zone during that render
 * produces one string in the file and a different one in the browser, which is
 * a hydration mismatch: React throws the server markup away and, in a
 * production build, the two can simply disagree with no warning at all. So the
 * deterministic form is what ships in the file, and the local reading replaces
 * it after mount, once there is a real browser with a real zone to ask.
 */

const UTC_FORMAT: Intl.DateTimeFormatOptions = {
  timeZone: "UTC",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

const LOCAL_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

/** "Sat 20 Sep, 19:00 UTC", built the same way on the server and in the browser. */
function utcLabel(iso: string): string {
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return iso;
  return `${new Intl.DateTimeFormat("en-GB", UTC_FORMAT).format(at)} UTC`;
}

export function EventTime({ startsAt, endsAt }: { startsAt: string; endsAt?: string }) {
  const [local, setLocal] = useState<{ label: string; zone: string } | null>(null);

  useEffect(() => {
    const start = new Date(startsAt);
    if (Number.isNaN(start.getTime())) return;

    const formatter = new Intl.DateTimeFormat("en-GB", LOCAL_FORMAT);
    let label = formatter.format(start);

    // An end on the same day needs the clock time only: "19:00 to 21:00", not
    // the date twice.
    if (endsAt !== undefined) {
      const end = new Date(endsAt);
      if (!Number.isNaN(end.getTime())) {
        const sameDay = formatter.format(end).slice(0, 10) === label.slice(0, 10);
        label += sameDay
          ? ` to ${new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(end)}`
          : ` to ${formatter.format(end)}`;
      }
    }

    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "your time";
    setLocal({ label, zone });
  }, [startsAt, endsAt]);

  if (local === null) {
    return (
      <span className="font-mono text-[0.82rem] text-text-primary tabular-nums">
        {utcLabel(startsAt)}
      </span>
    );
  }

  return (
    <span className="font-mono text-[0.82rem] text-text-primary tabular-nums">
      {local.label}
      <span className="ml-2 text-text-muted">
        {local.zone} &middot; {utcLabel(startsAt)}
      </span>
    </span>
  );
}

/**
 * How far off an event is, in words.
 *
 * Rendered only after mount, for the same reason as the zone: a build-time
 * "in three days" is wrong the day after the build, and on a site that is
 * rebuilt when somebody deploys rather than nightly, that is most days.
 */
export function TimeUntil({ startsAt }: { startsAt: string }) {
  const [away, setAway] = useState<string | null>(null);

  useEffect(() => {
    const at = Date.parse(startsAt);
    if (Number.isNaN(at)) return;

    const tick = (): void => {
      const minutes = Math.round((at - Date.now()) / 60_000);
      if (minutes <= 0) {
        setAway("happening now");
        return;
      }
      if (minutes < 60) {
        setAway(`in ${minutes} minute${minutes === 1 ? "" : "s"}`);
        return;
      }
      const hours = Math.round(minutes / 60);
      if (hours < 36) {
        setAway(`in ${hours} hour${hours === 1 ? "" : "s"}`);
        return;
      }
      const days = Math.round(hours / 24);
      setAway(`in ${days} day${days === 1 ? "" : "s"}`);
    };

    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, [startsAt]);

  if (away === null) return null;
  return (
    <span className="font-display text-[10px] tracking-[1.6px] text-brand-accent uppercase">
      {away}
    </span>
  );
}
