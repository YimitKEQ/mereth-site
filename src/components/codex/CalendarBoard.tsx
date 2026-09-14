"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { EventTime, TimeUntil } from "@/components/codex/EventTime";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { fetchChronicle, mergeChronicle } from "@/lib/live-chronicle";
import { inline } from "@/lib/markup";
import {
  formatDayMonth,
  formatInWorld,
  inWorldOrder,
  type Annal,
  type Chronicle,
  type ScheduledEvent,
} from "@/lib/world/calendar";

/**
 * The calendar and the annals, on one page, both correcting themselves.
 *
 * Client rather than server for two reasons that are not the usual one:
 *
 * 1. **The split between coming and passed is a function of now.** Baked into a
 *    static export it is a function of the last deploy, and an event stays
 *    listed as upcoming until somebody happens to rebuild the site. So the
 *    split is recomputed after mount, from the reader's own clock.
 * 2. **The register is delivered live**, not only baked. See
 *    `lib/live-chronicle.ts` for why the lore office is the source rather than
 *    a file in the repository.
 *
 * It is still rendered on the server, because Next renders client components
 * into the HTML too. That is deliberate: the baked register is in the file, so
 * the page is complete for a crawler, for a reader with JavaScript off, and on
 * first paint before any request has been made.
 */

function annalKey(annal: Annal): string {
  return `${annal.when.era}-${annal.when.year}`;
}

function EventCard({ event, past }: { event: ScheduledEvent; past: boolean }) {
  return (
    <article
      className={`relative border border-brand-accent/30 bg-black/30 p-6 ${past ? "opacity-70" : ""}`}
    >
      <FrameCorners weight="thin" size={16} />

      <div className="relative flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
        <h3 className="font-display text-[1.05rem] tracking-heading text-brand-accent uppercase">
          {event.title}
        </h3>
        {past ? null : <TimeUntil startsAt={event.startsAt} />}
      </div>

      <div className="relative mt-2.5">
        <EventTime startsAt={event.startsAt} endsAt={event.endsAt} />
      </div>

      {event.summary === "" ? null : (
        <p className="relative mt-3 text-[0.95rem] leading-[1.8] text-text-light">
          {inline(event.summary)}
        </p>
      )}

      <dl className="relative mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[0.85rem]">
        {event.where === "" ? null : (
          <div>
            <dt className="font-display text-[10px] tracking-[1.6px] text-text-muted uppercase">
              Where
            </dt>
            <dd className="mt-0.5 text-text-primary">{event.where}</dd>
          </div>
        )}
        {event.host === undefined ? null : (
          <div>
            <dt className="font-display text-[10px] tracking-[1.6px] text-text-muted uppercase">
              Held by
            </dt>
            <dd className="mt-0.5 text-text-primary">{event.host}</dd>
          </div>
        )}
        {event.inWorld === undefined ? null : (
          <div>
            <dt className="font-display text-[10px] tracking-[1.6px] text-text-muted uppercase">
              In the province
            </dt>
            <dd className="mt-0.5 text-text-primary">{formatInWorld(event.inWorld)}</dd>
          </div>
        )}
        {event.repeats === undefined ? null : (
          <div>
            <dt className="font-display text-[10px] tracking-[1.6px] text-text-muted uppercase">
              Repeats
            </dt>
            <dd className="mt-0.5 text-text-primary">{event.repeats}</dd>
          </div>
        )}
      </dl>

      {event.link === undefined ? null : (
        <p className="relative mt-4">
          <Link
            href={event.link.href}
            className="text-[0.88rem] text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
          >
            {event.link.label}
          </Link>
        </p>
      )}
    </article>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative border border-dashed border-brand-accent/25 bg-black/20 p-8 text-center">
      <p className="mx-auto max-w-[52ch] text-[0.95rem] leading-[1.8] text-text-muted">{children}</p>
    </div>
  );
}

export function CalendarBoard({ baked }: { baked: Chronicle }) {
  const [register, setRegister] = useState<Chronicle>(baked);

  /*
   * Null until mounted, and every reader of it treats null as "do not split
   * yet". The first client render has to match the server's, and the server has
   * no idea what time it is where the reader is.
   */
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchChronicle(controller.signal).then((live) => {
      if (controller.signal.aborted || live === null) return;
      setRegister((current) => mergeChronicle(current, live));
    });
    return () => controller.abort();
  }, []);

  const { upcoming, past } = useMemo(() => {
    const ended = (event: ScheduledEvent): number => Date.parse(event.endsAt ?? event.startsAt) || 0;
    const byStart = [...register.events].sort(
      (a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt),
    );
    // Before mount everything is "upcoming", which renders one list in date
    // order. That is a defensible page on its own and it is what a crawler and
    // a reader without JavaScript get.
    if (now === null) return { upcoming: byStart, past: [] as ScheduledEvent[] };
    return {
      upcoming: byStart.filter((event) => ended(event) >= now),
      past: byStart.filter((event) => ended(event) < now).reverse(),
    };
  }, [register.events, now]);

  const annals = useMemo(
    () => [...register.annals].sort((a, b) => inWorldOrder(b.when) - inWorldOrder(a.when)),
    [register.annals],
  );

  return (
    <div className="space-y-16">
      <section id="upcoming" className="scroll-mt-[140px]">
        <h2 className="font-display mb-5 text-xl tracking-heading text-brand-accent uppercase">
          What is coming
        </h2>
        {upcoming.length === 0 ? (
          <Empty>
            Nothing is on the calendar right now. Moots, markets, trials, feasts and hunts are
            posted here by the lore team as they are called, and everything scheduled shows in your
            own time zone. Until one appears, the Discord is where a gathering gets arranged.
          </Empty>
        ) : (
          <div className="space-y-5">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} past={false} />
            ))}
          </div>
        )}
      </section>

      {past.length === 0 ? null : (
        <section id="passed" className="scroll-mt-[140px]">
          <h2 className="font-display mb-5 text-xl tracking-heading text-brand-accent uppercase">
            What has passed
          </h2>
          <div className="space-y-5">
            {past.map((event) => (
              <EventCard key={event.id} event={event} past />
            ))}
          </div>
        </section>
      )}

      <section id="annals" className="scroll-mt-[140px]">
        <h2 className="font-display mb-3 text-xl tracking-heading text-brand-accent uppercase">
          The annals of the province
        </h2>
        <p className="mb-7 max-w-[68ch] text-[0.95rem] leading-[1.8] text-text-muted">
          Dated history, newest first. Every entry names where its date comes from, and where the
          story is told properly it links there rather than retelling it. A date written{" "}
          <span className="text-text-primary">c.</span> is our arithmetic from a source that gave it
          relatively, not a year anybody wrote down.
        </p>

        {annals.length === 0 ? (
          <Empty>The annals are empty.</Empty>
        ) : (
          /*
           * The date sits in its own column rather than above the title, which
           * is what makes a column of entries read as a chronology instead of as
           * a list of headlines. It collapses to one column below `lg`, where
           * there is no room for a gutter and the date goes back above the
           * title.
           */
          <ol className="relative">
            {annals.map((annal, index) => {
              const previous = annals[index - 1];
              const newYear = previous === undefined || annalKey(previous) !== annalKey(annal);
              return (
                <li
                  key={annal.id}
                  className="grid gap-x-8 gap-y-2 border-t border-border-subtle py-7 first:border-t-0 first:pt-0 lg:grid-cols-[12rem_minmax(0,1fr)]"
                >
                  <div className="lg:text-right">
                    <div
                      className={`font-display text-[13px] tracking-[2px] uppercase ${
                        newYear ? "text-brand-accent" : "text-text-muted/60"
                      }`}
                    >
                      {annal.when.approximate === true ? "c. " : ""}
                      {annal.when.era}E {annal.when.year}
                    </div>
                    {formatDayMonth(annal.when) === "" ? null : (
                      <div className="mt-1 font-mono text-[0.76rem] text-text-muted tabular-nums">
                        {formatDayMonth(annal.when)}
                      </div>
                    )}
                    <div className="font-display mt-1.5 text-[10px] tracking-[1.6px] text-text-muted uppercase">
                      {annal.scope}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-[1rem] tracking-heading text-text-primary uppercase">
                      {annal.title}
                    </h3>

                    {annal.summary === "" ? null : (
                      <p className="mt-2 max-w-[66ch] text-[0.93rem] leading-[1.8] text-text-light">
                        {inline(annal.summary)}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[0.8rem]">
                      {annal.source === "" ? null : (
                        <span className="max-w-[54ch] text-text-muted">
                          <span className="font-display text-[10px] tracking-[1.4px] uppercase">
                            Source
                          </span>{" "}
                          {annal.when.asWritten === undefined
                            ? annal.source
                            : `${annal.source} It says "${annal.when.asWritten}".`}
                        </span>
                      )}
                      {annal.link === undefined ? null : (
                        <Link
                          href={annal.link.href}
                          className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
                        >
                          {annal.link.label}
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
