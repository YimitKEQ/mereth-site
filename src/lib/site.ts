/**
 * One source of truth for the shell: names, navigation and footer columns.
 * Rebranding starts here and in globals.css.
 */

export interface NavLink {
  label: string;
  href: string;
}

export const site = {
  name: "Mereth",
  tagline: "Skyrim Roleplay",
  description:
    "A serious-roleplay Skyrim server set in 4E 185, ten years after the White-Gold Concordat. Player-run holds, professions, contracts and law.",
  copyright: "© 4E 185 Mereth Roleplay",
} as const;

export const primaryNav: readonly NavLink[] = [
  { label: "Begin", href: "/how-to-play" },
  { label: "Chronicle", href: "/news" },
  { label: "Archive", href: "/wiki" },
  { label: "Questions", href: "/faq" },
  { label: "Petitions", href: "/support" },
];

/** Navigation once a character is bound to the account. */
export const authedNav: readonly NavLink[] = [
  { label: "Begin", href: "/how-to-play" },
  { label: "Chronicle", href: "/news" },
  { label: "Archive", href: "/wiki" },
  { label: "Ledger", href: "/shop" },
];

/** Behind the Hall dropdown in the navbar. */
export const communityMenu: readonly NavLink[] = [
  { label: "The Hall", href: "/community" },
  { label: "Discord", href: "/discord" },
  { label: "Officers", href: "/staff" },
  { label: "Laws", href: "/rules" },
];

export const footerColumns: readonly { links: readonly NavLink[] }[] = [
  {
    links: [
      { label: "Begin", href: "/how-to-play" },
      { label: "Chronicle", href: "/news" },
      { label: "Archive", href: "/wiki" },
      { label: "Ledger", href: "/shop" },
    ],
  },
  {
    links: [
      { label: "Petitions", href: "/support" },
      { label: "Questions", href: "/faq" },
      { label: "Discord", href: "/discord" },
      { label: "Patronage", href: "/donate" },
    ],
  },
];

export const legalLinks: readonly NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Refunds", href: "/refunds" },
  { label: "Terms", href: "/terms" },
];
