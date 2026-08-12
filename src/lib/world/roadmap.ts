/**
 * The roadmap, as published.
 *
 * Transcribed verbatim in substance from merethroleplay.com. Two notes for
 * whoever edits this next:
 *
 * 1. This is the plan. The [chronicle](/news) is what actually shipped, taken
 *    from dated release notes, and the two can drift. Where an item here says
 *    "to do" and the release notes say otherwise, the release notes are the
 *    record of what happened and this list needs updating.
 * 2. Keep the wording plain. A roadmap that reads as marketing stops being
 *    useful to the people who check it every week.
 */

export type Stage = "done" | "building" | "planned" | "later";

export interface RoadmapStage {
  id: Stage;
  title: string;
  blurb: string;
  items: string[];
}

export const roadmap: RoadmapStage[] = [
  {
    id: "done",
    title: "Completed",
    blurb: "Shipped and running on the live server.",
    items: [
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
    ],
  },
  {
    id: "building",
    title: "In progress",
    blurb: "Being worked on now.",
    items: [
      "Durability for weapons and armour, almost complete, final touches and debugging",
      "Global NPC sync for enemies, critters and wild animals, almost complete",
      "Custom spells in the Creation Kit",
      "Reworked loot tables in the Creation Kit",
      "Nexus API integration so the launcher can use collections",
    ],
  },
  {
    id: "planned",
    title: "To do",
    blurb: "Committed to, not started or not finished.",
    items: [
      "A lumber system hooked to the base game lumber mills and their animations",
      "A medical system and a downed state",
      "Raven and pigeon mail for in-character correspondence",
      "A pinboard system",
      "Syncing dungeon puzzles",
      "Magic system syncing and damage balancing",
      "A craftable key system for doors at different tiers of strength",
      "Pickpocketing",
      "An interaction system with hands-up and surrender",
      "Handcuffing, tied into the interaction system",
      "Baking",
      "Brewing",
      "More looms placed around the map, for tailoring",
      "The base game survival system, customised and implemented",
      "An exhaustion system: you cannot gain experience until you rest at an inn",
      "A bard system that increases exhaustion recovered while in an inn",
      "Fort and camp claiming, where bandits do not respawn while you maintain the site with materials",
      "A custom book system",
    ],
  },
  {
    id: "later",
    title: "Future updates",
    blurb: "Wanted, but not scheduled.",
    items: [
      "A vampire system with two types, Cyrodiilic and Pure Blooded",
      "A werewolf system",
    ],
  },
];
