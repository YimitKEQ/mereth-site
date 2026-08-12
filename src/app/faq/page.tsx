import type { Metadata } from "next";

import { Contents } from "@/components/handbook/Contents";
import { QaList, type ResolvedAnswer } from "@/components/handbook/QaList";
import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { faqCount, faqSections } from "@/lib/handbook/faq";
import { citations } from "@/lib/mereth";

export const metadata: Metadata = {
  title: "Questions",
  description:
    "Answers about playing on Mereth: skills and memory points, magic, fighting, holds and jarls, and every reason the game refuses to connect.",
};

export default function FaqPage() {
  // Citation patterns are resolved here, on the server. A RegExp cannot cross
  // into a client component, and matching them once at build beats matching
  // them in every reader's browser.
  const sections = faqSections.map((section) => ({
    id: section.id,
    title: section.title,
    blurb: section.blurb,
    items: section.items.map(
      (item): ResolvedAnswer => ({
        q: item.q,
        a: item.a,
        open: item.open,
        quote: item.quote,
        notes: item.cite === undefined ? undefined : citations(item.cite, 2),
      }),
    ),
  }));

  const contents = sections.map((section) => ({ id: section.id, title: section.title }));

  return (
    <div className="mx-auto max-w-[70rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />
      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          The Handbook
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          Questions
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
          {faqCount} answers about playing on Mereth: what the skill system actually does, why your
          sword might be doing nothing, how magic is taught, what a Jarl whitelist asks for, and
          every reason the game refuses to connect. Where an answer depends on something that
          changed, the release note that changed it is shown underneath.
        </p>
      </header>

      <div className="relative mt-8 max-w-3xl border border-brand-accent/40 bg-black/35 px-6 py-5">
        <FrameCorners weight="thin" size={16} />
        <p className="relative text-[0.95rem] leading-relaxed text-text-light">
          <strong className="font-semibold text-text-primary">Cannot find it here?</strong> Open a
          ticket in Discord, or speak to a Court Wizard in game if the question is about magic. The
          rulebook covers conduct; this page covers how things work.
        </p>
      </div>

      <OrnateDivider className="my-12" />

      <div className="grid gap-14 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <Contents items={contents} />

        <div className="min-w-0 max-w-3xl">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-14 scroll-mt-[140px]">
              <h2 className="font-display mb-3 text-xl tracking-heading text-brand-accent uppercase md:text-2xl">
                {section.title}
              </h2>
              {section.blurb !== undefined ? (
                <p className="mb-6 max-w-[68ch] text-[0.98rem] leading-[1.8] text-text-muted">
                  {section.blurb}
                </p>
              ) : null}
              <QaList items={section.items} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
