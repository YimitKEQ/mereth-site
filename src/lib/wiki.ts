/**
 * Written guides.
 *
 * Flat article list plus a category index, which is the shape a database or CMS
 * hands back, so the pages need no rewriting when the source changes. The large
 * reference tables live in `reference.ts` and come from the devkit sweeps.
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
  { id: "getting-started", label: "Arriving", blurb: "Application, install, and your first evening." },
  { id: "systems", label: "Systems", blurb: "How the world works, and what we changed." },
  { id: "living", label: "Living here", blurb: "Trades, contracts, magic and money." },
  { id: "community", label: "Law and hall", blurb: "Rules, officers, and how to get help." },
];

export const wikiArticles: readonly WikiArticle[] = [
  {
    slug: "your-first-evening",
    title: "Your First Evening",
    category: "getting-started",
    summary: "From application to standing in a hold with somewhere to be.",
    updated: "12 Last Seed, 4E 185",
    readMinutes: 4,
    sections: [
      {
        paragraphs: [
          "Everything below assumes nothing. Follow it top to bottom and you will be in the world with a reason to talk to someone, which is the only part that actually matters.",
        ],
      },
      {
        heading: "Before you apply",
        bullets: [
          "Skyrim Special Edition on PC, legitimately owned. The launcher checks.",
          "A character idea you can say in one sentence. Plain and understood beats ornate and borrowed.",
          "About an hour. The modlist is large and the first install is the slow part.",
        ],
      },
      {
        heading: "The steps",
        bullets: [
          "Apply on this site. A person reads it and answers within a few days.",
          "Install the launcher and let it pull the modlist. Do not reorder anything by hand.",
          "Make your character, and start in a hold rather than the wilderness.",
          "Say something to the first person you meet. That is the whole game.",
        ],
      },
      {
        heading: "If it will not connect",
        paragraphs: [
          "Almost every failure is a load order that drifted from the server's. The launcher owns that file, so let it repair rather than editing it by hand.",
          "If it persists, open a petition with your account name and the launcher log. Never include your password, and no officer will ask for it.",
        ],
      },
    ],
  },
  {
    slug: "the-setting",
    title: "The Setting",
    category: "getting-started",
    summary: "4E 185, ten years after the Concordat. What is true, what is tense, what you can play.",
    updated: "9 Last Seed, 4E 185",
    readMinutes: 5,
    sections: [
      {
        paragraphs: [
          "It is 4E 185. The White-Gold Concordat was signed ten years ago and Imperial law still runs in the holds. That is the whole of the good news.",
        ],
      },
      {
        heading: "What the treaty cost",
        paragraphs: [
          "Talos worship is illegal. The Thalmor keep an office in the capital and their justiciars travel with letters that open any door. Most people comply, quietly, and resent it.",
          "This is not a war server. There is no front line to queue for. The tension is administrative, which is slower and stranger: who holds a writ, whose contract is honoured, which jarl answers a letter.",
        ],
      },
      {
        heading: "What you can play",
        bullets: [
          "Almost anyone ordinary. Farmers, smiths, guards, scribes and merchants are the backbone.",
          "Nords, Imperials, Bretons and Redguards without explanation. Elves and beastfolk with one, because the setting has opinions about them.",
          "Not a Dragonborn, not the last of an order. Play someone who wants something instead.",
        ],
      },
    ],
  },
  {
    slug: "how-magic-is-learned",
    title: "How Magic Is Learned",
    category: "systems",
    summary: "A master and a spellbook, or nothing. Why the gate exists and how to pass it.",
    updated: "11 Last Seed, 4E 185",
    readMinutes: 5,
    sections: [
      {
        paragraphs: [
          "You cannot teach yourself a spell here. Someone who already knows it has to teach you, and they need the book to do it. That is the entire rule, and it is the most important design decision on the server.",
        ],
      },
      {
        heading: "Why it works this way",
        paragraphs: [
          "Without a gate, every third character arrives an archmage and magic stops meaning anything. With one, a spell is a favour someone did for you, and it comes with a relationship attached.",
          "It also gives mages something to be. A teacher is a role, not a stat line.",
        ],
      },
      {
        heading: "Getting taught",
        bullets: [
          "Find someone who knows the school. The Archive lists every spell in the load order, so you can at least name what you want.",
          "Bring the book, or the coin to buy one.",
          "Expect to be asked why. A good answer in character is usually the price.",
          "A master teaches faster. Being taught badly does not.",
        ],
      },
    ],
  },
  {
    slug: "trades-and-coin",
    title: "Trades and Coin",
    category: "living",
    summary: "Professions, what they feed, and how a market survives contact with players.",
    updated: "10 Last Seed, 4E 185",
    readMinutes: 6,
    sections: [
      {
        paragraphs: [
          "Every profession has its own progression, and the economy is player-run rather than vendor-fed. Someone mined the ore in the sword you are holding.",
        ],
      },
      {
        heading: "How a trade runs",
        bullets: [
          "Gathering feeds crafting, and crafting feeds the market. Skipping a link means buying from someone who did not.",
          "Durability and tempering mean gear wears out, so a smith has repeat custom rather than one sale.",
          "Every bench, what it makes and what it takes, is listed in the Archive.",
        ],
      },
      {
        heading: "Contracts",
        paragraphs: [
          "A contract is signed, witnessed and held by the server. It survives both parties logging off, and it survives the argument about whether there was a contract.",
          "That is the difference between a trade server and a screenshot of one.",
        ],
      },
    ],
  },
  {
    slug: "law-and-consequence",
    title: "Law and Consequence",
    category: "community",
    summary: "What happens in character when you break a law, and out of character when you break a rule.",
    updated: "11 Last Seed, 4E 185",
    readMinutes: 4,
    sections: [
      {
        heading: "In character",
        paragraphs: [
          "Holds keep their own law. A crime witnessed is a crime reported, and what follows is arrest, a hearing, and a sentence from whoever holds that authority in that hold.",
          "Sentences run from fines through imprisonment to banishment, and in rare, agreed cases, execution. Nothing that permanent happens without both players agreeing beforehand.",
        ],
      },
      {
        heading: "Out of character",
        bullets: [
          "One account per person.",
          "No automation of any kind.",
          "Do not exploit a bug. Report it and you will be credited.",
          "Metagaming, powergaming and forcing outcomes on another character get a conversation first and an action second.",
        ],
      },
      {
        heading: "Appeals",
        paragraphs: [
          "Every officer action is recorded with who took it and why. An appeal goes through a petition and is read by someone other than the officer who acted.",
        ],
      },
    ],
  },
  {
    slug: "getting-help",
    title: "Getting Help",
    category: "community",
    summary: "Which channel to use, what to include, and what to expect back.",
    updated: "8 Last Seed, 4E 185",
    readMinutes: 2,
    sections: [
      {
        heading: "Where to go",
        table: {
          columns: ["Problem", "Where", "Typical response"],
          rows: [
            ["Cannot connect", "Petition", "Under 12 hours"],
            ["Lost item or stuck character", "Petition", "Under 24 hours"],
            ["Another player's conduct", "Petition, in private", "Under 24 hours"],
            ["Bug", "Discord", "Triaged daily"],
            ["A question about the world", "Discord, or the Archive", "Usually minutes"],
          ],
        },
      },
      {
        heading: "What to include",
        bullets: [
          "Your account name. Never your password, and no officer will ask.",
          "Your character's name and the hold you were in.",
          "What you expected, what happened, and roughly when.",
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
