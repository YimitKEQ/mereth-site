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
 * The build script imports this file directly. Node strips the types, so this
 * has to stay free of imports, JSX and anything that needs a bundler.
 */

export interface Note {
  kind: string | null;
  text: string;
}

/** A release as GitHub hands it over, before `-dev` builds are folded in. */
export interface RawRelease {
  tag: string;
  body: string;
  date: string | null;
  draft?: boolean;
}

export interface FoldedRelease {
  version: string;
  date: string | null;
  notes: Note[];
}

/**
 * The most notes any one release keeps.
 *
 * A handful of releases carry sixty-odd bullets. Rendering all of them makes a
 * single entry taller than the screen and buries the releases either side of
 * it, so the tail is dropped rather than paged.
 */
export const MAX_NOTES = 16;

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

/** `v0.68.31-dev` and `0.68.31` are the same patch. The tag's own `v` is not part of it. */
export function publicVersion(tag: string): string {
  return tag.replace(/^v/i, "").replace(/-dev$/i, "").trim();
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
 * Compare two dotted versions numerically.
 *
 * String comparison is wrong here and quietly so: `"0.68.9" > "0.68.31"` is
 * true lexically, so the first patch past x.x.9 would stop being recognised as
 * new and the live list would silently go empty for the rest of that minor.
 */
export function isNewer(a: string, b: string): boolean {
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
 * Fold raw tags into public releases, newest first.
 *
 * Roughly one tag in five is an internal `-dev` build that restates the notes
 * of the public patch beside it. Listing both puts the same sentence on the
 * page twice under two version numbers, which reads like the changelog is
 * broken. Dropping them outright is not an option either: a hundred-odd notes
 * only ever appeared on a dev build and were never restated. So they merge, and
 * the notes are deduplicated by text.
 *
 * Releases with no notes at all are kept, because they are still releases and
 * the count on the page is a count of patches shipped, not of patches that had
 * something worth writing down. Callers that render a list filter them out.
 */
export function foldReleases(raw: readonly RawRelease[]): FoldedRelease[] {
  const merged = new Map<string, { date: string | null; notes: Map<string, Note> }>();

  for (const entry of raw) {
    if (entry.draft === true) continue;
    const version = publicVersion(entry.tag);
    if (!isVersion(version)) continue;

    let folded = merged.get(version);
    if (folded === undefined) {
      folded = { date: entry.date, notes: new Map() };
      merged.set(version, folded);
    }

    /* Keep the later of the two dates, so a public patch does not inherit the
       timestamp of the dev build that preceded it. */
    if (entry.date !== null && (folded.date === null || entry.date > folded.date)) {
      folded.date = entry.date;
    }

    for (const note of notesFrom(entry.body)) {
      const key = note.text.trim().toLowerCase();
      if (!folded.notes.has(key)) folded.notes.set(key, note);
    }
  }

  return [...merged.entries()]
    .map(([version, folded]) => ({
      version,
      date: folded.date,
      notes: [...folded.notes.values()].slice(0, MAX_NOTES),
    }))
    .sort((a, b) => (isNewer(a.version, b.version) ? -1 : 1));
}
