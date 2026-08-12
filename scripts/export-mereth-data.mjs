// Pull the devkit's Mereth sweeps into the website as two bundles.
//
//   node scripts/export-mereth-data.mjs
//
// The devkit holds ~150 MB of parsed server data. The site needs a small slice
// of it, so this selects and flattens rather than copying: the pages should read
// one predictable shape and never know where it came from.
//
// Two outputs, because they have different lifetimes:
//
//   src/data/mereth.json  the handbook. Imported by server components, so it
//                         never reaches the browser except as the slice a page
//                         actually renders.
//
// It deliberately does NOT carry a searchable record catalogue or a list of
// where unique gear stands. Both existed, both worked, and both were removed:
// on a roleplay server, handing over what is in a barrow deletes the reason to
// go to the barrow. Publish what helps a player decide, never what removes the
// reason to look.
//
// Everything here is derived from Mereth's own published manifest, their client
// bundle and the plugins their launcher installs. Nothing is invented.

import fs from "node:fs";
import path from "node:path";

const DEVKIT = path.resolve("..", "devkit", "data");
const OUT_DIR = path.resolve("src", "data");

const read = (name) => {
  const file = path.join(DEVKIT, name);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
};

const title = (text) =>
  text
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const ui = read("wiki-ui-data.json");
const facts = read("wiki-client-facts.json");
const wiki = read("wiki.json");
const client = read("wiki-client.json");
const manifest = read("mereth-manifest.json");
const changelog = read("wiki-changelog.json");
const deep = read("wiki-deep.json");
const recipeFile = read("wiki-recipes.json");
const gatheringFile = read("wiki-gathering.json");
const secrets = read("wiki-secrets.json");

if (ui === null || wiki === null) {
  throw new Error(`devkit data missing at ${DEVKIT}. Run \`npm run wiki\` in the repo root first.`);
}

// --- Skills, grouped the way their own menu groups them --------------------
//
// `wiki-ui-data.json` flattens the 51 skills and loses the grouping, so the
// grouping is recovered from the client source the UI dump recovered. Their
// `content` is an array of arrays and `skillMenuCategories` slices it; both are
// transcribed below rather than evaluated, because evaluating recovered foreign
// source is not something this repo does.

const CONTENT_SOURCE = path.join(DEVKIT, "ui-source", "src", "features", "skillsMenu", "content.ts");

/** Skill names per top-level group of their `content` array, in source order. */
function readContentGroups() {
  const source = fs.readFileSync(CONTENT_SOURCE, "utf8");
  const start = source.indexOf("const content = [");
  if (start === -1) throw new Error("content array not found in the recovered skill menu source");

  const groups = [];
  let current = null;
  let depth = 0;

  for (let i = source.indexOf("[", start); i < source.length; i++) {
    const ch = source[i];
    if (ch === "[") {
      depth++;
      // Depth 2 is a category group: content[n].
      if (depth === 2) current = [];
    } else if (ch === "]") {
      depth--;
      if (depth === 1 && current !== null) {
        groups.push(current);
        current = null;
      }
      if (depth === 0) break;
    } else if (ch === "{" && current !== null) {
      // A skill object opens here; its `name` is the first key.
      const name = /^\s*\{\s*\n?\s*name:\s*'([^']+)'/.exec(source.slice(i, i + 200));
      if (name !== null) current.push(name[1]);
    }
  }
  return groups;
}

const groups = readContentGroups();
const g = (n) => groups[n] ?? [];

/*
 * Transcribed from `skillMenuCategories` in their own source. The slices are
 * theirs; reproducing them is what keeps our grouping identical to the grouping
 * a player sees in the K menu.
 */
const CATEGORY_SLICES = [
  ["Gathering", g(0).slice(0, 8)],
  ["Crafting & trades", g(1).filter((name) => name !== "horseriding")],
  ["Weapon Specializations", g(2).slice(0, 10)],
  ["Armor Specializations", g(3).slice(1, 6)],
  ["Magic schools", [g(3)[0], ...g(3).slice(6)]],
  ["Movement & stealth", [...g(0).slice(8, 12), "horseriding"]],
  ["Combat styles", g(4)],
  ["Performance", g(5)],
];

const skillByKey = new Map(ui.skills.map((s) => [s.key, s]));
const categoryOf = new Map();
for (const [label, keys] of CATEGORY_SLICES) {
  for (const key of keys) {
    if (key !== undefined && skillByKey.has(key)) categoryOf.set(key, label);
  }
}

const skills = ui.skills.map((skill) => ({
  key: skill.key,
  name: skill.display,
  // Their description reads "Mining: extracts ore, gems and minerals". The
  // prefix is the skill name again, so it is dropped for the summary line.
  summary: skill.description.replace(new RegExp(`^${skill.display}:\\s*`, "i"), ""),
  category: categoryOf.get(skill.key) ?? "Other",
  tiers: skill.tiers,
}));

const categories = CATEGORY_SLICES.map(([label]) => ({
  label,
  keys: skills.filter((s) => s.category === label).map((s) => s.key),
})).filter((c) => c.keys.length > 0);

const uncategorised = skills.filter((s) => s.category === "Other");
if (uncategorised.length > 0) {
  console.warn(`  warning: ${uncategorised.length} skills fell outside their own categories: ` +
    uncategorised.map((s) => s.key).join(", "));
}

/** Memory point cost per tier. Mereth's published figures; the client does not carry them. */
const tierCosts = [1, 2, 3, 5, 8];

const tiers = ui.levels.map((level, i) => ({
  name: level.name,
  color: level.color,
  cost: tierCosts[i] ?? null,
  from: (ui.tierBounds[i] ?? 0) === 0 ? 1 : (ui.tierBounds[i] ?? 0) + 1,
  to: ui.tierBounds[i + 1] ?? 100,
}));

// --- Systems, from the changelog's own clustering ---------------------------
//
// Read from `wiki-changelog.json` rather than `wiki.json`. The changelog is
// refreshed on its own in seconds (`npm run wiki:changelog`); the full sweep
// takes minutes and rebuilds things this site no longer uses, so sourcing
// anything release-shaped from it means the site goes stale between sweeps.
const systems = (changelog?.topics ?? [])
  .map((s) => ({
    name: s.name,
    blurb: s.blurb ?? null,
    count: s.count ?? 0,
    firstSeen: s.firstSeen ?? null,
    lastSeen: s.lastSeen ?? null,
  }))
  .sort((a, b) => b.count - a.count);

// --- Services, the client's own list of running subsystems -------------------
const SKIP = /^(base|core|util|helper|logger|debug|test|index)$/i;
const services = (client?.services ?? [])
  .map((s) => (typeof s === "string" ? s : s.name))
  .filter(Boolean)
  .map((s) => s.replace(/Service$/, ""))
  .filter((s) => !SKIP.test(s))
  .map(title)
  .sort((a, b) => a.localeCompare(b));

// --- Modlist and load order --------------------------------------------------
//
// The launcher manifest carries a label and an id; the sweep of the archives
// carries the author, the version and what the mod contributes. Joined on the
// Nexus mod id, because a credits page that lists mods without naming who made
// them is not a credits page.
const modMeta = new Map((wiki.mods ?? []).map((m) => [m.modId, m]));

const mods = (manifest?.modList ?? [])
  .map((m) => {
    const meta = modMeta.get(m.modId);
    const author = (meta?.author ?? "").trim();
    return {
      name: m.label ?? meta?.name ?? null,
      modId: m.modId ?? null,
      author: author === "" ? null : author,
      version: meta?.version ?? null,
      contributes: meta?.contributes ?? null,
    };
  })
  .filter((m) => m.name)
  .sort((a, b) => a.name.localeCompare(b.name));

const plugins = (manifest?.loadOrder ?? []).slice();

// --- Changelog, most recent first --------------------------------------------
//
// A fifth of the releases are internal `-dev` builds, and they mostly restate
// the notes of the public patch that follows them. Listing both puts the same
// sentence on the page twice under two version numbers, which reads like the
// changelog is broken.
//
// So fold them: a `-dev` build merges into its public version and its notes are
// deduplicated by text. Dropping them outright is not an option, because 104
// notes only ever appeared on a dev build and never got restated.
const publicVersion = (version) => version.replace(/-dev$/i, "");

const notesFor = new Map();
const seenText = new Map();
for (const bullet of changelog?.bullets ?? []) {
  if (!bullet.version || !bullet.text) continue;
  const version = publicVersion(bullet.version);
  if (!notesFor.has(version)) {
    notesFor.set(version, []);
    seenText.set(version, new Set());
  }
  const key = bullet.text.trim().toLowerCase();
  const seen = seenText.get(version);
  if (seen.has(key)) continue;
  seen.add(key);
  const list = notesFor.get(version);
  if (list.length < 16) list.push({ kind: bullet.kind ?? null, text: bullet.text });
}

// Collapse the release list the same way, keeping the newest date in each pair.
const releaseDates = new Map();
const releaseOrder = [];
for (const r of changelog?.releases ?? []) {
  if (!r.version) continue;
  const version = publicVersion(r.version);
  if (!releaseDates.has(version)) releaseOrder.push(version);
  const known = releaseDates.get(version) ?? null;
  const date = r.date ?? null;
  if (known === null || (date !== null && date > known)) releaseDates.set(version, date);
}
const releases = releaseOrder
  .map((version) => ({
    version,
    date: releaseDates.get(version) ?? null,
    notes: notesFor.get(version) ?? [],
  }))
  .filter((r) => r.notes.length > 0)
  .slice(0, 80);

// --- Alchemy -----------------------------------------------------------------
const ingredients = (deep?.ingredients ?? [])
  .filter((i) => i.name && !/^AA|^aa|Test/i.test(i.name))
  .map((i) => ({ name: i.name, effects: (i.effects ?? []).slice(0, 4) }))
  .filter((i) => i.effects.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

// --- Spells, the spellbook rather than the record table ---------------------
//
// A SPEL record is not automatically a spell anybody casts. The sweep now reads
// the casting perk out of SPIT and reports it as `castable` plus a tier, which
// is what separates the 400 spells a player can learn from the 550 creature
// abilities, quest effects, diseases and enchantments sharing the same table.
//
// Names still merge, because mods ship the same spell at many power levels and
// fourteen rows of "Lightning Bolt" is not a spellbook. The merge keeps the
// cost range and the lowest tier seen, since that is the one you learn first.
const SCHOOLS = ["Alteration", "Conjuration", "Destruction", "Illusion", "Restoration"];
const TIER_ORDER = ["Novice", "Apprentice", "Adept", "Expert", "Master"];

const spellVariants = new Map();
for (const s of deep?.spells ?? []) {
  if (!s.name || !s.school || !SCHOOLS.includes(s.school)) continue;
  if (!s.castable || !s.tier) continue;
  if (/^AA|Test|^DLC1?Test/i.test(s.name)) continue;

  const key = `${s.school}:${s.name}`;
  const found = spellVariants.get(key);
  if (found === undefined) {
    spellVariants.set(key, {
      name: s.name,
      school: s.school,
      tier: s.tier,
      cost: s.cost,
      costHigh: s.cost,
      variants: 1,
      effects: [...new Set(s.effects ?? [])].slice(0, 3),
    });
  } else {
    found.cost = Math.min(found.cost, s.cost);
    found.costHigh = Math.max(found.costHigh, s.cost);
    found.variants += 1;
    if (TIER_ORDER.indexOf(s.tier) < TIER_ORDER.indexOf(found.tier)) found.tier = s.tier;
    if (found.effects.length === 0) found.effects = [...new Set(s.effects ?? [])].slice(0, 3);
  }
}

const spells = [...spellVariants.values()].sort(
  (a, b) =>
    a.school.localeCompare(b.school) ||
    TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) ||
    a.cost - b.cost ||
    a.name.localeCompare(b.name),
);

// --- Crafting, aggregated by bench ------------------------------------------
//
// The bench field is an editor id, so the raw list is both ugly and full of
// noise: 200-odd `BYOHBuilding Interior Part…` entries with one recipe each,
// plus three buckets that are not benches at all ("unknown bench", "no bench",
// "is Alchemy", the last of which has its own page).
//
// So the benches are named explicitly rather than cleaned with a regex. An
// allow-list is longer to maintain and is the only version that cannot quietly
// start showing a reader "BYOHBuilding Trophy Base2".
const BENCHES = new Map([
  ["Blacksmith forge", "Forge"],
  ["Workbench", "Workbench"],
  ["Smelter", "Smelter"],
  ["Grindstone", "Grindstone"],
  ["Tanning rack", "Tanning rack"],
  ["MCE_Crafting Loom", "Loom"],
  ["BYOHBuilding Carpenter", "Carpenter's bench"],
  ["Cooking pot", "Cooking pot"],
  ["BYOHCrafting Oven", "Oven"],
  ["Camping_Campfire Cooking Shared", "Campfire"],
  ["Brew Crafting", "Brewing barrel"],
  ["DLC2Staff Enchanter", "Staff enchanter"],
  ["Skyforge", "Skyforge"],
  ["DLC1Crafting Dawnguard", "Dawnguard forge"],
]);

/** How many recipes each bench is shown with. The rest are reachable by search. */
const RECIPE_SAMPLE = 150;

const byBench = new Map();
const benchTotals = new Map();
for (const recipe of recipeFile?.recipes ?? []) {
  const label = BENCHES.get(recipe.bench ?? "");
  if (label === undefined || !recipe.result) continue;
  if (/^AA|Test|^DLC1?Test|^zz/i.test(recipe.result)) continue;

  benchTotals.set(label, (benchTotals.get(label) ?? 0) + 1);
  if (!byBench.has(label)) byBench.set(label, []);
  const list = byBench.get(label);
  if (list.length < RECIPE_SAMPLE) {
    list.push({
      result: recipe.result,
      count: recipe.count ?? 1,
      items: (recipe.items ?? []).slice(0, 6).map((i) => ({ name: i.name, count: i.count ?? 1 })),
      perks: (recipe.perks ?? []).slice(0, 2),
    });
  }
}

const benches = [...byBench.entries()]
  .map(([name, recipes]) => ({
    name,
    // The true count, so a page never implies that every bench holds exactly
    // the sample size.
    total: benchTotals.get(name) ?? recipes.length,
    recipes: recipes.sort((a, b) => a.result.localeCompare(b.result)),
  }))
  .filter((b) => b.recipes.length >= 3)
  .sort((a, b) => b.total - a.total);

// --- Gathering ---------------------------------------------------------------
const gathering = {
  professions: (gatheringFile?.professions ?? []).map((p) => ({
    profession: p.profession,
    colour: p.colour,
    outdoors: p.outdoors ?? 0,
  })),
  nodes: (gatheringFile?.totals ?? []).slice(0, 30),
  indoors: (gatheringFile?.indoors ?? [])
    .slice()
    .sort((a, b) => b.total - a.total)
    .slice(0, 40)
    .map((r) => ({ where: r.where, total: r.total, nodes: (r.nodes ?? []).slice(0, 4) })),
};

// --- The handbook bundle -----------------------------------------------------
const handbook = {
  builtAt: new Date().toISOString(),
  server: {
    version: changelog?.latest ?? wiki.server?.version ?? null,
    // Public releases, not raw entries. The raw count includes internal `-dev`
    // builds, which are folded above and must not be counted twice.
    releases: releaseOrder.length,
    firstRelease: changelog?.firstRelease ?? null,
    lastRelease: changelog?.lastRelease ?? null,
    checkedFiles: wiki.server?.checkedFiles ?? 0,
    loadOrderLength: (manifest?.loadOrder ?? []).length,
    recordsLoaded: wiki.totals?.recordsLoaded ?? 0,
    named: wiki.totals?.named ?? 0,
  },
  skills,
  categories,
  tiers,
  planMaxTier: ui.planMaxTier,
  memoryPoints: 18,
  needs: ui.needs.filter((n) => n.enabled !== false),
  races: ui.races,
  months: ui.months,
  accessLevels: ui.accessLevels,
  binds: facts?.interactionBinds ?? [],
  slashCommands: facts?.slashCommands ?? [],
  messages: facts?.messages ?? { rules: [], troubles: [], other: [] },
  systems,
  services,
  mods,
  plugins,
  releases,
  ingredients,
  spells,
  benches,
  gathering,
};

fs.mkdirSync(OUT_DIR, { recursive: true });

const write = (dir, name, value) => {
  const file = path.join(dir, name);
  fs.writeFileSync(file, JSON.stringify(value));
  return (fs.statSync(file).size / 1024).toFixed(0);
};

console.log(`src/data/mereth.json  ${write(OUT_DIR, "mereth.json", handbook)} KB`);
console.log(JSON.stringify({
  skills: skills.length,
  categories: categories.length,
  spells: spells.length,
  ingredients: ingredients.length,
  benches: benches.length,
  releases: releases.length,
  systems: systems.length,
  mods: mods.length,
}, null, 1));
