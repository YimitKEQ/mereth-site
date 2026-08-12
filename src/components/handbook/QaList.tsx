"use client";

import { useEffect, useState } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ChevronDown } from "@/components/ui/icons";
import { inline } from "@/lib/markup";

/**
 * The question list.
 *
 * Answers are stated plainly, because they are ours. What is kept is the
 * evidence underneath: the exact string the client prints, so a player can
 * match an error on screen to an answer, and the dated release note behind
 * anything that changed.
 *
 * A question with no decided answer is marked rather than filled in. Rows open
 * independently, several at a time, and a row whose anchor is in the URL opens
 * itself so a deep link lands on an answer rather than on a heading.
 */

export interface ResolvedAnswer {
  q: string;
  a: string;
  /** True when there is genuinely no decided answer yet. */
  open?: boolean;
  quote?: string;
  /** Citations resolved on the server, because the patterns cannot cross over. */
  notes?: { version: string; date: string | null; text: string }[];
}

/** A stable anchor per question, so a single answer can be linked to. */
export function anchorFor(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function Row({ item, startOpen }: { item: ResolvedAnswer; startOpen: boolean }) {
  const [open, setOpen] = useState(startOpen);
  const id = anchorFor(item.q);

  // A deep link should land on the answer, not on a collapsed heading.
  useEffect(() => {
    if (window.location.hash === `#${id}`) setOpen(true);
  }, [id]);

  return (
    <div id={id} className="scroll-mt-[140px]">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="relative flex w-full cursor-pointer items-start justify-between gap-5 border border-brand-accent/45 bg-black/35 px-5 py-4 text-left transition-colors duration-[var(--duration-fast)] hover:border-brand-accent/70 hover:bg-black/50 md:px-6"
        >
          <FrameCorners weight="thin" size={16} />
          <span className="relative flex-1 text-[0.98rem] leading-snug text-text-primary md:text-[1.05rem]">
            {item.q}
          </span>
          {item.open === true ? (
            <span className="relative hidden shrink-0 border border-[#a8503c]/55 px-2.5 py-1 font-display text-[10px] tracking-[1.4px] text-[#d08a76] uppercase sm:block">
              Not decided yet
            </span>
          ) : null}
          <ChevronDown
            className={`relative mt-1 shrink-0 text-brand-accent transition-transform duration-[var(--duration-fast)] ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>

      {open ? (
        <div className="relative mt-px border border-brand-accent/30 border-t-0 bg-black/25 px-5 py-5 md:px-6">
          {item.open === true ? (
            <span className="mb-3 inline-block border border-[#a8503c]/55 px-2.5 py-1 font-display text-[10px] tracking-[1.4px] text-[#d08a76] uppercase sm:hidden">
              Not decided yet
            </span>
          ) : null}
          <p className="text-[0.98rem] leading-[1.8] text-text-light">{inline(item.a)}</p>

          {item.quote !== undefined ? (
            <figure className="mt-5 border-l-2 border-brand-accent/50 bg-black/30 py-2.5 pr-4 pl-4">
              <blockquote className="font-mono text-[0.8rem] leading-relaxed text-text-light">
                {item.quote}
              </blockquote>
              <figcaption className="mt-1 text-[11px] text-text-muted">
                the client, verbatim
              </figcaption>
            </figure>
          ) : null}

          {item.notes !== undefined && item.notes.length > 0 ? (
            <ul className="mt-5 space-y-2 border-l border-brand-accent/20 pl-4">
              {item.notes.map((note, i) => (
                <li key={i} className="text-[0.82rem] leading-relaxed text-text-muted">
                  {note.text}
                  <span className="mt-0.5 block font-mono text-[11px] text-brand-accent/70">
                    {note.version}
                    {note.date === null ? "" : ` · ${note.date}`}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function QaList({ items, openFirst = false }: { items: ResolvedAnswer[]; openFirst?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <Row key={item.q} item={item} startOpen={openFirst && index === 0} />
      ))}
    </div>
  );
}
