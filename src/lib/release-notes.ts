/**
 * Turning Mereth's GitHub releases into the patch notes the site renders.
 *
 * One module, because three things parse the same tags and they must not
 * disagree: the build-time sync that bakes the changelog into the bundle
 * (`scripts/sync-releases.mjs`), the browser fetch that picks up anything
 * published since that build (`src/lib/live-changelog.ts`), and anything later
 * that wants a version number. When the same note lands in "Fixed" on one path
 * and "Changed" on the other, the kind counts on the changelog page shift the
 * moment a build happens, which reads as data loss rather than as a rebuild.
 *
 * ## What a release is
 *
 * Two kinds of tag come off that repository and they mean different things:
 *
 *   v0.70.54       a patch. The notes are curated, grouped under Added, Fixed,
 *                  Updated and so on, and often opened with a paragraph of
 *                  prose. This is what players receive.
 *   v0.70.53-dev   an internal build. One or two lines, written as the work
 *                  happened. It is not shipped on its own: it is collected,
 *                  with the ones either side of it, into the next patch.
 *
 * So the dev builds are drafts of a patch, not patches. Treating them as
 * releases is what this file used to do and it made the changelog look broken:
 * on 30 August the page carried eighteen consecutive entries, 0.70.37 through
 * 0.70.53, every one of them reading "Fixed double tap dodge to only count with
 * same skill", followed by 0.70.54 saying it again. Nothing was wrong with the
 * data. We were publishing the working notes as if each were a patch.
 *
 * `foldReleases` therefore rolls each dev build forward into the first patch at
 * or above its version, which is the patch it was compiled into, and keeps the
 * union of the notes. The curated wording leads, anything that only ever
 * appeared on a dev build follows it rather than being lost: about 240 notes
 * across the history are in that second category, so dropping the dev builds
 * outright is not an option either.
 *
 * Builds ahead of every patch have not been compiled into anything yet. They
 * collapse into a single entry marked `shipped: false` rather than vanishing,
 * because a week can pass between patches and a changelog that goes quiet for a
 * week looks abandoned.
 *
 * The build script imports this file directly. Node strips the types, so this
 * has to stay free of imports, JSX and anything that needs a bundler.
 */

export interface Note {
  kind: string | null;
  text: string;
}

/** A release as GitHub hands it over, before dev builds are rolled up. */
export interface RawRelease {
  tag: string;
  body: string;
  date: string | null;
  draft?: boolean;
}

export interface FoldedRelease {
  version: string;
  date: string | null;
  /**
   * The paragraphs Mereth writes above the bullets on a bigger patch, in their
   * own words. Two hundred of the releases carry one and the site used to throw
   * every one of them away, which is how a changelog ends up sounding like a
   * machine wrote it.
   */
  summary: string | null;
  /**
   * False only for the entry holding dev builds that no patch has collected
   * yet. Those notes describe work that is real but not yet in players' hands,
   * so the page labels them rather than counting them as shipped.
   */
  shipped: boolean;
  notes: Note[];
}

/**
 * The order the kinds are listed in within a release.
 *
 * A patch that has absorbed a fortnight of dev builds carries the curated
 * bullets followed by whatever only the dev builds said, and read in arrival
 * order that tail is a jumble. Sorting by kind puts it back into the shape the
 * curated notes were already written in, since their own headings run Added,
 * Fixed, Updated, Removed. The sort is stable, so within a kind the curated
 * wording still comes first.
 */
const KIND_ORDER = ["Added", "Fixed", "Changed", "Removed"];

/**
 * Map a heading to one of four buckets.
 *
 * Only consulted when the line itself does not open with a verb, because a
 * bullet reading "Fixed X" under a heading called "Changes" is a fix.
 */
export function kindOfHeading(heading: string): string {
  const clean = heading.replace(/^#+\s*/, "").toLowerCase();
  if (/(^|\s)(add|addition|feature|new)/.test(clean)) return "Added";
  if (/(^|\s)(fix|bug)/.test(clean)) return "Fixed";
  if (/(^|\s)(remov|deprecat)/.test(clean)) return "Removed";
  return "Changed";
}

/** The kind the line states about itself, or null when it does not open with a verb. */
export function kindFromText(text: string): string | null {
  if (/^(added|adds|add|new)\b/i.test(text)) return "Added";
  if (/^(fixed|fix|fixes)\b/i.test(text)) return "Fixed";
  if (/^(removed|remove|disabled)\b/i.test(text)) return "Removed";
  if (/^(updated|update|changed|reworked|rebalanced|reduced|increased|improved)\b/i.test(text)) {
    return "Changed";
  }
  return null;
}

/** A release's markdown body to the notes the page renders. */
export function notesFrom(body: string): Note[] {
  const notes: Note[] = [];
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

/**
 * The prose a release opens with, or null when it is bullets only.
 *
 * Mereth marks it with a bare `**Summary**` line, consistently, on every one of
 * the two hundred releases that has one. It runs until the next heading. A
 * bullet also ends it, because two releases open the changes without a heading
 * and would otherwise pull the whole patch into the summary.
 */
export function summaryFrom(body: string): string | null {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\*\*\s*summary\s*\*\*:?$/i.test(line.trim()));
  if (start === -1) return null;

  const paragraphs: string[] = [];
  for (const rawLine of lines.slice(start + 1)) {
    const line = rawLine.trim();
    if (/^#{1,6}\s/.test(line) || line.startsWith("-")) break;
    if (line === "") {
      if (paragraphs.length > 0) paragraphs.push("");
      continue;
    }
    paragraphs.push(line);
  }

  const text = paragraphs.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return text === "" ? null : text;
}

/** `v0.68.31-dev` and `0.68.31` are the same patch. The tag's own `v` is not part of it. */
export function publicVersion(tag: string): string {
  return tag.replace(/^v/i, "").replace(/-dev$/i, "").trim();
}

/** Whether this tag is an internal build rather than a patch players received. */
export function isDevBuild(tag: string): boolean {
  return /-dev$/i.test(tag.trim());
}

/**
 * Whether a stripped tag is a version at all.
 *
 * Not every tag on the repository is a release. `dev-latest` is a rolling
 * pointer that moves with the newest internal build, and it survives
 * `publicVersion` unchanged because it is not suffixed `-dev`, it is prefixed.
 * Left in, it parses as version zero, sorts below `0.0.1`, and takes the
 * changelog's "first release" date with it: the site claimed the server had
 * launched in August rather than in February.
 *
 * So the shape is checked rather than assumed. Anything that is not a dotted
 * run of digits is not a patch and is not counted as one.
 */
export function isVersion(version: string): boolean {
  return /^\d+(\.\d+)*$/.test(version);
}

/**
 * Order two dotted versions numerically. Negative when `a` is the older.
 *
 * String comparison is wrong here and quietly so: `"0.68.9" > "0.68.31"` is
 * true lexically, so the first patch past x.x.9 would stop being recognised as
 * new and the live list would silently go empty for the rest of that minor.
 */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((p) => Number.parseInt(p, 10) || 0);
  const pb = b.split(".").map((p) => Number.parseInt(p, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) return x - y;
  }
  return 0;
}

export function isNewer(a: string, b: string): boolean {
  return compareVersions(a, b) > 0;
}

interface Bucket {
  version: string;
  date: string | null;
  summary: string | null;
  shipped: boolean;
  notes: Map<string, Note>;
}

function addBody(bucket: Bucket, body: string): void {
  for (const note of notesFrom(body)) {
    const key = note.text.trim().toLowerCase();
    if (!bucket.notes.has(key)) bucket.notes.set(key, note);
  }
}

/** Group notes by kind in the order a patch's own headings use, arrival order within. */
export function sortNotes(notes: readonly Note[]): Note[] {
  const rank = (note: Note): number => {
    const index = KIND_ORDER.indexOf(note.kind ?? "");
    return index === -1 ? KIND_ORDER.length : index;
  };
  return notes
    .map((note, index) => ({ note, index }))
    .sort((a, b) => rank(a.note) - rank(b.note) || a.index - b.index)
    .map((entry) => entry.note);
}

function finish(bucket: Bucket): FoldedRelease {
  return {
    version: bucket.version,
    date: bucket.date,
    summary: bucket.summary,
    shipped: bucket.shipped,
    notes: sortNotes([...bucket.notes.values()]),
  };
}

/**
 * Fold raw tags into the patches players received, newest first.
 *
 * Every dev build rolls forward into the first patch at or above its version,
 * which is the patch that collected it, and the notes are deduplicated by text.
 * Builds no patch has collected yet become one trailing entry with
 * `shipped: false`.
 *
 * Patches with no notes at all are kept, because they are still patches and the
 * count on the page is a count of what shipped, not of what had something worth
 * writing down. Callers that render a list filter them out.
 */
export function foldReleases(raw: readonly RawRelease[]): FoldedRelease[] {
  const patches = new Map<string, Bucket>();
  const devBuilds: { version: string; date: string | null; body: string }[] = [];

  for (const entry of raw) {
    if (entry.draft === true) continue;
    const version = publicVersion(entry.tag);
    if (!isVersion(version)) continue;

    if (isDevBuild(entry.tag)) {
      devBuilds.push({ version, date: entry.date, body: entry.body });
      continue;
    }

    /* A version tagged twice is one patch. Keep the later date and the first
       summary written for it. */
    let patch = patches.get(version);
    if (patch === undefined) {
      patch = { version, date: entry.date, summary: null, shipped: true, notes: new Map() };
      patches.set(version, patch);
    }
    if (entry.date !== null && (patch.date === null || entry.date > patch.date)) {
      patch.date = entry.date;
    }
    patch.summary ??= summaryFrom(entry.body);
    addBody(patch, entry.body);
  }

  /* Ascending, so the first patch at or above a dev build's version is the one
     that collected it. */
  const ascending = [...patches.values()].sort((a, b) => compareVersions(a.version, b.version));

  /* Newest dev build first, so where a note only ever appeared on a dev build
     the most recent wording is the one that survives deduplication. */
  devBuilds.sort((a, b) => compareVersions(b.version, a.version));

  let pending: Bucket | null = null;

  for (const build of devBuilds) {
    const collector = ascending.find((patch) => compareVersions(patch.version, build.version) >= 0);

    if (collector !== undefined) {
      /* The prose is as often written on the build as on the patch: 0.70.21's
         "Long awaited update" paragraphs are on 0.70.21-dev and the patch tag
         carries bullets only. The patch's own wording still wins where it has
         some, and otherwise the newest build to have written any is used, which
         is why these are walked newest first. */
      collector.summary ??= summaryFrom(build.body);
      addBody(collector, build.body);
      continue;
    }

    /* Ahead of every patch: work that is done but not yet compiled into one.
       The version shown is the newest build's, which is the highest number
       anybody testing has seen. */
    pending ??= {
      version: build.version,
      date: build.date,
      summary: null,
      shipped: false,
      notes: new Map(),
    };
    if (build.date !== null && (pending.date === null || build.date > pending.date)) {
      pending.date = build.date;
    }
    pending.summary ??= summaryFrom(build.body);
    addBody(pending, build.body);
  }

  const folded = ascending.reverse().map(finish);
  return pending === null ? folded : [finish(pending), ...folded];
}

/**
 * Baked releases corrected by whatever the browser fetched, newest first.
 *
 * Not a concatenation, because the two lists overlap on purpose. The newest
 * baked release is re-fetched every time so that a patch which has absorbed
 * more dev builds since the build picks them up, and the entry that was
 * "in testing" at build time is replaced by the patch that collected it rather
 * than sitting above it under the same version number.
 *
 * Notes are unioned rather than swapped. The live fetch reads one page of tags
 * while the bundle was folded from the whole history, so on a long-running
 * patch the live fold can be the shorter of the two, and a live answer must
 * never subtract from a page that already rendered correctly.
 */
export function mergeLive<T extends FoldedRelease>(baked: readonly T[], live: readonly T[]): T[] {
  if (live.length === 0) return [...baked];

  const bakedByVersion = new Map(baked.map((release) => [release.version, release]));
  const merged = live.map((release) => {
    const known = bakedByVersion.get(release.version);
    if (known === undefined) return release;

    const notes = new Map<string, Note>();
    for (const note of [...release.notes, ...known.notes]) {
      const key = note.text.trim().toLowerCase();
      if (!notes.has(key)) notes.set(key, note);
    }
    return {
      ...release,
      summary: release.summary ?? known.summary,
      notes: sortNotes([...notes.values()]),
    };
  });

  const replaced = new Set(live.map((release) => release.version));
  return [...merged, ...baked.filter((release) => !replaced.has(release.version))];
}
