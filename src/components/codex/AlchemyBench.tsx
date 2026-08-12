"use client";

import { useMemo, useState } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { Search, X } from "@/components/ui/icons";
import type { Ingredient } from "@/lib/mereth";

/**
 * The mortar: pick ingredients, see what they would actually brew.
 *
 * Alchemy's one rule is that an effect only appears in the potion when at least
 * two ingredients share it. Everything else about the system is arithmetic a
 * player should not be doing on paper, which is why the wiki answer to "what
 * goes with a blue mountain flower" is a list and the useful answer is a bench.
 *
 * Selecting nothing shows what pairs with a highlighted ingredient; selecting
 * two or three shows the effects they have in common.
 */
export function AlchemyBench({ ingredients }: { ingredients: Ingredient[] }) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  const byName = useMemo(() => new Map(ingredients.map((i) => [i.name, i])), [ingredients]);

  const listed = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed === "") return ingredients.slice(0, 60);
    return ingredients
      .filter(
        (item) =>
          item.name.toLowerCase().includes(trimmed) ||
          item.effects.some((effect) => effect.toLowerCase().includes(trimmed)),
      )
      .slice(0, 60);
  }, [ingredients, query]);

  const toggle = (name: string): void =>
    setPicked((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : // Three is the cap at a real alchemy table, so the bench holds three.
          current.length >= 3
          ? [...current.slice(1), name]
          : [...current, name],
    );

  /** Effects carried by at least two of the picked ingredients. */
  const brewed = useMemo(() => {
    if (picked.length < 2) return [];
    const tally = new Map<string, number>();
    for (const name of picked) {
      for (const effect of byName.get(name)?.effects ?? []) {
        tally.set(effect, (tally.get(effect) ?? 0) + 1);
      }
    }
    return [...tally.entries()]
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([effect, count]) => ({ effect, count }));
  }, [picked, byName]);

  /** With exactly one picked, suggest what would complete a potion. */
  const suggestions = useMemo(() => {
    if (picked.length !== 1) return [];
    const first = byName.get(picked[0] ?? "");
    if (first === undefined) return [];
    const wanted = new Set(first.effects);
    return ingredients
      .filter((item) => item.name !== first.name)
      .map((item) => ({ name: item.name, shared: item.effects.filter((e) => wanted.has(e)) }))
      .filter((match) => match.shared.length > 0)
      .sort((a, b) => b.shared.length - a.shared.length || a.name.localeCompare(b.name))
      .slice(0, 14);
  }, [picked, byName, ingredients]);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
      <div className="min-w-0">
        <div className="relative mb-6 flex max-w-md items-center gap-3 border border-brand-accent/40 bg-black/35 px-4 py-3">
          <FrameCorners weight="thin" size={14} />
          <Search className="relative shrink-0 text-brand-accent" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ingredients, or an effect"
            aria-label="Search ingredients"
            className="relative w-full bg-transparent text-[0.95rem] text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </div>

        <ul className="space-y-1">
          {listed.map((item) => {
            const on = picked.includes(item.name);
            return (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => toggle(item.name)}
                  aria-pressed={on}
                  className={`flex w-full cursor-pointer flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border-subtle px-2 py-2.5 text-left transition-colors ${
                    on ? "bg-brand-accent/12" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <span className="text-[0.95rem] text-text-primary">{item.name}</span>
                  <span className="text-[0.82rem] text-text-muted">{item.effects.join(", ")}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {query.trim() === "" ? (
          <p className="mt-5 text-[0.8rem] text-text-muted">
            Showing the first 60 of {ingredients.length}. Search to reach the rest.
          </p>
        ) : null}
      </div>

      <aside className="lg:sticky lg:top-[140px] lg:self-start">
        <div className="relative border border-brand-accent/45 bg-black/45 p-6 backdrop-blur-[var(--blur-panel)]">
          <FrameCorners weight="thin" size={18} />

          <div className="relative">
            <p className="font-display text-[11px] tracking-[2px] text-text-muted uppercase">
              The mortar
            </p>

            {picked.length === 0 ? (
              <p className="mt-4 text-[0.85rem] leading-relaxed text-text-muted">
                Pick an ingredient and this will show everything that pairs with it. Pick two or
                three and it shows what they actually brew.
              </p>
            ) : (
              <ul className="mt-4 space-y-1.5">
                {picked.map((name) => (
                  <li key={name} className="flex items-center justify-between gap-3">
                    <span className="min-w-0 flex-1 truncate text-[0.9rem] text-text-primary">
                      {name}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggle(name)}
                      aria-label={`Remove ${name}`}
                      className="shrink-0 cursor-pointer text-text-muted transition-colors hover:text-brand-accent"
                    >
                      <X className="text-sm" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {picked.length >= 2 ? (
              <div className="mt-6 border-t border-border-subtle pt-5">
                <p className="font-display mb-3 text-[11px] tracking-[2px] text-brand-accent uppercase">
                  {brewed.length === 0 ? "Nothing in common" : "Would brew"}
                </p>
                {brewed.length === 0 ? (
                  <p className="text-[0.85rem] leading-relaxed text-text-muted">
                    No effect is shared by two of these, so they make nothing. An effect needs to
                    appear on at least two ingredients.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {brewed.map((row) => (
                      <li key={row.effect} className="flex items-baseline justify-between gap-3">
                        <span className="text-[0.9rem] text-text-primary">{row.effect}</span>
                        <span className="shrink-0 text-[0.75rem] tabular-nums text-text-muted">
                          on {row.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}

            {suggestions.length > 0 ? (
              <div className="mt-6 border-t border-border-subtle pt-5">
                <p className="font-display mb-3 text-[11px] tracking-[2px] text-brand-accent uppercase">
                  Pairs with
                </p>
                <ul className="space-y-1.5">
                  {suggestions.map((match) => (
                    <li key={match.name}>
                      <button
                        type="button"
                        onClick={() => toggle(match.name)}
                        className="flex w-full cursor-pointer items-baseline justify-between gap-3 text-left"
                      >
                        <span className="min-w-0 flex-1 truncate text-[0.85rem] text-text-light transition-colors hover:text-brand-accent">
                          {match.name}
                        </span>
                        <span className="shrink-0 text-[0.75rem] text-text-muted">
                          {match.shared.join(", ")}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {picked.length > 0 ? (
              <button
                type="button"
                onClick={() => setPicked([])}
                className="mt-6 w-full cursor-pointer border border-border-subtle py-2 font-display text-[11px] tracking-[1.5px] text-text-muted uppercase transition-colors hover:border-brand-accent/50 hover:text-text-primary"
              >
                Empty the mortar
              </button>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}
