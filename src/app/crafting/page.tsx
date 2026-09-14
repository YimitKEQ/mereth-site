import type { Metadata } from "next";

import { AlchemyBench } from "@/components/codex/AlchemyBench";
import { CodexHeader } from "@/components/codex/CodexHeader";
import { RecipeBrowser } from "@/components/codex/RecipeBrowser";
import { Tabs } from "@/components/codex/Tabs";
import { Blocks } from "@/components/handbook/Blocks";
import { PlateImage } from "@/components/ui/Plate";
import { pageMeta } from "@/lib/seo";
import { counts, mereth } from "@/lib/mereth";
import type { Block } from "@/lib/handbook/blocks";

export const metadata: Metadata = pageMeta({
  path: "/crafting",
  title: "Crafting",
  description:
    "Mereth's benches and what comes off them, an alchemy bench that shows what two ingredients actually brew, and where the gathering nodes stand.",
});

const gathering: Block[] = [
  {
    kind: "prose",
    paragraphs: [
      `Gathering is eight separate skills, not one. Each has its own nodes placed around the
        province, and each tier of each skill names exactly which materials open up: mining moves
        from iron through corundum and quicksilver to moonstone and ebony, fishing changes which
        bait works, saltmaking starts at sea salt and ends at void salts.`,
      `That text is the honest answer to "is another point worth it", so it is reproduced in full
        on the [skills page](/skills).`,
    ],
  },
  {
    kind: "note",
    tone: "key",
    title: "Carry weight is the first thing worth crafting",
    body: `A 200 carry weight chest comes off the carpentry bench at level 5 and needs materials
      from several other professions, which makes it a trade good as much as a personal upgrade. A
      50 carry weight satchel comes from leatherworking at 5 for considerably less.`,
  },
  {
    kind: "note",
    tone: "warn",
    title: "An ordinary container is not storage",
    body: `Containers regenerate their contents, so anything left in one may not survive. Bind it to
      a parcel through the holdstone and it stops regenerating. That is what makes a chest yours.`,
  },
];

/**
 * What moved in the workshop between late August and mid September.
 *
 * Four patches rearranged which bench owns what, what a repair needs, and where
 * gold comes from. None of it is visible in the recipe browser, which shows the
 * records rather than the rules on top of them, so it is written out.
 */
const workshop: Block[] = [
  {
    kind: "note",
    tone: "key",
    title: "The forge only shows you what you can make",
    body: `Since 0.71.0 the forge gates armour, weapons and jewellery by skill and separates them,
      so a recipe you cannot use is not in the list at all. An empty-looking forge usually means the
      skill, not a bug. Several light armours also moved off it: **if a piece is mostly leather it
      is leatherworking now**, while mail and chitin stayed on the forge.`,
  },
  {
    kind: "prose",
    paragraphs: [
      `**Repair stopped being a smith's monopoly.** Tailoring, leatherworking and carpentry can all
        repair the things they make, every custom item got a repair recipe, and 0.72.9 validated
        2,672 recipes to find the ones that had none. In 0.72.34 the **Arcane Blacksmith
        requirement was dropped entirely**, so an enchanted item is now simply repairable.`,
      `**Jewellery was rebuilt** into a proper tiered progression in 0.71.0, and **tailoring took
        46 new recipes** in 0.72.30.`,
    ],
  },
  {
    kind: "note",
    tone: "key",
    title: "Hunting now feeds the soft trades",
    body: `Hides drop from far more creatures than they used to, and the materials behind linen and
      spider silk drop out in the world as well, deliberately, so that **hunting feeds tailoring and
      leatherworking** instead of only feeding the forge. If you have been buying cloth, go hunting.`,
  },
  {
    kind: "prose",
    paragraphs: [
      `**Writs are how a faction owns a recipe.** Faction armour, racial armour and the named meads
        are all locked behind one: a perk that is awarded rather than bought, held by the people
        entitled to make that thing. It is the mechanism that lets an organisation actually have a
        product nobody else can make.`,
      `**The Writ of Coinage is the sharpest example.** It permits minting gold coins, and gold
        ingots were added to a great many master recipes specifically to create demand for smelted
        coin. Between the two, gold became something the economy produces rather than something
        that simply exists.`,
    ],
  },
  {
    kind: "note",
    tone: "warn",
    title: "Enchanting: tier gating gone, gems matter",
    body: `Disenchanting is **no longer tier gated**, so you may pull an effect off anything you can
      hold. In exchange, **enchantment magnitude now scales with the gem** you use and the charge
      size scales with its size, so the soul gem is a real decision rather than a formality. The
      overpowered enchanted items that could be crafted were removed in 0.70.54.`,
  },
];

export default function CraftingPage() {
  const { professions, nodes, indoors } = mereth.gathering;

  /*
   * Two different numbers, and they were being conflated. The Gathering
   * category holds eight skills; `gathering.professions` groups every
   * profession that has nodes in the world, which includes crafting trades
   * like smithing and milling. Labelling the second one "gathering skills"
   * contradicted the prose on this page's own first tab.
   */
  const gatheringSkills =
    mereth.categories.find((category) => category.label === "Gathering")?.keys.length ?? 0;

  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <CodexHeader
        title="Crafting"
        lede={`Crafting is **several separate skills**, not one smithing stat. A blacksmith might be a
          Master of weapons and only an Adept at armour, so two smiths in the same hold are good at
          different things and you have to find the one who bought the skill you need.`}
        facts={[
          { label: "Recipes", value: counts.recipes.toLocaleString("en-GB") },
          { label: "Benches", value: String(mereth.benches.length) },
          { label: "Ingredients", value: String(counts.ingredients) },
          { label: "Gathering skills", value: String(gatheringSkills) },
          { label: "Professions with nodes", value: String(professions.length) },
        ]}
      />

      <Tabs
        tabs={[
          {
            id: "benches",
            label: "Benches",
            hint: "What comes off what",
            content: <RecipeBrowser benches={mereth.benches} />,
          },
          {
            id: "workshop",
            label: "The workshop",
            hint: "Benches, repairs, writs and coin",
            content: (
              <div className="max-w-[72ch]">
                <Blocks blocks={workshop} />
              </div>
            ),
          },
          {
            id: "alchemy",
            label: "Alchemy",
            hint: "What two ingredients brew",
            content: <AlchemyBench ingredients={mereth.ingredients} />,
          },
          {
            id: "gathering",
            label: "Gathering",
            hint: "Where the nodes stand",
            content: (
              <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div className="max-w-[62ch]">
                  <PlateImage
                    slug="mammoths"
                    aspect="aspect-[16/9]"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="mb-8"
                  />
                  <Blocks blocks={gathering} />
                  <PlateImage
                    slug="the-kill"
                    aspect="aspect-[16/9]"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="mt-8"
                  />
                </div>

                <div className="space-y-10">
                  <section>
                    <h3 className="font-display mb-4 text-[0.95rem] tracking-heading text-brand-accent uppercase">
                      The commonest nodes outdoors
                    </h3>
                    <ul className="space-y-1">
                      {nodes.slice(0, 14).map((node) => (
                        <li
                          key={node.name}
                          className="flex items-baseline justify-between gap-4 border-b border-border-subtle py-2 last:border-0"
                        >
                          <span className="text-[0.9rem] text-text-primary">{node.name}</span>
                          <span className="shrink-0 text-[0.82rem] tabular-nums text-text-muted">
                            {node.count.toLocaleString("en-GB")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <p className="text-[0.78rem] leading-relaxed text-text-muted">
                    Counted across the province, not mapped. Which nodes exist and roughly how
                    common they are is worth knowing before you spend a memory point. Where the
                    good ones are is worth finding out yourself, or worth asking somebody who
                    already has.
                  </p>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
