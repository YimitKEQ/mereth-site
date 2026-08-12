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
  state: "Open, and taking applications",
  totalOnline: 63,
  worldDate: "17th of Last Seed, 4E 185",
} as const;

export const features: readonly Feature[] = [
  {
    slug: "holds-and-holdstones",
    title: "Holds hold themselves",
    body: "Every hold has a jarl, a steward and a court, and the ranks are real permissions rather than titles in a Discord. Land is parcelled, granted and taken back.",
  },
  {
    slug: "professions",
    title: "Twenty-five trades",
    body: "Smithing, mining, farming, brewing, fishing, scribing and the rest, each with its own progression. A blacksmith is a job someone does, not a menu.",
  },
  {
    slug: "contracts-and-ledgers",
    title: "Written and enforced",
    body: "Contracts are signed, witnessed and held on the server, not in a screenshot. A debt survives the argument about whether there was a debt.",
  },
  {
    slug: "magic-is-taught",
    title: "Magic must be taught",
    body: "A master and a spellbook, or nothing. There is no learning a school alone in the wilderness, and no character arrives already an archmage.",
  },
  {
    slug: "living-world",
    title: "A world that keeps time",
    body: "One clock for everyone. Proximity voice with lip sync, durability and tempering, lockpicking, survival, horses and dragons in sync.",
  },
  {
    slug: "law-and-consequence",
    title: "Consequence, not deletion",
    body: "Crimes are recorded, tried and answered for. Imprisonment, banishment and execution exist because a world without stakes is a chatroom with mountains.",
  },
];

export const faq: readonly FaqItem[] = [
  {
    question: "What is Mereth?",
    answer:
      "A serious-roleplay Skyrim server running on SkyMP. It is set in 4E 185, ten years after the White-Gold Concordat, and everything a player does happens in character unless a staff member says otherwise.",
  },
  {
    question: "Do I need to apply?",
    answer:
      "Yes. Applications are read by a person and answered in a few days. We ask for a character concept rather than a writing sample, and we would rather see a plain idea you understand than an ornate one you do not.",
  },
  {
    question: "What do I need installed?",
    answer:
      "Skyrim Special Edition on PC and our launcher, which installs and updates the modlist for you. Nothing needs to be assembled by hand, and the load order is managed so it matches the server exactly.",
  },
  {
    question: "Can I play a mage?",
    answer:
      "You can, but not immediately. Spells are taught by another character who already knows them, using a spellbook. Nobody arrives able to cast, which is what stops every third character being an archmage.",
  },
  {
    question: "Is there combat and death?",
    answer:
      "There is, and it is negotiated. Fights between players need consent about the stakes beforehand. Death is permanent only when both people agreed it could be.",
  },
  {
    question: "What happens if I break a law?",
    answer:
      "In character, you are arrested, tried and sentenced by the hold that caught you. Out of character, rule breaking goes through a petition and is handled by officers, with the action and the reason recorded.",
  },
  {
    question: "Is it free?",
    answer:
      "Playing is free. Patronage keeps the server running and buys cosmetics and conveniences. It buys nothing that affects standing, land, wealth or law.",
  },
  {
    question: "How many people play?",
    answer:
      "Roughly sixty to seventy at once on an ordinary evening, out of a few thousand on the Discord. Small enough that your character is recognised, large enough that a market works.",
  },
  {
    question: "Can I bring a guild?",
    answer:
      "Yes, and organisations have member caps and whitelisted leadership so that a group is a structure rather than a name. Speak to us before you arrive and we will find you somewhere to fit.",
  },
  {
    question: "Where do I ask for help?",
    answer:
      "A petition on this site for anything involving your account, a character or another player. Discord for questions that just need answering.",
  },
];

export const news: readonly NewsArticle[] = [
  {
    slug: "the-concordat-holds",
    title: "The Concordat Holds, For Now",
    publishedAt: "17th of Last Seed, 4E 185",
    excerpt: "Ten years on, Imperial law still runs in Mereth. The question is who it runs for.",
    sections: [
      {
        heading: "Ten years of paper peace",
        paragraphs: [
          "The White-Gold Concordat was signed a decade ago and every hold in Mereth still flies the Imperial banner. That is the whole of the good news.",
          "What the treaty bought was time, and what it cost was the right to say certain things out loud. Talos worship is illegal. The Thalmor keep an office in the capital, and their justiciars travel the roads with letters that open any door.",
        ],
      },
      {
        heading: "What this means at the table",
        paragraphs: [
          "Mereth is not a war server. There is no front line to queue for. The tension here is administrative, which is a stranger and slower thing: who holds a writ, whose contract is honoured, which jarl returns a letter.",
          "A character who wants to matter here does it by accumulating obligations, not kills.",
        ],
      },
      {
        heading: "What is being built",
        paragraphs: [
          "Court records, so a trial leaves something behind. Contracts that hold when the people who signed them log off. A bounty system that makes a crime a thing with a cost rather than a screenshot in a ticket.",
          "None of it is finished. The roadmap is public and honest about what is not there yet.",
        ],
      },
    ],
  },
];

export function articleBySlug(slug: string): NewsArticle | undefined {
  return news.find((article) => article.slug === slug);
}
