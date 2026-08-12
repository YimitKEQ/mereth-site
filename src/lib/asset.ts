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
 * Where the built site is served from, absolute.
 *
 * Only used for metadata that must be absolute: the Open Graph image, the
 * canonical URL. Set `NEXT_PUBLIC_SITE_ORIGIN` in the deploy to move the site
 * to a custom domain without touching code.
 */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://yimitkeq.github.io";
