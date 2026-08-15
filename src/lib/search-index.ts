import { faqSections } from "@/lib/handbook/faq";
import { qaSections } from "@/lib/handbook/qa";
import { guide } from "@/lib/handbook/guide";
import { progression } from "@/lib/handbook/progression";
import { survival } from "@/lib/handbook/survival";
import { tips } from "@/lib/handbook/tips";
import { hashHref } from "@/lib/hash";
import { mereth } from "@/lib/mereth";
import { allNavLinks } from "@/lib/site";
import { factions } from "@/lib/world/factions";
import { holds } from "@/lib/world/holds";
import { swapGroups } from "@/lib/world/language";
import { ruleSections } from "@/lib/world/rules";
import { loreDocuments } from "@/lib/world/lore";

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
 *
 * Every href has to be one the destination can actually honour. The codex
 * pages are tabbed and only the open tab is in the DOM, so a link that names
 * no tab lands on whichever one happens to be first: the right page, the wrong
 * view, nothing found. `hashHref` writes the grammar those pages read, which
 * is why the tab id comes before the search term rather than a `?q=` after it.
 * See `src/lib/hash.ts` for why a fragment and not a query string.
 */

export type EntryKind =
  | "page"
  | "skill"
  | "answer"
  | "section"
  | "spell"
  | "ingredient"
  | "recipe"
  | "profession"
  | "rule"
  | "phrase"
  | "place"
  | "faction";

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

  /* The skill anchors are real ids, but they are rendered inside the "all"
     tab, so naming the skill alone resolved to nothing while the planner was
     the tab on screen. The tab first, then the name as the term. */
  for (const skill of mereth.skills) {
    entries.push({
      label: skill.name,
      kind: "skill",
      href: hashHref("/skills", "all", { q: skill.name }),
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

  // The Q&A answers a different kind of question from the FAQ, so its entries say
  // so: a search for "fishing" should not put an intention and a rule side by side
  // looking identical.
  for (const section of qaSections) {
    for (const item of section.items) {
      entries.push({
        label: item.q,
        kind: "answer",
        href: `/qa#${section.id}`,
        sub: "Latest Q&A, " + section.title,
      });
    }
  }

  for (const [page, path] of [
    [guide, "/guide"],
    [tips, "/tips"],
    [progression, "/progression"],
    [survival, "/survival"],
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

  /*
   * The lore documents. Eleven pages of real writing that the palette could
   * not find: searching "Skyforge" or "Vigilant" returned nothing, because the
   * only lore entry was the index page itself.
   */
  for (const document of loreDocuments) {
    entries.push({
      label: document.title,
      kind: "section",
      href: `/lore/${document.slug}`,
      sub: document.note,
      terms: document.paragraphs.slice(0, 2).join(" ").slice(0, 400),
    });
  }

  for (const spell of mereth.spells) {
    entries.push({
      label: spell.name,
      kind: "spell",
      href: hashHref("/magic", "spells", { q: spell.name }),
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
      href: hashHref("/crafting", "alchemy", { q: ingredient.name }),
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
        href: hashHref("/crafting", "benches", { bench: bench.name, q: recipe.result }),
        sub: `Made at the ${bench.name.toLowerCase()}`,
        terms: recipe.items.map((i) => i.name).join(" "),
      });
    }
  }

  // The phrase somebody is about to say out of character is exactly what they
  // would type into the palette, so the swaps are indexed on the out-of-character
  // side. Searching "respawn", "level" or "grind" lands on the line that says
  // what to say instead.
  for (const group of swapGroups) {
    for (const swap of group.swaps) {
      entries.push({
        label: swap.ooc,
        kind: "phrase",
        href: `/language#${group.id}`,
        sub: `Say instead: ${swap.ic}`,
        terms: `${swap.ooc} ${swap.ic} ${swap.why ?? ""}`,
      });
    }
  }

  for (const section of ruleSections) {
    for (const rule of section.rules) {
      entries.push({
        label: `${rule.code} ${rule.text.slice(0, 70)}${rule.text.length > 70 ? "..." : ""}`,
        kind: "rule",
        href: `/rules#${section.id}`,
        sub: section.title,
        terms: rule.text,
      });
    }
  }

  for (const hold of holds) {
    entries.push({
      label: hold.name,
      kind: "place",
      href: "/holds",
      sub: hold.jarl === null ? `Seat of ${hold.seat}` : `${hold.seat}, ${hold.jarl}`,
      terms: hold.seat,
    });
  }

  for (const faction of factions) {
    entries.push({
      label: faction.name,
      kind: "faction",
      href: "/factions",
      sub: faction.standing,
    });
  }

  for (const profession of mereth.gathering.professions) {
    entries.push({
      label: profession.profession,
      kind: "profession",
      href: hashHref("/crafting", "gathering"),
      sub: `${profession.outdoors.toLocaleString("en-GB")} nodes standing outdoors`,
    });
  }

  return entries;
}
