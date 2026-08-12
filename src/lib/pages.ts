/**
 * Content for the pages that are prose rather than an application.
 *
 * One map instead of a dozen near-identical route files. Each entry renders
 * through `SimplePage`, so adding a page is adding an entry.
 */

export interface SimpleSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface SimplePageContent {
  title: string;
  subtitle: string;
  sections: SimpleSection[];
  cta?: { label: string; href: string };
}

export const simplePages: Record<string, SimplePageContent> = {
  community: {
    title: "Community",
    subtitle: "Where the server actually lives between patches.",
    sections: [
      {
        paragraphs: [
          "Most of what happens here happens between people: guilds forming, keys being run at two in the morning, arguments about class balance that occasionally turn into changelog entries.",
        ],
      },
      {
        heading: "Where to find everyone",
        bullets: [
          "Discord is the main room. Development updates, patch discussion, and help.",
          "Forums hold the longer-form things: guild recruitment, guides, and feedback threads.",
          "In game, the realm-wide channel is unmoderated for chat but not for conduct.",
        ],
      },
    ],
    cta: { label: "Join Discord", href: "/discord" },
  },
  discord: {
    title: "Discord",
    subtitle: "The fastest way to reach players and staff.",
    sections: [
      {
        paragraphs: [
          "The invite is not live in this prototype. On the real site this page redirects straight to the server invite rather than rendering at all.",
        ],
      },
      {
        heading: "What is in there",
        bullets: [
          "Development updates as they land, before they reach the news page.",
          "Help channels with players who have answered the question before.",
          "Bug reports, which are triaged daily.",
          "Recruitment, for both guilds and staff.",
        ],
      },
    ],
  },
  forums: {
    title: "Forums",
    subtitle: "For the conversations too long for Discord.",
    sections: [
      {
        paragraphs: [
          "Guides, guild recruitment, class feedback and patch retrospectives. Slower than Discord on purpose: things written here are meant to still be useful in six months.",
        ],
      },
      {
        heading: "Posting",
        bullets: [
          "Search before you post. Most first questions have an answer already.",
          "One topic per thread. Threads that sprawl get split.",
          "Feedback is welcome and blunt feedback is fine. Personal attacks are not.",
        ],
      },
    ],
  },
  staff: {
    title: "Staff Team",
    subtitle: "Who runs the server, and what each role can actually do.",
    sections: [
      {
        heading: "Roles",
        bullets: [
          "Administrators: infrastructure, the database, and final say on appeals.",
          "Developers: scripting, core changes, and the patch notes.",
          "Game Masters: tickets, stuck characters, and rule enforcement in game.",
          "Moderators: Discord and forums only. No in-game powers.",
        ],
      },
      {
        heading: "What staff will never do",
        bullets: [
          "Ask for your password. Not in a ticket, not in a DM, never.",
          "Give items or gold outside a documented restoration.",
          "Take an enforcement action without logging who took it and why.",
        ],
      },
    ],
    cta: { label: "Open a ticket", href: "/support" },
  },
  rules: {
    title: "Rules",
    subtitle: "Short, enforced, and applied the same way to everyone.",
    sections: [
      {
        heading: "The rules",
        bullets: [
          "One account per person. Multiboxing is not permitted in rated play.",
          "No third-party automation, including anything that plays for you while you are away.",
          "Do not exploit a bug. Report it, and you will be credited in the patch notes.",
          "Keep public channels usable. Harassment is an immediate removal.",
          "Real-money trading of in-game goods is a permanent removal, both sides.",
        ],
      },
      {
        heading: "How enforcement works",
        paragraphs: [
          "Escalation runs warning, mute, temporary suspension, permanent removal. Skipping a step requires a second staff member to agree, and every action is logged with who took it and why.",
          "Appeals go through a ticket and are reviewed by someone other than the person who took the action.",
        ],
      },
    ],
    cta: { label: "Read the full conduct guide", href: "/wiki/rules-and-conduct" },
  },
  donate: {
    title: "Donate",
    subtitle: "What the money pays for, and what it will never buy.",
    sections: [
      {
        paragraphs: [
          "The server is free to play and will stay that way. Donations cover hosting, and when they exceed hosting they cover development time.",
        ],
      },
      {
        heading: "What it never buys",
        bullets: [
          "Gear, gold, levels, or any advantage in play.",
          "Faster ticket handling.",
          "Immunity from the rules.",
        ],
      },
      {
        heading: "What it does buy",
        bullets: [
          "Cosmetics: mounts, pets, toys and tabards.",
          "Convenience services: renames, transfers, faction changes.",
        ],
      },
    ],
    cta: { label: "Open the shop", href: "/shop" },
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "What is collected, why, and how long it is kept.",
    sections: [
      {
        heading: "What is collected",
        bullets: [
          "Account data: username, email, and a hashed password.",
          "Connection data: IP address and client version, used for security and multi-account detection.",
          "Gameplay data: characters, progress and purchases.",
        ],
      },
      {
        heading: "What is not",
        paragraphs: [
          "No advertising or analytics trackers, no data sold to anyone, and no reading of private in-game messages except where a ticket names them as evidence.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "Ask for a copy of your data or its deletion through a ticket. Deletion removes the account and its characters, and is not reversible.",
          "This is prototype copy, not legal advice, and needs a lawyer's eye before it goes anywhere real.",
        ],
      },
    ],
  },
  refunds: {
    title: "Refund Policy",
    subtitle: "When a purchase can be reversed, and when it cannot.",
    sections: [
      {
        heading: "Refundable",
        bullets: [
          "Anything unclaimed, within 14 days of purchase.",
          "Any purchase that failed to deliver, at any time.",
          "Duplicate charges, always.",
        ],
      },
      {
        heading: "Not refundable",
        bullets: [
          "Services already applied, such as a completed rename or transfer.",
          "Cosmetics already claimed onto a character.",
          "Purchases on an account removed for breaking the rules.",
        ],
      },
      {
        heading: "How to ask",
        paragraphs: [
          "Open a ticket with the transaction reference. Refunds are processed to the original payment method and take a few working days to appear.",
          "This is prototype copy, not legal advice.",
        ],
      },
    ],
    cta: { label: "Open a ticket", href: "/support" },
  },
  terms: {
    title: "Terms of Service",
    subtitle: "The agreement between you and the server.",
    sections: [
      {
        heading: "Your account",
        bullets: [
          "You are responsible for what happens on it, including anyone you share it with.",
          "Accounts are not property and cannot be sold or transferred.",
          "Access can be withdrawn for breaking the rules.",
        ],
      },
      {
        heading: "Service",
        paragraphs: [
          "This is a volunteer-run service provided as-is. Downtime happens, and progress can in rare cases be lost to a rollback. Backups run regularly, but no guarantee is offered.",
          "This is prototype copy, not legal advice, and needs review before it goes live anywhere.",
        ],
      },
    ],
  },
};

export function simplePage(slug: string): SimplePageContent | undefined {
  return simplePages[slug];
}
