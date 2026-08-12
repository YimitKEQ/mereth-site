"use client";

import { useMemo, useState } from "react";

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
export function RecipeBrowser({ benches }: { benches: Bench[] }) {
  const [bench, setBench] = useState(benches[0]?.name ?? "");
  const [query, setQuery] = useState("");

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
                onClick={() => setBench(item.name)}
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
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search the ${active?.name.toLowerCase() ?? "bench"}`}
            aria-label="Search recipes"
            className="relative w-full bg-transparent text-[0.95rem] text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </div>

        {active !== undefined && active.total > active.recipes.length ? (
          <p className="mb-5 text-[0.8rem] text-text-muted">
            Showing {active.recipes.length} of {active.total.toLocaleString("en-GB")} recipes at the{" "}
            {active.name.toLowerCase()}. Most of the remainder are variants of what is listed.
          </p>
        ) : null}

        {recipes.length === 0 ? (
          <p className="text-sm text-text-muted">
            Nothing at this bench matches <span className="text-text-primary">{query}</span>.
          </p>
        ) : (
          <ul>
            {recipes.map((recipe, index) => (
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
      </div>
    </div>
  );
}
