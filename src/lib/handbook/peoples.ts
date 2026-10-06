import guide from "@/data/pocket-guide.json";
import { plates } from "@/lib/images";

import type { Block, HandbookPage, Section } from "./blocks";

/**
 * The peoples of Tamriel, as the Lore Team wrote them up in the
 * #tamriel-pocket-guide forum on Discord.
 *
 * The prose for each people is theirs, word for word, and lives in
 * `src/data/pocket-guide.json`. `scripts/sync-pocket-guide.mjs` refreshes that
 * file from the forum at build time once the bot can read it, so a people the
 * Lore Team adds there reaches this page without anyone retyping it.
 */

interface People {
  id: string;
  name: string;
  points: string[];
  reading: { label: string; url: string }[];
}

const peoples: People[] = guide.peoples;

function section(people: People): Section {
  /* A people the forum adds before anyone has picked a portrait gets no picture, not a broken one. */
  const portrait = `people-${people.id}`;
  const blocks: Block[] = [
    ...(portrait in plates ? [{ kind: "plate", slug: portrait } as const] : []),
    { kind: "list", items: people.points },
  ];
  if (people.reading.length > 0) {
    blocks.push({
      kind: "prose",
      paragraphs: [
        "Further reading: " +
          people.reading.map((r) => `[${r.label}](${r.url})`).join(", ") +
          ".",
      ],
    });
  }
  return { id: people.id, title: people.name, blocks };
}

export const peoplesPage: HandbookPage = {
  title: "The peoples of Tamriel",
  lede: `Culture, faith and place of origin shape how a character sees the world. This is the Lore
    Team's guide to every people of Tamriel, Nords to Khajiit: a starting point for a character,
    not a cage around one.`,

  sections: [
    {
      id: "reading",
      title: "How to read this",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `Knowing these nuances helps you build a character, but it matters more for everyone
            around you: immersion and roleplay go hand in hand when the people in a scene share a
            world.`,
            `None of this is an exhaustive racial guide, and no character has to conform to every
            tradition below. People are individuals and the lore is full of exceptions.`,
          ],
        },
        {
          kind: "note",
          tone: "key",
          title: "A deviation needs a reason",
          body: `If your character breaks from the traditions of their people, that break is part of
            the character. Ask why they think differently, where they were raised, who influenced
            them, and what happened to them.`,
        },
        {
          kind: "prose",
          paragraphs: [
            `The Lore Team researched and compiled every section here so that lore supports
            creativity rather than restricting it. The guide grows in the
            **#tamriel-pocket-guide** forum on [our Discord](/discord), and this page follows it.
            The portraits are Skyrim's own loading screens.`,
          ],
        },
      ],
    },
    ...peoples.map(section),
  ],
};
