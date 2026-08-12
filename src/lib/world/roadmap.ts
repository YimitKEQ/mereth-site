/**
 * The roadmap, reconciled against what actually shipped.
 *
 * The list itself comes from merethroleplay.com. It was transcribed verbatim
 * and then went stale: twelve items sitting under "To do" had already landed,
 * some of them months earlier, and a few were being bug-fixed in the same week
 * the page still called them unstarted.
 *
 * Rather than quietly reword somebody else's published plan, each item that the
 * release notes contradict carries the release that shipped it and moves to
 * Completed. The version is the newest note found for that feature, so it is
 * evidence the thing exists and is maintained, not a claim about the exact
 * release it first appeared in.
 *
 * Two notes for whoever edits this next:
 *
 * 1. This is the plan. The [changelog](/changelog) is what actually shipped,
 *    and where the two disagree the changelog wins and this list is what needs
 *    updating. Re-run that comparison whenever the roadmap is touched.
 * 2. Keep the wording plain. A roadmap that reads as marketing stops being
 *    useful to the people who check it every week.
 */

export type Stage = "done" | "building" | "planned" | "later";

export interface RoadmapItem {
  text: string;
  /** Set when a release note shows the item has landed. */
  shipped?: { version: string; date: string };
}

export interface RoadmapStage {
  id: Stage;
  title: string;
  blurb: string;
  items: RoadmapItem[];
}

const plain = (...lines: string[]): RoadmapItem[] => lines.map((text) => ({ text }));

export const roadmap: RoadmapStage[] = [
  {
    id: "done",
    title: "Completed",
    blurb: "Shipped and running on the live server.",
    items: [
      ...plain(
        "Crafting systems",
        "Voice chat with adjustable ranges",
        "Voice chat lip sync with the character model",
        "Chat box, with no global out-of-character channel",
        "Rework of the SkyMP backend to allow ESLs, so modded buildings and the like are possible",
        "Mining, with nodes holding limited ore on respawn timers",
        "A custom skill menu hooked into the base game perk trees",
        "A sneak ability that takes you to 90 percent invisible",
        "Reworked SkyMP backend for better player syncing during combat",
        "Lockpicking hooked into the base game lockpicking minigame",
      ),

      /*
       * Everything below was published as "to do" and has since landed. The
       * release is the most recent note touching that feature.
       */
      {
        text: "Pickpocketing",
        shipped: { version: "0.68.15", date: "2026-08-10" },
      },
      {
        text: "An interaction system with hands-up and surrender",
        shipped: { version: "0.65.5", date: "2026-07-25" },
      },
      {
        text: "Handcuffing, tied into the interaction system",
        shipped: { version: "0.68.24", date: "2026-08-11" },
      },
      {
        text: "A medical system and a downed state",
        shipped: { version: "0.68.15", date: "2026-08-10" },
      },
      {
        text: "A pinboard system",
        shipped: { version: "0.68.15", date: "2026-08-10" },
      },
      {
        text: "Syncing dungeon puzzles",
        shipped: { version: "0.66.7", date: "2026-07-30" },
      },
      {
        text: "A lumber system hooked to the base game lumber mills and their animations",
        shipped: { version: "0.66.7", date: "2026-07-30" },
      },
      {
        text: "Baking",
        shipped: { version: "0.67.26", date: "2026-08-04" },
      },
      {
        text: "Brewing",
        shipped: { version: "0.67.38", date: "2026-08-05" },
      },
      {
        text: "More looms placed around the map, for tailoring",
        shipped: { version: "0.27.0", date: "2026-03-15" },
      },
      {
        text: "The base game survival system, customised and implemented",
        shipped: { version: "0.67.38", date: "2026-08-05" },
      },
      {
        text: "An energy and exhaustion system, recovered by resting at an inn",
        shipped: { version: "0.65.8", date: "2026-07-26" },
      },
      {
        text: "A bard system that speeds up recovery while in an inn",
        shipped: { version: "0.68.0", date: "2026-08-05" },
      },
    ],
  },
  {
    id: "building",
    title: "In progress",
    blurb: "Being worked on now.",
    items: plain(
      "Durability for weapons and armour, almost complete, final touches and debugging",
      "Global NPC sync for enemies, critters and wild animals, almost complete",
      "Custom spells in the Creation Kit",
      "Reworked loot tables in the Creation Kit",
      "Nexus API integration so the launcher can use collections",
      "Magic system syncing and damage balancing",
    ),
  },
  {
    id: "planned",
    title: "To do",
    blurb: "Committed to, not started or not finished.",
    items: plain(
      "Raven and pigeon mail for in-character correspondence",
      "A craftable key system for doors at different tiers of strength",
      "Fort and camp claiming, where bandits do not respawn while you maintain the site with materials",
      "A custom book system",
    ),
  },
  {
    id: "later",
    title: "Future updates",
    blurb: "Wanted, but not scheduled.",
    items: plain(
      "A vampire system with two types, Cyrodiilic and Pure Blooded",
      "A werewolf system",
    ),
  },
];
