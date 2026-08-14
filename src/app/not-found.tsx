import type { Metadata } from "next";
import Link from "next/link";

import { OrnateDivider } from "@/components/ornament/Divider";
import { ButtonLink } from "@/components/ui/Button";
import { PlateImage } from "@/components/ui/Plate";

export const metadata: Metadata = {
  title: "Off the map",
  description: "That page is not part of the province.",
  /* A static host serves this file for a mistyped address, and on some hosts it
     answers 200 rather than 404. A 404 page indexed as a real page is a soft
     404, so it says so itself rather than relying on the status code. */
  robots: { index: false, follow: true },
};

/**
 * The page you get for an address that does not exist.
 *
 * There was no custom one, so a mistyped URL dropped the reader onto Next's
 * stock black and white "404: This page could not be found" in the middle of an
 * otherwise carefully dressed site. It reads like the site broke rather than
 * like the link was wrong.
 *
 * Written in the register of the rest of the site rather than as a joke: dry,
 * in world, and then immediately useful. Somebody who lands here mistyped
 * something or followed a stale link, and what they want next is the way back,
 * not a punchline.
 *
 * Under a static export this becomes `out/404.html`, which GitHub Pages serves
 * for any unmatched path without any configuration.
 */

const WAYS_BACK = [
  { href: "/start", label: "Start here", note: "Six steps from hearing about Mereth to standing in it." },
  { href: "/faq", label: "Questions", note: "Sixty two answers, including every reason the game refuses to connect." },
  { href: "/lore", label: "Lore", note: "The province in its own documents." },
  { href: "/holds", label: "The Nine Holds", note: "The seats, and who sits them." },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[64rem] px-6 pt-20 pb-24 md:px-8 md:pt-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start lg:gap-16">
        <div>
          <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
            Off the map
          </p>
          <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
            There is nothing here
          </h1>
          <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
            No page answers to that address. Either it was mistyped, or it was something we moved:
            the site is rebuilt most weeks and old links do go stale. Nothing has gone wrong with
            your game or your account.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/" variant="solid" size="md">
              Back to the start
            </ButtonLink>
            <ButtonLink href="/faq" size="md">
              Ask a question
            </ButtonLink>
          </div>

          <OrnateDivider className="my-10" />

          <p className="font-display mb-5 text-[11px] tracking-[2px] text-text-muted uppercase">
            Or pick up the road again
          </p>
          <ul className="space-y-4">
            {WAYS_BACK.map((way) => (
              <li key={way.href}>
                <Link href={way.href} className="group flex flex-col">
                  <span className="font-display text-[0.95rem] tracking-heading text-brand-accent transition-colors group-hover:text-brand-glow">
                    {way.label}
                  </span>
                  <span className="mt-0.5 text-[0.88rem] leading-relaxed text-text-muted">
                    {way.note}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-[0.85rem] leading-relaxed text-text-muted">
            Press <kbd className="text-text-light">Ctrl</kbd> and{" "}
            <kbd className="text-text-light">K</kbd> to search everything at once, which is usually
            faster than guessing where a page went.
          </p>
        </div>

        {/* A traveller looking at a ruin, which is roughly the situation. */}
        <PlateImage
          slug="the-arch"
          scale="lg"
          aspect="aspect-[4/3]"
          sizes="(max-width: 1024px) 100vw, 38vw"
          className="hidden lg:block"
        />
      </div>
    </div>
  );
}
