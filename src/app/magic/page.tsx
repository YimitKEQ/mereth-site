import type { Metadata } from "next";

import { CodexHeader } from "@/components/codex/CodexHeader";
import { SpellBrowser } from "@/components/codex/SpellBrowser";
import { Tabs } from "@/components/codex/Tabs";
import { Blocks } from "@/components/handbook/Blocks";
import { counts, mereth, spellsBySchool } from "@/lib/mereth";
import type { Block } from "@/lib/handbook/blocks";

export const metadata: Metadata = {
  title: "Magic",
  description:
    "How magic is learned on Mereth: a teacher, a book, and time. Plus every spell in the province, by school.",
};

/**
 * The pipeline first, the catalogue second.
 *
 * A spell list is the wrong thing to lead with here. Magic on Mereth is gated
 * behind another player and behind time, and a reader who scrolls a table of
 * 950 spells without knowing that leaves with exactly the wrong impression.
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
        lede={`The most complained about system on the server, and the most deliberate. Magic is a
          roleplay pipeline rather than a menu: a teacher, a book, and time. The catalogue below is
          what **exists in the world**, which is not the same as what anyone will teach you.`}
        facts={[
          { label: "Spells", value: counts.spells.toLocaleString("en-GB") },
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
              <div className="max-w-[68ch]">
                <Blocks blocks={pipeline} />
              </div>
            ),
          },
          {
            id: "spells",
            label: "Every spell",
            hint: `${counts.spells.toLocaleString("en-GB")} in the province`,
            content: (
              <div>
                <p className="mb-6 max-w-[68ch] text-[0.9rem] leading-relaxed text-text-muted">
                  Read out of the plugins the launcher installs, so this is what exists in the
                  world rather than what you can be taught. Records sharing a name are merged into
                  one row: mods ship the same spell at many power levels, and the magicka column
                  shows the range those variants span. Creature and quest abilities live in the
                  same table as spells, so a few rows here are things no player casts.
                </p>
                <SpellBrowser spells={mereth.spells} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
