/**
 * The live launcher manifest, read in the browser and reconciled against the baked modlist.
 *
 * `/records` renders `mereth.mods` (167) and `mereth.plugins` (131), baked at build time from a
 * devkit sweep of Mereth's own manifest. The launcher's manifest moves more often than this site
 * gets rebuilt, so the baked page can already be behind the day it ships. This closes that gap in
 * the browser: fetch the manifest the launcher itself reads, and correct the counts, the load
 * order and the mod list against it without a rebuild.
 *
 * `merethroleplay.com/api/servers/bstarrp/manifest.json` sends
 * `Access-Control-Allow-Origin: *`, so it is readable from a page, including the GitHub Pages
 * mirror where a relative `/api/...` path would 404. The absolute origin is used deliberately for
 * that reason, not a same-origin route.
 *
 * A mod's Nexus id is not a safe key to reconcile on. About a dozen Nexus mod pages contribute
 * more than one downloadable file to the manifest (a main file plus a patch, or a base plus a
 * texture pack), so the same `modId` appears on multiple `modList` rows with different labels.
 * The baked `name` field is the manifest's own `label` at build time, and every label in the
 * manifest is unique, so `label` is what actually identifies one installed file across two
 * snapshots. Reconciling on `modId` instead would silently collapse a modId's several files down
 * to one and misreport which specific file was added or removed.
 *
 * The join key is a normalised form of the label, not the raw text. Verified against the live
 * endpoint while building this: one baked label used a colon as its separator, and the live
 * manifest's version of the same file used a dash character instead. Same file, same modId,
 * nothing actually changed, Mereth just re-punctuated the label upstream between the bake and
 * now. A literal string match would have reported that file as both removed and added, which is
 * false and exactly the kind of thing this page must not invent. So the join key folds colons
 * and every dash variant to a space before comparing, and a punctuation-only edit upstream stops
 * being mistaken for a file change. The raw text is what renders either way; only the comparison
 * uses the normalised form.
 */

import type { Mereth } from "@/lib/mereth";

type BakedMod = Mereth["mods"][number];

const MANIFEST_URL = "https://merethroleplay.com/api/servers/bstarrp/manifest.json";
const TIMEOUT_MS = 8_000;

export interface LiveMod {
  modId: number;
  name: string;
  author: string | null;
  version: string | null;
  contributes: string | null;
}

export interface AddedMod {
  modId: number;
  label: string;
}

export interface RemovedMod {
  modId: number | null;
  name: string;
}

export type ModlistLive =
  | { status: "unavailable" }
  | {
      status: "ok";
      modList: LiveMod[];
      loadOrder: string[];
      sksePlugins: number;
      /** How many files the launcher checksums before it lets you connect. */
      checkedFiles: number;
      minClientVersion: string | null;
      versionMajor: number | null;
      added: AddedMod[];
      removed: RemovedMod[];
      fetchedAt: string;
    };

const UNAVAILABLE: ModlistLive = { status: "unavailable" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isModListEntry(value: unknown): value is { modId: number; label: string } {
  return (
    isRecord(value) &&
    typeof value.modId === "number" &&
    typeof value.label === "string" &&
    value.label.trim() !== ""
  );
}

function isPluginName(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isSksePlugin(value: unknown): value is { filename: string } {
  return isRecord(value) && typeof value.filename === "string";
}

/**
 * A label's identity for joining, not for display.
 *
 * Case folded, whitespace collapsed, and every colon or dash folded to a space. The dash match
 * uses the Unicode `Pd` (Dash Punctuation) property rather than a list of literal characters,
 * which covers hyphen-minus, hyphen, non-breaking hyphen, figure dash, en dash, em dash and
 * every other dash variant in one match, and keeps this file free of the characters it exists
 * to normalise away.
 *
 * See the module comment for why this exists: it is what stops a punctuation-only relabel
 * upstream from reading as a removed file plus an unrelated added one.
 */
function joinKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/[:\p{Pd}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * One request per page view, however many components ask.
 *
 * The facts row in the header and the mod/load order lists further down both want this. The
 * promise is cached rather than the result, so a caller that arrives while it is still in flight
 * joins it instead of starting a second one. Same shape as `live-changelog`'s `payloadOnce`, for
 * the same reason.
 *
 * Deliberately not aborted by any single caller: a component unmounting must not cancel a fetch
 * another mounted component is still waiting on. The shared fetch carries only its own timeout,
 * and each caller drops the answer itself if it has gone away by the time it lands.
 */
let inFlight: Promise<unknown> | null = null;

function payloadOnce(): Promise<unknown> {
  inFlight ??= fetch(MANIFEST_URL, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { Accept: "application/json" },
  })
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);
  return inFlight;
}

/**
 * Reconcile the live manifest against the mods this page was built with.
 *
 * Never rejects and never throws for a caller to catch. Any failure, an unreachable host, a
 * timeout, a reshaped payload, resolves to `{ status: "unavailable" }`, which means exactly one
 * thing to a caller: keep showing the baked list, nothing here has changed.
 */
export async function fetchLiveModlist(
  bakedMods: readonly BakedMod[],
  signal: AbortSignal,
): Promise<ModlistLive> {
  try {
    const payload = await payloadOnce();
    if (signal.aborted || !isRecord(payload)) return UNAVAILABLE;

    const rawModList = payload.modList;
    const rawLoadOrder = payload.loadOrder;
    if (!Array.isArray(rawModList) || !Array.isArray(rawLoadOrder)) return UNAVAILABLE;

    const liveEntries = rawModList.filter(isModListEntry);
    const loadOrder = rawLoadOrder.filter(isPluginName);
    if (liveEntries.length === 0 || loadOrder.length === 0) return UNAVAILABLE;

    const bakedByKey = new Map<string, BakedMod>();
    for (const mod of bakedMods) {
      const key = joinKey(mod.name);
      if (key !== "") bakedByKey.set(key, mod);
    }

    const modList: LiveMod[] = liveEntries
      .map((entry) => {
        const baked = bakedByKey.get(joinKey(entry.label));
        return {
          modId: entry.modId,
          name: entry.label,
          author: baked?.author ?? null,
          version: baked?.version ?? null,
          contributes: baked?.contributes ?? null,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    const liveKeys = new Set(liveEntries.map((entry) => joinKey(entry.label)));

    const added: AddedMod[] = liveEntries
      .filter((entry) => !bakedByKey.has(joinKey(entry.label)))
      .map((entry) => ({ modId: entry.modId, label: entry.label }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const removed: RemovedMod[] = bakedMods
      .filter((mod) => joinKey(mod.name) !== "" && !liveKeys.has(joinKey(mod.name)))
      .map((mod) => ({ modId: mod.modId, name: mod.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const sksePlugins = Array.isArray(payload.sksePlugins)
      ? payload.sksePlugins.filter(isSksePlugin).length
      : 0;

    // The `mods` array is the file-level list the launcher CRC32s, which is a
    // different figure from the mod list and moves independently of it.
    const checkedFiles = Array.isArray(payload.mods) ? payload.mods.length : 0;

    const minClientVersion = typeof payload.minClientVersion === "string" ? payload.minClientVersion : null;
    const versionMajor = typeof payload.versionMajor === "number" ? payload.versionMajor : null;

    return {
      status: "ok",
      modList,
      loadOrder,
      sksePlugins,
      checkedFiles,
      minClientVersion,
      versionMajor,
      added,
      removed,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return UNAVAILABLE;
  }
}
