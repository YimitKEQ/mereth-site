"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { OrnateBox } from "@/components/ornament/OrnateBox";
import { Search, X } from "@/components/ui/icons";
import type { EntryKind, SearchEntry } from "@/lib/search-index";

/**
 * One box that searches everything: pages, skills, answers, spells,
 * ingredients, recipes.
 *
 * The index is fetched once on first open rather than shipped with the page,
 * because it is ~400 KB of data serving a feature many visits never use. Until
 * it lands the input still accepts typing, so the palette never feels stalled.
 *
 * Ranking is deliberately simple and predictable: a prefix match beats a word
 * boundary match beats a substring, and pages beat data at equal score so
 * typing "skills" offers the page before it offers a skill. A fuzzy matcher
 * would rank better on paper and worse in the hand, because the reader cannot
 * predict it.
 */

const KIND_LABEL: Record<EntryKind, string> = {
  page: "Page",
  skill: "Skill",
  answer: "Answer",
  section: "Section",
  spell: "Spell",
  ingredient: "Ingredient",
  recipe: "Recipe",
  profession: "Profession",
  rule: "Rule",
  place: "Hold",
  faction: "Faction",
};

/** Ties break toward the thing a reader more likely meant. */
const KIND_WEIGHT: Record<EntryKind, number> = {
  page: 6,
  section: 5,
  answer: 4,
  skill: 4,
  place: 4,
  faction: 4,
  rule: 3,
  profession: 3,
  recipe: 2,
  ingredient: 2,
  spell: 2,
};

const MAX_RESULTS = 40;

function score(entry: SearchEntry, query: string): number {
  const label = entry.label.toLowerCase();
  if (label === query) return 1000;
  if (label.startsWith(query)) return 600 - label.length;
  // A match at the start of any word: "iron ore" for the query "ore".
  if (new RegExp(`\\b${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(label)) {
    return 400 - label.length;
  }
  if (label.includes(query)) return 200 - label.length;
  const haystack = `${entry.sub ?? ""} ${entry.terms ?? ""}`.toLowerCase();
  if (haystack.includes(query)) return 80;
  return -1;
}

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Fetched once per page load, on first open. A failure is reported rather
  // than retried in a loop: the palette is an accelerator, not the only route.
  useEffect(() => {
    if (!open || entries !== null || failed) return;
    let cancelled = false;
    fetch("/api/search")
      .then((response) => {
        if (!response.ok) throw new Error(`search index responded ${response.status}`);
        return response.json();
      })
      .then((data: SearchEntry[]) => {
        if (!cancelled) setEntries(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, entries, failed]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (entries === null) return [];
    if (trimmed === "") return entries.filter((entry) => entry.kind === "page");

    return entries
      .map((entry) => ({ entry, points: score(entry, trimmed) }))
      .filter((row) => row.points >= 0)
      .sort((a, b) =>
        b.points - a.points ||
        KIND_WEIGHT[b.entry.kind] - KIND_WEIGHT[a.entry.kind] ||
        a.entry.label.localeCompare(b.entry.label),
      )
      .slice(0, MAX_RESULTS)
      .map((row) => row.entry);
  }, [entries, query]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  const go = useCallback(
    (entry: SearchEntry | undefined) => {
      if (entry === undefined) return;
      onClose();
      setQuery("");
      router.push(entry.href);
    },
    [onClose, router],
  );

  const onKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "ArrowDown" || (event.key === "n" && event.ctrlKey)) {
      event.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
      return;
    }
    if (event.key === "ArrowUp" || (event.key === "p" && event.ctrlKey)) {
      event.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      go(results[cursor]);
    }
  };

  // Keep the highlighted row in view when the cursor is driven by the keyboard.
  useEffect(() => {
    const list = listRef.current;
    if (list === null) return;
    const row = list.children[cursor];
    if (row instanceof HTMLElement) row.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-[var(--blur-modal)]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search Mereth"
        className="relative w-full max-w-2xl"
      >
        <OrnateBox size="md" fill="var(--color-bg-overlay)" contentClassName="p-1">
          <div className="flex items-center gap-3 border-b border-brand-accent/20 px-5 py-4">
            <Search className="shrink-0 text-lg text-brand-accent" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search skills, spells, answers, recipes..."
              aria-label="Search"
              className="w-full bg-transparent text-base text-text-primary outline-none placeholder:text-text-placeholder"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 cursor-pointer text-text-muted transition-colors hover:text-brand-accent"
            >
              <X />
            </button>
          </div>

          <div className="max-h-[52vh] overflow-y-auto overscroll-contain">
            {failed ? (
              <p className="px-5 py-8 text-center text-sm text-text-muted">
                The index could not be loaded. Everything is still reachable from the menu.
              </p>
            ) : entries === null ? (
              <p className="px-5 py-8 text-center text-sm text-text-muted">Reading the codex...</p>
            ) : results.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-text-muted">
                Nothing matches <span className="text-text-primary">{query}</span>.
              </p>
            ) : (
              <ul ref={listRef}>
                {results.map((entry, index) => (
                  /*
                   * Keyed by position, not by content. Two different records
                   * can genuinely share a label, a kind and an href, and a
                   * duplicate key makes React reuse rows instead of replacing
                   * them: the list grows past its own cap and shows results
                   * from the previous query. Position is the right identity for
                   * a list that is fully recomputed on every keystroke.
                   */
                  <li key={index}>
                    <button
                      type="button"
                      onMouseEnter={() => setCursor(index)}
                      onClick={() => go(entry)}
                      className={`flex w-full cursor-pointer items-center gap-4 px-5 py-2.5 text-left transition-colors ${
                        index === cursor ? "bg-brand-accent/12" : ""
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-text-primary">{entry.label}</span>
                        {entry.sub !== undefined ? (
                          <span className="block truncate text-xs text-text-muted">{entry.sub}</span>
                        ) : null}
                      </span>
                      <span className="shrink-0 font-display text-[10px] tracking-[1.5px] text-brand-accent/70 uppercase">
                        {KIND_LABEL[entry.kind]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-brand-accent/20 px-5 py-2.5 text-[11px] text-text-muted">
            <span>
              <kbd className="text-text-light">up</kbd> <kbd className="text-text-light">down</kbd> to
              move, <kbd className="text-text-light">enter</kbd> to open
            </span>
            <span>{entries === null ? "" : `${entries.length.toLocaleString("en-GB")} entries`}</span>
          </div>
        </OrnateBox>
      </div>
    </div>
  );
}
