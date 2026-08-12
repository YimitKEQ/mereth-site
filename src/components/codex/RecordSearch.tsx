"use client";

import { useEffect, useMemo, useState } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { Search } from "@/components/ui/icons";

/**
 * Search across every named record in the plugins the launcher installs.
 *
 * The catalogue is ~800 KB, so it is a static file fetched on first use rather
 * than part of the page. Until it arrives the input still accepts typing and
 * says what it is doing, because a search box that silently does nothing is
 * worse than a slow one.
 *
 * What this is and is not, stated on the page rather than implied: it knows
 * that a thing exists and which plugin declares it. It does not know where the
 * thing stands, what it costs, or whether anyone will ever sell you one.
 */

interface Catalog {
  signatures: { signature: string; label: string; group: string; count: number }[];
  /** [name, signature] pairs, sorted by name. */
  records: [string, string][];
}

const MAX_RESULTS = 200;

/**
 * Somewhere to start, because an empty search box over 28,000 records is a
 * blank page with a cursor in it. These are chosen to demonstrate what the
 * catalogue is good for: materials, gear families and named places.
 */
const SUGGESTIONS = [
  "ebony",
  "lockpick",
  "spellbook",
  "iron ore",
  "leather strips",
  "mead",
  "dwarven",
  "Whiterun",
];

export function RecordSearch({ total }: { total: number }) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/catalog.json")
      .then((response) => {
        if (!response.ok) throw new Error(`catalog responded ${response.status}`);
        return response.json();
      })
      .then((data: Catalog) => {
        if (!cancelled) setCatalog(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const labelFor = useMemo(() => {
    const map = new Map<string, { label: string; group: string }>();
    for (const signature of catalog?.signatures ?? []) {
      map.set(signature.signature, { label: signature.label, group: signature.group });
    }
    return map;
  }, [catalog]);

  const groups = useMemo(() => {
    const tally = new Map<string, number>();
    for (const signature of catalog?.signatures ?? []) {
      tally.set(signature.group, (tally.get(signature.group) ?? 0) + signature.count);
    }
    return [...tally.entries()].sort((a, b) => b[1] - a[1]);
  }, [catalog]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (catalog === null || trimmed.length < 2) return [];

    const out: { name: string; signature: string; label: string; group: string }[] = [];
    for (const [name, signature] of catalog.records) {
      const meta = labelFor.get(signature);
      if (meta === undefined) continue;
      if (group !== null && meta.group !== group) continue;
      if (!name.toLowerCase().includes(trimmed)) continue;
      out.push({ name, signature, label: meta.label, group: meta.group });
      if (out.length >= MAX_RESULTS) break;
    }
    return out;
  }, [catalog, query, group, labelFor]);

  const trimmed = query.trim();

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex min-w-0 flex-1 items-center gap-3 border border-brand-accent/40 bg-black/35 px-4 py-3 lg:max-w-lg">
          <FrameCorners weight="thin" size={14} />
          <Search className="relative shrink-0 text-brand-accent" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              catalog === null && !failed
                ? "Reading the catalogue..."
                : `Search ${total.toLocaleString("en-GB")} records`
            }
            aria-label="Search records"
            className="relative w-full bg-transparent text-[0.95rem] text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setGroup(null)}
            aria-pressed={group === null}
            className={`cursor-pointer border px-3 py-1.5 text-[0.8rem] transition-colors ${
              group === null
                ? "border-brand-accent text-brand-accent"
                : "border-border-subtle text-text-muted hover:border-brand-accent/50 hover:text-text-light"
            }`}
          >
            Everything
          </button>
          {groups.map(([name]) => (
            <button
              key={name}
              type="button"
              onClick={() => setGroup(group === name ? null : name)}
              aria-pressed={group === name}
              className={`cursor-pointer border px-3 py-1.5 text-[0.8rem] transition-colors ${
                group === name
                  ? "border-brand-accent text-brand-accent"
                  : "border-border-subtle text-text-muted hover:border-brand-accent/50 hover:text-text-light"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {failed ? (
        <p className="text-sm text-text-muted">
          The catalogue could not be loaded. Everything else on this site works without it.
        </p>
      ) : catalog === null ? (
        <p className="text-sm text-text-muted">Reading the catalogue...</p>
      ) : trimmed.length < 2 ? (
        <div>
          <p className="text-sm text-text-muted">
            Type at least two letters, or start from one of these:
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="cursor-pointer border border-border-subtle px-3 py-1.5 text-[0.82rem] text-text-muted transition-colors hover:border-brand-accent/50 hover:text-text-light"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : results.length === 0 ? (
        <p className="text-sm text-text-muted">
          Nothing named <span className="text-text-primary">{trimmed}</span>
          {group === null ? "" : ` in ${group}`}.
        </p>
      ) : (
        <>
          <p className="mb-4 text-[0.8rem] text-text-muted">
            {results.length === MAX_RESULTS ? `First ${MAX_RESULTS} matches. ` : ""}
            {results.length.toLocaleString("en-GB")} shown.
          </p>
          <ul className="grid gap-x-10 md:grid-cols-2">
            {results.map((record) => (
              <li
                key={`${record.signature}:${record.name}`}
                className="flex items-baseline justify-between gap-4 border-b border-border-subtle py-2.5"
              >
                <span className="min-w-0 truncate text-[0.92rem] text-text-primary">
                  {record.name}
                </span>
                <span className="shrink-0 text-[0.78rem] text-text-muted">{record.label}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
