/**
 * The Patreon tiers.
 *
 * Named after the skill tiers on purpose, so each one is coloured with that
 * tier's own colour from the client. Prices and benefits are transcribed from
 * Patreon; if they change there, change them here.
 *
 * The currency is euros, checked against the live membership page rather than
 * assumed: it serves euro symbols and no others, and the six prices are 1x, 2x,
 * 3x, 5x and 8x a 4.50 base, the same shape as the memory point costs. Patreon
 * may show a reader a converted amount depending on where they are, which is
 * why the page now says so rather than leaving people to argue about it.
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
  euros: number;
  slots: number;
  /** The in-game title the tier grants. */
  title: string;
}

export const tiers: Tier[] = [
  { name: "Hero I", rank: "Novice", euros: 4.5, slots: 1, title: "Wayfarer" },
  { name: "Hero II", rank: "Apprentice", euros: 9, slots: 2, title: "Oathbound" },
  { name: "Hero III", rank: "Adept", euros: 13.5, slots: 3, title: "Mereth's Chosen" },
  { name: "Hero IV", rank: "Expert", euros: 22.5, slots: 4, title: "Dawn Patron" },
  { name: "Hero V", rank: "Master", euros: 36, slots: 5, title: "Starforged" },
  { name: "Hero VI", rank: "Legendary", euros: 54, slots: 6, title: "Mereth Eternal" },
];


