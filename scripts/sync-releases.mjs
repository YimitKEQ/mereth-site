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
 * Releases kept with their notes.
 *
 * The changelog page renders these and pages through them client side; the
 * count above it comes from the full tally instead, which is why the two
 * numbers differ. Eighty releases of notes is around 100 KB of the bundle and
 * reaches back about six weeks, which is as far as anybody scrolls.
 */
const KEEP_WITH_NOTES = 80;

const REQUEST_TIMEOUT_MS = 15_000;

const check = process.argv.includes("--check");

/** Every release GitHub has, oldest page last. Null when the API cannot be trusted. */
async function fetchAll() {
  const all = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const url = `${API}?per_page=${PER_PAGE}&page=${page}`;
    let payload;
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "mereth-site-release-sync",
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) {
        console.warn(`sync-releases: GitHub answered ${response.status} on page ${page}`);
        return null;
      }
      payload = await response.json();
    } catch (error) {
      console.warn(`sync-releases: page ${page} failed: ${error.message}`);
      return null;
    }

    if (!Array.isArray(payload)) {
      console.warn("sync-releases: GitHub returned something that is not a list");
      return null;
    }

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

    const newest = folded[0];
    const withNotes = folded.filter((r) => r.notes.length > 0);

    /*
     * The span comes from the dates themselves, not from the ends of the
     * version-sorted list. Versions and dates only agree while nobody
     * backports, and reading the oldest date off the lowest version number is
     * the kind of assumption that holds until the day it does not.
     */
    const dates = folded.map((r) => r.date).filter((d) => d !== null).sort();

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
    if (folded.length < before.releases) {
      console.warn(
        `sync-releases: GitHub has ${folded.length} releases but the bundle has ${before.releases}, refusing`,
      );
      return;
    }

    const firstRelease = dates[0] ?? bundle.server?.firstRelease ?? null;
    const lastRelease = dates[dates.length - 1] ?? bundle.server?.lastRelease ?? null;

    console.log(
      `sync-releases: ${before.version} (${before.releases}) -> ${newest.version} (${folded.length})`,
    );
    console.log(`sync-releases: ${firstRelease} to ${lastRelease}, ${withNotes.length} carry notes`);

    if (check) {
      const gap = folded.length - before.releases;
      console.log(`sync-releases: --check, writing nothing. ${gap} release(s) behind.`);
      return;
    }

    bundle.releases = withNotes.slice(0, KEEP_WITH_NOTES);
    bundle.server = {
      ...bundle.server,
      version: newest.version,
      releases: folded.length,
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
