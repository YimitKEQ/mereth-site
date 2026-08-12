import type { Metadata } from "next";

import { CodexHeader } from "@/components/codex/CodexHeader";
import { Tabs } from "@/components/codex/Tabs";
import { Blocks } from "@/components/handbook/Blocks";
import { counts, mereth } from "@/lib/mereth";
import type { Block } from "@/lib/handbook/blocks";

export const metadata: Metadata = {
  title: "The World",
  description:
    "Holds, parcels and property, the interaction keys, races and the Tamriel calendar, and what happens when you cause trouble.",
};

const holds: Block[] = [
  {
    kind: "prose",
    paragraphs: [
      `The holdstone is the spine of the server. You pledge to a hold, hold a rank in it, and the
        rank carries real mechanical benefit rather than a title alone: a blacksmith rank carries
        smithing, guards carry light armour, a court mage carries spell points. Professions are
        ranks inside this system, not a separate one.`,
      `**Parcels are the property system.** A hold divides into named parcels, and a parcel is the
        closest thing Mereth has to owning something. Jarls and stewards grant them to citizens.
        Doors and containers bind to a parcel as fixtures, and holders carry parcel keys.`,
    ],
  },
  { kind: "data", name: "access" },
  {
    kind: "prose",
    paragraphs: [
      `A parcel can also demand a minimum rank, and **access can be granted to people outside the
        hold entirely**, so a workshop, a shop back room or a stash can be shared across hold lines.`,
    ],
  },
  {
    kind: "note",
    tone: "key",
    title: "A bound container stops regenerating",
    body: `The single most useful storage fact on the server. An ordinary container regenerates its
      contents, which means it is not safe to keep anything in. Bind it to a parcel through the
      holdstone and it stops.`,
  },
  { kind: "cite", pattern: /holdstone|jarl|steward|pledge|parcel/i, limit: 6 },
];

const law: Block[] = [
  {
    kind: "prose",
    paragraphs: [
      `There is **no bounty system and there are no guards who arrest you**. What exists is a set
        of interactions players use on each other, and a real incapacitated state at the end of
        them.`,
    ],
  },
  { kind: "data", name: "binds" },
  {
    kind: "prose",
    paragraphs: [
      `Only two illicit acts are modelled mechanically, lockpicking and pickpocketing, and both are
        fenced: not on creatures, not while detected, and a failed attempt puts the target on edge
        which blocks a retry until they settle. Both refuse to function at all until the skill is
        locked into your plan.`,
      `Everything after the cuffs, the accusation, the sentence, the record, is roleplay and staff
        adjudication. **Nothing in the game remembers it for you**, which is worth knowing before
        you build a character around consequences.`,
    ],
  },
  { kind: "cite", pattern: /tackle|cuff|shackle|surrender|incapacitated|pickpocket|lockpick/i, limit: 5 },
];

const living: Block[] = [
  {
    kind: "prose",
    paragraphs: [
      `**You start as a Stranger.** Your title stays Stranger until somebody introduces themselves
        to you, which is the introduce interaction on \`H\`. Other titles come from mastering skill
        categories. Names are not free here, and that is the best thing about the social design.`,
    ],
  },
  { kind: "data", name: "races" },
  {
    kind: "prose",
    paragraphs: [
      `**Needs are live.** Two of them, with thresholds the client enforces. A third, Rest driven by
        a fatigue stat, is written into their UI and commented out, so it is intent rather than
        mechanic.`,
    ],
  },
  { kind: "data", name: "needs" },
  {
    kind: "prose",
    paragraphs: [
      `**World time is synced** for everyone and runs on the Tamriel year, so a date means the same
        thing to every player at once:`,
    ],
  },
  { kind: "data", name: "months" },
  {
    kind: "prose",
    paragraphs: [
      `**Dungeons reset.** Cleared dungeons seal, sit on a timer, regenerate and reopen fully.
        Nothing left on the floor survives that, and keys found inside evaporate after thirty
        minutes.`,
      `**Every hold has a missive board** that doubles as a player pinboard. One note per person,
        three days before it expires, and you cannot take down anyone else's.`,
    ],
  },
  { kind: "cite", pattern: /dungeon|sealed|regenerate|missive board/i, limit: 4 },
];

export default function WorldPage() {
  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <CodexHeader
        title="The World"
        lede={`Skyrim in 4E 185, ten years after the Great War, on an alternate timeline where the
          named characters are gone and players fill those roles. What follows is how the province
          is actually organised: who grants what, what the keys do, and what the world remembers.`}
        facts={[
          { label: "Races", value: String(mereth.races.length) },
          { label: "Access modes", value: String(mereth.accessLevels.length) },
          { label: "Interactions", value: String(mereth.binds.length) },
          { label: "Systems shipped", value: String(counts.systems) },
        ]}
      />

      <Tabs
        tabs={[
          {
            id: "holds",
            label: "Holds and property",
            hint: "The holdstone, and parcels",
            content: (
              <div className="max-w-[68ch]">
                <Blocks blocks={holds} />
              </div>
            ),
          },
          {
            id: "law",
            label: "Trouble",
            hint: "What law there is",
            content: (
              <div className="max-w-[68ch]">
                <Blocks blocks={law} />
              </div>
            ),
          },
          {
            id: "living",
            label: "Living in it",
            hint: "Names, needs, time",
            content: (
              <div className="max-w-[68ch]">
                <Blocks blocks={living} />
              </div>
            ),
          },
          {
            id: "systems",
            label: "What is running",
            hint: `${counts.systems} systems`,
            content: (
              <div>
                <p className="mb-8 max-w-[68ch] text-[0.98rem] leading-[1.85] text-text-light">
                  Clustered from Mereth&apos;s own release notes. The count beside each is how many
                  times that system has been worked on, so the list doubles as a map of where the
                  effort has gone since launch.
                </p>
                <ul className="grid gap-x-10 gap-y-1 md:grid-cols-2">
                  {mereth.systems.map((system) => (
                    <li
                      key={system.name}
                      className="flex items-baseline justify-between gap-4 border-b border-border-subtle py-3"
                    >
                      <span className="min-w-0">
                        <span className="block text-[0.95rem] text-text-primary">{system.name}</span>
                        {system.blurb !== null ? (
                          <span className="block text-[0.8rem] text-text-muted">{system.blurb}</span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-[0.8rem] tabular-nums text-brand-accent/70">
                        {system.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
