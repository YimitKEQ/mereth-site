"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

import { ChevronDown } from "@/components/ui/icons";

/**
 * One chapter on screen at a time.
 *
 * The handbook pages were a single scroll. The guide ran to ten thousand
 * pixels: ten sections, every one of them fully expanded, tables and verbatim
 * client strings and release notes all the way down. Nothing on it was wrong
 * and almost nobody reached the bottom, because the page never signalled that
 * it would end.
 *
 * So the rail beside the text stopped being a set of jump links and became what
 * it already looked like: chapter navigation. One chapter shows, the rest wait.
 * The page is a screen or two instead of a wall, the reader can see how much is
 * left, and finishing a chapter is a thing that happens rather than a thing
 * that never arrives.
 *
 * Nothing is hidden from search. The site index is built from the same source
 * at build time and links straight to a chapter, and the browser's own find is
 * scoped to a chapter, which is where a reader wanted it anyway.
 *
 * The chapter lives in the URL hash, so a link to `/guide#controls` opens on
 * Controls and a shared link lands where the sender was.
 */

export interface Chapter {
  id: string;
  title: string;
  content: ReactNode;
}

export function Chapters({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(0);

  // Open on whatever the URL asked for, then keep the hash in step.
  useEffect(() => {
    const fromHash = (): void => {
      const id = window.location.hash.replace("#", "");
      if (id === "") return;
      const index = chapters.findIndex((chapter) => chapter.id === id);
      if (index >= 0) setActive(index);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [chapters]);

  const go = useCallback(
    (index: number, scroll: boolean) => {
      const chapter = chapters[index];
      if (chapter === undefined) return;
      setActive(index);

      /* replaceState rather than assigning the hash: assigning it makes the
         browser jump to the element, and the element is the thing that just
         changed underneath it. */
      window.history.replaceState(null, "", `#${chapter.id}`);
      if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [chapters],
  );

  const current = chapters[active];
  if (current === undefined) return null;

  const previous = chapters[active - 1];
  const next = chapters[active + 1];

  return (
    <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
      <nav aria-label="Chapters" className="lg:sticky lg:top-[140px] lg:self-start">
        <p className="font-display mb-4 text-[11px] tracking-[2px] text-text-muted uppercase">
          {chapters.length} chapters
        </p>

        {/* On a phone the rail would push the reading column a screen down, so
            it collapses to a single control that says where you are. */}
        <details className="lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between border border-brand-accent/30 bg-black/30 px-4 py-3 text-[0.9rem] text-brand-accent">
            <span>
              {active + 1}. {current.title}
            </span>
            <ChevronDown />
          </summary>
          <ul className="mt-2 border border-brand-accent/20 bg-black/40">
            {chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <button
                  type="button"
                  onClick={() => go(index, false)}
                  className={`block w-full cursor-pointer px-4 py-2.5 text-left text-[0.88rem] ${
                    index === active ? "text-brand-accent" : "text-text-muted"
                  }`}
                >
                  {index + 1}. {chapter.title}
                </button>
              </li>
            ))}
          </ul>
        </details>

        <ol className="hidden border-l border-brand-accent/20 lg:block">
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => go(index, true)}
                aria-current={index === active ? "true" : undefined}
                className={`-ml-px flex w-full cursor-pointer items-baseline gap-3 border-l-2 py-2 pl-4 text-left text-[0.85rem] leading-snug transition-colors ${
                  index === active
                    ? "border-brand-accent text-brand-accent"
                    : "border-transparent text-text-muted hover:border-brand-accent/40 hover:text-text-light"
                }`}
              >
                <span className="shrink-0 tabular-nums opacity-50">{index + 1}</span>
                <span>{chapter.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-w-0 max-w-[68ch]">
        <section id={current.id} className="scroll-mt-[140px]">
          <h2 className="font-display mb-6 text-xl tracking-heading text-brand-accent uppercase md:text-2xl">
            {current.title}
          </h2>
          {current.content}
        </section>

        {/* Where you are, and the way on. A reader who finishes a chapter should
            not have to go back up to the rail to find the next one. */}
        <nav
          aria-label="Chapter navigation"
          className="mt-16 flex items-stretch gap-4 border-t border-brand-accent/20 pt-8"
        >
          {previous === undefined ? (
            <span className="flex-1" />
          ) : (
            <button
              type="button"
              onClick={() => go(active - 1, true)}
              className="group flex flex-1 cursor-pointer flex-col items-start border border-brand-accent/25 px-5 py-4 text-left transition-colors hover:border-brand-accent/60"
            >
              <span className="font-display text-[10px] tracking-[2px] text-text-muted uppercase">
                Previous
              </span>
              <span className="mt-1 text-[0.92rem] text-text-light transition-colors group-hover:text-brand-accent">
                {previous.title}
              </span>
            </button>
          )}

          {next === undefined ? (
            <span className="flex-1" />
          ) : (
            <button
              type="button"
              onClick={() => go(active + 1, true)}
              className="group flex flex-1 cursor-pointer flex-col items-end border border-brand-accent/25 px-5 py-4 text-right transition-colors hover:border-brand-accent/60"
            >
              <span className="font-display text-[10px] tracking-[2px] text-text-muted uppercase">
                Next
              </span>
              <span className="mt-1 text-[0.92rem] text-text-light transition-colors group-hover:text-brand-accent">
                {next.title}
              </span>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
