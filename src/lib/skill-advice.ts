/**
 * What a plan is missing, and a few plans to start from.
 *
 * Every rule below is quoted from the skill's own description in the exported
 * bundle, which came out of the client. None of it is advice this site invented,
 * because a planner that makes up rules is worse than one that stays quiet: a
 * reader has no way to tell the two apart, and these points cannot be taken back
 * without burning the experience earned in the tier you drop out of.
 *
 * The traps are real ones. Magic without Spellcasting does nothing in combat. A
 * combat style with no weapon specialisation under it has no damage. A shield
 * skill with no Block does not mitigate. Each of those is a plan that looks fine
 * on the board and fails in play.
 */

/** Schools that actually cast. Alchemy and Enchanting are bench work, not spells. */
const CASTING = ["conjuration", "alteration", "destruction", "illusion", "restoration"];

const ONE_HANDED_WEAPONS = ["daggers", "swords", "mace", "axes", "unarmed"];
const TWO_HANDED_WEAPONS = ["greatsword", "battleaxe", "warhammer"];
const RANGED_WEAPONS = ["bows", "crossbows"];

export interface Advice {
  id: string;
  title: string;
  detail: string;
  triggers: (plan: Map<string, number>) => boolean;
}

const has = (plan: Map<string, number>, key: string): boolean => plan.has(key);
const hasAny = (plan: Map<string, number>, keys: string[]): boolean => keys.some((k) => plan.has(k));

export const ADVICE: Advice[] = [
  {
    id: "magic-needs-spellcasting",
    title: "Magic without Spellcasting does nothing in a fight.",
    detail:
      "Spellcasting is the foundation of all magic. Without it on your plan, spells have no combat effect.",
    triggers: (plan) => hasAny(plan, CASTING) && !has(plan, "spellcasting"),
  },
  {
    id: "onehanded-needs-weapon",
    title: "One-Handed has no weapon under it.",
    detail:
      "One-Handed improves stamina efficiency on the swing. Pair it with a weapon specialization, daggers, swords, maces, war axes or unarmed, for damage and weapon access.",
    triggers: (plan) => has(plan, "onehanded") && !hasAny(plan, ONE_HANDED_WEAPONS),
  },
  {
    id: "twohanded-needs-weapon",
    title: "Two-Handed has no weapon under it.",
    detail:
      "Two-Handed improves stamina efficiency on the swing. Pair it with greatswords, battleaxes or warhammers for damage and weapon access.",
    triggers: (plan) => has(plan, "twohanded") && !hasAny(plan, TWO_HANDED_WEAPONS),
  },
  {
    id: "archery-needs-weapon",
    title: "Archery has no weapon under it.",
    detail:
      "Archery improves stamina efficiency when drawing and holding. Pair it with the Bows or Crossbows specialization for damage and weapon access.",
    triggers: (plan) => has(plan, "archery") && !hasAny(plan, RANGED_WEAPONS),
  },
  {
    id: "weapon-needs-style",
    title: "A weapon specialization with no combat style behind it.",
    detail:
      "The specialization grants the weapon and its damage; the style grants the vanilla perks and the stamina efficiency. Most builds carry both.",
    triggers: (plan) =>
      (hasAny(plan, ONE_HANDED_WEAPONS) && !has(plan, "onehanded")) ||
      (hasAny(plan, TWO_HANDED_WEAPONS) && !has(plan, "twohanded")) ||
      (hasAny(plan, RANGED_WEAPONS) && !has(plan, "archery")),
  },
  {
    id: "shield-needs-block",
    title: "A shield skill without Block does not mitigate.",
    detail:
      "Light and Heavy Shield are required to mitigate blocked hits with that shield, and both scale with Block. Without Block on the plan there is nothing for them to scale.",
    triggers: (plan) => hasAny(plan, ["shieldlight", "shieldheavy"]) && !has(plan, "block"),
  },
  {
    id: "block-needs-shield",
    title: "Block is planned, but no shield skill is.",
    detail:
      "Block trains on any successful block, so this is fine bare-handed or with a weapon. While using a shield you must also carry the matching Light or Heavy Shield skill.",
    triggers: (plan) => has(plan, "block") && !hasAny(plan, ["shieldlight", "shieldheavy"]),
  },
];

export interface Preset {
  name: string;
  blurb: string;
  /** Skill key to tier. Every one of these spends the full eighteen. */
  plan: Record<string, number>;
}

/**
 * Starting points, not recommendations.
 *
 * Each spends all eighteen and satisfies the rules above, so a reader who takes
 * one and changes nothing has a plan that works rather than one that quietly
 * fails in play. They are deliberately archetypes a roleplay server actually
 * has, rather than an attempt at an optimal build, which is not a thing that
 * exists when the point of the character is who they are.
 */
export const PRESETS: Preset[] = [
  {
    name: "Smith",
    blurb: "Master weaponsmith. Digs and fells what the forge needs.",
    plan: { weaponsmithing: 5, armoursmithing: 3, smelting: 3, mining: 2, woodcutting: 1, carpentry: 1 },
  },
  {
    name: "Court mage",
    blurb: "Destruction and wards, with the enchanting to supply a court.",
    plan: { spellcasting: 5, destruction: 4, alteration: 3, enchanting: 2 },
  },
  {
    name: "Hunter",
    blurb: "Bow, quiet feet, and the skills to bring the carcass home.",
    plan: { archery: 4, bows: 4, hunting: 3, sneaking: 3, lightarmour: 2 },
  },
  {
    name: "Hold guard",
    blurb: "Shield wall, heavy plate, a sword that does not need to be clever.",
    plan: { block: 4, heavyarmour: 4, shieldheavy: 3, onehanded: 3, swords: 2 },
  },
  {
    name: "Thief",
    blurb: "Locks, pockets, and a dagger for when neither worked.",
    plan: { sneaking: 4, lockpicking: 3, pickpocketing: 3, daggers: 3, onehanded: 2, lightarmour: 2 },
  },
  {
    name: "Alchemist",
    blurb: "Field herbalist. Gathers it, brews it, and sells the rest.",
    plan: { alchemy: 5, herbalism: 4, farming: 3, cooking: 2 },
  },
];
