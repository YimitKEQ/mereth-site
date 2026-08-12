/**
 * Wiki content.
 *
 * Flat article list plus a category index, which is the shape a database or CMS
 * will hand back later, so the pages do not need rewriting when the source
 * changes. Search runs over `title`, `summary` and the body text.
 */

export interface WikiSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { columns: string[]; rows: string[][] };
}

export interface WikiArticle {
  slug: string;
  title: string;
  category: string;
  summary: string;
  updated: string;
  readMinutes: number;
  sections: WikiSection[];
}

export interface WikiCategory {
  id: string;
  label: string;
  blurb: string;
}

export const wikiCategories: readonly WikiCategory[] = [
  { id: "getting-started", label: "Getting Started", blurb: "Install, connect and make your first character." },
  { id: "systems", label: "Server Systems", blurb: "What we changed and why it matters." },
  { id: "progression", label: "Progression", blurb: "Levelling, gearing and the endgame path." },
  { id: "community", label: "Community", blurb: "Rules, staff and how to get help." },
];

export const wikiArticles: readonly WikiArticle[] = [
  {
    slug: "first-hour",
    title: "Your First Hour",
    category: "getting-started",
    summary: "From download to standing in Pandaria, in order, with nothing assumed.",
    updated: "12 August 2026",
    readMinutes: 4,
    sections: [
      {
        paragraphs: [
          "This is the short version of everything a new player needs. If you follow it top to bottom you will be in the world in about fifteen minutes, most of which is the download.",
        ],
      },
      {
        heading: "Before you start",
        bullets: [
          "An account, created on this site. Your username is what you log in with, not your email.",
          "About 25 GB free. The client is the full game, not a patch.",
          "A wired connection if you can. Not required, but instance bosses are unforgiving of packet loss.",
        ],
      },
      {
        heading: "The steps",
        bullets: [
          "Create your account and confirm it.",
          "Download the client from How to Play and unzip it somewhere you own, not Program Files.",
          "Launch Wow-64.exe and log in with your username.",
          "Pick a realm, create a character, and take the intro quest.",
        ],
      },
      {
        heading: "If something goes wrong",
        paragraphs: [
          "Nine times out of ten a failed login is the realmlist. Open realmlist.wtf in your WoW Data folder and check it matches the line on the How to Play page exactly, with no trailing spaces.",
          "If the client opens and immediately closes, unzip it again somewhere else. Windows blocks execution from some folders and does it silently.",
        ],
      },
    ],
  },
  {
    slug: "mythic-plus",
    title: "The Mythic+ System",
    category: "systems",
    summary: "How keys, affixes and scoring work here, and where we differ from retail.",
    updated: "10 August 2026",
    readMinutes: 6,
    sections: [
      {
        paragraphs: [
          "Mythic+ is a timed, scaling difficulty for five-player dungeons. Each completion rewards a key for another dungeon, one level higher if you beat the timer.",
        ],
      },
      {
        heading: "Key levels",
        table: {
          columns: ["Key level", "Health and damage", "Affixes"],
          rows: [
            ["+2 to +3", "+8% per level", "None"],
            ["+4 to +6", "+8% per level", "One"],
            ["+7 to +9", "+8% per level", "Two"],
            ["+10 and above", "+10% per level", "Three"],
          ],
        },
      },
      {
        heading: "Where we differ from retail",
        bullets: [
          "No seasonal affix. We found it flattened dungeon identity.",
          "Death penalty is 10 seconds, not 5. Pulls should be decisions.",
          "Keys do not deplete below +10, so a bad night does not undo a week.",
        ],
      },
    ],
  },
  {
    slug: "levelling-1-90",
    title: "Levelling 1 to 90",
    category: "progression",
    summary: "Accelerated rates, the zones worth your time, and what to skip.",
    updated: "8 August 2026",
    readMinutes: 5,
    sections: [
      {
        paragraphs: [
          "Experience is accelerated so that reaching the endgame is a weekend rather than a month. The curve is deliberately uneven: fastest through the stretches everyone has done a dozen times, close to normal through Pandaria.",
        ],
      },
      {
        heading: "Rates by bracket",
        table: {
          columns: ["Levels", "Rate", "Why"],
          rows: [
            ["1 to 60", "5x", "Classic and Outland are well trodden."],
            ["60 to 80", "4x", "Northrend holds up, but not at full length."],
            ["80 to 85", "3x", "Cataclysm zones are short already."],
            ["85 to 90", "1.5x", "Pandaria is the content. It is not skipped."],
          ],
        },
      },
      {
        heading: "Worth doing on the way",
        bullets: [
          "Every Pandaria zone story. They feed directly into reputation you will want at 90.",
          "Dungeon quests, which are tuned to be worth the detour here.",
          "Your profession as you go. Catching up later is far slower than it looks.",
        ],
      },
    ],
  },
  {
    slug: "rules-and-conduct",
    title: "Rules and Conduct",
    category: "community",
    summary: "The short list, what actually gets enforced, and how appeals work.",
    updated: "11 August 2026",
    readMinutes: 3,
    sections: [
      {
        heading: "The short list",
        bullets: [
          "One account per person. Multiboxing is not permitted in rated play.",
          "No third-party automation of any kind.",
          "Do not exploit a bug. Report it and you will be credited.",
          "Keep public channels usable. Harassment is an immediate removal.",
        ],
      },
      {
        heading: "How enforcement works",
        paragraphs: [
          "Every action is logged with the staff member who took it and the reason given. Escalation runs warning, mute, temporary suspension, permanent removal, and skipping a step requires a second staff member to agree.",
          "Appeals go through a ticket, not Discord DMs. A different staff member reviews it than the one who took the action.",
        ],
      },
    ],
  },
  {
    slug: "professions",
    title: "Professions and the Economy",
    category: "systems",
    summary: "Gathering rates, crafting catch-up, and how the auction house is kept honest.",
    updated: "9 August 2026",
    readMinutes: 4,
    sections: [
      {
        paragraphs: [
          "Professions matter here because gear from crafting is competitive at entry endgame rather than a footnote.",
        ],
      },
      {
        heading: "What is changed",
        bullets: [
          "Gathering nodes respawn faster in Pandaria zones, tuned so a full circuit is never empty.",
          "Skill-ups from grey recipes continue slightly longer, which removes the worst catch-up walls.",
          "Daily cooldown crafts are account-wide, not per character.",
        ],
      },
      {
        heading: "Auction house integrity",
        paragraphs: [
          "Gold sellers are removed on detection and their listings are rolled back. Trades are logged, so a bought-gold chain can be unwound without punishing the people at the end of it who did nothing wrong.",
        ],
      },
    ],
  },
  {
    slug: "getting-help",
    title: "Getting Help",
    category: "community",
    summary: "Which channel to use, what to include, and realistic response times.",
    updated: "7 August 2026",
    readMinutes: 2,
    sections: [
      {
        heading: "Where to go",
        table: {
          columns: ["Problem", "Where", "Typical response"],
          rows: [
            ["Cannot log in", "Support ticket", "Under 12 hours"],
            ["Stuck character or lost item", "Support ticket", "Under 24 hours"],
            ["Bug report", "Discord bug channel", "Triaged daily"],
            ["Rule breaking", "Support ticket, in private", "Under 24 hours"],
            ["General question", "Discord help channel", "Usually minutes"],
          ],
        },
      },
      {
        heading: "What to include",
        bullets: [
          "Your account username, never your password. Staff will not ask for it.",
          "Character name and realm.",
          "What you expected, what happened, and the time it happened.",
          "A screenshot if there is anything to see.",
        ],
      },
    ],
  },
];

export function wikiBySlug(slug: string): WikiArticle | undefined {
  return wikiArticles.find((article) => article.slug === slug);
}

export function articlesInCategory(id: string): WikiArticle[] {
  return wikiArticles.filter((article) => article.category === id);
}

/** Flattened body text, so search covers content and not only titles. */
export function articleText(article: WikiArticle): string {
  const parts = [article.title, article.summary];
  for (const section of article.sections) {
    if (section.heading) parts.push(section.heading);
    if (section.paragraphs) parts.push(...section.paragraphs);
    if (section.bullets) parts.push(...section.bullets);
    if (section.table) parts.push(...section.table.rows.flat());
  }
  return parts.join(" ").toLowerCase();
}
