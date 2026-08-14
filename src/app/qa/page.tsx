import type { Metadata } from "next";
import Link from "next/link";

import { Chapters } from "@/components/handbook/Chapters";
import { QaList, type ResolvedAnswer } from "@/components/handbook/QaList";
import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { anchorFor } from "@/lib/anchor";
import { qaAnsweredOn, qaCount, qaSections } from "@/lib/handbook/qa";

export const metadata: Metadata = {
  title: "Latest Q&A",
  description:
    "Answers from the team on where Mereth is heading: enchanting, crafting tiers and materials, memory points, horses and fishing, Fear RP, starter kits and skill progression.",
};

/**
 * The community Q&A.
 *
 * Sits under The Realm rather than the Handbook, beside the roadmap and the
 * changelog, because it is the same kind of thing they are: a statement about
 * intent rather than about how the server works today. Questions covers the
 * second, and putting these beside it would blur a line this site is otherwise
 * careful about.
 *
 * Dated at the top for the same reason. The roadmap on the old site had thirteen
 * items still listed as planned that had already shipped, because nothing on the
 * page said when it was written.
 */
export default function QaPage() {
  const chapters = qaSections.map((section) => ({
    id: section.id,
    title: section.title,
    /* So a search hit on one question can find the chapter holding it. */
    anchors: section.items.map((item) => anchorFor(item.q)),
    content: (
      <>
        {section.blurb === undefined ? null : (
          <p className="mb-6 max-w-[68ch] text-[0.98rem] leading-[1.8] text-text-muted">
            {section.blurb}
          </p>
        )}
        <QaList items={section.items as ResolvedAnswer[]} />
      </>
    ),
  }));

  return (
    <div className="mx-auto max-w-[70rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />

      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          The Realm
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          Latest Q&amp;A
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
          {qaCount} answers from the team, given in {qaAnsweredOn}, on where the server is heading.
          Enchanting, the next crafting tiers, memory points, horses and fishing, Fear RP, starter
          kits and how the slower skills are meant to progress.
        </p>
      </header>

      <div className="relative mt-8 max-w-3xl border border-brand-accent/40 bg-black/35 px-6 py-5">
        <FrameCorners weight="thin" size={16} />
        <p className="relative text-[0.95rem] leading-relaxed text-text-light">
          <strong className="font-semibold text-text-primary">This is intent, not a promise.</strong>{" "}
          Answers here describe what we are planning and considering, and some of it will change.
          For what has actually shipped, read the{" "}
          <Link
            href="/changelog"
            className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 hover:decoration-brand-glow"
          >
            changelog
          </Link>
          . For how the server works today, read{" "}
          <Link
            href="/faq"
            className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 hover:decoration-brand-glow"
          >
            Questions
          </Link>
          .
        </p>
      </div>

      <OrnateDivider className="my-12" />

      <Chapters chapters={chapters} />

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display mb-4 text-xl tracking-heading text-brand-accent uppercase">
          A closing note from the team
        </h2>
        <div className="space-y-4 text-[0.98rem] leading-[1.8] text-text-light">
          <p>
            A lot of what you are seeing right now is still the foundation. The priority for launch
            was getting the major systems functional and stable. Now that players are actively using
            them, we can better see what progresses too quickly, what progresses too slowly, what
            needs better rewards, and what needs additional content.
          </p>
          <p>
            Expect continued balancing, new mods, additional professions, more equipment, more
            locations and improvements to existing systems as development continues.
          </p>
          <p>
            And as always, suggestions are welcome. If you have an idea that improves RP, fits the
            lore, and makes the server better without destroying progression or balance, post it. We
            do read them.
          </p>
        </div>
      </section>
    </div>
  );
}
