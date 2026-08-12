import type { ReactNode } from "react";

import { Blocks } from "@/components/handbook/Blocks";
import { Contents } from "@/components/handbook/Contents";
import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { inline } from "@/lib/markup";
import type { HandbookPage } from "@/lib/handbook/blocks";

/**
 * The shared long-form layout: a title, a lede, a sticky table of contents and
 * a single measured column of sections.
 *
 * One column, roughly 68 characters wide. The chrome elsewhere on this site is
 * wide and symmetrical; a reading page is neither, and forcing prose into the
 * full 1560px container is the fastest way to make something nobody finishes.
 */
export function Reader({
  page,
  eyebrow,
  children,
}: {
  page: HandbookPage;
  /** Small label above the title, naming which part of the site this is. */
  eyebrow: string;
  /** Rendered after the sections, inside the reading column. */
  children?: ReactNode;
}) {
  const contents = page.sections.map((section) => ({ id: section.id, title: section.title }));

  return (
    // Narrower than the site container on purpose. A reading page is a column
    // with a rail beside it, and letting it inherit the 1560px shell leaves the
    // whole right half of the screen empty, which reads as a broken layout
    // rather than as generous margin.
    <div className="mx-auto max-w-[70rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />
      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          {page.title}
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">{inline(page.lede)}</p>
      </header>

      <OrnateDivider className="my-12" />

      <div className="grid gap-14 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <Contents items={contents} />

        <div className="min-w-0 max-w-[68ch]">
          {page.sections.map((section) => (
            <section key={section.id} className="mb-16 scroll-mt-[140px]" id={section.id}>
              <h2 className="font-display mb-6 text-xl tracking-heading text-brand-accent uppercase md:text-2xl">
                {section.title}
              </h2>
              <Blocks blocks={section.blocks} />
            </section>
          ))}
          {children}
        </div>
      </div>
    </div>
  );
}
