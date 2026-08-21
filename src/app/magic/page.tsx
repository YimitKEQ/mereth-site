import type { Metadata } from "next";

import { CodexHeader } from "@/components/codex/CodexHeader";
import { SpellBrowser } from "@/components/codex/SpellBrowser";
import { Tabs } from "@/components/codex/Tabs";
import { Blocks } from "@/components/handbook/Blocks";
import { PlateImage } from "@/components/ui/Plate";
import { pageMeta } from "@/lib/seo";
import { counts, mereth, spellsBySchool } from "@/lib/mereth";
import { SPELL_POINTS_START, spellTierRows } from "@/lib/magic";
import type { Block } from "@/lib/handbook/blocks";

export const metadata: Metadata = pageMeta({
  path: "/magic",
  title: "Magic",
  description:
    "How a spell is learned on Mereth: a tome or a teacher, 50 spell points to spend, and 7 to 35 days of study. Plus every spell in the province, by school.",
});

/**
 * The pipeline first, the spellbook second.
 *
 * A spell list is the wrong thing to lead with. Magic here is gated behind time
 * and, for anything past a tome you happen to find, behind another player. A
 * reader who scrolls 351 spells without knowing that leaves with exactly the
 * wrong impression of how they get one.
 *
 * The order is what a new mage needs in the order they need it: the two routes,
 * what each tier costs in points and days, the first evening, then the people
 * and the law around all of it.
 */
const pipeline: Block[] = [
  {
    kind: "prose",
    paragraphs: [
      `There are two ways to learn a spell, and neither of them is instant. **Read a tome**, found
        in the world, bought from a shop or handed to you, or **be taught by a whitelisted
        Teacher**. Either way the spell goes into your grimoire as a timer and you wait it out.`,
      `What a Teacher adds is speed and judgement. Only a Teacher can shorten a study already
        running, and outside the College only a Teacher decides you are ready for the next rank.`,
    ],
  },
  {
    kind: "table",
    head: ["Spell tier", "Spell points", "Days in the grimoire"],
    rows: spellTierRows(),
  },
  {
    kind: "note",
    tone: "warn",
    title: "One spell at a time",
    body: `You can only study one spell at once. Reading a second tome while the first is still
      running does not queue it, it fails. Finish what is in the book before you open another.`,
  },
  {
    kind: "prose",
    paragraphs: [
      `A Teacher shortens the wait. **Each lesson takes one day off** a study already running, so a
        Master spell is 35 days alone and rather less with somebody turning up to teach you, which
        is what makes a teacher worth finding rather than optional.
        [What the role demands of them](/teaching).`,
      `**Day one, before anything else, set your skills.** Spellcasting sets your maximum magicka,
        and a rank in a school is what lets you learn that school's spells at all, with perks that
        cut their cost and raise their effect as it climbs. Neither is optional and neither can be
        bought later without a memory point.`,
      `**Then take the Mystic kit.** \`/kit\` offers it at the start: robes, a Candlelight tome and
        the rest of the starting essentials. **You need at least one point in Alteration** to read
        the tome it gives you, so spend that point before you spawn or the kit's spell is a book you
        cannot open. Once you are in, \`F8\` opens your grimoire: everything you know, everything
        you are still learning with the time left on it, and the place a finished spell can be
        unlearned.`,
      `**Everybody starts with 50 spell points.** They cap what your grimoire can hold rather than
        what you can cast, and a spell costs exactly what the matching skill rank costs in memory
        points: 1 for a Novice, 8 for a Master. Fifty points is five Master spells, or fifty Novice
        ones, or any mix in between. Becoming a [whitelisted Teacher](/teaching) is the only route
        anybody has published for raising that total, though holding the court mage rank in a
        holdstone grants another 50 for as long as you hold it.`,
    ],
  },
  {
    kind: "note",
    tone: "warn",
    title: "Training a school is not casting the same spell in a tavern",
    body: `Magic skills climb by casting, which makes them the easiest thing on the server to grind
      by accident. Train where it makes sense, a yard or a training dummy rather than an inn floor.
      Train with somebody, or make the fumbling the scene: the mage who gets a Clairvoyance wrong
      and leads four people into a bog is playing correctly. Repetition with nobody watching and
      nothing said is powergaming and is treated as such.`,
  },
  {
    kind: "prose",
    paragraphs: [
      `**A Teacher is a whitelisted role**, not simply anybody who knows a spell. One holds at most
        three apprentices and may teach them as far as Adept; past Adept means the College of
        Winterhold, or approval from staff. Outside those three, a Teacher may teach one other
        person a week. The requirements, the audits and the etiquette are on the
        [teaching page](/teaching).`,
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
  { kind: "cite", pattern: /spell training|masters of a school|spell points|grimoire|learn.*spell/i, limit: 5 },
];

export default function MagicPage() {
  const schools = spellsBySchool();

  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <CodexHeader
        title="Magic"
        lede={`You cannot learn a spell from a menu. It comes from **a tome you have found or a
          Teacher who already knows it**, and either way it sits in your grimoire for days before it
          is yours. Below is how that works, and then every spell a player can learn, with its tier,
          so you can see what a Novice, an Adept and a Master actually have access to.`}
        facts={[
          { label: "Learnable spells", value: counts.spells.toLocaleString("en-GB") },
          { label: "Schools", value: String(schools.length) },
          {
            label: "Magic skills",
            value: String(mereth.categories.find((c) => c.label === "Magic schools")?.keys.length ?? 0),
          },
          { label: "Starting spell points", value: String(SPELL_POINTS_START) },
        ]}
      />

      <Tabs
        tabs={[
          {
            id: "pipeline",
            label: "How you learn it",
            hint: "A tome or a teacher, and time",
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
