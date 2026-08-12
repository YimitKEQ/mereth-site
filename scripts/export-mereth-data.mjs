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
//   src/data/mereth.json      the handbook. Imported by server components, so it
//                             never reaches the browser except as the slice a
//                             page actually renders.
//   public/data/catalog.json  the searchable record catalogue. Too large to ship
//                             with a page, so it is served as a static file and
//                             fetched on the database route's first search.
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
const systems = (wiki.systems ?? [])
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
const mods = (manifest?.modList ?? [])
  .map((m) => ({ name: m.label ?? null, modId: m.modId ?? null }))
  .filter((m) => m.name)
  .sort((a, b) => a.name.localeCompare(b.name));
const plugins = (manifest?.loadOrder ?? []).slice();

// --- Changelog, most recent first --------------------------------------------
const notesFor = new Map();
for (const bullet of changelog?.bullets ?? []) {
  if (!bullet.version || !bullet.text) continue;
  if (!notesFor.has(bullet.version)) notesFor.set(bullet.version, []);
  const list = notesFor.get(bullet.version);
  if (list.length < 16) list.push({ kind: bullet.kind ?? null, text: bullet.text });
}
const releases = (changelog?.releases ?? [])
  .slice(0, 40)
  .map((r) => ({ version: r.version, date: r.date ?? null, notes: notesFor.get(r.version) ?? [] }))
  .filter((r) => r.notes.length > 0);

// --- Alchemy -----------------------------------------------------------------
const ingredients = (deep?.ingredients ?? [])
  .filter((i) => i.name && !/^AA|^aa|Test/i.test(i.name))
  .map((i) => ({ name: i.name, effects: (i.effects ?? []).slice(0, 4) }))
  .filter((i) => i.effects.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

// --- Spells, grouped by school ----------------------------------------------
//
// The raw SPEL list is not a spellbook. It also carries creature abilities
// ("Werewolf Claws"), diseases ("Ataxia"), standing stone effects and armour
// enchantments, and it holds 130 duplicate names because mods ship the same
// spell at a dozen power levels.
//
// Two filters and a merge turn it into something a player can read:
//
//   cost 0            never a castable spell here. Every real one, checked
//                     against Candlelight, Magelight, Healing, Oakflesh,
//                     Clairvoyance and Muffle, has a magicka cost.
//   "... of Eminent"  vanilla enchantment naming, not a spell.
//   merge by name     one row per spell, with the range of costs the variants
//                     span, because "Flames" existing at 5 and at 343 is a real
//                     fact about the world rather than two spells.
const SCHOOLS = ["Alteration", "Conjuration", "Destruction", "Illusion", "Restoration"];
const ENCHANT_NAME = / of (Eminent|Major|Minor|Extreme|Peerless|Waning|Grand|Petty|Lesser|Greater|Common) /i;

const spellVariants = new Map();
for (const s of deep?.spells ?? []) {
  if (!s.name || !s.school || !SCHOOLS.includes(s.school)) continue;
  if (/^AA|Test|^DLC1?Test/i.test(s.name)) continue;
  if ((s.cost ?? 0) <= 0) continue;
  if (ENCHANT_NAME.test(`${s.name} `)) continue;

  const key = `${s.school}:${s.name}`;
  const found = spellVariants.get(key);
  if (found === undefined) {
    spellVariants.set(key, {
      name: s.name,
      school: s.school,
      cost: s.cost,
      costHigh: s.cost,
      variants: 1,
      effects: [...new Set(s.effects ?? [])].slice(0, 3),
    });
  } else {
    found.cost = Math.min(found.cost, s.cost);
    found.costHigh = Math.max(found.costHigh, s.cost);
    found.variants += 1;
    if (found.effects.length === 0) found.effects = [...new Set(s.effects ?? [])].slice(0, 3);
  }
}

const spells = [...spellVariants.values()].sort(
  (a, b) => a.school.localeCompare(b.school) || a.cost - b.cost || a.name.localeCompare(b.name),
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

// --- One of a kind gear ------------------------------------------------------
//
// An item standing in exactly one named interior is findable by going there.
// An empty result is never proof of "unobtainable"; the site says so on the page.
const oneOfAKind = (secrets?.found ?? [])
  .filter((r) => r.count === 1 && r.spots?.[0] &&
    r.spots[0].cell !== "outdoors" && r.spots[0].cell !== "unnamed cell")
  .filter((r) => /WEAP|ARMO/.test(r.signature))
  .slice(0, 120)
  .map((r) => ({ name: r.name, kind: r.signature === "WEAP" ? "Weapon" : "Armour", where: r.spots[0].cell }));

// --- The handbook bundle -----------------------------------------------------
const handbook = {
  builtAt: new Date().toISOString(),
  server: {
    version: wiki.server?.version ?? null,
    releases: wiki.server?.releaseCount ?? 0,
    firstRelease: wiki.server?.firstRelease ?? null,
    lastRelease: wiki.server?.lastRelease ?? null,
    checkedFiles: wiki.server?.checkedFiles ?? 0,
    loadOrderLength: wiki.server?.loadOrderLength ?? 0,
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
  oneOfAKind,
};

// --- The catalogue, for the database route -----------------------------------
//
// `wiki.catalog` is [name, signature, modIndex, editorId]. Signature labels come
// from the same file so the page never hardcodes a four letter code.
const labelFor = new Map((wiki.signatures ?? []).map((s) => [s.signature, s.label]));
const groupFor = new Map();
for (const [group, sigs] of Object.entries(wiki.signatureGroups ?? {})) {
  for (const sig of sigs) groupFor.set(sig, group);
}

/*
 * Two sources, because neither is complete on its own.
 *
 * The codex walks record definitions and is thin exactly where a player cares:
 * 70 MISC items in the whole province, which is why on its own it cannot find
 * a single ingot. The placement sweep walks what actually stands in the world
 * and carries about 7,600 names the codex never saw.
 *
 * Merged and deduplicated on name plus signature, so a thing named in both
 * appears once.
 */
const seen = new Set();
const records = [];
const addRecord = (name, signature) => {
  if (!name || !signature) return;
  const clean = String(name).trim();
  if (clean === "" || /^AA|^aa[A-Z]|Test|^zz|^DELETE/i.test(clean)) return;
  const key = `${clean} ${signature}`;
  if (seen.has(key)) return;
  seen.add(key);
  records.push([clean, signature]);
};

for (const [name, signature] of wiki.catalog ?? []) addRecord(name, signature);
for (const row of secrets?.found ?? []) addRecord(row.name, row.signature);
for (const row of secrets?.never ?? []) addRecord(row.name, row.signature);
records.sort((a, b) => a[0].localeCompare(b[0]));

/** Counts are recounted from the merged set rather than carried over. */
const signatureCounts = new Map();
for (const [, signature] of records) {
  signatureCounts.set(signature, (signatureCounts.get(signature) ?? 0) + 1);
}

const catalog = {
  builtAt: handbook.builtAt,
  signatures: [...signatureCounts.entries()]
    .filter(([signature]) => labelFor.has(signature))
    .map(([signature, count]) => ({
      signature,
      label: labelFor.get(signature) ?? signature,
      group: groupFor.get(signature) ?? "Other",
      count,
    }))
    .sort((a, b) => b.count - a.count),
  records,
};

const PUBLIC_DIR = path.resolve("public", "data");
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

const write = (dir, name, value) => {
  const file = path.join(dir, name);
  fs.writeFileSync(file, JSON.stringify(value));
  return (fs.statSync(file).size / 1024).toFixed(0);
};

// The searchable total belongs to the handbook, because the Records page states
// it before the catalogue has finished loading. Set after the merge so the two
// numbers can never disagree.
handbook.server.searchable = records.length;

console.log(`src/data/mereth.json      ${write(OUT_DIR, "mereth.json", handbook)} KB`);
console.log(`public/data/catalog.json  ${write(PUBLIC_DIR, "catalog.json", catalog)} KB`);
console.log(JSON.stringify({
  skills: skills.length,
  categories: categories.length,
  spells: spells.length,
  ingredients: ingredients.length,
  benches: benches.length,
  releases: releases.length,
  systems: systems.length,
  mods: mods.length,
  oneOfAKind: oneOfAKind.length,
  records: records.length,
}, null, 1));
