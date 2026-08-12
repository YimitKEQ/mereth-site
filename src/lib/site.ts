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

export const site = {
  name: "Mereth",
  tagline: "Skyrim Roleplay",
  description:
    "Mereth Roleplay: a serious roleplay Skyrim server set in 4E 185, ten years after the White-Gold Concordat. Memory points, professions, holds, magic and law, explained.",
  copyright: "© 4E 185 Mereth Roleplay",
} as const;

export const handbookMenu: readonly NavLink[] = [
  { label: "The Guide", href: "/guide", hint: "How the server works, end to end" },
  { label: "Progression", href: "/progression", hint: "What a tier is actually worth" },
  { label: "Food and Exhaustion", href: "/survival", hint: "The four bars, explained" },
  { label: "Tips", href: "/tips", hint: "The numbers, cooldowns and traps" },
  { label: "Questions", href: "/faq", hint: "Answers to what gets asked most" },
];

export const codexMenu: readonly NavLink[] = [
  { label: "Skills", href: "/skills", hint: "51 skills, and an 18 point planner" },
  { label: "Magic", href: "/magic", hint: "Every spell, with its tier" },
  { label: "Crafting", href: "/crafting", hint: "Benches, recipes and alchemy" },
  { label: "The World", href: "/world", hint: "Parcels, keys, races, the calendar" },
  { label: "Records", href: "/records", hint: "Search everything in the province" },
];

/** Behind the Realm dropdown in the navbar. */
export const realmMenu: readonly NavLink[] = [
  { label: "The Nine Holds", href: "/holds", hint: "The seats, and who sits them" },
  { label: "Factions", href: "/factions", hint: "What they are in 4E 185" },
  { label: "Rules", href: "/rules", hint: "The rulebook, with its codes" },
  { label: "Roadmap", href: "/roadmap", hint: "What is built and what is next" },
  { label: "Chronicle", href: "/news", hint: "What shipped, and when" },
];

/** Behind the Community dropdown in the navbar. */
export const communityMenu: readonly NavLink[] = [
  { label: "Discord", href: "/discord", hint: "Your login, and the front door" },
  { label: "The Hall", href: "/community", hint: "Where the server lives between patches" },
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
      { label: "Progression", href: "/progression" },
      { label: "Food and Exhaustion", href: "/survival" },
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
      { label: "Records", href: "/records" },
    ],
  },
  {
    heading: "The Realm",
    links: [
      { label: "The Nine Holds", href: "/holds" },
      { label: "Factions", href: "/factions" },
      { label: "Rules", href: "/rules" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Chronicle", href: "/news" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Getting help", href: "/support" },
      { label: "Discord", href: "/discord" },
      { label: "Supporting Mereth", href: "/donate" },
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
