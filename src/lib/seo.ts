/**
 * The route registry, and the metadata every page is built from.
 *
 * One list, read by four things that must never disagree: the sitemap, the
 * canonical link on each page, `llms.txt`, and the crawl budget hints. Keeping
 * them in separate files is how a site ends up with a sitemap advertising a
 * page that carries a canonical pointing somewhere else, which is a signal
 * Google resolves by ignoring both.
 *
 * Adding a route means adding a line here. Nothing else has to be touched.
 */

import { OG_IMAGE, SITE_ORIGIN } from "@/lib/asset";
import type { Metadata } from "next";

/**
 * Whether this build is the GitHub Pages mirror rather than the real site.
 *
 * The mirror serves the whole site a second time under a different host, which
 * is a textbook duplicate: forty pages of identical content with nothing saying
 * which one is the original. Canonicals below always point at the domain, and
 * the mirror additionally asks not to be indexed at all, because a canonical is
 * a hint and `noindex` is not.
 */
export const IS_MIRROR = (process.env.NEXT_PUBLIC_BASE_PATH ?? "") !== "";

export interface RouteEntry {
  path: string;
  /** Sitemap priority. Relative within the site; absolute value means nothing. */
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  /** One line, for `llms.txt`. What a reader would find there, not a slogan. */
  summary: string;
}

/**
 * Priorities reflect what a stranger actually needs, in order: how to join,
 * how the systems work, then reference, then the legal pages nobody links.
 */
export const ROUTES: readonly RouteEntry[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily", summary: "What Mereth is, live player and Discord counts, and the download." },
  { path: "/start", priority: 0.9, changeFrequency: "weekly", summary: "Joining from scratch: Discord login, the launcher, first character." },
  { path: "/guide", priority: 0.9, changeFrequency: "weekly", summary: "How the server works end to end, in chapters." },
  { path: "/rules", priority: 0.9, changeFrequency: "weekly", summary: "The rulebook, with the severe rules flagged as severe." },
  { path: "/faq", priority: 0.85, changeFrequency: "weekly", summary: "Answers on skills, magic, combat, holds, and every connection failure." },
  { path: "/qa", priority: 0.8, changeFrequency: "weekly", summary: "The latest community Q&A on where the server is heading." },

  { path: "/skills", priority: 0.85, changeFrequency: "weekly", summary: "The skill system: 18 memory points across 51 skills, with a planner and the in-game menu." },
  { path: "/progression", priority: 0.8, changeFrequency: "weekly", summary: "What each tier is actually worth, and what a point buys." },
  { path: "/magic", priority: 0.8, changeFrequency: "weekly", summary: "How magic is taught and gated: a master, a spellbook, a week per tier." },
  { path: "/survival", priority: 0.75, changeFrequency: "weekly", summary: "The three bars that tick down while you play, and how exhaustion works." },
  { path: "/crafting", priority: 0.75, changeFrequency: "weekly", summary: "Every recipe, bench by bench, with spawnable item ids." },
  { path: "/tips", priority: 0.7, changeFrequency: "weekly", summary: "The numbers, the cooldowns and the traps." },

  { path: "/world", priority: 0.8, changeFrequency: "weekly", summary: "Skyrim in 4E 185, ten years after the White-Gold Concordat." },
  { path: "/holds", priority: 0.8, changeFrequency: "weekly", summary: "The nine holds and who holds each seat." },
  { path: "/factions", priority: 0.75, changeFrequency: "weekly", summary: "The Companions, the College of Winterhold and the Thieves' Guild." },
  { path: "/lore", priority: 0.75, changeFrequency: "monthly", summary: "The in-world library: eleven documents written for the setting." },

  { path: "/changelog", priority: 0.7, changeFrequency: "daily", summary: "Every release note, searchable and grouped by month." },
  { path: "/roadmap", priority: 0.7, changeFrequency: "weekly", summary: "The four stages of the plan, and what has already shipped." },
  { path: "/records", priority: 0.6, changeFrequency: "weekly", summary: "The full modlist and load order." },
  { path: "/gallery", priority: 0.6, changeFrequency: "monthly", summary: "Screenshots and clips from the server." },
  { path: "/credits", priority: 0.5, changeFrequency: "monthly", summary: "The 167 mods and 117 authors the server is built on." },

  { path: "/community", priority: 0.7, changeFrequency: "monthly", summary: "How the Discord works, and what happens there." },
  { path: "/discord", priority: 0.7, changeFrequency: "monthly", summary: "Discord as the login, the front door and the support channel." },
  { path: "/support", priority: 0.6, changeFrequency: "monthly", summary: "Getting help, and what to bring to a ticket." },
  { path: "/donate", priority: 0.5, changeFrequency: "monthly", summary: "Patreon tiers and what supporting the server pays for." },

  { path: "/terms", priority: 0.2, changeFrequency: "yearly", summary: "Terms of use." },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly", summary: "Privacy notice." },
  { path: "/refunds", priority: 0.2, changeFrequency: "yearly", summary: "Refund policy for Patreon support." },
];

/** Lore documents are registered from their own data, so the two cannot drift. */
export const LORE_PRIORITY = 0.6;

/**
 * The absolute canonical for a path, always on the real domain.
 *
 * `SITE_ORIGIN` rather than the host being built, deliberately: the mirror must
 * point at the original, not at itself. Trailing slash because the export is
 * configured with `trailingSlash: true`, and a canonical that disagrees with
 * the URL the host actually serves is a canonical pointing at a redirect.
 */
export function canonicalFor(path: string): string {
  if (path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path}/`;
}

interface PageMetaInput {
  /** The route this page is served at, leading slash, no trailing slash. */
  path: string;
  title: string;
  description: string;
  /** Overrides the share-card title when the page title is too terse alone. */
  shareTitle?: string;
}

/**
 * The metadata for one page, complete.
 *
 * This exists because of a trap that has now cost this site twice: **Next
 * replaces `openGraph` rather than merging it.** A page that declares an
 * `openGraph` block to set its own title silently loses the root's `images`,
 * and a share card is the one thing nobody notices is broken by visiting the
 * page. Routing every page through here means the spread happens once, in a
 * place that cannot be forgotten, instead of in thirty places that can.
 *
 * It also attaches the canonical, which is the actual fix for the mirror.
 */
export function pageMeta({ path, title, description, shareTitle }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: canonicalFor(path) },
    openGraph: {
      title: shareTitle ?? title,
      description,
      url: canonicalFor(path),
      type: "website",
      images: [OG_IMAGE],
    },
    /* The mirror is the same forty pages on a second host. A canonical asks
       Google to prefer the original; this tells it not to index the copy. */
    ...(IS_MIRROR ? { robots: { index: false, follow: true } } : {}),
  };
}
