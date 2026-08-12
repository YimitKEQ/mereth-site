import type { Metadata } from "next";
import Link from "next/link";

import { CodexHeader } from "@/components/codex/CodexHeader";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { PlateFigure } from "@/components/ui/Plate";
import { loreDocuments, loreShelves } from "@/lib/world/lore";

export const metadata: Metadata = {
  title: "Lore",
  description:
    "The documents Mereth has published about its own setting: the orders, magic and faith, and who holds the province in 4E 185.",
};

/**
 * The library.
 *
 * These are in-world documents rather than a wiki, and they are reproduced in
 * full rather than summarised. A summary would be this site talking over
 * somebody's writing, and the writing is the point: a player reads the
 * Harbinger's letter to know how the Companions actually sound, not to be told
 * that they are in decline.
 *
 * Shelved rather than listed alphabetically. Eleven documents in one column is
 * a wall; three shelves of three or four is a place you can find something in.
 */
export default function LorePage() {
  const words = loreDocuments.reduce(
    (sum, document) => sum + document.paragraphs.join(" ").split(/\s+/).length,
    0,
  );

  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <CodexHeader
        title="Lore"
        lede={`What Mereth has written about its own province, in full and in the words it was written
          in. **None of it is a rule and none of it is a system:** it is the setting your character
          lives inside, and the reason a Dunmer in Windhelm meets the reception they do.`}
        facts={[
          { label: "Documents", value: String(loreDocuments.length) },
          { label: "Shelves", value: String(loreShelves.length) },
          { label: "Words", value: words.toLocaleString("en-GB") },
        ]}
      />

      <div className="mb-12 grid gap-5 md:grid-cols-3">
        <PlateFigure slug="the-lesson" />
        <PlateFigure slug="hold-moot" />
        <PlateFigure slug="the-legion" />
      </div>

      <div className="relative mb-12 max-w-3xl border border-brand-accent/40 bg-black/35 px-6 py-5">
        <FrameCorners size={14} />
        <p className="relative text-[0.95rem] leading-relaxed text-text-light">
          <strong className="font-semibold text-text-primary">
            Written by Mereth, not by the games.
          </strong>{" "}
          This is an alternate 4E 185. Where a document disagrees with something you remember from
          Skyrim, the document is what is true here.
        </p>
      </div>

      <div className="space-y-14">
        {loreShelves.map((shelf) => (
          <section key={shelf.id} id={shelf.id} className="scroll-mt-[140px]">
            <h2 className="font-display text-xl tracking-heading text-brand-accent uppercase">
              {shelf.title}
            </h2>
            <p className="mt-2 mb-6 max-w-[68ch] text-[0.95rem] leading-relaxed text-text-muted">
              {shelf.blurb}
            </p>

            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {shelf.documents.map((document) => (
                <li key={document.slug}>
                  <Link
                    href={`/lore/${document.slug}`}
                    className="group relative flex h-full flex-col border border-brand-accent/25 bg-black/30 p-6 transition-colors hover:border-brand-accent/60"
                  >
                    <FrameCorners weight="thin" size={16} />
                    <h3 className="font-display relative text-[1rem] leading-snug tracking-heading text-text-primary transition-colors group-hover:text-brand-accent">
                      {document.title}
                    </h3>
                    <p className="relative mt-2.5 flex-1 text-[0.88rem] leading-relaxed text-text-muted">
                      {document.note}
                    </p>
                    <span className="relative mt-4 text-[0.78rem] tabular-nums text-brand-accent/70">
                      {document.paragraphs.length} passages
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
