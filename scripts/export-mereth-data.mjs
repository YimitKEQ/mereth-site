// Pull the devkit's Mereth sweeps into the website as one compact bundle.
//
//   node scripts/export-mereth-data.mjs
//
// The devkit holds ~150 MB of parsed server data. The site needs a few hundred
// kilobytes of it, so this selects and flattens rather than copying: the wiki
// pages should read one predictable shape and never know where it came from.
//
// Everything here is derived from Mereth's own published manifest, their client
// bundle and the plugins their launcher installs. Nothing is invented.

import fs from "node:fs";
import path from "node:path";

const DEVKIT = path.resolve("..", "devkit", "data");
const OUT = path.resolve("src", "data", "mereth.json");

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

// --- Systems, from the client's own service list ----------------------------
// A service is a running subsystem, so the list is the most honest possible
// answer to "what does this server actually do".
const client = read("wiki-client.json");
const SKIP = /^(base|core|util|helper|logger|debug|test|index)$/i;
const systems = (client?.services ?? [])
  .map((s) => (typeof s === "string" ? s : s.name))
  .filter(Boolean)
  .map((s) => s.replace(/Service$/, ""))
  .filter((s) => !SKIP.test(s))
  .map(title)
  .sort((a, b) => a.localeCompare(b));

// --- Modlist, from the launcher manifest -------------------------------------
const manifest = read("mereth-manifest.json");
// `modList` carries the human labels; `mods` is the file manifest with sizes.
// Joined on nothing, so they are reported side by side rather than merged.
const mods = (manifest?.modList ?? [])
  .map((m) => ({ name: m.label ?? null, modId: m.modId ?? null }))
  .filter((m) => m.name)
  .sort((a, b) => a.name.localeCompare(b.name));

const plugins = (manifest?.loadOrder ?? []).slice();

// --- Changelog, most recent first --------------------------------------------
const changelog = read("wiki-changelog.json");
// Releases carry only a version and a date; the notes live in a flat bullet
// list keyed by version, so they are regrouped here.
const notesFor = new Map();
for (const bullet of changelog?.bullets ?? []) {
  if (!bullet.version || !bullet.text) continue;
  if (!notesFor.has(bullet.version)) notesFor.set(bullet.version, []);
  const list = notesFor.get(bullet.version);
  if (list.length < 16) list.push({ kind: bullet.kind ?? null, text: bullet.text });
}
const releases = (changelog?.releases ?? [])
  .slice(0, 30)
  .map((r) => ({ version: r.version, date: r.date ?? null, notes: notesFor.get(r.version) ?? [] }))
  .filter((r) => r.notes.length > 0);

/** The topics the changelog itself clusters around: what is worked on most. */
const topics = (changelog?.topics ?? [])
  .map((t) => (typeof t === "string" ? { name: t, count: 0 } : { name: t.name ?? t.term, count: t.count ?? t.hits ?? 0 }))
  .filter((t) => t.name)
  .sort((a, b) => b.count - a.count)
  .slice(0, 18);

// --- Alchemy -----------------------------------------------------------------
const deep = read("wiki-deep.json");
const ingredients = (deep?.ingredients ?? [])
  .filter((i) => i.name && !/^AA|^aa|Test/i.test(i.name))
  .map((i) => ({ name: i.name, effects: (i.effects ?? []).slice(0, 4) }))
  .filter((i) => i.effects.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

// --- Spells, grouped by school ----------------------------------------------
const spells = (deep?.spells ?? [])
  .filter((s) => s.name && s.school && !/^AA|Test/i.test(s.name))
  .map((s) => ({ name: s.name, school: s.school, cost: s.cost ?? 0 }))
  .sort((a, b) => a.school.localeCompare(b.school) || a.cost - b.cost);

// --- Crafting, aggregated by bench ------------------------------------------
const recipeFile = read("wiki-recipes.json");
const byBench = new Map();
for (const recipe of recipeFile?.recipes ?? []) {
  const bench = recipe.bench ?? recipe.benchName ?? "Unknown";
  if (!byBench.has(bench)) byBench.set(bench, []);
  const list = byBench.get(bench);
  if (list.length < 60 && recipe.result) {
    list.push({
      result: recipe.result,
      count: recipe.count ?? 1,
      inputs: (recipe.inputs ?? recipe.ingredients ?? [])
        .map((i) => (typeof i === "string" ? i : `${i.count ?? 1}x ${i.name}`))
        .slice(0, 6),
    });
  }
}
const benches = [...byBench.entries()]
  .map(([name, list]) => ({ name, recipes: list }))
  .filter((b) => b.recipes.length > 0 && b.name !== "Unknown")
  .sort((a, b) => b.recipes.length - a.recipes.length)
  .slice(0, 12);

const bundle = {
  builtAt: new Date().toISOString(),
  counts: {
    plugins: plugins.length,
    topics: topics.length,
    systems: systems.length,
    mods: mods.length,
    releases: releases.length,
    ingredients: ingredients.length,
    spells: spells.length,
    benches: benches.length,
  },
  systems,
  mods,
  plugins,
  releases,
  topics,
  ingredients,
  spells,
  benches,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(bundle));
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(`wrote ${OUT} (${kb} KB)`);
console.log(JSON.stringify(bundle.counts, null, 1));
