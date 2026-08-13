"use client";

import { useEffect, useMemo, useState } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { Search } from "@/components/ui/icons";
import { fetchNewReleases } from "@/lib/live-changelog";
import type { Release } from "@/lib/mereth";

/**
 * The changelog, filterable.
 *
 * A flat wall of releases is only useful to somebody who already knows what
 * they are looking for. The two questions people actually arrive with are "what
 * changed for my character" and "when did this break", so the controls are a
 * kind filter and a free text search rather than a date picker.
 *
 * Kinds are counted from the notes themselves rather than from a list we
 * maintain here, so a new one appears the day it is first used.
 *
 * Paged deliberately. We ship more than one release a day, so rendering every
 * one at full height makes a page tens of thousands of pixels tall that nobody
 * reaches the bottom of. Twelve at a time, grouped by month, gives the eye
 * somewhere to rest. A search widens the page automatically, because somebody
 * who typed a word wants every match, not the first twelve.
 */

const KIND_COLOUR: Record<string, string> = {
  Added: "#7fc99a",
  Fixed: "#9fb8c4",
  Changed: "#e0b45c",
  Removed: "#c9705c",
};

const PAGE = 12;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** "2026-08-11" to "August 2026". Undated releases group under their own heading. */
function monthOf(date: string | null): string {
  if (date === null) return "Undated";
  const [year, month] = date.split("-");
  const index = Number(month) - 1;
  const name = MONTHS[index];
  if (year === undefined || name === undefined) return "Undated";
  return `${name} ${year}`;
}

export function ChangelogBrowser({ releases: baked }: { releases: Release[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE);
  const [live, setLive] = useState<Release[]>([]);

  /*
   * Anything upstream has published since this site was built, prepended.
   *
   * We ship more than one patch a day, so the baked list is behind the moment a
   * build lands and somebody has to remember to rebuild it. Asking GitHub in the
   * browser closes that gap on its own. It can only ever add: every failure path
   * in `fetchNewReleases` returns nothing, leaving exactly the page that was
   * rendered on the server.
   */
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

  const releases = useMemo(() => (live.length > 0 ? [...live, ...baked] : baked), [live, baked]);

  const kinds = useMemo(() => {
    const tally = new Map<string, number>();
    for (const release of releases) {
      for (const note of release.notes) {
        if (note.kind === null) continue;
        tally.set(note.kind, (tally.get(note.kind) ?? 0) + 1);
      }
    }
    return [...tally.entries()].sort((a, b) => b[1] - a[1]);
  }, [releases]);

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return releases
      .map((release) => ({
        ...release,
        notes: release.notes.filter(
          (note) =>
            (kind === null || note.kind === kind) &&
            (trimmed === "" ||
              note.text.toLowerCase().includes(trimmed) ||
              release.version.toLowerCase().includes(trimmed)),
        ),
      }))
      .filter((release) => release.notes.length > 0);
  }, [releases, query, kind]);

  const searching = query.trim() !== "" || kind !== null;
  const visible = searching ? filtered : filtered.slice(0, limit);
  const remaining = filtered.length - visible.length;
  const shownNotes = visible.reduce((total, release) => total + release.notes.length, 0);

  /* Month headings, computed over what is actually on screen so the last one is
     never a heading with nothing under it. */
  const firstOfMonth = new Map<string, string>();
  for (const release of visible) {
    const month = monthOf(release.date);
    if (!firstOfMonth.has(month)) firstOfMonth.set(month, release.version);
  }

  const reset = (): void => setLimit(PAGE);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative flex max-w-md items-center gap-3 border border-brand-accent/40 bg-black/35 px-4 py-3">
          <FrameCorners size={14} />
          <Search className="relative shrink-0 text-brand-accent" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              reset();
            }}
            placeholder="Search the notes, or a version"
            aria-label="Search the changelog"
            className="relative w-full bg-transparent text-[0.95rem] text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setKind(null);
              reset();
            }}
            aria-pressed={kind === null}
            className={`cursor-pointer border px-3 py-1.5 text-[0.8rem] transition-colors ${
              kind === null
                ? "border-brand-accent text-brand-accent"
                : "border-border-subtle text-text-muted hover:border-brand-accent/50 hover:text-text-light"
            }`}
          >
            Everything
          </button>
          {kinds.map(([name, count]) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                setKind(kind === name ? null : name);
                reset();
              }}
              aria-pressed={kind === name}
              className="cursor-pointer border px-3 py-1.5 text-[0.8rem] transition-colors"
              style={{
                borderColor: kind === name ? KIND_COLOUR[name] : "var(--color-border-subtle)",
                color: kind === name ? KIND_COLOUR[name] : "var(--color-text-muted)",
              }}
            >
              {name} <span className="tabular-nums opacity-60">{count}</span>
            </button>
          ))}
        </div>

        <p className="text-[0.8rem] tabular-nums text-text-muted">
          {searching
            ? `${shownNotes.toLocaleString("en-GB")} notes across ${filtered.length} releases match.`
            : `Showing ${visible.length} of ${filtered.length} releases.`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-text-muted">
          Nothing matches <span className="text-text-primary">{query}</span>
          {kind === null ? "" : ` under ${kind}`}.
        </p>
      ) : (
        <>
          <ol className="space-y-8">
            {visible.map((release) => {
              const month = monthOf(release.date);
              const opensMonth = firstOfMonth.get(month) === release.version;

              return (
                <li key={release.version}>
                  {opensMonth ? (
                    <div className="mb-6 flex items-center gap-4 first:mt-0">
                      <span className="font-display text-[11px] tracking-[2.4px] text-text-muted uppercase">
                        {month}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-px flex-1 bg-gradient-to-r from-brand-accent/30 to-transparent"
                      />
                    </div>
                  ) : null}

                  <h3 className="flex items-baseline gap-4">
                    <span className="font-display text-[1.05rem] tracking-heading text-brand-accent">
                      {release.version}
                    </span>
                    {release.date !== null ? (
                      <span className="text-[0.8rem] tabular-nums text-text-muted">
                        {release.date}
                      </span>
                    ) : null}
                    <span className="ml-auto text-[0.75rem] tabular-nums text-text-muted/70">
                      {release.notes.length} {release.notes.length === 1 ? "note" : "notes"}
                    </span>
                  </h3>

                  <ul className="mt-3 space-y-2 border-l border-brand-accent/20 pl-5">
                    {release.notes.map((note, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-[0.88rem] leading-relaxed text-text-light"
                      >
                        {note.kind === null ? null : (
                          <span
                            className="font-display mt-[0.15em] w-[3.6rem] shrink-0 text-[10px] tracking-[1.2px] uppercase"
                            style={{ color: KIND_COLOUR[note.kind] ?? "var(--color-text-muted)" }}
                          >
                            {note.kind}
                          </span>
                        )}
                        <span>{note.text}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>

          {remaining > 0 ? (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setLimit((current) => current + PAGE * 2)}
                className="ornate-glow cursor-pointer border border-brand-accent/50 bg-black/40 px-7 py-3 text-[0.85rem] tracking-[1.2px] text-brand-accent uppercase transition-colors hover:border-brand-accent hover:text-brand-glow"
              >
                Show {Math.min(remaining, PAGE * 2)} more
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
