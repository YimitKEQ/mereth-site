import type { Metadata } from "next";
import Link from "next/link";

import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { loreDocument, loreDocuments, loreShelves } from "@/lib/world/lore";

/**
 * One document, whole.
 *
 * Deliberately plain: a measured column, generous leading, no cards, no
 * ornament between paragraphs. These pages are the only place on the site where
 * the job is reading rather than reference, and everything the rest of the site
 * does to help somebody scan gets in the way of that.
 *
 * The last paragraph of most of these documents is a signature, so it is set
 * apart rather than left to look like another sentence.
 */

export function generateStaticParams(): { slug: string }[] {
  return loreDocuments.map((document) => ({ slug: document.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const document = loreDocuments.find((entry) => entry.slug === slug);
  if (document === undefined) return { title: "Lore" };
  return { title: document.title, description: document.note };
}

/** The shelf a document sits on, for the line above the title. */
function shelfOf(slug: string): string {
  return loreShelves.find((shelf) => shelf.documents.some((d) => d.slug === slug))?.title ?? "Lore";
}

export default async function LoreDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const document = loreDocument(slug);

  const body = document.paragraphs;
  const last = body[body.length - 1] ?? "";
  /* A signature is short and has no full stop of its own. */
  const signed = body.length > 2 && last.length < 90 && !last.endsWith(".");
  const passages = signed ? body.slice(0, -1) : body;

  const order = loreDocuments.findIndex((entry) => entry.slug === slug);
  const next = loreDocuments[order + 1] ?? loreDocuments[0];

  return (
    <div className="mx-auto max-w-[52rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />

      <Link
        href="/lore"
        className="font-display text-[11px] tracking-[2.5px] text-brand-accent/70 uppercase transition-colors hover:text-brand-accent"
      >
        <span aria-hidden="true">&larr;</span> {shelfOf(slug)}
      </Link>

      <h1 className="font-display mt-4 text-2xl leading-tight tracking-title text-text-primary text-shadow-page-heading md:text-4xl">
        {document.title}
      </h1>

      <OrnateDivider className="my-10" />

      <article className="space-y-6">
        {passages.map((text, index) => (
          <p
            key={index}
            className={
              index === 0
                ? "text-[1.08rem] leading-[1.9] text-text-primary"
                : "text-[1.02rem] leading-[1.95] text-text-light"
            }
          >
            {text}
          </p>
        ))}

        {signed ? (
          <p className="font-display border-t border-brand-accent/20 pt-6 text-[0.95rem] tracking-heading text-brand-accent">
            {last}
          </p>
        ) : null}
      </article>

      <nav className="mt-16 border-t border-brand-accent/20 pt-8">
        <Link
          href={`/lore/${next?.slug ?? ""}`}
          className="group flex flex-col border border-brand-accent/25 px-6 py-5 transition-colors hover:border-brand-accent/60"
        >
          <span className="font-display text-[10px] tracking-[2px] text-text-muted uppercase">
            Read next
          </span>
          <span className="mt-1.5 text-[1rem] text-text-light transition-colors group-hover:text-brand-accent">
            {next?.title}
          </span>
        </Link>
      </nav>
    </div>
  );
}
