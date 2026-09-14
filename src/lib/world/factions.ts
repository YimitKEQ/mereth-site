/**
 * The organisations, and what a player can actually do inside one.
 *
 * Three lore factions have published pages; their standing is transcribed from
 * those. The rest of this file is the organisation rules from the rulebook,
 * because "what factions exist" is only half of what a player is asking. The
 * other half is how many people can join, what an organisation may own, and
 * why they can only be in one at a time.
 */

export interface Faction {
  name: string;
  /** One line on what it is right now, not what it was in the games. */
  standing: string;
  /** The published lore, in its own words. */
  lore: string[];
  /** What joining actually offers a player. */
  play: string[];
  /** Member cap from the organisation rules. */
  cap: number;
}

export const factions: Faction[] = [
  {
    name: "The Companions",
    cap: 25,
    standing: "Jorrvaskr stands empty. The mantle of Harbinger is unclaimed, and has been for forty years.",
    lore: [
      `Some sixty years ago, shield brother and shield sister took up arms against one another in
        vile disagreement over one question: who shall uphold the honour of the Companions and take
        up the mantle of Harbinger? It was decided that to claim Jorrvaskr was to prove the honour
        of one's claim, and from the division between Jorm Orc-born and Lok Merkiller came the
        twenty years of infighting known now as the Blood-Score.`,
      `It has been twice as long again since either would-be Harbinger died a gloriously bloody
        death, and yet the mighty hall remains unconquered. Some say it is fear of more bloodshed
        that prevents these so-called Companions from stepping forth; others believe the ancient
        warriors are no more.`,
    ],
    play: [
      `The legacy is not gone, and the hall is not held. A band with the courage to stand again for
        the honour of Skyrim, of ancient Nord culture and of Ysgramor could put the Companions back
        in Jorrvaskr, which is a story with a beginning available to players right now.`,
    ],
  },
  {
    name: "The College of Winterhold",
    cap: 25,
    standing: "Teaching three semesters, and the only place with reliable spellbook access.",
    lore: [
      `The College traces its history to the Cleverfolk, the shamans and spellsingers of the ancient
        Nords, and the worship of the Nordic Owl Totem. Though now mistrusted by the denizens of
        Skyrim, a great many Nords still hone their Craft under the watchful gaze of Jhunal, and are
        more than willing to impart their history and knowledge upon the stranger and foreigner
        alike.`,
      `Many former Mage's Guild neophytes have been drawn to Winterhold out of curiosity, as the
        philosophies of spellwork found within, the perception of magicka as a force of nature, are
        vastly different from the more manufactured and Aetheric teachings of Vanus Galerion.`,
      `The true depth of this land's mystical history cannot be contained within a reliquary. It
        lives on in the wilds, continued by hedgewitches and Ternion monks and everything in
        between. The Clever Craft dies in name alone, for its lessons are evergreen.`,
    ],
    play: [
      `Three semesters of formal instruction at rising prices: Novice, Apprentice, Adept. You must
        already know at least one spell to be admitted, so nearly everyone arrives via a Hold's
        Court Wizard first.`,
      `Past Adept you do not continue as a student. You stay on as a researcher or a professor's
        assistant, which is a role rather than a course.`,
      `Library access is effectively unlimited for students, which makes the College the one
        dependable source of spellbooks in the province.`,
      `**The College itself was rebuilt in 0.71.0**, as a working building with its own holdstone
        where the Shalidor statue used to stand. It is somewhere to go now rather than a name on a
        map, and past Adept it is the only route the rules recognise.`,
    ],
  },
  {
    name: "The Thieves' Guild",
    cap: 25,
    standing: "Several clans trading under one name, rather than a single organisation.",
    lore: [
      `Hidden in the shadows of betrayal and coin, the Thieves' Guild thrives buried under ice. Some
        say the Guild exists solely as an interloper of Imperial culture, that true Sons and
        Daughters of Kyne would never engage in such dishonourable criminality. Others argue this
        Guild shares only its name with the provincial counterparts: clans, both storied and new,
        trading alliances, services, agents and gold, all sharing the mask of the most notorious of
        collectives.`,
      `In the wake of the Great War the clans have enjoyed a berth of opportunity and profit. In
        harmony with its nature as a dark mirror to society, the Guild thrives on tragedy and must
        now prepare to face the hardships of peace: with the Concordat growing ever further behind,
        the threat of stability might mean a lack of desperation.`,
      `Furthermore, the machinations of individual clans are unending, and none can ever feel
        certain of the loyalty of thieves.`,
    ],
    play: [
      `Theft between players is governed by the robbery rules rather than by opportunity: limits on
        what may be taken, cooldowns between jobs, and a requirement to roleplay the break-in
        rather than simply loot.`,
      `Storage theft is permitted but bounded. Three items and five hundred gold, never emptying a
        container, and never the same target twice inside forty eight hours.`,
    ],
  },
];

/**
 * The Dark Brotherhood is deliberately not in the list above.
 *
 * It is whitelisted and it is the only sanctioned route to killing another
 * player's character without their consent, which makes it a rules topic rather
 * than a recruitment pitch. It lives on the rules page.
 */

export interface OrgRule {
  kind: string;
  cap: number;
  note?: string;
}

/** Member caps, from the organisation rules. Subject to change as the server grows. */
export const orgCaps: OrgRule[] = [
  { kind: "Lore factions", cap: 25 },
  { kind: "Houses, Orc strongholds and clans", cap: 12 },
  { kind: "Mercenary guilds, organisations, knightly orders, bandit factions", cap: 10 },
  { kind: "Khajiit caravans", cap: 6 },
];

export const orgLimits: string[] = [
  `Every organisation, of every type, is limited to **two official businesses or operations**.`,
  `Every organisation is limited to **one official hideout or headquarters**. A member's personal
    home may not be used for organisation activity unless it is the designated hideout.`,
  `Mercenary organisations, guilds and knightly orders are limited to **one per hold**, subject to
    change as the server grows.`,
  `Rosters must be kept up to date by the organisation's leader in their Mereth Discord.`,
  `Recruitment and out-of-character coordination happen in an official Mereth Discord. Lore
    factions have their own; everything else shares one with hidden categories per role.`,
  `**You may belong to one organisation at a time.** Not one per character, one full stop.`,
];

/**
 * The organisations that now have a stone standing in the world.
 *
 * Kept as a plain list rather than folded into `factions` above, because those
 * three have published lore and these do not all have it. What is published
 * about the rest is mechanical: a stone exists, you can pledge to it, and it
 * carries ranks and parcels the way a hold does. Writing them a personality here
 * would be inventing setting on an official page, which is the one thing this
 * site does not do.
 *
 * Wired into the system in 0.69.0, modelled and placed through 0.70.21, and
 * finished in 0.71.0 alongside the rebuilt College of Winterhold.
 */
export const factionStones: { name: string; note: string }[] = [
  { name: "The Companions", note: "Stone placed in the world in 0.70.21." },
  { name: "The Thieves' Guild", note: "Stone placed in the world in 0.70.21." },
  { name: "The Vigilants of Stendarr", note: "Stone placed in the world in 0.70.21." },
  { name: "The Volkihar", note: "Given its own model, then placed, in 0.70.21." },
  { name: "The Thalmor", note: "Given its own model, then placed, in 0.70.21." },
  {
    name: "The College of Winterhold",
    note: "Its stone replaced the Shalidor statue, and the College itself was rebuilt in 0.71.0.",
  },
];

/** How pledging to any stone works, hold or faction. Straight from the patch notes. */
export const stoneRules: string[] = [
  `**One stone at a time.** You cannot pledge to another until you leave the one you are in.`,
  `**A day between stones.** Switching carries a 24 hour cooldown, and so does being kicked out of
    one before you may join anywhere else.`,
  `**Nothing stacks.** Where two stones would give you the same benefit, only the higher applies.`,
  `**A rank lifts you, it does not promote you.** A stone's boost raises a skill up to a level and
    never past it, never above Expert, and never past level 60. It helps the under-tiered and does
    nothing for somebody already good.`,
  `**A stone decides who may join it**: open to anyone who pledges, invite only, or closed.`,
  `**Faction armour is a perk of the stone.** Since 0.72.34 the factions with stones can craft their
    own armour, and the recipe is awarded rather than bought.`,
];
