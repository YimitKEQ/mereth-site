/**
 * Patch notes published since this site was last built, read in the browser.
 *
 * The changelog on the page is baked at build time from the devkit's sweep, which
 * is what makes it instant, searchable and grouped by kind. The cost of baking is
 * that it freezes: we ship more than one patch a day, so a build from Tuesday is
 * visibly behind by Wednesday and somebody has to remember to rebuild. This closes
 * that gap without giving up the baked list, by asking GitHub for anything newer
 * and prepending it.
 *
 * Source is GitHub's releases API rather than the `changelog.json` the launcher
 * reads. Both carry the same markdown, but the launcher's copy is a release asset
 * served from `release-assets.githubusercontent.com`, which sends no
 * `Access-Control-Allow-Origin` and so cannot be read from a page at all.
 * `api.github.com` sends `*`. That is the whole reason for the choice.
 *
 * Unauthenticated GitHub allows 60 requests an hour per IP, shared with anything
 * else that address does against the API. That is ample for one call per visit and
 * it is also why this never retries: a reader who is out of budget gets the baked
 * list, which is the same thing they would have seen before this existed.
 */

import type { Release } from "@/lib/mereth";

const RELEASES_URL =
  "https://api.github.com/repos/BStarRP/BStarRP_SkyMP_Data/releases?per_page=30";

const TIMEOUT_MS = 8_000;

/**
 * Nothing published more than this far ahead of the newest baked release is
 * trusted as "new".
 *
 * Without a ceiling, a build made from a stale export would treat the entire
 * upstream history as unseen and prepend a hundred releases the page already
 * lists further down. The cap turns that failure into a short, obviously wrong
 * list instead of a duplicated page.
 */
const MAX_NEW = 12;

interface GitHubRelease {
  tag_name?: string;
  name?: string;
  body?: string;
  draft?: boolean;
  published_at?: string | null;
}

/**
 * Map a heading to one of four buckets, and prefer the verb the line opens with.
 *
 * Deliberately the same rules as `devkit/wiki/changelog.ts`, because a note that
 * arrives live and the same note after the next rebuild must land in the same
 * filter. If those two ever disagree the kind counts on the page shift when a
 * build happens, which looks like data loss.
 */
function kindOfHeading(heading: string): string {
  const clean = heading.replace(/^#+\s*/, "").toLowerCase();
  if (/(^|\s)(add|addition|feature|new)/.test(clean)) return "Added";
  if (/(^|\s)(fix|bug)/.test(clean)) return "Fixed";
  if (/(^|\s)(remov|deprecat)/.test(clean)) return "Removed";
  return "Changed";
}

function kindFromText(text: string): string | null {
  if (/^(added|adds|add|new)\b/i.test(text)) return "Added";
  if (/^(fixed|fix|fixes)\b/i.test(text)) return "Fixed";
  if (/^(removed|remove|disabled)\b/i.test(text)) return "Removed";
  if (/^(updated|update|changed|reworked|rebalanced|reduced|increased|improved)\b/i.test(text)) {
    return "Changed";
  }
  return null;
}

/** Markdown body to the note shape the page already renders. */
function notesFrom(body: string): { kind: string | null; text: string }[] {
  const notes: { kind: string | null; text: string }[] = [];
  let heading = "Changes";
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === "") continue;
    if (/^#{1,6}\s/.test(line)) {
      heading = line;
      continue;
    }
    if (!line.startsWith("-")) continue;
    const text = line.replace(/^-\s*/, "").trim();
    if (text === "") continue;
    notes.push({ kind: kindFromText(text) ?? kindOfHeading(heading), text });
  }
  return notes;
}

/** `v0.68.31-dev` and `0.68.31` are the same patch. The tag's own `v` is not part of it. */
const publicVersion = (tag: string): string =>
  tag.replace(/^v/i, "").replace(/-dev$/i, "").trim();

/**
 * Compare two dotted versions numerically.
 *
 * String comparison is wrong here and quietly so: `"0.68.9" > "0.68.31"` is true
 * lexically, so the first patch past x.x.9 would stop being recognised as new and
 * the live list would silently go empty for the rest of that minor.
 */
function isNewer(a: string, b: string): boolean {
  const pa = a.split(".").map((p) => Number.parseInt(p, 10) || 0);
  const pb = b.split(".").map((p) => Number.parseInt(p, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) return x > y;
  }
  return false;
}

/**
 * One request per page view, however many components ask.
 *
 * Two parts of the changelog page want this: the list, and the "Latest" fact
 * above it. Letting each fetch would double the draw on a 60 an hour budget to
 * show the same numbers twice. The promise is cached rather than the result, so
 * callers that arrive while it is still in flight join it instead of starting a
 * second one.
 *
 * Deliberately not aborted by any single caller. A component unmounting must not
 * cancel a request another component is still waiting on, so the shared fetch
 * carries only its own timeout and each caller drops the answer itself if it has
 * gone away by the time it lands.
 */
let inFlight: Promise<unknown> | null = null;

function payloadOnce(): Promise<unknown> {
  inFlight ??= fetch(RELEASES_URL, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { Accept: "application/vnd.github+json" },
  })
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);
  return inFlight;
}

/**
 * Releases upstream has that the baked bundle does not, newest first.
 *
 * Never rejects. Every failure path, an unreachable API, a rate limit, a changed
 * shape, returns an empty list, because the page behind this is already complete
 * and correct. This can only ever add.
 */
export async function fetchNewReleases(
  known: readonly Release[],
  signal: AbortSignal,
): Promise<Release[]> {
  const newest = known[0]?.version;
  if (newest === undefined) return [];

  try {
    const payload = await payloadOnce();
    if (signal.aborted || !Array.isArray(payload)) return [];

    const seenVersion = new Set(known.map((r) => r.version));

    /*
     * Fold `-dev` into the public patch, exactly as the export does. Roughly a
     * fifth of upstream's tags are internal builds that restate the notes of the
     * public patch beside them, and listing both puts the same sentence on the
     * page twice under two version numbers.
     */
    const merged = new Map<string, { date: string | null; notes: Map<string, { kind: string | null; text: string }> }>();
    for (const raw of payload as GitHubRelease[]) {
      const tag = raw.tag_name ?? raw.name ?? "";
      if (tag === "" || raw.draft === true) continue;

      const version = publicVersion(tag);
      if (version === "" || seenVersion.has(version) || !isNewer(version, newest)) continue;

      const date = raw.published_at != null ? raw.published_at.slice(0, 10) : null;
      const entry = merged.get(version) ?? { date, notes: new Map() };
      // Keep the later of the two dates, so a public patch does not inherit the
      // timestamp of the dev build that preceded it.
      if (date !== null && (entry.date === null || date > entry.date)) entry.date = date;
      for (const note of notesFrom(raw.body ?? "")) {
        const key = note.text.trim().toLowerCase();
        if (!entry.notes.has(key)) entry.notes.set(key, note);
      }
      merged.set(version, entry);
    }

    return [...merged.entries()]
      .filter(([, entry]) => entry.notes.size > 0)
      .map(([version, entry]) => ({
        version,
        date: entry.date,
        notes: [...entry.notes.values()].slice(0, 16),
      }))
      .sort((a, b) => (isNewer(a.version, b.version) ? -1 : 1))
      .slice(0, MAX_NEW);
  } catch {
    return [];
  }
}
