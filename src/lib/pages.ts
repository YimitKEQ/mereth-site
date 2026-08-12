/**
 * Content for the pages that are prose rather than an application.
 *
 * One map instead of a dozen near-identical route files. Each entry renders
 * through `SimplePage`, so adding a page is adding an entry.
 *
 * A standing rule for everything in this file: **this site does not speak for
 * Mereth.** The first version of these pages was inherited from a template and
 * invented plausible-sounding policy (rated play, a cosmetics shop, an appeals
 * process), which on a Mereth-branded page reads as official and is worse than
 * saying nothing. Every page here now either states something checkable or
 * sends the reader to the people who can actually answer.
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
    title: "The Hall",
    subtitle: "Where the server actually lives between patches.",
    sections: [
      {
        paragraphs: [
          "Mereth runs on Discord as much as it runs on SkyMP. That is not a convenience: your Discord account is the login, so the server and the community are the same membership.",
        ],
      },
      {
        heading: "What happens there",
        bullets: [
          "Release notes, which land near-daily and are the closest thing to a changelog the server publishes.",
          "Tickets, which is how every rule question, dispute and bug report reaches staff.",
          "Applications for whitelisted roles, including the leadership positions inside holds.",
          "The out-of-character conversation that most in-character plots are arranged in.",
        ],
      },
      {
        heading: "About this site",
        paragraphs: [
          "This is a player-built handbook, not an official Mereth surface. It is assembled from the client their launcher installs, their published manifest and their dated release notes, and it says on every claim which of those it came from. Where it disagrees with the team, the team is right.",
        ],
      },
    ],
    cta: { label: "Join the Discord", href: "/discord" },
  },

  discord: {
    title: "Discord",
    subtitle: "The login, the front door, and the only support channel.",
    sections: [
      {
        paragraphs: [
          "Mereth authenticates through Discord rather than a username and password. The client has separate failure messages for being outside their Discord and for never having logged in through it, so joining is not optional: it is the account system.",
        ],
      },
      {
        heading: "Once you are in",
        bullets: [
          "Read the rules before applying. They are about conduct and consistency, and one of them forbids AI-written roleplay outright.",
          "Open a ticket for anything that needs staff: rule questions, disputes, bugs, or being genuinely stuck.",
          "Bring your exact error text if the game will not connect. The client distinguishes far more failures than most, and the wording tells you which one you have.",
        ],
      },
      {
        heading: "This page is not the invite",
        paragraphs: [
          "The invite belongs to Mereth and changes at their discretion, so this handbook does not mirror it. Search for Mereth Roleplay, or follow the link from their own site.",
        ],
      },
    ],
    cta: { label: "The connection errors, explained", href: "/faq#connect" },
  },

  staff: {
    title: "Officers",
    subtitle: "Who runs Mereth, and what this site can honestly tell you about them.",
    sections: [
      {
        paragraphs: [
          "Mereth is run by BStarRP, a roleplay community that came to Skyrim from FiveM and RedM. Development is effectively one person, shipping at a pace that shows in the release history: hundreds of releases since the server launched in July 2026.",
        ],
      },
      {
        heading: "In-world authority is played, not administered",
        bullets: [
          "Jarls and stewards hold real mechanical power through the holdstone: ranks, parcels and access.",
          "Guard, Guard Captain and Commander are ranks inside a hold, held by players.",
          "Leadership roles are whitelisted, which means an application rather than an election.",
        ],
      },
      {
        heading: "Out-of-character authority is a ticket",
        paragraphs: [
          "There is no bounty system and no automated enforcement. Accusations, sentences and appeals are adjudicated by staff reading Discord tickets, which is worth knowing before you build a character around consequences: nothing in the game records one for you.",
        ],
      },
      {
        heading: "Names",
        paragraphs: [
          "This handbook does not publish a staff roster. Roles change, and a stale list of real people on a site the team does not control is worth less than a link to the current one.",
        ],
      },
    ],
    cta: { label: "Open a ticket", href: "/discord" },
  },

  rules: {
    title: "Laws",
    subtitle: "What this site can tell you, and where the authoritative version lives.",
    sections: [
      {
        paragraphs: [
          "Mereth's rules are published and enforced by the team on Discord, and that copy is the only one that counts. What follows is context a new player usually wants before reading them, not a substitute.",
        ],
      },
      {
        heading: "The one people trip over",
        paragraphs: [
          "AI-written roleplay is forbidden. The rule is explicit, and the applications for whitelisted leadership roles ask about it directly. Write your own character.",
        ],
      },
      {
        heading: "How consequence works here",
        bullets: [
          "In character, players can tackle, cuff and shackle each other, and cuffing produces a real incapacitated state.",
          "Nothing persists after that. No bounty, no record, no debt that follows anyone.",
          "So sentences are written ones. The published sanctions run as far as life imprisonment, banishment and execution, adjudicated by staff.",
          "Which means a scene has the weight the people in it agree to give it, and the ticket afterwards is where it becomes real.",
        ],
      },
      {
        heading: "Also worth knowing before you play",
        bullets: [
          "Magic is legal by hold, not by province. Every hold sets its own law on casting, teaching and licences.",
          "No characters from Elder Scrolls lore. Familiar clans, yes; copy-paste characters, no.",
          "New players do not start with magic, without exception.",
        ],
      },
    ],
    cta: { label: "Read the rules on Discord", href: "/discord" },
  },

  donate: {
    title: "Supporting Mereth",
    subtitle: "Where support goes, and what this handbook does not take.",
    sections: [
      {
        paragraphs: [
          "Mereth is free to play and funded by its own community through Patreon. Hosting a synchronised Skyrim province with a mod list this size is not cheap, and the money goes there.",
        ],
      },
      {
        heading: "This site takes nothing",
        paragraphs: [
          "This handbook is player-built and unaffiliated. It has no shop, no accounts and no payments, and it will not collect money on Mereth's behalf. If you want to support the server, do it through the team's own channels so it reaches them directly.",
        ],
      },
      {
        heading: "Worth saying plainly",
        paragraphs: [
          "Support is not a route to advantage. Skills are capped by memory points spent at character creation, magic requires a teacher and a book, and property is granted by a jarl. None of those has a price.",
        ],
      },
    ],
    cta: { label: "Find the team on Discord", href: "/discord" },
  },

  privacy: {
    title: "Privacy",
    subtitle: "What this site collects, which is very little.",
    sections: [
      {
        paragraphs: [
          "This is a static handbook. It has no accounts, no login, no comments and no forms, so there is nothing here to sign up for and nothing to hand over.",
        ],
      },
      {
        heading: "What the site stores",
        bullets: [
          "Nothing in a database, because there is no database.",
          "A skill plan lives entirely in the address bar, in the part after the #, which is never sent to any server. Sharing a plan means sharing that link and nothing else.",
          "Standard web server request logs, which any host keeps.",
        ],
      },
      {
        heading: "What it loads",
        bullets: [
          "One self-hosted display typeface and one from Google Fonts.",
          "Its own data files, served from the same site.",
          "No analytics, no advertising, no third-party trackers, no cookies set by this site.",
        ],
      },
      {
        heading: "Mereth itself is separate",
        paragraphs: [
          "The game server authenticates through Discord and handles its own data. Nothing on this site is connected to your Mereth account, and this site could not read it if it tried.",
        ],
      },
    ],
  },

  terms: {
    title: "Terms",
    subtitle: "What this site is, and what it is not.",
    sections: [
      {
        heading: "Not official",
        paragraphs: [
          "This is a player-built handbook for Mereth Roleplay. It is not run by, endorsed by, or affiliated with the Mereth team, BStarRP, Bethesda Softworks or ZeniMax. Where anything here disagrees with the team, the team is right and this site is wrong.",
        ],
      },
      {
        heading: "Where the facts come from",
        bullets: [
          "The client Mereth's own launcher installs, quoted verbatim where it is quoted.",
          "Their published release notes, cited by version and date.",
          "The plugins in their published mod list, read as data.",
          "The team's own posted answers, reorganised but never changed in substance.",
        ],
      },
      {
        heading: "Accuracy",
        paragraphs: [
          "The server ships almost daily, so anything here can go out of date between one visit and the next. Every page shows the date its data was indexed. Treat this as a good map, not as the territory, and check anything that matters against the team.",
        ],
      },
      {
        heading: "Content",
        paragraphs: [
          "The Elder Scrolls, Skyrim and their content are the property of Bethesda Softworks. Mereth's own text, quoted here as evidence, belongs to Mereth. The writing, code and design of this handbook are its author's.",
        ],
      },
    ],
  },

  refunds: {
    title: "Refunds",
    subtitle: "There is nothing here to buy.",
    sections: [
      {
        paragraphs: [
          "This handbook sells nothing, takes no payments and has no shop, so there is nothing to refund. The page exists because people look for it.",
        ],
      },
      {
        heading: "If you supported Mereth",
        paragraphs: [
          "Anything you have paid went to the Mereth team through their own channels, and only they can answer a question about it. Open a Discord ticket.",
        ],
      },
    ],
    cta: { label: "Open a ticket", href: "/discord" },
  },
};

export function simplePage(slug: string): SimplePageContent | null {
  return simplePages[slug] ?? null;
}
