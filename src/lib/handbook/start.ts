/**
 * Start Here: the path from "I have heard of this server" to "I am standing in
 * Skyrim with a plan".
 *
 * Ordered by what actually blocks people, which is not the order a marketing
 * page would choose. Installing is step one because it is where most attempts
 * die, and character planning comes before connecting because the eighteen
 * points are spent in the first five minutes and cannot be taken back cleanly.
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
      `Mereth authenticates through Discord, so being in their server is not a social nicety, it
        is the account system. The client has separate failures for being outside the Discord and
        for never having logged in through it.`,
      `Read the rules before you apply rather than after. They are about conduct and consistency:
        stay in character, do not metagame, do not write your character out of consequences. One
        rule catches people out repeatedly, so it is worth saying plainly: **AI-written roleplay is
        forbidden.**`,
    ],
    link: { label: "The rules in full", href: "/rules" },
  },
  {
    title: "Install through the launcher, and only through the launcher",
    summary: "It installs the mod list in a fixed order and checks your files before you connect.",
    body: [
      `You need Skyrim Special Edition on PC and SKSE. Everything else comes from Mereth's
        launcher, which reads a manifest and installs the whole list in a fixed order.`,
      `**Do not assemble the list by hand and do not update mods yourself.** Plugin names, load
        order, and light versus regular flags are all compared against the server, and SKSE DLLs
        are compared by name, size and checksum. A newer version of the right mod fails exactly
        the way a missing one does.`,
    ],
    pitfall: `Having a file in your Data folder is not the same as loading it. The check reads your
      active load order, so a plugin sitting there unticked counts as missing.`,
    link: { label: "Every connection error, explained", href: "/faq#connect" },
  },
  {
    title: "Decide who your character is, before the game asks",
    summary: "Race and hold are political facts here, not a stat screen.",
    body: [
      `The setting is 4E 185, ten years after the Great War. It is an alternate timeline, so named
        characters from the games are gone and players fill those roles instead. You cannot play a
        character from the lore.`,
      `Your race puts you somewhere on a map of grudges before you have said a word: a Dunmer in
        Windhelm and an Altmer anywhere under Imperial law are both walking into a situation. That
        is material to work with, not an obstacle.`,
      `Work out what your character **wants**, and make it something that needs other people. A
        character with a goal that can be met alone will run out of things to do by the second
        evening.`,
    ],
    link: { label: "Setting and lore answers", href: "/faq#setting" },
  },
  {
    title: "Plan your eighteen memory points",
    summary: "Tiers are caps you buy once, not levels you grind. This is the decision that lasts.",
    body: [
      `At character creation you get **18 memory points** and spend them to set the highest tier
        each skill can ever reach. Novice costs 1, Apprentice 2, Adept 3, Expert 5, Master 8. One
        Master eats nearly half your budget.`,
      `Two consequences people meet the hard way. **No points in a weapon skill means no damage at
        all** with that weapon, deliberately, so a civilian cannot pick up a sword and fight. And
        lockpicking and pickpocketing refuse to function until the skill is locked in, which reads
        exactly like a bug and is not one.`,
      `You allocate in the starting room or at any temple. Taking a point back later burns the
        experience you earned in the tier you dropped out of, so decide the whole build first.`,
    ],
    pitfall: `Do not spread points thinly across everything you might want. Eighteen points buys
      roughly two specialisms and a hobby. A character who is mediocre at nine things has no reason
      for anyone to seek them out, and being sought out is the game.`,
    link: { label: "Plan it on the planner", href: "/skills" },
  },
  {
    title: "Learn the interaction keys",
    summary: "Aim at a person and press a key. This is most of what makes it a roleplay server.",
    body: [
      `Mereth layers its own interaction system on top of Skyrim's controls. \`E\` opens a two
        sided trade, \`H\` introduces yourself, \`T\` tackles, \`F\` cuffs, \`B\` sits, \`X\`
        surrenders. \`K\` opens your skills and \`F3\` re-aims the look target when a menu loses it.`,
      `**You start as a Stranger** and stay one until somebody introduces themselves to you. Names
        are not free here, which is the single best thing about the social design.`,
    ],
    link: { label: "The full control table", href: "/guide#controls" },
  },
  {
    title: "Your first evening in the province",
    summary: "Find an inn, find a hold, and find one person who wants something from you.",
    body: [
      `Park at an inn for five minutes to pick up Well Rested, which is the cheapest standing
        experience bonus in the game and re-triggers every five minutes while you stay.`,
      `Pledge to a hold when you know where your character belongs. The holdstone is the spine of
        the server: rank in a hold carries real mechanical benefits, and jarls and stewards grant
        parcels, which are how you come to own a house, a workshop or a shop.`,
      `Check the missive board in the hold. Every hold has one, it doubles as a player pinboard,
        and it is where work and trouble get advertised.`,
    ],
    link: { label: "Tips worth knowing on night one", href: "/tips#first" },
  },
];
