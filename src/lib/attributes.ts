/**
 * The attribute rules, as the server runs them.
 *
 * Read from the DEV build's gamemode.js on 28 October 2026 (line numbers in the
 * comments are that file's). Players were building characters blind because
 * racial bases and the point bank only exist server side: the client is handed
 * them at runtime and nothing published them.
 *
 * `npm test` runs this file directly with Node stripping the types, so it stays
 * free of imports, JSX and anything that needs a bundler.
 */

export const ATTRS = [
  "strength",
  "intelligence",
  "willpower",
  "agility",
  "speed",
  "endurance",
  "personality",
  "luck",
] as const;

export type AttrKey = (typeof ATTRS)[number];
export type Attrs = Record<AttrKey, number>;
export type Sex = "m" | "f";

export const ATTR_MAX = 100;
/** How far below its racial base any one attribute may be lowered (L6468-6470). */
export const DUMP_MAX = 5;
/** Unspent points at creation, and what each Master Level past the first adds (L6466, L11773). */
export const CREATION_BANK = 12;
export const BANK_PER_MASTER_LEVEL = 3;
export const MIN_CARRY = 40;

export interface Race {
  id: string;
  name: string;
  /** Vanilla race FormID, which the server keys the magicka bonus on. */
  formId: number;
  /** Str, Int, Wil, Agi, Spd, End, Per for [male, female]. Luck is 50 for every race. */
  bases: [number[], number[]];
}

/** L6497-6532. */
export const RACES: Race[] = [
  { id: "argonian", name: "Argonian", formId: 0x13740, bases: [[40, 40, 30, 50, 50, 30, 30], [40, 50, 40, 40, 40, 30, 30]] },
  { id: "breton", name: "Breton", formId: 0x13741, bases: [[40, 50, 50, 30, 30, 30, 40], [30, 50, 50, 30, 40, 30, 40]] },
  { id: "dunmer", name: "Dark Elf", formId: 0x13742, bases: [[40, 40, 30, 40, 50, 40, 30], [40, 40, 30, 40, 50, 30, 40]] },
  { id: "altmer", name: "High Elf", formId: 0x13743, bases: [[40, 50, 40, 40, 30, 40, 40], [40, 50, 40, 40, 40, 30, 40]] },
  { id: "imperial", name: "Imperial", formId: 0x13744, bases: [[40, 40, 30, 30, 40, 40, 50], [40, 40, 40, 30, 30, 40, 50]] },
  { id: "khajiit", name: "Khajiit", formId: 0x13745, bases: [[40, 40, 30, 50, 40, 30, 40], [30, 40, 30, 50, 40, 40, 40]] },
  { id: "nord", name: "Nord", formId: 0x13746, bases: [[50, 30, 30, 40, 40, 50, 30], [50, 30, 40, 40, 40, 40, 30]] },
  { id: "orc", name: "Orc", formId: 0x13747, bases: [[45, 30, 50, 35, 30, 50, 30], [45, 40, 45, 35, 30, 50, 25]] },
  { id: "redguard", name: "Redguard", formId: 0x13748, bases: [[50, 30, 30, 40, 40, 50, 30], [40, 30, 30, 40, 40, 50, 40]] },
  { id: "bosmer", name: "Wood Elf", formId: 0x13749, bases: [[30, 40, 30, 50, 50, 40, 30], [30, 40, 30, 50, 50, 30, 40]] },
];

/** L6542-6546. */
const MAGICKA_BONUS: Record<number, number> = { 0x13741: 50, 0x13743: 100 };

/** Which attribute feeds each skill's hidden bonus (L5969-6034). Luck feeds none. */
export const GOVERNS: Record<Exclude<AttrKey, "luck">, string[]> = {
  strength: ["swords", "axes", "mace", "warhammer", "battleaxe", "greatsword", "heavyarmour", "block", "unarmed", "weaponsmithing", "armoursmithing", "onehanded", "twohanded", "shieldheavy"],
  intelligence: ["alchemy", "enchanting", "conjuration", "spellcasting", "firstaid"],
  willpower: ["alteration", "destruction", "restoration"],
  agility: ["sneaking", "lockpicking", "pickpocketing", "bows", "crossbows", "lightarmour", "daggers", "dualwield", "acrobatics", "fishing", "hunting", "leatherworking", "tailoring", "archery", "shieldlight", "jewelcrafting"],
  speed: ["athletics", "horseriding", "animaltaming"],
  endurance: ["mining", "woodcutting", "farming", "saltmaking", "smelting", "beekeeping", "lycanthropy", "herbalism", "brewing", "cooking", "carpentry", "vampirism"],
  personality: ["musicianship", "illusion"],
};

export function governorOf(skill: string): AttrKey | null {
  for (const [attr, skills] of Object.entries(GOVERNS)) {
    if (skills.includes(skill)) return attr as AttrKey;
  }
  return null;
}

export function racialBase(race: Race, sex: Sex): Attrs {
  const row = race.bases[sex === "m" ? 0 : 1];
  const out = { luck: 50 } as Attrs;
  ATTRS.slice(0, 7).forEach((key, i) => {
    out[key] = row[i] ?? 40;
  });
  return out;
}

export function bankFor(masterLevel: number): number {
  return CREATION_BANK + BANK_PER_MASTER_LEVEL * Math.max(0, Math.floor(masterLevel) - 1);
}

export function floorOf(base: number): number {
  return Math.max(0, base - DUMP_MAX);
}

/** Points the build spends: raises cost one each, lowering refunds one each. */
export function spentOn(base: Attrs, attrs: Attrs): number {
  return ATTRS.reduce((sum, key) => sum + (attrs[key] - base[key]), 0);
}

/** Whether the server would accept this build for this bank. */
export function isLegal(base: Attrs, attrs: Attrs, bank: number): boolean {
  return (
    ATTRS.every((key) => attrs[key] >= floorOf(base[key]) && attrs[key] <= ATTR_MAX) &&
    spentOn(base, attrs) <= bank
  );
}

/** The hidden skill modifier: floor((attr - 50) * 0.2), so 70 is +4 and 45 is -1 (L6047-6049). */
export function skillBonus(attr: number): number {
  return Math.floor((attr - 50) * 0.2);
}

/**
 * The level a skill plays at once you reach its tier's ceiling, counting only
 * the attribute bonus. The server clamps the sum to 1..99 (L14905-14910), so a
 * bonus can carry a skill past the tier its memory points bought.
 */
export function playsAt(trained: number, bonus: number): number {
  if (trained <= 0) return 0;
  if (trained >= 100) return 100;
  return Math.min(99, Math.max(1, trained + bonus));
}

export interface Pools {
  health: number;
  magicka: number;
  stamina: number;
  carry: number;
  spellPoints: number;
  /** Multiplier on study time, below 1 is faster. */
  studyTime: number;
  studySlots: number;
}

/** L6570-6599, carry floor L32775-32803. */
export function poolsOf(a: Attrs, race: Race): Pools {
  return {
    health: Math.floor(2 * a.endurance + a.strength),
    magicka: Math.floor(3 * a.intelligence + a.willpower + (MAGICKA_BONUS[race.formId] ?? 0)),
    stamina: Math.floor(2 * a.endurance + a.agility),
    carry: Math.max(MIN_CARRY, Math.floor((a.strength + a.endurance) * 1.25 + 10)),
    spellPoints: Math.floor((3 * a.intelligence + a.willpower) / 4),
    studyTime: 1 - (a.willpower - 50) * 0.006 - (a.intelligence - 50) * 0.002,
    studySlots: a.intelligence >= 85 && a.willpower >= 65 ? 2 : 1,
  };
}

export interface LuckEffects {
  /** Multiplier on crafting and gathering failure chance. */
  failRate: number;
  /** Chance of a +1 (positive) or -1 (negative) yield roll, signed. */
  yieldRoll: number;
  /** Chance of a gathering extra-item roll. */
  extraItem: number;
  /** Multiplier on loot counts. */
  loot: number;
}

/** L486-527, L614-618. */
export function luckEffects(luck: number): LuckEffects {
  const d = Math.min(1, Math.max(-1, (luck - 50) / 50));
  return {
    failRate: 1 - 0.3 * d,
    yieldRoll: 0.2 * d,
    extraItem: 0.5 + 0.25 * d,
    loot: 1 + 0.4 * d,
  };
}

/** Escalating reset cooldown by resets in a rolling 30 days (L10509-10522, L12008-12030). */
export const RESET_COOLDOWNS = ["24 hours", "3 days", "7 days", "30 days"];

/**
 * `nord.m.1.str:5,lck:-5` for a share link: race, sex, Master Level, then each
 * attribute's change from its racial base. Untrusted on the way in, so anything
 * unreadable or illegal comes back as null and the planner starts fresh.
 */
const SHORT: Record<AttrKey, string> = {
  strength: "str", intelligence: "int", willpower: "wil", agility: "agi",
  speed: "spd", endurance: "end", personality: "per", luck: "lck",
};

export function formatBuild(race: Race, sex: Sex, masterLevel: number, base: Attrs, attrs: Attrs): string {
  const deltas = ATTRS.filter((key) => attrs[key] !== base[key])
    .map((key) => `${SHORT[key]}:${attrs[key] - base[key]}`)
    .join(",");
  return `${race.id}.${sex}.${masterLevel}.${deltas}`;
}

export function parseBuild(
  text: string,
): { race: Race; sex: Sex; masterLevel: number; attrs: Attrs } | null {
  const [raceId, sex, ml, deltas = ""] = text.split(".");
  const race = RACES.find((r) => r.id === raceId);
  const masterLevel = Number(ml);
  if (race === undefined || (sex !== "m" && sex !== "f")) return null;
  if (!Number.isInteger(masterLevel) || masterLevel < 1 || masterLevel > 200) return null;

  const base = racialBase(race, sex);
  const attrs = { ...base };
  for (const pair of deltas.split(",").filter(Boolean)) {
    const [short, value] = pair.split(":");
    const key = ATTRS.find((k) => SHORT[k] === short);
    const delta = Number(value);
    if (key === undefined || !Number.isInteger(delta)) return null;
    attrs[key] = base[key] + delta;
  }
  return isLegal(base, attrs, bankFor(masterLevel)) ? { race, sex, masterLevel, attrs } : null;
}
