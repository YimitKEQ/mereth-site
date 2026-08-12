import type { ReactNode } from "react";

import { OrnateDivider } from "@/components/ornament/Divider";
import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { inline } from "@/lib/markup";

/**
 * The shared masthead for a codex page.
 *
 * Left aligned, matching the handbook, because a codex page is read rather than
 * landed on. The centred heading treatment belongs to the marketing surfaces.
 */
export function CodexHeader({
  title,
  lede,
  facts,
  children,
}: {
  title: string;
  lede: string;
  /** Small provenance line: what this page counted, and out of what. */
  facts?: { label: string; value: string }[];
  children?: ReactNode;
}) {
  return (
    <header>
      <ReadingScrim />
      <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
        The Codex
      </p>
      <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
        {title}
      </h1>
      <p className="mt-5 max-w-3xl text-[1.05rem] leading-[1.8] text-text-muted">{inline(lede)}</p>

      {facts !== undefined && facts.length > 0 ? (
        <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-display text-[10px] tracking-[2px] text-text-muted uppercase">
                {fact.label}
              </dt>
              <dd className="font-display mt-1 text-2xl tabular-nums text-brand-accent">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {children}
      <OrnateDivider className="my-11" />
    </header>
  );
}
