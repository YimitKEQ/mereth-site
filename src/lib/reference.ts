import bundle from "@/data/mereth.json";

/**
 * The reference datasets, all derived from Mereth's own published manifest,
 * their client bundle and the plugins their launcher installs.
 *
 * Each set is normalised to the same row shape so one table component renders
 * all of them. `facet` is the column the sidebar filters on, when there is one
 * worth filtering by.
 */

export interface ReferenceRow {
  key: string;
  cells: string[];
  facet?: string;
  /** Everything searchable, pre-lowered so filtering stays cheap. */
  haystack: string;
}

export interface ReferenceSet {
  slug: string;
  title: string;
  blurb: string;
  columns: string[];
  facetLabel?: string;
  rows: ReferenceRow[];
  /** Where the numbers came from, shown at the foot of the table. */
  provenance: string;
}

interface Bundle {
  counts: Record<string, number>;
  systems: string[];
  mods: { name: string; modId: number | null }[];
  plugins: string[];
  releases: { version: string; date: string | null; notes: { kind: string | null; text: string }[] }[];
  topics: { name: string; count: number }[];
  ingredients: { name: string; effects: string[] }[];
  spells: { name: string; school: string; cost: number }[];
  benches: { name: string; recipes: { result: string; count: number; inputs: string[] }[] }[];
}

const data = bundle as unknown as Bundle;

const row = (key: string, cells: string[], facet?: string): ReferenceRow => ({
  key,
  cells,
  ...(facet === undefined ? {} : { facet }),
  haystack: [...cells, facet ?? ""].join(" ").toLowerCase(),
});

export const referenceSets: readonly ReferenceSet[] = [
  {
    slug: "systems",
    title: "Systems",
    blurb:
      "Every subsystem the client runs. This is the most honest answer to what the server actually does, because a service that is not running does not appear here.",
    columns: ["System"],
    rows: data.systems.map((name) => row(name, [name])),
    provenance: `${data.counts.systems} services read from the shipped client bundle.`,
  },
  {
    slug: "spells",
    title: "Spells",
    blurb:
      "Every spell in the load order, with its school and magicka cost. Remember that knowing a spell exists is not the same as being able to cast it: someone has to teach you.",
    columns: ["Spell", "Magicka"],
    facetLabel: "School",
    rows: data.spells.map((s) =>
      row(`${s.school}-${s.name}`, [s.name, s.cost > 0 ? String(s.cost) : "—"], s.school),
    ),
    provenance: `${data.counts.spells} spells parsed from the plugins the launcher installs.`,
  },
  {
    slug: "alchemy",
    title: "Alchemy",
    blurb:
      "Ingredients and their four effects. Two ingredients that share an effect will combine, which is the whole of the craft and the reason this table is worth a bookmark.",
    columns: ["Ingredient", "Effects"],
    rows: data.ingredients.map((i) => row(i.name, [i.name, i.effects.join(", ")])),
    provenance: `${data.counts.ingredients} ingredients parsed from the plugins the launcher installs.`,
  },
  {
    slug: "crafting",
    title: "Crafting",
    blurb:
      "What each bench makes and what it takes. Benches are listed by how much they can produce, so the ones a working trade runs on come first.",
    columns: ["Bench", "Makes", "From"],
    facetLabel: "Bench",
    rows: data.benches.flatMap((bench) =>
      bench.recipes.map((recipe, index) =>
        row(
          `${bench.name}-${recipe.result}-${index}`,
          [bench.name, recipe.count > 1 ? `${recipe.count}x ${recipe.result}` : recipe.result, recipe.inputs.join(", ") || "—"],
          bench.name,
        ),
      ),
    ),
    provenance: `${data.counts.benches} benches, from the crafting recipes in the load order.`,
  },
  {
    slug: "modlist",
    title: "Modlist",
    blurb:
      "Everything the launcher installs. You do not assemble any of this by hand, and the load order is managed so it matches the server exactly.",
    columns: ["Mod"],
    rows: data.mods.map((m) => row(String(m.modId ?? m.name), [m.name])),
    provenance: `${data.counts.mods} mods and ${data.counts.plugins} plugins in the published manifest.`,
  },
  {
    slug: "plugins",
    title: "Load order",
    blurb:
      "The plugin order, exactly as the server loads it. If your client and the server disagree here, nothing else will work, which is why the launcher owns it.",
    columns: ["#", "Plugin"],
    rows: data.plugins.map((name, index) => row(name, [String(index + 1).padStart(3, "0"), name])),
    provenance: `${data.counts.plugins} plugins in load order.`,
  },
];

export function referenceSet(slug: string): ReferenceSet | undefined {
  return referenceSets.find((set) => set.slug === slug);
}

export const releases = data.releases;
export const topics = data.topics;
export const counts = data.counts;
