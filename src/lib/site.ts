/**
 * One source of truth for the shell: names, navigation and footer columns.
 *
 * The navigation is organised around what a player is trying to find out, not
 * around the sections a game website traditionally has. Two ideas carry it:
 *
 *   Handbook  prose. Read it once, in order, and you know how to play.
 *   Codex     data. Look something up when you need it.
 *
 * Everything else (news, community, the account pages) hangs off those two.
 */

export interface NavLink {
  label: string;
  href: string;
  /** Shown under the label inside a dropdown, so a menu explains itself. */
  hint?: string;
}

export interface NavItem {
  label: string;
  /** A plain link, or a dropdown when `menu` is present. */
  href?: string;
  menu?: readonly NavLink[];
}

/**
 * External links that appear on many surfaces.
 *
 * One constant each, because an invite that changes has to change in one place,
 * and a dead invite on a page nobody edited is the worst kind of stale.
 */
/*
 * The launcher, straight from Mereth's own storage. Taken from the official
 * site's own download handler rather than guessed, and the size is what the
 * server reports so a reader knows what an 86 MB download is meant to look
 * like before it starts.
 */
export const LAUNCHER_DOWNLOAD = "https://storage.bstarrp.com/launcher/BStarRP_SkyMP_Launcher.exe";
export const LAUNCHER_SIZE_MB = 86;

export const DISCORD_INVITE = "https://discord.com/invite/mereth";
export const PATREON_URL = "https://www.patreon.com/cw/merethroleplay";
export const TRAILER_ID = "KK28lxLJCbw";
export const RULES_DOC_URL =
  "https://docs.google.com/document/d/1AhSN2rsXZox0ISYFghavl0t4FJueDWUZ1VcckBUzEHM/edit";
/* The Teaching Guidelines, Revision 1. Published by the Magic Team as its own
   document rather than as a chapter of the rulebook, so it gets its own link. */
export const TEACHING_DOC_URL =
  "https://docs.google.com/document/d/13nalr1rOF9BUGdiQUSZemDr-FWtZDUNxFBEpfUPKxwg/edit";

export const site = {
  name: "Mereth",
  tagline: "Skyrim Roleplay",
  /* 160 characters is where Google truncates a description, and this was 166,
     so the last clause was being cut mid-phrase in every result. It also now
     names SkyMP, which is what somebody looking for a Skyrim multiplayer
     roleplay server actually types. */
  description:
    "A serious roleplay Skyrim server on SkyMP, set in 4E 185 after the White-Gold Concordat. Memory points, professions, holds, magic and law, explained.",
  copyright: "© 4E 185 Mereth Roleplay",
} as const;

export const handbookMenu: readonly NavLink[] = [
  { label: "The Guide", href: "/guide", hint: "How the server works, end to end" },
  { label: "Roleplay Language", href: "/language", hint: "How to say it in character" },
  { label: "Progression", href: "/progression", hint: "What a tier is actually worth" },
  { label: "Teaching Magic", href: "/teaching", hint: "The Teacher whitelist, and what it demands" },
  { label: "Food, Drink and Energy", href: "/survival", hint: "The three bars, explained" },
  { label: "Tips", href: "/tips", hint: "The numbers, cooldowns and traps" },
  { label: "Questions", href: "/faq", hint: "Answers to what gets asked most" },
];

export const codexMenu: readonly NavLink[] = [
  { label: "Skills", href: "/skills", hint: "51 skills, and an 18 point planner" },
  { label: "Magic", href: "/magic", hint: "Every spell, with its tier" },
  { label: "Crafting", href: "/crafting", hint: "Benches, recipes and alchemy" },
  { label: "The World", href: "/world", hint: "Parcels, keys, races, the calendar" },
  { label: "The Modlist", href: "/records", hint: "What the launcher installs" },
];

/** Behind the Realm dropdown in the navbar. */
export const realmMenu: readonly NavLink[] = [
  { label: "The Nine Holds", href: "/holds", hint: "The seats, and who sits them" },
  { label: "Factions", href: "/factions", hint: "What they are in 4E 185" },
  { label: "Lore", href: "/lore", hint: "The province, in its own documents" },
  { label: "Rules", href: "/rules", hint: "The rulebook, with its codes" },
  { label: "Roadmap", href: "/roadmap", hint: "What is built and what is next" },
  { label: "Latest Q&A", href: "/qa", hint: "The team on where things are heading" },
  { label: "Changelog", href: "/changelog", hint: "Every patch note, searchable" },
  { label: "Gallery", href: "/gallery", hint: "Screenshots from the province" },
];

/** Behind the Community dropdown in the navbar. */
export const communityMenu: readonly NavLink[] = [
  { label: "Discord", href: "/discord", hint: "Your login, and the front door" },
  { label: "The Hall", href: "/community", hint: "Where the server lives between patches" },
  { label: "Credits", href: "/credits", hint: "The authors we install" },
  { label: "Getting help", href: "/support", hint: "Where to take a problem" },
  { label: "Supporting Mereth", href: "/donate", hint: "How the server is funded" },
];

export const primaryNav: readonly NavItem[] = [
  { label: "Start Here", href: "/start" },
  { label: "Handbook", menu: handbookMenu },
  { label: "Codex", menu: codexMenu },
  { label: "The Realm", menu: realmMenu },
  { label: "Community", menu: communityMenu },
];

export const footerColumns: readonly { heading: string; links: readonly NavLink[] }[] = [
  {
    heading: "Handbook",
    links: [
      { label: "Start Here", href: "/start" },
      { label: "The Guide", href: "/guide" },
      { label: "Roleplay Language", href: "/language" },
      { label: "Progression", href: "/progression" },
      { label: "Teaching Magic", href: "/teaching" },
      { label: "Food, Drink and Energy", href: "/survival" },
      { label: "Tips", href: "/tips" },
      { label: "Questions", href: "/faq" },
    ],
  },
  {
    heading: "Codex",
    links: [
      { label: "Skills", href: "/skills" },
      { label: "Magic", href: "/magic" },
      { label: "Crafting", href: "/crafting" },
      { label: "The World", href: "/world" },
      { label: "The Modlist", href: "/records" },
    ],
  },
  {
    heading: "The Realm",
    links: [
      { label: "The Nine Holds", href: "/holds" },
      { label: "Factions", href: "/factions" },
      { label: "Lore", href: "/lore" },
      { label: "Rules", href: "/rules" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Changelog", href: "/changelog" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Getting help", href: "/support" },
      { label: "Discord", href: "/discord" },
      { label: "Supporting Mereth", href: "/donate" },
      { label: "Credits", href: "/credits" },
    ],
  },
];

export const legalLinks: readonly NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Refunds", href: "/refunds" },
  { label: "Terms", href: "/terms" },
];

/** Every route the search palette and the sitemap should know about. */
export const allNavLinks: readonly NavLink[] = [
  { label: "Start Here", href: "/start" },
  ...handbookMenu,
  ...codexMenu,
  ...realmMenu,
  ...communityMenu,
];
