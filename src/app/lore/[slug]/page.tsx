import type { Metadata } from "next";
import Link from "next/link";

import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { OG_IMAGE } from "@/lib/asset";
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

  /*
   * `openGraph.title` is set explicitly rather than left to inherit. A page
   * that sets only `title` does not populate the Open Graph title when the root
   * layout already defines an `openGraph` block, so every one of these pasted
   * into Discord previewed as plain "Mereth Roleplay". These are the most
   * shareable pages on the site. The root's template adds the suffix, so this
   * passes the bare title: adding one here produced it twice.
   */
  return {
    title: document.title,
    description: document.note,
    /* `images` has to be repeated here. Next replaces the root's `openGraph`
       block rather than merging into it, so declaring a title without this
       dropped the banner from every one of these cards. */
    openGraph: { title: document.title, description: document.note, images: [OG_IMAGE] },
  };
}

/** The shelf a document sits on, for the line above the title. */
function shelfOf(slug: string): string {
  return loreShelves.find((shelf) => shelf.documents.some((d) => d.slug === slug))?.title ?? "Lore";
}

/** The same shelf's anchor, so the back link returns to where the reader was. */
function shelfIdOf(slug: string): string {
  return loreShelves.find((shelf) => shelf.documents.some((d) => d.slug === slug))?.id ?? "";
}

export default async function LoreDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const document = loreDocument(slug);

  /*
   * A signature is a run of short lines with no full stop, at the end of the
   * document, and it is usually more than one: a name on one line and a title
   * on the next. Lifting only the last line drew the rule through the middle of
   * the sign-off and left "Lurius Floria" sitting in the body as if it were a
   * sentence.
   */
  const body = document.paragraphs;
  const isSignatureLine = (text: string): boolean => text.length < 90 && !text.endsWith(".");

  let signatureFrom = body.length;
  while (signatureFrom > 1 && isSignatureLine(body[signatureFrom - 1] ?? "")) signatureFrom -= 1;

  /* Only treat it as a signature if the document has real body left over. */
  const signed = signatureFrom > 1 && signatureFrom < body.length;
  const passages = signed ? body.slice(0, signatureFrom) : body;
  const signature = signed ? body.slice(signatureFrom) : [];

  const order = loreDocuments.findIndex((entry) => entry.slug === slug);
  const next = loreDocuments[order + 1] ?? loreDocuments[0];

  return (
    <div className="mx-auto max-w-[52rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />

      <Link
        href={`/lore#${shelfIdOf(slug)}`}
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

        {signature.length === 0 ? null : (
          <div className="border-t border-brand-accent/20 pt-6">
            {signature.map((line, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? "font-display text-[0.95rem] tracking-heading text-brand-accent"
                    : "font-display mt-1 text-[0.85rem] tracking-heading text-text-muted"
                }
              >
                {line}
              </p>
            ))}
          </div>
        )}
      </article>

      <nav className="mt-16 grid gap-4 border-t border-brand-accent/20 pt-8 sm:grid-cols-2">
        {/* Lore that leads nowhere is a dead end. Each document points at the
            page where the thing it describes is a system you can use. */}
        {document.related === undefined ? null : (
          <Link
            href={document.related.href}
            className="group flex flex-col border border-brand-accent/25 px-6 py-5 transition-colors hover:border-brand-accent/60"
          >
            <span className="font-display text-[10px] tracking-[2px] text-text-muted uppercase">
              In play
            </span>
            <span className="mt-1.5 text-[1rem] text-text-light transition-colors group-hover:text-brand-accent">
              {document.related.label}
            </span>
          </Link>
        )}

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
