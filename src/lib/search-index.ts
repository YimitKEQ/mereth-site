import { faqSections } from "@/lib/handbook/faq";
import { guide } from "@/lib/handbook/guide";
import { tips } from "@/lib/handbook/tips";
import { mereth } from "@/lib/mereth";
import { allNavLinks } from "@/lib/site";

/**
 * The index behind the command palette.
 *
 * Built on the server and served as one static JSON document, because the
 * alternative (shipping `mereth.json` to the browser so the palette can index it
 * there) costs 450 KB on every page load to power a feature most visits never
 * open. The palette fetches this once, on first open.
 *
 * Entries are deliberately terse. A palette row shows a label, a kind and one
 * line of context, so anything else is weight for no gain.
 */

export type EntryKind =
  | "page"
  | "skill"
  | "answer"
  | "section"
  | "spell"
  | "ingredient"
  | "recipe"
  | "profession";

export interface SearchEntry {
  /** What the row shows and what the query matches against. */
  label: string;
  kind: EntryKind;
  href: string;
  /** One line of context under the label. */
  sub?: string;
  /** Extra words that should match but need not be shown. */
  terms?: string;
}

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const link of allNavLinks) {
    entries.push({ label: link.label, kind: "page", href: link.href, sub: link.hint });
  }

  for (const skill of mereth.skills) {
    entries.push({
      label: skill.name,
      kind: "skill",
      href: `/skills#${skill.key}`,
      sub: skill.summary,
      terms: skill.category,
    });
  }

  for (const section of faqSections) {
    for (const item of section.items) {
      entries.push({
        label: item.q,
        kind: "answer",
        href: `/faq#${section.id}`,
        sub: section.title,
      });
    }
  }

  for (const [page, path] of [
    [guide, "/guide"],
    [tips, "/tips"],
  ] as const) {
    for (const section of page.sections) {
      entries.push({
        label: section.title,
        kind: "section",
        href: `${path}#${section.id}`,
        sub: page.title,
      });
    }
  }

  for (const spell of mereth.spells) {
    entries.push({
      label: spell.name,
      kind: "spell",
      href: `/magic?q=${encodeURIComponent(spell.name)}`,
      sub:
        spell.cost === spell.costHigh
          ? `${spell.school}, ${spell.cost} magicka`
          : `${spell.school}, ${spell.cost} to ${spell.costHigh} magicka`,
      terms: spell.effects.join(" "),
    });
  }

  for (const ingredient of mereth.ingredients) {
    entries.push({
      label: ingredient.name,
      kind: "ingredient",
      href: `/crafting?ingredient=${encodeURIComponent(ingredient.name)}`,
      sub: ingredient.effects.slice(0, 2).join(", "),
      terms: ingredient.effects.join(" "),
    });
  }

  // Recipes repeat across benches; the first bench that makes a thing is the
  // one worth linking to, so later duplicates are dropped.
  const seenRecipe = new Set<string>();
  for (const bench of mereth.benches) {
    for (const recipe of bench.recipes) {
      if (seenRecipe.has(recipe.result)) continue;
      seenRecipe.add(recipe.result);
      entries.push({
        label: recipe.result,
        kind: "recipe",
        href: `/crafting?bench=${encodeURIComponent(bench.name)}&q=${encodeURIComponent(recipe.result)}`,
        sub: `Made at the ${bench.name.toLowerCase()}`,
        terms: recipe.items.map((i) => i.name).join(" "),
      });
    }
  }

  for (const profession of mereth.gathering.professions) {
    entries.push({
      label: profession.profession,
      kind: "profession",
      href: "/crafting#gathering",
      sub: `${profession.outdoors.toLocaleString("en-GB")} nodes standing outdoors`,
    });
  }

  return entries;
}
