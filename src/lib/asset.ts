/**
 * Prefix a path in `public/` with the base path the site is served from.
 *
 * `next/image` and `next/link` apply `basePath` themselves. Nothing else does:
 * a plain `<video src>`, a `poster`, a metadata icon and a `fetch` are all just
 * strings as far as Next is concerned, and on a GitHub project page served from
 * `/mereth-site/` every one of them 404s one directory up.
 *
 * Empty in development and on any root-served deploy, so this is a no-op there
 * and the same code runs in both places.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE}${path}`;
}

/**
 * Where the site lives, absolute, for the metadata that cannot be relative:
 * the Open Graph image and the canonical URL.
 *
 * This is the canonical home, not whichever host built the page. The GitHub
 * Pages copy is a mirror and should point a share card at the real site, so it
 * deliberately does not override this.
 *
 * It defaulted to the Pages host once, and that broke every Discord embed the
 * day the site moved: `metadataBase` resolved the banner to a host where the
 * base path is `/mereth-site`, so the share card asked for
 * `yimitkeq.github.io/brand/banner.png`, got a 404, and Discord rendered the
 * link with no image. A share card is the one thing nobody tests by visiting.
 */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://merethroleplay.com";

/**
 * The share card, in one place.
 *
 * Next does not merge `openGraph` field by field: a page that declares its own
 * block replaces the root's entirely, so naming a title there silently drops
 * the image. That is exactly what happened to the twelve lore documents, which
 * are the most shared pages on the site. Any page that sets `openGraph` must
 * spread this in, and having one constant means there is nothing to keep in
 * sync when the card changes.
 *
 * Not the banner. That is 2800x722 and 3.6 MB, so it arrived as a thin strip
 * inside a 1.91:1 box after a wait long enough that people stopped seeing it at
 * all. `scripts/build-og-card.mjs` crops it to the ratio unfurlers actually use
 * and encodes it as JPEG, which is 137 KB for the same painting.
 */
export const OG_IMAGE = {
  url: `${SITE_ORIGIN}/brand/og-card.jpg`,
  width: 1200,
  height: 630,
} as const;
