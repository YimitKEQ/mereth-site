"use client";

import { useEffect, useMemo, useState } from "react";

import { useHashSeed } from "@/components/codex/hash-seed";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { Search } from "@/components/ui/icons";
import type { Bench } from "@/lib/mereth";

/**
 * What comes off which bench, and what it takes.
 *
 * Benches are the axis rather than item categories, because standing at the
 * wrong bench is the actual failure mode: the recipe exists, you are just not
 * in front of the thing that makes it.
 */
const PAGE = 60;

export function RecipeBrowser({ benches }: { benches: Bench[] }) {
  const [bench, setBench] = useState(benches[0]?.name ?? "");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE);

  /*
   * Seeded from `#benches&bench=<name>&q=<result>`, which is how the command
   * palette hands over a recipe. Both halves matter: a query on its own would
   * search whichever bench happened to be first, and a recipe is only findable
   * at the bench that makes it.
   *
   * Applied, never written back. The hash belongs to `Tabs`, and a browser that
   * also wrote it would fight the reader every time they cleared the box.
   */
  const seed = useHashSeed();
  useEffect(() => {
    // Only honour a bench that exists, or the rail would highlight the fallback
    // while the state claimed something else entirely.
    const wanted = seed.get("bench");
    if (wanted !== undefined && benches.some((item) => item.name === wanted)) setBench(wanted);
    const term = seed.get("q");
    if (term !== undefined && term !== "") setQuery(term);
  }, [benches, seed]);

  const active = benches.find((b) => b.name === bench) ?? benches[0];

  const recipes = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (active === undefined) return [];
    if (trimmed === "") return active.recipes;
    return active.recipes.filter(
      (recipe) =>
        recipe.result.toLowerCase().includes(trimmed) ||
        recipe.items.some((item) => item.name.toLowerCase().includes(trimmed)),
    );
  }, [active, query]);

  /* Two separate caps, and only this one is about drawing. A bench rendered
     whole made the page thousands of pixels of rows nobody scrolled, so the
     list opens on a readable number and grows on request.

     The other cap is upstream and is not a display concern at all: the export
     ships `RECIPE_SAMPLE` recipes per bench and carries the true count beside
     them, so the workbench arrives as 150 of 1,567. Searching therefore looks
     at every recipe that shipped, which is not every recipe that exists. The
     note above the list and the empty state below both say so, because a
     search that silently misses things is worse than one that admits it. */
  const shown = recipes.slice(0, limit);
  const remaining = recipes.length - shown.length;

  /* Only where it is true. Most benches ship whole, and warning a reader at the
     campfire that they might be missing something would send them hunting for a
     recipe that was never there. */
  const sampled = active !== undefined && active.total > active.recipes.length;

  return (
    <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
      <nav aria-label="Benches">
        <p className="font-display mb-4 text-[11px] tracking-[2px] text-text-muted uppercase">
          Benches
        </p>
        <ul className="space-y-0.5 border-l border-brand-accent/20">
          {benches.map((item) => (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => { setBench(item.name); setLimit(PAGE); }}
                className={`-ml-px flex w-full cursor-pointer items-center justify-between gap-3 border-l-2 py-1.5 pl-4 text-left text-[0.85rem] transition-colors ${
                  item.name === active?.name
                    ? "border-brand-accent text-brand-accent"
                    : "border-transparent text-text-muted hover:border-brand-accent/40 hover:text-text-light"
                }`}
              >
                <span className="min-w-0 truncate">{item.name}</span>
                <span className="shrink-0 tabular-nums opacity-60">{item.total}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 max-w-3xl">
        <div className="relative mb-5 flex max-w-md items-center gap-3 border border-brand-accent/40 bg-black/35 px-4 py-3">
          <FrameCorners weight="thin" size={14} />
          <Search className="relative shrink-0 text-brand-accent" />
          <input
            value={query}
            onChange={(event) => { setQuery(event.target.value); setLimit(PAGE); }}
            placeholder={`Search the ${active?.name.toLowerCase() ?? "bench"}`}
            aria-label="Search recipes"
            className="relative w-full bg-transparent text-[0.95rem] text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </div>

        {sampled && active !== undefined ? (
          <p className="mb-5 text-[0.8rem] text-text-muted">
            Showing {active.recipes.length} of {active.total.toLocaleString("en-GB")} recipes at the{" "}
            {active.name.toLowerCase()}. Most of the remainder are variants of what is listed.
          </p>
        ) : null}

        {recipes.length === 0 ? (
          <p className="text-sm text-text-muted">
            Nothing at this bench matches <span className="text-text-primary">{query}</span>.
            {sampled && active !== undefined ? (
              <>
                {" "}
                What is listed is a sample of the {active.total.toLocaleString("en-GB")} recipes at
                the {active.name.toLowerCase()} rather than the whole set, so a rarer variant may
                not be in it.
              </>
            ) : null}
          </p>
        ) : (
          <ul>
            {shown.map((recipe, index) => (
              <li
                key={`${recipe.result}:${index}`}
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-border-subtle py-2.5 last:border-0"
              >
                <span className="text-[0.95rem] text-text-primary">
                  {recipe.result}
                  {recipe.count > 1 ? (
                    <span className="ml-2 text-[0.8rem] tabular-nums text-brand-accent">
                      x{recipe.count}
                    </span>
                  ) : null}
                </span>
                <span className="text-right text-[0.85rem] text-text-muted">
                  {recipe.items.length === 0
                    ? "no listed materials"
                    : recipe.items
                        .map((item) => (item.count > 1 ? `${item.count} ${item.name}` : item.name))
                        .join(", ")}
                  {recipe.perks.length > 0 ? (
                    <span className="ml-3 text-brand-accent/70">{recipe.perks.join(", ")}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        )}

        {remaining > 0 ? (
          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setLimit((current) => current + PAGE * 3)}
              className="ornate-glow cursor-pointer border border-brand-accent/50 bg-black/40 px-6 py-2.5 text-[0.82rem] tracking-[1.2px] text-brand-accent uppercase transition-colors hover:border-brand-accent hover:text-brand-glow"
            >
              Show {Math.min(remaining, PAGE * 3)} more
            </button>
            <span className="text-[0.8rem] tabular-nums text-text-muted">
              {shown.length} of {recipes.length}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
