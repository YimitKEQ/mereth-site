import { buyableTiers } from "@/lib/mereth";

/**
 * The numbers behind learning a spell, in one place.
 *
 * Three pages quote them (the magic codex, the teaching guidelines and the
 * FAQ) and an earlier version of this site had them written out by hand on two
 * of those, which is how "a week per tier" survived on one page for weeks after
 * the real table replaced it. The tier names and their point costs come from
 * the client's own tier table rather than being retyped here, because a spell
 * costs exactly what the matching skill rank costs in memory points.
 */

/**
 * Days a spell of each tier sits in the grimoire before it is learned.
 *
 * Cut in 0.72.9 (7 September) from 7/14/21/28/35. The note reads "Adjusted spell
 * learning times to 5, 10, 15, 25, 35 days per tier", so only Master is unchanged
 * and the whole lower ladder moved. Four pages quoted the old numbers.
 */
export const studyDays: Record<string, number> = {
  Novice: 5,
  Apprentice: 10,
  Adept: 15,
  Expert: 25,
  Master: 35,
};

/** Spell points every character starts with. Nobody starts with more. */
export const SPELL_POINTS_START = 50;

/** Spell points' worth of learned spells a Master needs before applying to teach. */
export const TEACHER_POINTS_REQUIRED = 40;

/** Days a repeat lesson takes off a study already running. */
export const LESSON_DAYS_SAVED = 1;

/** Apprentices one Teacher may hold at a time. */
export const MAX_APPRENTICES = 3;

/**
 * One row per tier: what a spell of that tier costs, and how long it takes.
 *
 * Rendered by both the magic page and the teaching page, under different
 * headings, so the two can never disagree about a number.
 */
export function spellTierRows(): string[][] {
  return buyableTiers.map((tier) => [
    `**${tier.name}**`,
    `${tier.cost} ${tier.cost === 1 ? "point" : "points"}`,
    `${studyDays[tier.name] ?? 0} days`,
  ]);
}
