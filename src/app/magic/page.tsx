import type { Metadata } from "next";

import { CodexHeader } from "@/components/codex/CodexHeader";
import { SpellBrowser } from "@/components/codex/SpellBrowser";
import { Tabs } from "@/components/codex/Tabs";
import { Blocks } from "@/components/handbook/Blocks";
import { PlateImage } from "@/components/ui/Plate";
import { counts, mereth, spellsBySchool } from "@/lib/mereth";
import type { Block } from "@/lib/handbook/blocks";

export const metadata: Metadata = {
  title: "Magic",
  description:
    "How magic is learned on Mereth: a teacher, a book, and time. Plus every spell in the province, by school.",
};

/**
 * The pipeline first, the spellbook second.
 *
 * A spell list is the wrong thing to lead with. Magic here is gated behind
 * another player and behind time, and a reader who scrolls 351 spells without
 * knowing that leaves with exactly the wrong impression of how they get one.
 */
const pipeline: Block[] = [
  {
    kind: "prose",
    paragraphs: [
      `You cannot teach yourself. Two things are required for any spell: **a Master Mage or Wizard
        willing to teach you, and a spellbook for that spell.** No master, no book, no magic. New
        players do not start with magic, no exceptions.`,
    ],
  },
  {
    kind: "note",
    tone: "key",
    title: "The usual route to a first spell",
    body: `A Hold's Court Wizard runs aspiring mages through a three week apprenticeship and sends
      them off with their first spellbook. You need at least one spell already before the College of
      Winterhold will take you, so the Court Wizard is where nearly everyone starts.`,
  },
  {
    kind: "prose",
    paragraphs: [
      `**The College of Winterhold** teaches three semesters of formal instruction at rising
        prices: Novice, Apprentice, Adept. Past Adept you stay on as a researcher or a professor's
        assistant rather than as an ordinary student.`,
      `**Other organisations can teach** but hold no spellbook access by default. The head may be a
        Master Wizard and may take apprentices, and every book still has to be found: East Empire
        purchases, dungeon expeditions, trades.`,
    ],
  },
  {
    kind: "table",
    head: ["Where books come from", "How reliable"],
    rows: [
      ["The College library", "Effectively unlimited, for students"],
      ["A Court Wizard", "A limited starting selection"],
      ["The East Empire Company", "For purchase"],
      ["Dungeons", "Placed at random, on a bi-monthly cycle"],
    ],
  },
  {
    kind: "note",
    tone: "key",
    title: "A week a tier, and a master can cut it",
    body: `Training runs **a week per tier**. A master of the school can teach spells directly or
      speed the study up by **three days per twenty four hour period**, which makes a teacher worth
      finding without making one optional. Staves grant experience too, so a college can train with
      them where it makes sense.`,
  },
  {
    kind: "note",
    tone: "key",
    title: "Spell points",
    body: `Everyone **starts with 50**. Holding the court mage rank in a holdstone grants
      **another 50**, and the college and court roles are described as receiving more. The exact
      figure for a college place is not something we have published a number for yet.`,
  },
  {
    kind: "note",
    tone: "warn",
    title: "Magic is not legal everywhere",
    body: `**Every Hold sets its own magical law.** What is fine in Winterhold may not be in
      Markarth, Windhelm or Solitude. Check which spells are legal where you are, whether teaching
      requires a licence, and any local restriction on Conjuration, Destruction or Illusion.
      Ignorance is not a defence in any Jarl's court.`,
  },
  {
    kind: "prose",
    paragraphs: [
      `**Priests are the doctors.** Temple priests hold Master Restoration, are authorised to teach
        disciples, and are who you look for when someone is hurt. Factions like the Vigilants of
        Stendarr serve the same role on the road.`,
      `Expect **utility rather than firepower**. Magelight, Candlelight, Detect Life, Detect Dead
        and their kin. Every school is being redone around roleplay-friendly spells, so read the
        catalogue as tools first and weapons second.`,
    ],
  },
  { kind: "cite", pattern: /spell training|masters of a school|spell points|learn.*spell/i, limit: 5 },
];

export default function MagicPage() {
  const schools = spellsBySchool();

  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <CodexHeader
        title="Magic"
        lede={`You cannot learn a spell from a menu. Every one needs **a teacher who already knows it
          and a spellbook to learn it from**, which means finding a person before you find a spell.
          Below is every spell a player can be taught, with its tier, so you can see what a Novice,
          an Adept and a Master actually have access to.`}
        facts={[
          { label: "Learnable spells", value: counts.spells.toLocaleString("en-GB") },
          { label: "Schools", value: String(schools.length) },
          {
            label: "Magic skills",
            value: String(mereth.categories.find((c) => c.label === "Magic schools")?.keys.length ?? 0),
          },
        ]}
      />

      <Tabs
        tabs={[
          {
            id: "pipeline",
            label: "How you learn it",
            hint: "Teacher, book, time",
            content: (
              <div className="grid gap-10 lg:grid-cols-[minmax(0,68ch)_minmax(0,1fr)] lg:gap-14">
                {/* min-w-0: a grid item sizes to its widest unbreakable child by
                    default, and one long spell name was pushing the whole page
                    sideways on a phone. */}
                <div className="min-w-0">
                  <Blocks blocks={pipeline} />
                </div>
                <div className="hidden gap-6 lg:sticky lg:top-[120px] lg:grid lg:self-start">
                  <PlateImage
                    slug="the-lesson"
                    aspect="aspect-[4/3]"
                    sizes="(max-width: 1024px) 100vw, 30vw"
                  />
                  <PlateImage
                    slug="the-shrine"
                    aspect="aspect-[4/3]"
                    sizes="(max-width: 1024px) 100vw, 30vw"
                  />
                  <PlateImage
                    slug="spellcasting"
                    aspect="aspect-[4/3]"
                    sizes="(max-width: 1024px) 100vw, 30vw"
                  />
                  <PlateImage
                    slug="old-ways"
                    aspect="aspect-[4/3]"
                    sizes="(max-width: 1024px) 100vw, 30vw"
                  />
                </div>
              </div>
            ),
          },
          {
            id: "spells",
            label: "Every spell",
            hint: `${counts.spells.toLocaleString("en-GB")} you can be taught`,
            content: (
              <div>
                <p className="mb-6 max-w-[68ch] text-[0.9rem] leading-relaxed text-text-muted">
                  Every spell a player can be taught, with its real tier. Tier comes from the
                  casting perk on the spell itself, the same field the game uses to decide whether
                  you may cast it, so Flames is Novice and Fire Storm is Master because the record
                  says so. Creature abilities, quest effects and diseases share the same table and
                  are excluded. Records sharing a name are merged, and the magicka column shows the
                  range their variants span. Much of what is here comes from Mysticism, the magic
                  overhaul by Simon Magus that our launcher installs, so the spellbook is wider than
                  vanilla Skyrim's.
                </p>
                <SpellBrowser spells={mereth.spells} tiers={mereth.tiers.slice(0, 5)} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
