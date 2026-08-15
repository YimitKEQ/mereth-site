/**
 * The TikTok feed, read from our own origin.
 *
 * TikTok has no unauthenticated list API, so the reading is done by a Cloudflare
 * Pages Function at `/api/tiktok` which pulls TikTok's own creator embed apart
 * server-side and hands back clean JSON. `functions/api/tiktok.js` in the
 * website repository carries the detail of why that is the only route that
 * works, and what was tried first.
 *
 * Read in the browser rather than baked at build time, for the same reason the
 * server status is: this site ships as static files, and a snapshot of "the
 * latest posts" taken whenever it was last built is exactly the thing that goes
 * quietly wrong. There is a harder reason here too. TikTok's cover URLs are
 * signed and expire about two days out, so a baked feed would not merely be
 * stale, it would be a row of broken images.
 *
 * Deliberately narrow, and hostile to what comes back. The response is a
 * third-party document parsed out of a third-party page, so every field is
 * checked before it reaches a rendered surface rather than trusted because it
 * was there yesterday.
 */

const FEED_URL = "https://merethroleplay.com/api/tiktok";

export const TIKTOK_PROFILE = "https://www.tiktok.com/@merethrp";

/*
 * A deadline on the request, for the reason given in `status.ts`: a hung
 * connection never rejects, and without this a stalled upstream leaves an open
 * socket in the reader's browser for as long as the tab is open.
 */
const TIMEOUT_MS = 8_000;

export interface TikTokVideo {
  id: string;
  url: string;
  /** The caption as posted, hashtags and all. Clean it with `readable`. */
  caption: string;
  cover: string;
  plays: number | null;
}

export interface TikTokFeed {
  videos: TikTokVideo[];
  followers: number | null;
  likes: number | null;
}

/** Nothing readable. Never an error, and never a zero presented as a count. */
const EMPTY: TikTokFeed = { videos: [], followers: null, likes: null };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const text = (value: unknown): string => (typeof value === "string" ? value : "");

const count = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;

/**
 * A caption worth putting on this page.
 *
 * Every post ends in a run of discovery tags, `#skyrimrp #skyrim #fyp #tes`,
 * which do a job on TikTok and none at all here: they are the same five words
 * under all eight cards and they push the sentence that says something out of
 * the two lines a card has. Stripped rather than truncated, so what survives is
 * the part somebody wrote.
 */
export function readable(caption: string): string {
  return caption
    .replace(/#[\p{L}\p{N}_]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

/**
 * Only a video that carries everything it needs to be drawn.
 *
 * A half-populated card, a frame with no picture or a link going nowhere, is
 * worse than one fewer card, so a row missing any of the four is dropped rather
 * than rendered with a gap.
 */
function toVideo(value: unknown): TikTokVideo | null {
  if (!isRecord(value)) return null;

  const id = text(value.id);
  const url = text(value.url);
  const cover = text(value.cover);
  if (id === "" || cover === "") return null;

  /* The link is built from the id rather than taken on trust. The field arrives
     from a scraped page, and an href is the one thing on this card that must not
     be attacker-controlled. */
  if (!url.startsWith("https://www.tiktok.com/")) return null;

  return { id, url, cover, caption: text(value.caption), plays: count(value.plays) };
}

/** Never rejects. An unreadable feed comes back empty, which the page draws as
 *  a link to the profile rather than as an error. */
export async function fetchTikTok(signal: AbortSignal): Promise<TikTokFeed> {
  try {
    const response = await fetch(FEED_URL, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]),
    });
    if (!response.ok) return EMPTY;

    const body: unknown = await response.json();
    if (!isRecord(body) || body.ok !== true || !Array.isArray(body.videos)) return EMPTY;

    const videos = body.videos
      .map(toVideo)
      .filter((video): video is TikTokVideo => video !== null);

    if (videos.length === 0) return EMPTY;

    return { videos, followers: count(body.followers), likes: count(body.likes) };
  } catch {
    return EMPTY;
  }
}
