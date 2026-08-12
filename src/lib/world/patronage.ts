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
 */

export interface Tier {
  /** The name as it appears on Patreon. */
  name: string;
  /** The skill tier it is named for, which is also where its colour comes from. */
  rank: string;
  /** The tier price as Patreon defines it, in US dollars. */
  usd: number;
  slots: number;
  /** The in-game title the tier grants. */
  title: string;
}

export const tiers: Tier[] = [
  { name: "Hero I", rank: "Novice", usd: 5, slots: 1, title: "Wayfarer" },
  { name: "Hero II", rank: "Apprentice", usd: 10, slots: 2, title: "Oathbound" },
  { name: "Hero III", rank: "Adept", usd: 15, slots: 3, title: "Mereth's Chosen" },
  { name: "Hero IV", rank: "Expert", usd: 25, slots: 4, title: "Dawn Patron" },
  { name: "Hero V", rank: "Master", usd: 40, slots: 5, title: "Starforged" },
  { name: "Hero VI", rank: "Legendary", usd: 60, slots: 6, title: "Mereth Eternal" },
];


