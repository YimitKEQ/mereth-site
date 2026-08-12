/**
 * One source of truth for the shell: names, navigation and footer columns.
 *
 * Rebranding starts here and in globals.css. Nothing else should hardcode a
 * product name or a route label.
 */

export interface NavLink {
  label: string;
  href: string;
}

export const site = {
  name: "Miststorm",
  tagline: "Mists of Pandaria",
  description:
    "A quality Mists of Pandaria Plus experience. Blizzlike content, a custom Mythic+ system, and a community-first team.",
  copyright: "© 2026 Miststorm.org",
} as const;

/** Primary navigation, signed out. */
export const primaryNav: readonly NavLink[] = [
  { label: "How to Play", href: "/how-to-play" },
  { label: "News", href: "/news" },
  { label: "FAQ", href: "/faq" },
  { label: "Support", href: "/support" },
];

/** Primary navigation once a player is signed in, per the inventory screen. */
export const authedNav: readonly NavLink[] = [
  { label: "How to Play", href: "/how-to-play" },
  { label: "News", href: "/news" },
  { label: "Shop", href: "/shop" },
  { label: "Community", href: "/community" },
];

/** Items behind the Community dropdown in the navbar pill. */
export const communityMenu: readonly NavLink[] = [
  { label: "Discord", href: "/discord" },
  { label: "Forums", href: "/forums" },
  { label: "Staff Team", href: "/staff" },
  { label: "Rules", href: "/rules" },
];

export const footerColumns: readonly { links: readonly NavLink[] }[] = [
  {
    links: [
      { label: "How to Play", href: "/how-to-play" },
      { label: "News", href: "/news" },
      { label: "Shop", href: "/shop" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    links: [
      { label: "Support", href: "/support" },
      { label: "FAQ", href: "/faq" },
      { label: "Discord", href: "/discord" },
      { label: "Donate", href: "/donate" },
    ],
  },
];

export const legalLinks: readonly NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refunds" },
  { label: "Terms Of Service", href: "/terms" },
];
