/**
 * Site content, kept as data rather than inlined in JSX.
 *
 * This is the seam where a CMS or the wiki database lands later. Copy is
 * transcribed from the reference so the layout is tested against real text
 * lengths rather than lorem, which is what actually breaks a grid.
 */

export interface Feature {
  slug: string;
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  sections: { heading?: string; paragraphs: string[] }[];
}

export const serverStatus = {
  state: "Under Development (Alpha)",
  totalOnline: 1,
} as const;

export const features: readonly Feature[] = [
  {
    slug: "new-era-of-mop",
    title: "New Era of MoP",
    body: "Miststorm is a blizzlike+ project in works. Coming soon™",
  },
  {
    slug: "mythic-system",
    title: "Mythic System",
    body: "Experience our custom Mythic+ system tailored for dungeons and raids",
  },
  {
    slug: "mop-plus-experience",
    title: "MoP+ Experience",
    body: "Blizzlike experience with MoP+ features. Solo queue arenas, Reputation boosts, Crossfaction BGs, and much much more",
  },
  {
    slug: "blizzlike-aspect",
    title: "Blizzlike Aspect",
    body: "The development team has high standards for content scripting. Although we are a MoP+ server, we want the existing gameplay to feel blizzlike. Built for players by players.",
  },
  {
    slug: "scripted-pvp-pve",
    title: "Scripted PvP & PvE",
    body: "The server has an enormous focus on PvP Gameplay, including battlegrounds and arenas, as well as having high standards for PvE dungeon and raid scripting.",
  },
  {
    slug: "events-community",
    title: "Events & Community",
    body: "Upcoming weekly events, giveaways, and a friendly staff team. Level up from 1-90 via an accelerated experience.",
  },
];

export const faq: readonly FaqItem[] = [
  {
    question: "What is this server?",
    answer:
      "Miststorm is a free-to-play Mists of Pandaria private server focused on delivering an authentic, high-quality WoW experience. Our team works around the clock to keep the realm stable, scripted, and fun for everyone.",
  },
  {
    question: "What content is available?",
    answer:
      "All major Mists of Pandaria content is available, including raids, dungeons, battlegrounds, arenas, world bosses, and daily quest hubs. We continuously script and refine encounters to match retail quality.",
  },
  {
    question: "How active is PvP?",
    answer:
      "PvP is thriving on Miststorm. We have active arena seasons, rated battlegrounds, and an open-world PvP community. Seasonal rewards and leaderboards keep the competition fierce.",
  },
  {
    question: "Are raids and dungeons fully working?",
    answer:
      "Yes, all raid tiers and dungeons are fully scripted, including heroic and mythic difficulties. Our QA team tests every boss mechanic to ensure an authentic experience.",
  },
  {
    question: "How do I start playing?",
    answer:
      "Create a free account, download the client from the How to Play page, set your realmlist, and log in. The whole process takes a few minutes.",
  },
  {
    question: "Do I need the original Mists of Pandaria client?",
    answer:
      "No. You can download a ready-to-play client from us, or point your own 5.4.8 client at our realmlist if you already have one.",
  },
  {
    question: "Is Miststorm free to play?",
    answer:
      "Absolutely. Miststorm is 100% free to play. Our optional cosmetic shop helps fund server costs, but nothing in the shop provides a gameplay advantage.",
  },
  {
    question: "Are there custom features on the server?",
    answer:
      "Yes. Alongside the blizzlike foundation we run a custom Mythic+ system, solo queue arenas, crossfaction battlegrounds and reputation boosts.",
  },
  {
    question: "Can I play with friends from the other faction?",
    answer:
      "In battlegrounds, yes. Crossfaction queues mean shorter waits and better matches regardless of which side your friends picked.",
  },
  {
    question: "How do I report a bug or a player?",
    answer:
      "Use the in-game ticket system or visit our Support page on the website. For urgent issues you can also reach our staff on Discord.",
  },
];

export const news: readonly NewsArticle[] = [
  {
    slug: "the-mist-is-rising",
    title: "Miststorm - The Mist is Rising",
    publishedAt: "April 6, 2026 at 11:33 AM",
    excerpt: "Miststorm is officially in development. A Mists of Pandaria",
    sections: [
      {
        heading: "A New Chapter for MoP",
        paragraphs: [
          "Miststorm is officially in development, and we are building something special.",
          "For too long, the Mists of Pandaria expansion has been underserved in the private server scene. We believe MoP deserves a home that does it justice: properly scripted content, a passionate development team, and a community-first approach. That is exactly what Miststorm is setting out to be.",
        ],
      },
      {
        heading: "What is Miststorm?",
        paragraphs: [
          "Miststorm is a Mists of Pandaria Plus+ private server project. At its core, we aim for a blizzlike experience with faithfully scripted dungeons, raids, battlegrounds, and arenas. On top of that, we are adding carefully chosen quality-of-life improvements and custom systems that make the game more enjoyable without breaking the feel of the original expansion.",
        ],
      },
      {
        heading: "What does MoP+ mean?",
        paragraphs: [
          "Custom Mythic+ System: A dungeon and raid challenge system inspired by retail, tailored for MoP content.",
          "Solo Queue Arenas: Jump into competitive PvP without needing a partner.",
          "Crossfaction Battlegrounds: Shorter queues, better matches.",
          "Reputation Boosts: Less grind, more gameplay.",
          "Accelerated Leveling: Get from 1-90 and into the endgame faster.",
          "All of this sits on top of a blizzlike foundation. The development team has high standards for content scripting. Boss mechanics, spell interactions, and class balance are treated with care.",
        ],
      },
      {
        heading: "Current Status: Alpha",
        paragraphs: [
          "Let us be transparent: Miststorm is currently in closed alpha. We are actively developing and testing core systems. This means the server is not yet open to the public, but we are making steady progress toward a closed beta and eventually a full launch.",
          "We believe in building in the open. Rather than going silent for months and dropping a surprise launch, we want to grow our community alongside the project. Your feedback, your excitement, and your ideas matter to us, even at this early stage.",
        ],
      },
      {
        heading: "Why Join Now?",
        paragraphs: [
          "Even though we are not live yet, there has never been a better time to get involved:",
          "Shape the server: Early community members have a real voice in development decisions.",
          "Be first in line: When closed beta keys go out, active community members will be first to receive them.",
          "Find your guild: Start building your team before launch day.",
          "Stay informed: Get development updates, sneak peeks, and announcements before anyone else.",
        ],
      },
      {
        heading: "Join the Community",
        paragraphs: [
          "The heart of Miststorm lives on Discord. It is where we share development progress, discuss features, gather feedback, and just hang out. Whether you are a hardcore raider, a PvP enthusiast, or someone who just misses the feeling of Pandaria, there is a place for you.",
          "We are building something worth waiting for. Come be part of it from the beginning.",
          "The mist is rising. Will you answer the call?",
        ],
      },
    ],
  },
];

export function articleBySlug(slug: string): NewsArticle | undefined {
  return news.find((article) => article.slug === slug);
}
