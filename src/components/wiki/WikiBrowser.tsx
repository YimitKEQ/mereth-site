"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { OrnateBox } from "@/components/ornament/OrnateBox";
import { SearchField } from "@/components/ui/Controls";
import { Book } from "@/components/ui/icons";
import { articleText, wikiArticles, wikiCategories } from "@/lib/wiki";
import { counts, referenceSets } from "@/lib/reference";

const ALL = "all";

/**
 * Browse and search in one view.
 *
 * Search runs over titles, summaries and body text rather than titles alone,
 * because the thing a new player types is usually a phrase from inside an
 * article ("realmlist", "key depletes") and not its heading.
 */
export function WikiBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return wikiArticles.filter((article) => {
      if (category !== ALL && article.category !== category) return false;
      if (needle === "") return true;
      return articleText(article).includes(needle);
    });
  }, [query, category]);

  const filters = [{ id: ALL, label: "All" }, ...wikiCategories.map((c) => ({ id: c.id, label: c.label }))];

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="flex flex-col gap-6">
        <SearchField
          label="Search the wiki"
          placeholder="Search the wiki…"
          value={query}
          onChange={setQuery}
        />
        <OrnateBox size="sm" contentClassName="p-4">
          <h2 className="font-display px-2 text-xs tracking-heading text-brand-accent">Categories</h2>
          <ul className="mt-3 flex flex-col gap-1">
            {filters.map((filter) => {
              const selected = filter.id === category;
              return (
                <li key={filter.id}>
                  <button
                    type="button"
                    onClick={() => setCategory(filter.id)}
                    aria-pressed={selected}
                    className={`w-full rounded-sm px-2 py-2 text-left text-sm transition-colors duration-[var(--duration-fast)] ${
                      selected
                        ? "bg-brand-accent/15 text-brand-accent"
                        : "text-text-muted hover:bg-white/5 hover:text-text-primary"
                    }`}
                  >
                    {filter.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </OrnateBox>
      </aside>

      <div>
        {/* Reference tables first: they are what a player returns for, where the
            written guides are what a new one reads once. */}
        <section className="mb-10">
          <h2 className="font-display text-sm tracking-heading text-brand-accent">
            Reference
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Parsed from the server&apos;s own manifest and plugins. {counts.spells} spells,{" "}
            {counts.ingredients} ingredients, {counts.mods} mods, {counts.plugins} plugins.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {referenceSets.map((set) => (
              <li key={set.slug}>
                <Link href={`/wiki/reference/${set.slug}`} className="group block h-full">
                  <OrnateBox
                    size="sm"
                    className="h-full transition-[filter] duration-[var(--duration-fast)] group-hover:brightness-125"
                    contentClassName="flex h-full items-baseline justify-between gap-3 p-4"
                  >
                    <span className="font-display text-sm tracking-heading text-brand-accent">
                      {set.title}
                    </span>
                    <span className="shrink-0 text-xs text-text-muted tabular-nums">
                      {set.rows.length.toLocaleString("en-GB")}
                    </span>
                  </OrnateBox>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/wiki/patch-notes" className="group block h-full">
                <OrnateBox
                  size="sm"
                  className="h-full transition-[filter] duration-[var(--duration-fast)] group-hover:brightness-125"
                  contentClassName="flex h-full items-baseline justify-between gap-3 p-4"
                >
                  <span className="font-display text-sm tracking-heading text-brand-accent">
                    Patch notes
                  </span>
                  <span className="shrink-0 text-xs text-text-muted tabular-nums">
                    {counts.releases}
                  </span>
                </OrnateBox>
              </Link>
            </li>
          </ul>
        </section>

        <h2 className="font-display mb-2 text-sm tracking-heading text-brand-accent">Guides</h2>
        <p className="mb-5 text-sm text-text-muted" aria-live="polite">
          {results.length} {results.length === 1 ? "article" : "articles"}
          {query.trim() ? ` matching “${query.trim()}”` : ""}
        </p>

        {results.length === 0 ? (
          <OrnateBox size="md" contentClassName="p-12 text-center">
            <p className="font-display text-lg tracking-heading text-brand-accent">Nothing found</p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-text-muted">
              Try a broader term, or clear the category filter. If something is genuinely missing,
              open a ticket and it will get written.
            </p>
          </OrnateBox>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {results.map((article) => (
              <li key={article.slug}>
                <Link href={`/wiki/${article.slug}`} className="group block h-full">
                  <OrnateBox
                    size="sm"
                    className="h-full transition-[filter] duration-[var(--duration-fast)] group-hover:brightness-125"
                    contentClassName="flex h-full flex-col p-6"
                  >
                    <span className="flex items-center gap-2 text-xs tracking-widest text-text-muted uppercase">
                      <Book className="text-brand-accent" />
                      {wikiCategories.find((c) => c.id === article.category)?.label}
                    </span>
                    <h3 className="font-display mt-3 text-lg tracking-heading text-brand-accent">
                      {article.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
                      {article.summary}
                    </p>
                    <span className="mt-5 text-xs text-text-muted">
                      {article.readMinutes} min read · updated {article.updated}
                    </span>
                  </OrnateBox>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
