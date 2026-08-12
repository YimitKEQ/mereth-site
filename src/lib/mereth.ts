/**
 * Typed access to the exported Mereth bundle.
 *
 * `src/data/mereth.json` is produced by `scripts/export-mereth-data.mjs` from
 * the devkit's sweeps of Mereth's own manifest, client bundle and plugins. This
 * module is the only place that knows its shape, so a change to the export is a
 * change to one file.
 *
 * Import this from server components. A client component that needs a slice
 * should be handed that slice as a prop rather than importing the bundle, or the
 * whole 450 KB ships to the browser.
 */

import bundle from "@/data/mereth.json";

export interface Skill {
  key: string;
  name: string;
  /** Mereth's own one line description, with the repeated skill name stripped. */
  summary: string;
  category: string;
  /** Five paragraphs, Mereth's own, one per tier from Novice to Master. */
  tiers: string[];
}

export interface SkillCategory {
  label: string;
  keys: string[];
}

export interface Tier {
  name: string;
  /** Their colour for this tier, taken from the client. */
  color: string;
  /** Memory points to buy this tier as a cap. Null for Legendary, which cannot be bought. */
  cost: number | null;
  from: number;
  to: number;
}

export interface Need {
  id: string;
  label: string;
  prop: string;
  enabled: boolean;
  lowAt: number;
  criticalAt: number;
}

export interface Bind {
  action: string;
  key: string;
  pad: string;
  note: string | null;
}

export interface System {
  name: string;
  blurb: string | null;
  count: number;
  firstSeen: string | null;
  lastSeen: string | null;
}

export interface Release {
  version: string;
  date: string | null;
  notes: { kind: string | null; text: string }[];
}

export interface Ingredient {
  name: string;
  effects: string[];
}

export interface Spell {
  name: string;
  school: string;
  /** Novice through Master, read from the spell's own casting perk. */
  tier: string;
  /** The cheapest variant's magicka cost. */
  cost: number;
  /** The dearest variant's. Equal to `cost` when there is only one. */
  costHigh: number;
  /** How many records in the world's plugins carry this name. */
  variants: number;
  effects: string[];
}

export interface Recipe {
  result: string;
  count: number;
  items: { name: string; count: number }[];
  perks: string[];
}

export interface Bench {
  name: string;
  /** Every recipe this bench makes. `recipes` is a sample of it, not all of it. */
  total: number;
  recipes: Recipe[];
}

export interface GatheringNode {
  name: string;
  count: number;
}

export interface Mereth {
  builtAt: string;
  server: {
    version: string | null;
    releases: number;
    firstRelease: string | null;
    lastRelease: string | null;
    checkedFiles: number;
    loadOrderLength: number;
    recordsLoaded: number;
    named: number;
  };
  skills: Skill[];
  categories: SkillCategory[];
  tiers: Tier[];
  planMaxTier: number;
  memoryPoints: number;
  needs: Need[];
  races: string[];
  months: string[];
  accessLevels: string[];
  binds: Bind[];
  slashCommands: string[];
  messages: { rules: string[]; troubles: string[]; other: string[] };
  systems: System[];
  services: string[];
  mods: { name: string; modId: number | null }[];
  plugins: string[];
  releases: Release[];
  ingredients: Ingredient[];
  spells: Spell[];
  benches: Bench[];
  gathering: {
    professions: { profession: string; colour: string; outdoors: number }[];
    nodes: GatheringNode[];
    indoors: { where: string; total: number; nodes: GatheringNode[] }[];
  };
}

export const mereth = bundle as unknown as Mereth;

/** The five buyable tiers. Legendary is level 100 only and cannot be planned. */
export const buyableTiers = mereth.tiers.filter((t) => t.cost !== null) as (Tier & { cost: number })[];

const bySkillKey = new Map(mereth.skills.map((s) => [s.key, s]));

export function skill(key: string): Skill | null {
  return bySkillKey.get(key) ?? null;
}

/** Skills in their own menu's category order, which is not alphabetical. */
export function skillsByCategory(): { label: string; skills: Skill[] }[] {
  return mereth.categories.map((category) => ({
    label: category.label,
    skills: category.keys.map((key) => bySkillKey.get(key)).filter((s): s is Skill => s !== undefined),
  }));
}

/** Spells grouped by school, schools in the order a player meets them. */
export function spellsBySchool(): { school: string; spells: Spell[] }[] {
  const order = ["Alteration", "Conjuration", "Destruction", "Illusion", "Restoration"];
  return order
    .map((school) => ({ school, spells: mereth.spells.filter((s) => s.school === school) }))
    .filter((group) => group.spells.length > 0);
}

/**
 * Ingredients sharing at least two effects with the given one.
 *
 * Two shared effects is the alchemy rule: a potion needs a matching effect on
 * two ingredients, and a third ingredient only ever adds to that.
 */
export function pairsFor(name: string, limit = 12): { name: string; shared: string[] }[] {
  const source = mereth.ingredients.find((i) => i.name === name);
  if (source === undefined) return [];
  const wanted = new Set(source.effects);
  return mereth.ingredients
    .filter((other) => other.name !== name)
    .map((other) => ({ name: other.name, shared: other.effects.filter((e) => wanted.has(e)) }))
    .filter((match) => match.shared.length > 0)
    .sort((a, b) => b.shared.length - a.shared.length || a.name.localeCompare(b.name))
    .slice(0, limit);
}

/**
 * A client message matching a pattern, for quoting on a page.
 *
 * Quoted strings are Mereth's, verbatim, including their punctuation. They are
 * evidence, so they are never tidied to house style.
 */
export function clientSays(pattern: RegExp): string | null {
  const all = [...mereth.messages.rules, ...mereth.messages.troubles, ...mereth.messages.other];
  return all.find((message) => pattern.test(message)) ?? null;
}

/** Every release note matching a pattern, newest first, for citing a claim. */
export function citations(pattern: RegExp, limit = 3): { version: string; date: string | null; text: string }[] {
  const out: { version: string; date: string | null; text: string }[] = [];
  for (const release of mereth.releases) {
    for (const note of release.notes) {
      if (out.length >= limit) return out;
      if (pattern.test(note.text)) out.push({ version: release.version, date: release.date, text: note.text });
    }
  }
  return out;
}

export const counts = {
  skills: mereth.skills.length,
  categories: mereth.categories.length,
  spells: mereth.spells.length,
  ingredients: mereth.ingredients.length,
  recipes: mereth.benches.reduce((sum, bench) => sum + bench.total, 0),
  mods: mereth.mods.length,
  plugins: mereth.plugins.length,
  systems: mereth.systems.length,
  releases: mereth.server.releases,
  records: mereth.server.recordsLoaded,
  named: mereth.server.named,
  checkedFiles: mereth.server.checkedFiles,
} as const;
