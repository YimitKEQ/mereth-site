/**
 * The Patreon tiers.
 *
 * Named after the skill tiers on purpose, so each one is coloured with that
 * tier's own colour from the client. Prices and benefits are transcribed from
 * Patreon; if they change there, change them here.
 *
 * The currency is US dollars, and getting this right took three attempts.
 * Reading the rendered page is not enough: Patreon converts tier prices into
 * the viewer's own currency, so the same page shows euros here and dollars in
 * the United States. The tier definitions in its payload carry
 * `"currency":"USD"` with `amount_cents` of 500, 1000, 1500, 2500, 4000 and
 * 6000, and the euro figures sit beside them under `patron_currency`. The
 * numbers below are the definitions. The page says the conversion happens, so
 * nobody has to argue about it again.
 *
 * Worth keeping straight when editing: every benefit is a **character slot, a
 * title or a Discord role**. None of it is power. That is the line the donate
 * page makes explicitly, and adding anything to this list that crosses it would
 * make the page a lie.
 *
 * Titles last re-read from Patreon on 2026-08-20, when four of the six changed.
 * Read them from `/cw/merethroleplay/membership`, not from the campaign home
 * page: the home page shows only the cheapest price and no tier list at all.
 * Patreon's own wording is "Custom Title Prefix", so these sit in front of a
 * character's name rather than replacing it, and the page says prefix for that
 * reason.
 */

export interface Tier {
  /** The name as it appears on Patreon. */
  name: string;
  /** The skill tier it is named for, which is also where its colour comes from. */
  rank: string;
  /** The tier price as Patreon defines it, in US dollars. */
  usd: number;
  slots: number;
  /**
   * The title prefix the tier grants.
   *
   * A list, because the top tier grants a choice of two rather than one title,
   * and flattening that to a single string would either hide the choice or
   * invent a slash that reads as part of the title itself.
   */
  titles: string[];
}

export const tiers: Tier[] = [
  { name: "Hero I", rank: "Novice", usd: 5, slots: 1, titles: ["Wayfarer"] },
  { name: "Hero II", rank: "Apprentice", usd: 10, slots: 2, titles: ["Patron"] },
  { name: "Hero III", rank: "Adept", usd: 15, slots: 3, titles: ["Chosen"] },
  { name: "Hero IV", rank: "Expert", usd: 25, slots: 4, titles: ["Dawnmarked"] },
  { name: "Hero V", rank: "Master", usd: 40, slots: 5, titles: ["Starforged"] },
  {
    name: "Hero VI",
    rank: "Legendary",
    usd: 60,
    slots: 6,
    titles: ["Oathbound", "Oathbreaker"],
  },
];


