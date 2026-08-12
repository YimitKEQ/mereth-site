/**
 * Shop and inventory data.
 *
 * Stands in for what the game database returns. Shaped the way an API would
 * shape it (ids, enums, timestamps as display strings) so swapping in a fetch
 * later is a change of source, not of every component that reads it.
 */

export type ItemCategory =
  | "character-services"
  | "premium-services"
  | "heirlooms"
  | "mounts"
  | "pets"
  | "tabards"
  | "toys"
  | "misc";

export type ClaimStatus = "claimed" | "unclaimed" | "expired";

export interface ShopItem {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  blurb: string;
}

export interface InventoryEntry {
  id: string;
  itemId: string;
  name: string;
  category: ItemCategory;
  status: ClaimStatus;
  purchasedAt: string;
  claimedBy?: string;
}

export const categoryLabels: Record<ItemCategory, string> = {
  "character-services": "Character Services",
  "premium-services": "Premium Services",
  heirlooms: "Heirlooms",
  mounts: "Mounts",
  pets: "Pets",
  tabards: "Tabards",
  toys: "Toys",
  misc: "Misc",
};

export const characters: readonly string[] = [
  "Shadowblade",
  "Emberfall",
  "Mistwalker",
  "Ironbrew",
];

export const shopItems: readonly ShopItem[] = [
  { id: "jadewind-serpent", name: "Jadewind Serpent", category: "mounts", price: 2400, blurb: "A cloud serpent raised in the Jade Forest." },
  { id: "stormcaller-kite", name: "Stormcaller Kite", category: "mounts", price: 2800, blurb: "Rides the updrafts above Kun-Lai." },
  { id: "name-change", name: "Name Change", category: "character-services", price: 600, blurb: "One rename, applied at next login." },
  { id: "faction-change", name: "Faction Change", category: "character-services", price: 1800, blurb: "Switch sides, keeping progress and reputation." },
  { id: "server-transfer", name: "Realm Transfer", category: "character-services", price: 1500, blurb: "Move a character between realms." },
  { id: "premium-month", name: "Premium, One Month", category: "premium-services", price: 1200, blurb: "Extra bag space, a second talent set, and a queue skip." },
  { id: "heirloom-bundle", name: "Heirloom Bundle", category: "heirlooms", price: 3200, blurb: "The full set, scaling to 90." },
  { id: "jade-cub", name: "Jade Cub", category: "pets", price: 800, blurb: "Follows you and judges your pulls." },
  { id: "lantern-toy", name: "Sky Lantern", category: "toys", price: 450, blurb: "Releases a lantern that drifts for a minute." },
  { id: "guild-tabard", name: "Commemorative Tabard", category: "tabards", price: 500, blurb: "Marks the alpha. Never sold again." },
  { id: "bag-slot", name: "Bank Tab", category: "misc", price: 700, blurb: "One more tab, account wide." },
];

export const inventory: readonly InventoryEntry[] = [
  { id: "inv-1", itemId: "jadewind-serpent", name: "Jadewind Serpent", category: "mounts", status: "unclaimed", purchasedAt: "Feb 15, 2026" },
  { id: "inv-2", itemId: "jadewind-serpent", name: "Jadewind Serpent", category: "mounts", status: "unclaimed", purchasedAt: "Feb 15, 2026" },
  { id: "inv-3", itemId: "jadewind-serpent", name: "Jadewind Serpent", category: "mounts", status: "claimed", purchasedAt: "Feb 15, 2026", claimedBy: "Shadowblade" },
  { id: "inv-4", itemId: "stormcaller-kite", name: "Stormcaller Kite", category: "mounts", status: "unclaimed", purchasedAt: "Feb 14, 2026" },
  { id: "inv-5", itemId: "name-change", name: "Name Change", category: "character-services", status: "claimed", purchasedAt: "Feb 11, 2026", claimedBy: "Emberfall" },
  { id: "inv-6", itemId: "premium-month", name: "Premium, One Month", category: "premium-services", status: "unclaimed", purchasedAt: "Feb 10, 2026" },
  { id: "inv-7", itemId: "jade-cub", name: "Jade Cub", category: "pets", status: "claimed", purchasedAt: "Feb 2, 2026", claimedBy: "Mistwalker" },
  { id: "inv-8", itemId: "lantern-toy", name: "Sky Lantern", category: "toys", status: "expired", purchasedAt: "Dec 20, 2025" },
  { id: "inv-9", itemId: "heirloom-bundle", name: "Heirloom Bundle", category: "heirlooms", status: "unclaimed", purchasedAt: "Feb 9, 2026" },
  { id: "inv-10", itemId: "guild-tabard", name: "Commemorative Tabard", category: "tabards", status: "unclaimed", purchasedAt: "Feb 8, 2026" },
];

export const walletBalance = 12450;

/** The signed-in player. A session would supply this. */
export const currentUser = {
  name: "Tareq Alassar",
  handle: "tareq",
} as const;
