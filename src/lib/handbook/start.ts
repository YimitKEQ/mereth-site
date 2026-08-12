/**
 * Start Here: the path from "I have heard of this server" to "I am standing in
 * Skyrim with a plan".
 *
 * Ordered by what actually blocks people, which is not the order a marketing
 * page would choose. Installing is step one because it is where most attempts
 * die, and character planning comes before connecting because the eighteen
 * points are spent in the first five minutes and cannot be taken back cleanly.
 *
 * Kept short on purpose. Every step already links to the page that covers it
 * properly, so a step that explains the whole thing is just the linked page
 * again, in front of somebody who has not asked for it yet. Two paragraphs, the
 * mistake people actually make, and the way on.
 */

export interface Step {
  title: string;
  /** One line under the heading, in the inline markup grammar. */
  summary: string;
  body: string[];
  /** The thing people get wrong at this step. */
  pitfall?: string;
  link?: { label: string; href: string };
}

export const steps: Step[] = [
  {
    title: "Join the Discord and read the rules",
    summary: "Your Discord account **is** your login. There is no separate password.",
    body: [
      `There is no username and no password. Your Discord account is your Mereth account, so you
        have to be in our Discord to get in at all.`,
      `Read the rules before you apply. They are about conduct and consistency, and one of them
        catches people out repeatedly: **AI-written roleplay is forbidden.**`,
    ],
    link: { label: "The rules in full", href: "/rules" },
  },
  {
    title: "Install through the launcher, and only through the launcher",
    summary: "It installs the whole mod list in the right order and checks your files before you connect.",
    body: [
      `You need Skyrim Special Edition on PC and SKSE. Everything else comes from our launcher,
        which reads the live manifest and does the rest.`,
      `**Do not assemble the list by hand and do not update mods yourself.** Names, order, light
        flags and SKSE checksums are all compared against the server, so a newer version of the
        right mod fails exactly the way a missing one does.`,
    ],
    pitfall: `Having a file in your Data folder is not the same as loading it. The check reads your
      active load order, so a plugin sitting there unticked counts as missing.`,
    link: { label: "Every connection error, explained", href: "/faq#connect" },
  },
  {
    title: "Decide who your character is, before the game asks",
    summary: "Where your character is from and who they answer to matters more here than their stats.",
    body: [
      `The setting is 4E 185, ten years after the Great War. Named characters from the games are
        gone and players fill those roles, so you cannot play one of them.`,
      `Work out what your character **wants**, and make it something that needs other people. A
        goal you can finish alone runs out by the second evening.`,
    ],
    link: { label: "Setting and lore answers", href: "/faq#setting" },
  },
  {
    title: "Plan your eighteen memory points",
    summary: "Tiers are caps you buy once, not levels you grind. This is the decision that lasts.",
    body: [
      `You get **18 memory points** and spend them to set the highest tier each skill can ever
        reach. Novice costs 1, Apprentice 2, Adept 3, Expert 5, Master 8. One Master eats nearly
        half your budget.`,
      `Spend them in the starting room or at any temple. Taking a point back later burns the
        experience you earned in the tier you dropped out of, so decide the whole build first.`,
    ],
    pitfall: `Do not spread points thinly across everything you might want. Eighteen points buys
      roughly two specialisms and a hobby. Spread across nine skills you are Novice at all of them,
      which means there is no job anybody needs you specifically for.`,
    link: { label: "Plan it on the planner", href: "/skills" },
  },
  {
    title: "Learn the interaction keys",
    summary: "Aim at a person and press a key. Trading, introducing yourself and restraining someone all work this way.",
    body: [
      `We layer our own interactions on top of Skyrim's controls. \`E\` trades, \`H\` introduces
        yourself, \`T\` tackles, \`F\` cuffs, \`B\` sits, \`X\` surrenders, \`K\` opens your skills.`,
      `**You start as a Stranger.** That is what everyone sees above your head until somebody aims
        at you and presses \`H\`. Nobody learns your name by looking at you.`,
    ],
    link: { label: "The full control table", href: "/guide#controls" },
  },
  {
    title: "Your first evening in the province",
    summary: "Find an inn, find a hold, and find one person who wants something from you.",
    body: [
      `Park at an inn for five minutes at full energy to pick up Well Rested, ten percent bonus
        experience for an hour, re-triggering every five minutes while you stay.`,
      `Then find the missive board. Every hold has one, any player can pin a note to it, and jobs,
        warnings and meetings all get posted there. It is the fastest way to find somebody who
        wants something from you.`,
    ],
    link: { label: "Tips worth knowing on night one", href: "/tips#first" },
  },
];
