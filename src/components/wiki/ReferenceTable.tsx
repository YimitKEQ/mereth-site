"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { OrnateBox } from "@/components/ornament/OrnateBox";
import { SearchField } from "@/components/ui/Controls";
import type { ReferenceSet } from "@/lib/reference";

const PAGE = 60;

/**
 * One table for every reference dataset.
 *
 * These run to a few thousand rows, so three things matter. Filtering works on
 * a pre-lowered haystack rather than re-joining fields each keystroke, the
 * query is deferred so typing never blocks on a re-filter, and results page
 * rather than rendering nine hundred rows into the document at once.
 */
export function ReferenceTable({ set }: { set: ReferenceSet }) {
  const [query, setQuery] = useState("");
  const [facet, setFacet] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);
  const deferred = useDeferredValue(query);

  const facets = useMemo(() => {
    if (set.facetLabel === undefined) return [];
    const seen = new Map<string, number>();
    for (const row of set.rows) {
      if (row.facet === undefined) continue;
      seen.set(row.facet, (seen.get(row.facet) ?? 0) + 1);
    }
    return [...seen.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [set]);

  const rows = useMemo(() => {
    const needle = deferred.trim().toLowerCase();
    return set.rows.filter((row) => {
      if (facet !== null && row.facet !== facet) return false;
      if (needle === "") return true;
      return row.haystack.includes(needle);
    });
  }, [set, deferred, facet]);

  const visible = rows.slice(0, shown);

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="flex flex-col gap-5">
        <SearchField
          label={`Search ${set.title.toLowerCase()}`}
          placeholder="Search…"
          value={query}
          onChange={(next) => {
            setQuery(next);
            setShown(PAGE);
          }}
        />

        {facets.length > 0 ? (
          <OrnateBox size="sm" contentClassName="p-4">
            <h2 className="font-display px-2 text-xs tracking-heading text-brand-accent">
              {set.facetLabel}
            </h2>
            <ul className="mt-3 flex flex-col gap-1">
              <li>
                <button
                  type="button"
                  aria-pressed={facet === null}
                  onClick={() => {
                    setFacet(null);
                    setShown(PAGE);
                  }}
                  className={`flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm transition-colors ${
                    facet === null
                      ? "bg-brand-accent/15 text-brand-accent"
                      : "text-text-muted hover:bg-white/5 hover:text-text-primary"
                  }`}
                >
                  <span>All</span>
                  <span className="tabular-nums opacity-70">{set.rows.length}</span>
                </button>
              </li>
              {facets.map(([name, count]) => (
                <li key={name}>
                  <button
                    type="button"
                    aria-pressed={facet === name}
                    onClick={() => {
                      setFacet(name);
                      setShown(PAGE);
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-sm transition-colors ${
                      facet === name
                        ? "bg-brand-accent/15 text-brand-accent"
                        : "text-text-muted hover:bg-white/5 hover:text-text-primary"
                    }`}
                  >
                    <span className="truncate">{name}</span>
                    <span className="shrink-0 tabular-nums opacity-70">{count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </OrnateBox>
        ) : null}
      </aside>

      <div>
        <p className="mb-4 text-sm text-text-muted" aria-live="polite">
          {rows.length.toLocaleString("en-GB")} of {set.rows.length.toLocaleString("en-GB")} rows
          {facet !== null ? ` in ${facet}` : ""}
        </p>

        {rows.length === 0 ? (
          <OrnateBox size="md" contentClassName="p-12 text-center">
            <p className="font-display text-lg tracking-heading text-brand-accent">Nothing matches</p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-text-muted">
              Try a shorter term, or clear the filter.
            </p>
          </OrnateBox>
        ) : (
          <OrnateBox size="md" contentClassName="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr>
                  {set.columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="font-display sticky top-0 border-b border-brand-accent/40 bg-[var(--color-bg-overlay)] px-4 py-3 text-xs tracking-widest text-brand-accent"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={row.key} className="border-b border-white/6 last:border-0 hover:bg-white/4">
                    {row.cells.map((cell, index) => (
                      <td
                        key={index}
                        className={`px-4 py-2.5 align-top ${
                          index === 0 ? "text-text-primary" : "text-text-muted"
                        } ${/^\d+$/.test(cell) ? "tabular-nums" : ""}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </OrnateBox>
        )}

        {shown < rows.length ? (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShown((n) => n + PAGE * 2)}
              className="font-display border-2 border-brand-accent/70 px-6 py-3 text-xs tracking-widest text-brand-accent transition-colors hover:bg-brand-accent/10"
            >
              Show more ({(rows.length - shown).toLocaleString("en-GB")} left)
            </button>
          </div>
        ) : null}

        <p className="mt-6 text-xs text-text-muted">{set.provenance}</p>
      </div>
    </div>
  );
}
