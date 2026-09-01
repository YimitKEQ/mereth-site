// Rebuild the site's changelog from Mereth's GitHub releases.
//
//   node scripts/sync-releases.mjs            refresh src/data/mereth.json
//   node scripts/sync-releases.mjs --check    report the gap, write nothing
//
// Runs as part of `prebuild`, so every build ships current patch notes.
//
// The releases used to come from the devkit's `wiki-changelog.json`, which is
// produced by a sweep somebody has to remember to run. That sweep last ran on
// 12 August and the site kept serving 0.68.25 for the eighteen days after it,
// through roughly fifty patches, because nothing about a stale bundle looks
// broken from the outside. The launcher's own changelog is the same GitHub
// releases, so there is no reason for the website to read it second hand.
//
// What lands in the bundle is patches, not tags. Roughly a third of the tags
// upstream are internal `-dev` builds, which are drafts collected into the next
// patch rather than things players receive, so `foldReleases` rolls each one
// forward into the patch that collected it. Publishing them as releases is what
// put eighteen identical entries on the changelog for 30 August alone. The
// rules and the reasoning live in `src/lib/release-notes.ts`, and
// `npm test` holds them against the launcher's own changelog.
//
// This does not touch anything else in the bundle. Skills, recipes, spells and
// the record counts still come out of the devkit sweep via
// `export-mereth-data.mjs`, because those are parsed out of the server's data
// and GitHub does not know them. Run the export first, then this: the export
// writes the whole file including a stale changelog, and this corrects the
// changelog in place afterwards.
//
// Fails soft on purpose. GitHub being unreachable, rate limited, or returning a
// shape we do not recognise leaves the existing bundle untouched and exits 0,
// because a build that ships slightly old notes is worth having and a build
// that dies because a third party was down is not. The one thing it will not do
// is write a changelog shorter or older than the one already committed.

import fs from "node:fs";
import path from "node:path";

import { foldReleases, isNewer } from "../src/lib/release-notes.ts";

const REPO = process.env.MERETH_RELEASES_REPO ?? "BStarRP/BStarRP_SkyMP_Data";
const API = `https://api.github.com/repos/${REPO}/releases`;
const BUNDLE = path.resolve("src", "data", "mereth.json");

/** GitHub's maximum page size. Six requests covers the whole history today. */
const PER_PAGE = 100;

/**
 * Stop paginating here no matter what.
 *
 * Unauthenticated GitHub allows 60 requests an hour and this is not the only
 * thing on the machine using them. Twelve pages is twice the current history
 * and still leaves the budget mostly intact.
 */
const MAX_PAGES = 12;

/**
 * Patches kept with their notes.
 *
 * The changelog page renders these and pages through them client side; the
 * count above it comes from the full tally instead, which is why the two
 * numbers differ.
 *
 * Eighty patches is 78 KB, a kilobyte each, and reaches back about a month.
 * That weight is not the bundle's problem but the changelog page's: the browser
 * receives all of it as props, because filtering has to happen without a round
 * trip to be worth having. Raising this is a straight trade of payload for
 * reach, and the page already tells the reader where its window ends rather
 * than pretending to hold everything.
 */
const KEEP_WITH_NOTES = 80;

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Attempts per page, and the wait between them.
 *
 * Six pages have to succeed together or the run writes nothing, so a single
 * transient failure anywhere in the six discards all of them. That is not
 * hypothetical: a 504 on page six is what this hit the first time it ran after
 * the fold was rewritten, and the whole build kept notes from three days
 * earlier because of it. GitHub's own guidance is to retry a 5xx, and three
 * tries costs at most two extra requests out of sixty.
 *
 * A 4xx is not retried. Rate limited, moved or not found are all answers that
 * will be the same a second later, and burning the budget confirming it makes
 * the next build likelier to fail too.
 */
const ATTEMPTS = 3;
const RETRY_MS = 2_000;

/**
 * Smallest page size worth splitting down to.
 *
 * Some offsets on this repository do not answer at all. Page 6 of 100 returns
 * 504 on every attempt, indefinitely, while pages 5 and 7 are fine; the same
 * hundred releases read back cleanly as pages 11 and 12 of 50. It is a fault on
 * GitHub's side of a kind that retrying cannot help with, and left unhandled it
 * pins the whole site at whatever the changelog said the day it started, which
 * is the exact failure this script exists to prevent.
 *
 * So a window that will not load is halved and read as two, down to this floor.
 * Twenty five is four extra requests in the worst case, and below that the
 * request count starts to matter more than the odds of success.
 */
const MIN_PAGE = 25;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const check = process.argv.includes("--check");

/**
 * One page, retried past a transient upstream failure.
 *
 * Answers in three ways, because the caller's next move differs for each:
 * `{ data }` succeeded, `{ split: true }` means this offset is broken and a
 * smaller window is worth trying, `{}` means stop asking. A 4xx is the last of
 * those. Rate limited, moved or not found will all say the same thing to a
 * differently shaped request, and splitting a 403 into four 403s spends the
 * budget that the next build needs.
 */
async function fetchPage(url, page) {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    const last = attempt === ATTEMPTS;
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "mereth-site-release-sync",
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (response.ok) return { data: await response.json() };

      const upstreamFault = response.status >= 500;
      console.warn(
        `sync-releases: GitHub answered ${response.status} on page ${page}` +
          (upstreamFault && !last ? `, retrying (${attempt}/${ATTEMPTS})` : ""),
      );
      if (!upstreamFault) return {};
      if (last) return { split: true };
    } catch (error) {
      /* A timeout or a dropped connection is the same class of problem as a
         504, and a smaller window is exactly what tends to get through. */
      console.warn(
        `sync-releases: page ${page} failed: ${error.message}` +
          (last ? "" : `, retrying (${attempt}/${ATTEMPTS})`),
      );
      if (last) return { split: true };
    }
    await wait(RETRY_MS * attempt);
  }
  return { split: true };
}

/**
 * One window of releases, read as two smaller ones if that offset will not load.
 *
 * Returns null only when even the smallest split fails, which means the history
 * genuinely cannot be read and the caller must not write a partial one.
 */
async function fetchWindow(size, page) {
  const label = `${page} of ${size}`;
  const answer = await fetchPage(`${API}?per_page=${size}&page=${page}`, label);

  if (answer.data !== undefined) {
    if (Array.isArray(answer.data)) return answer.data;
    console.warn(`sync-releases: page ${label} was not a list`);
    return null;
  }

  if (answer.split !== true || size <= MIN_PAGE) return null;

  const half = size / 2;
  console.warn(`sync-releases: page ${label} will not load, reading it as two of ${half}`);

  const first = await fetchWindow(half, page * 2 - 1);
  if (first === null) return null;
  /* Short means the history ran out inside the first half, so there is no
     second half to ask for. */
  if (first.length < half) return first;

  const second = await fetchWindow(half, page * 2);
  return second === null ? null : [...first, ...second];
}

/** Every release GitHub has, oldest page last. Null when the API cannot be trusted. */
async function fetchAll() {
  const all = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const payload = await fetchWindow(PER_PAGE, page);
    if (payload === null) return null;

    all.push(...payload);
    if (payload.length < PER_PAGE) return all;
  }

  /*
   * Hitting the page cap means the history is longer than we are willing to
   * read, so the oldest releases are missing and the total count would be
   * wrong. Better to leave the committed bundle alone than to publish a tally
   * that quietly undercounts.
   */
  console.warn(`sync-releases: more than ${MAX_PAGES * PER_PAGE} releases, refusing a partial read`);
  return null;
}

function main() {
  if (!fs.existsSync(BUNDLE)) {
    console.warn(`sync-releases: ${BUNDLE} does not exist, run the export first`);
    return;
  }

  const bundle = JSON.parse(fs.readFileSync(BUNDLE, "utf8"));
  const before = {
    version: bundle.server?.version ?? null,
    releases: bundle.server?.releases ?? 0,
    tags: bundle.server?.tags ?? 0,
    lastRelease: bundle.server?.lastRelease ?? null,
  };

  return fetchAll().then((raw) => {
    if (raw === null) {
      console.log(`sync-releases: leaving the bundle at ${before.version} (${before.releases} releases)`);
      return;
    }

    const folded = foldReleases(
      raw.map((entry) => ({
        tag: entry.tag_name ?? entry.name ?? "",
        body: entry.body ?? "",
        date: entry.published_at != null ? entry.published_at.slice(0, 10) : null,
        draft: entry.draft,
      })),
    );

    if (folded.length === 0) {
      console.warn("sync-releases: parsed no releases at all, leaving the bundle alone");
      return;
    }

    /*
     * The counts on the pages are counts of patches, so the entry holding
     * builds nobody has received yet is listed but not tallied. It sits at the
     * top of the changelog labelled as in testing, and claiming it as a release
     * would mean the number moves before the patch does.
     */
    const shipped = folded.filter((r) => r.shipped);
    if (shipped.length === 0) {
      console.warn("sync-releases: nothing but internal builds came back, leaving the bundle alone");
      return;
    }

    const newest = shipped[0];
    const withNotes = folded.filter((r) => r.notes.length > 0);
    const pending = folded.find((r) => !r.shipped) ?? null;

    /*
     * The span comes from the dates themselves, not from the ends of the
     * version-sorted list. Versions and dates only agree while nobody
     * backports, and reading the oldest date off the lowest version number is
     * the kind of assumption that holds until the day it does not.
     */
    const dates = shipped.map((r) => r.date).filter((d) => d !== null).sort();

    /*
     * Refuse to go backwards. A truncated response, a repository rename or a
     * repo that has had its releases pruned would all present as a shorter,
     * older history, and overwriting a good changelog with it is worse than
     * doing nothing.
     */
    if (before.version !== null && isNewer(before.version, newest.version)) {
      console.warn(
        `sync-releases: GitHub's newest is ${newest.version} but the bundle already has ${before.version}, refusing`,
      );
      return;
    }
    /*
     * Guarded on raw tags rather than on patches, because the two answer
     * different questions. Patches legitimately go down: a week of internal
     * builds collapsing into one patch is the intended behaviour, and a check
     * on that number would read it as history disappearing. Tags only ever go
     * up unless something is actually wrong upstream.
     */
    if (raw.length < before.tags) {
      console.warn(
        `sync-releases: GitHub has ${raw.length} tags but the bundle was built from ${before.tags}, refusing`,
      );
      return;
    }

    const firstRelease = dates[0] ?? bundle.server?.firstRelease ?? null;
    const lastRelease = dates[dates.length - 1] ?? bundle.server?.lastRelease ?? null;

    console.log(
      `sync-releases: ${before.version} (${before.releases}) -> ${newest.version} (${shipped.length} patches from ${raw.length} tags)`,
    );
    console.log(`sync-releases: ${firstRelease} to ${lastRelease}, ${withNotes.length} carry notes`);
    if (pending !== null) {
      console.log(
        `sync-releases: ${pending.version} is in testing, ${pending.notes.length} note(s) not yet in a patch`,
      );
    }

    if (check) {
      const gap = shipped.length - before.releases;
      console.log(`sync-releases: --check, writing nothing. ${gap} patch(es) behind.`);
      return;
    }

    bundle.releases = withNotes.slice(0, KEEP_WITH_NOTES);
    bundle.server = {
      ...bundle.server,
      version: newest.version,
      releases: shipped.length,
      tags: raw.length,
      firstRelease,
      lastRelease,
    };
    /*
     * Deliberately no "synced at" stamp. This runs before every build, so a
     * timestamp in the bundle would leave the working tree dirty after each
     * one, differing only in a field nobody reads. That trains people to
     * discard changes to this file without looking, which is how a real
     * regression gets thrown away. When the notes last moved is a question for
     * `git log`.
     */
    fs.writeFileSync(BUNDLE, JSON.stringify(bundle));
    console.log(`sync-releases: wrote ${bundle.releases.length} releases with notes to ${BUNDLE}`);
  });
}

await main();
