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
    "The player's handbook for Mereth: a serious-roleplay Skyrim server set in 4E 185, ten years after the White-Gold Concordat. Memory points, professions, holds, magic and law, explained.",
  copyright: "© 4E 185 Mereth Roleplay",
} as const;

export const handbookMenu: readonly NavLink[] = [
  { label: "The Guide", href: "/guide", hint: "How the server works, end to end" },
  { label: "Tips", href: "/tips", hint: "The numbers, cooldowns and traps" },
  { label: "Questions", href: "/faq", hint: "Answers, and where each one came from" },
];

export const codexMenu: readonly NavLink[] = [
  { label: "Skills", href: "/skills", hint: "51 skills, and an 18 point planner" },
  { label: "Magic", href: "/magic", hint: "The pipeline, and every spell" },
  { label: "Crafting", href: "/crafting", hint: "Benches, recipes and alchemy" },
  { label: "The World", href: "/world", hint: "Holds, parcels, races, the calendar" },
  { label: "Records", href: "/records", hint: "Search everything in the province" },
];

/** Behind the Community dropdown in the navbar. */
export const communityMenu: readonly NavLink[] = [
  { label: "The Hall", href: "/community", hint: "Where the server lives between patches" },
  { label: "Discord", href: "/discord", hint: "Your login, and the front door" },
  { label: "Officers", href: "/staff", hint: "Who runs what" },
  { label: "Laws", href: "/rules", hint: "The rules, in full" },
];

export const primaryNav: readonly NavItem[] = [
  { label: "Start Here", href: "/start" },
  { label: "Handbook", menu: handbookMenu },
  { label: "Codex", menu: codexMenu },
  { label: "Chronicle", href: "/news" },
  { label: "Community", menu: communityMenu },
];

export const footerColumns: readonly { heading: string; links: readonly NavLink[] }[] = [
  {
    heading: "Handbook",
    links: [
      { label: "Start Here", href: "/start" },
      { label: "The Guide", href: "/guide" },
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
      { label: "Chronicle", href: "/news" },
      { label: "The Hall", href: "/community" },
      { label: "Officers", href: "/staff" },
      { label: "Laws", href: "/rules" },
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
  { label: "Chronicle", href: "/news" },
  ...communityMenu,
];
