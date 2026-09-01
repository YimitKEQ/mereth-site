/**
 * Patch notes published since this site was last built, read in the browser.
 *
 * The changelog on the page is baked at build time by `scripts/sync-releases.mjs`,
 * which is what makes it instant, searchable and grouped by kind. The cost of
 * baking is that it freezes the moment the build finishes, and we ship more than
 * one patch a day. This closes that gap without giving up the baked list.
 *
 * Since the bundle is now synced from the same GitHub releases at build time,
 * the gap this covers is hours rather than weeks. It used to be the only thing
 * standing between the site and a changelog frozen at whenever somebody last
 * remembered to re-export.
 *
 * Source is GitHub's releases API rather than the `changelog.json` the launcher
 * reads. Both carry the same markdown, byte for byte, which was checked across
 * every tag the two have in common. The launcher's copy is a release asset
 * served from `release-assets.githubusercontent.com`, which sends no
 * `Access-Control-Allow-Origin` and so cannot be read from a page at all.
 * `api.github.com` sends `*`. That is the whole reason for the choice.
 *
 * Unauthenticated GitHub allows 60 requests an hour per IP, shared with anything
 * else that address does against the API. That is ample for one call per visit
 * and it is also why this never retries: a reader who is out of budget gets the
 * baked list, which is now current as of the last deploy.
 *
 * The parsing lives in `release-notes.ts` and is shared with the build script,
 * so a note that arrives live and the same note after the next build land in
 * the same filter.
 */

import type { Release } from "@/lib/mereth";
import { compareVersions, foldReleases, type RawRelease } from "@/lib/release-notes";

const RELEASES_URL =
  "https://api.github.com/repos/BStarRP/BStarRP_SkyMP_Data/releases?per_page=30";

const TIMEOUT_MS = 8_000;

/**
 * Nothing published more than this far ahead of the newest baked patch is
 * trusted as "new".
 *
 * Without a ceiling, a build made from a stale bundle would treat the entire
 * upstream history as unseen and prepend a hundred patches the page already
 * lists further down. The cap turns that failure into a short, obviously wrong
 * list instead of a duplicated page.
 *
 * Twelve is comfortably more than a day's patches, which is all this has to
 * cover now that the bundle is synced from GitHub at build time.
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
 * One request per page view, however many components ask.
 *
 * Three parts of the site want this: the home page's three cards, the
 * changelog list, and the "Latest" fact above it. Letting each fetch would
 * treble the draw on a 60 an hour budget to show the same numbers twice. The
 * promise is cached rather than the result, so callers that arrive while it is
 * still in flight join it instead of starting a second one.
 *
 * Deliberately not aborted by any single caller. A component unmounting must
 * not cancel a request another component is still waiting on, so the shared
 * fetch carries only its own timeout and each caller drops the answer itself if
 * it has gone away by the time it lands.
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
 * The head of the changelog as upstream has it now, newest first.
 *
 * Returns every patch at or above the newest baked one, not only the strictly
 * newer ones, because the newest baked entry is the one most likely to have
 * moved since the build. Two ways it moves: a patch collects more internal
 * builds, and the entry that was "in testing" becomes the patch that collected
 * it. Both are corrections to an existing row rather than additions above it,
 * so callers hand the result to `mergeLive`, which folds it in by version and
 * unions the notes.
 *
 * Never rejects. Every failure path, an unreachable API, a rate limit, a
 * changed shape, returns an empty list, because the page behind this is already
 * complete and correct. This can only ever add.
 */
export async function fetchNewReleases(
  known: readonly Release[],
  signal: AbortSignal,
): Promise<Release[]> {
  /* The newest patch, not simply the first row: an entry still in testing sits
     above the patches and is exactly what a live answer supersedes. */
  const newest = known.find((release) => release.shipped !== false)?.version;
  if (newest === undefined) return [];

  try {
    const payload = await payloadOnce();
    if (signal.aborted || !Array.isArray(payload)) return [];

    const raw: RawRelease[] = (payload as GitHubRelease[]).map((entry) => ({
      tag: entry.tag_name ?? entry.name ?? "",
      body: entry.body ?? "",
      date: entry.published_at != null ? entry.published_at.slice(0, 10) : null,
      draft: entry.draft,
    }));

    return foldReleases(raw)
      .filter(
        (release) => release.notes.length > 0 && compareVersions(release.version, newest) >= 0,
      )
      .slice(0, MAX_NEW);
  } catch {
    return [];
  }
}
