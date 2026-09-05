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

// --- Changelog, carried over ---------------------------------------------------
//
// This script does not build the changelog and must not try to. `sync-releases.mjs`
// owns it, reads it live from Mereth's GitHub releases, and runs immediately
// after this on every build.
//
// It used to be assembled here as well, out of the devkit's `wiki-changelog.json`,
// which comes from a sweep somebody has to remember to run. That produced two
// copies of the same folding rules that then drifted apart, and the copy here
// was fed by whichever sweep ran last: on 12 August it stopped running, and the
// site served a changelog eighteen days and fifty patches behind while looking
// perfectly healthy. Both problems have one cause, which is that the same job
// was being done twice.
//
// So the previous bundle's changelog is carried forward untouched, and the sync
// corrects it a moment later. The carry matters because the sync deliberately
// fails soft: if GitHub is down mid-build, the site keeps the notes it had
// rather than publishing an empty page.
const previous = (() => {
  const file = path.join(OUT_DIR, "mereth.json");
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
})();

const releases = previous?.releases ?? [];

// --- Alchemy -----------------------------------------------------------------
// Deduplicated by name. Two ingredients ship twice with byte-identical
// effects, which gave the alchemy bench duplicate React keys and two rows that
// selected as one.
const ingredientByName = new Map();
for (const i of deep?.ingredients ?? []) {
  if (!i.name || /^AA|^aa|Test/i.test(i.name)) continue;
  const effects = (i.effects ?? []).slice(0, 4);
  if (effects.length === 0) continue;
  if (!ingredientByName.has(i.name)) ingredientByName.set(i.name, { name: i.name, effects });
}
const ingredients = [...ingredientByName.values()].sort((a, b) => a.name.localeCompare(b.name));

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

// --- Client messages, filtered to the ones a player can act on ---------------
//
// The sweep pulls strings out of the client by scanning it, which means it also
// pulls out things the client says to itself. Its buckets are not trustworthy:
// "The listener must be a function" is a JavaScript runtime error and it arrives
// filed under `rules`, next to "Assign Lockpicking in your skill plan".
//
// That got published. Until this was written, the guide's troubleshooting list
// opened with `(belongs at load order #` and `(no plugin at load index`, two
// halves of sentences the scanner had cut in the middle, rendered in monospace
// under the words "these are its own messages". Both render sites tried to
// defend themselves with a regex whitelist and both let those two through,
// which is the argument for filtering here instead: once, at the edge, where
// the untrusted data comes in, rather than at each place that displays it.
//
// Everything dropped is printed at the end of the run. A silent filter is how
// you end up unable to explain why a real message stopped appearing.
const DEV_ONLY =
  /listener must be a function|Dynamic cast|Generator is already|loadUrl|CreateActor|auth data|serverinfo|server-info-ignore|public keys configured|signature \(no signer\)|Gamemode updates|fresh auth screen|^Gets |^Applied |^Applying |Failed to (call|read|write|get|apply)|texture set|file info for/i;

/** Ends on a word that cannot end a sentence, so the scanner cut it short. */
const CUT_SHORT = /\b(at|to|the|of|for|with|from|has|missing|remove|enable|attempt|index)$/i;

const dropped = [];

function playerFacing(messages) {
  const keep = (text) => {
    if (typeof text !== "string") return false;
    const line = text.trim();
    // A leading bracket is always the middle of a sentence here, never the start.
    if (line.startsWith("(") || line.length < 12 || DEV_ONLY.test(line) || CUT_SHORT.test(line)) {
      dropped.push(line);
      return false;
    }
    return true;
  };

  return Object.fromEntries(
    Object.entries(messages).map(([bucket, lines]) => [bucket, (lines ?? []).filter(keep)]),
  );
}

// --- The handbook bundle -----------------------------------------------------
const handbook = {
  builtAt: new Date().toISOString(),
  server: {
    // Every changelog figure is carried over rather than recomputed, for the
    // reason above: `sync-releases.mjs` owns them and overwrites all five on the
    // next line of the build. Falling back to the devkit sweep is what let a
    // stale number onto the site in the first place.
    version: previous?.server?.version ?? changelog?.latest ?? wiki.server?.version ?? null,
    releases: previous?.server?.releases ?? 0,
    tags: previous?.server?.tags ?? 0,
    firstRelease: previous?.server?.firstRelease ?? changelog?.firstRelease ?? null,
    lastRelease: previous?.server?.lastRelease ?? changelog?.lastRelease ?? null,
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
  messages: playerFacing(facts?.messages ?? { rules: [], troubles: [], other: [] }),
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

// --- No dashes, anywhere --------------------------------------------------
//
// House rule for every Mereth surface: no em dashes and no en dashes in
// published text. Roughly fifty strings arrive carrying one, and they are not
// ours to rewrite by hand: they are Mereth's own client text, quoted verbatim
// so a player can match what the game says. So the punctuation is normalised
// here, at the boundary, once. Do it on the page instead and the next string
// the client adds walks straight past.
//
// The dash is doing one of three jobs, and each gets the punctuation it earned:
// a label introducing its definition takes a colon, a joined afterthought takes
// a comma, and two whole clauses become two sentences.
const JOINERS = /^(and|but|or|so|yet|nor|then|though|although)\b/i;
const CLAUSE_OPENERS =
  /^(you|i|we|they|he|she|it|the|this|that|there|nothing|everything|your|their|its|use|check|wait|assign|learn|keep|ask|see|read|expect|bring|do)\b/i;

/** Words since the last full stop. A short run reads as a label. */
const leadWords = (before) => {
  const clause = before.split(/(?<=[.!?])\s+/).pop() ?? before;
  return clause.trim().split(/\s+/).filter(Boolean).length;
};

/*
 * Written as escapes rather than as the characters themselves, so this file
 * stays free of the thing it exists to remove. A grep for a stray dash in the
 * codebase should come back empty, including here.
 */
const DASH = new RegExp("[\u2014\u2013]");
const DASH_WITH_SPACE = new RegExp("(\\s*)[\\u2014\\u2013](\\s*)", "g");

const undash = (text) => {
  if (typeof text !== "string" || !DASH.test(text)) return text;

  let out = text.replace(DASH_WITH_SPACE, (match, spaceBefore, spaceAfter, offset, whole) => {
    const before = whole.slice(0, offset);
    const after = whole.slice(offset + match.length);
    const spaced = spaceBefore.length > 0 || spaceAfter.length > 0;

    // A dash straight after a full stop or a closing quote is only a pause.
    if (/[.!?]["'”]?\s*$/.test(before)) return " ";

    // A second colon in one sentence reads worse than the dash did.
    const clause = before.split(/(?<=[.!?])\s+/).pop() ?? before;
    const colonFree = !clause.includes(":");

    if (leadWords(before) <= 4 && colonFree) return ": ";
    if (JOINERS.test(after)) return ", ";
    if (spaced) return ". ";
    if (colonFree && CLAUSE_OPENERS.test(after)) return ": ";
    return ", ";
  });

  // Capitalise whatever now opens a sentence, then tidy the seams.
  out = out.replace(
    /([.!?]["'”]?)(\s+)([a-z])/g,
    (_m, stop, gap, letter) => `${stop}${gap}${letter.toUpperCase()}`,
  );
  return out
    .replace(/\s+([,.:;!?])/g, "$1")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
};

/** Walk every string in the bundle. Keys are untouched, only values. */
const undashDeep = (value) => {
  if (typeof value === "string") return undash(value);
  if (Array.isArray(value)) return value.map(undashDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, undashDeep(v)]));
  }
  return value;
};

const clean = undashDeep(handbook);
const remaining = (JSON.stringify(clean).match(new RegExp("[\u2014\u2013]", "g")) ?? []).length;
if (remaining > 0) throw new Error(`${remaining} dashes survived normalisation`);

fs.mkdirSync(OUT_DIR, { recursive: true });

const write = (dir, name, value) => {
  const file = path.join(dir, name);
  fs.writeFileSync(file, JSON.stringify(value));
  return (fs.statSync(file).size / 1024).toFixed(0);
};

console.log(`src/data/mereth.json  ${write(OUT_DIR, "mereth.json", clean)} KB`);

if (dropped.length > 0) {
  console.log(`\nheld back ${dropped.length} client string(s) as not player facing:`);
  for (const line of dropped) console.log(`  ${line}`);
  console.log(
    "If one of those is a real message, loosen the filter in this script rather than\n" +
      "quoting it from a page. See src/lib/handbook/client-messages.ts.",
  );
}
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
