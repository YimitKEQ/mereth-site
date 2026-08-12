/**
 * Content for the pages that are prose rather than an application.
 *
 * One map instead of a dozen near-identical route files. Each entry renders
 * through `SimplePage`, so adding a page is adding an entry.
 *
 * A standing rule for everything in this file: **this is an official Mereth
 * surface, so anything written here reads as policy.** An earlier version
 * inherited a template and invented plausible-sounding policy: rated play, a
 * cosmetics shop, an appeals process. None of it existed. Do not add anything
 * here that has not actually been decided. If it is undecided, say so, or leave
 * it out and point at Discord.
 */

import { DISCORD_INVITE } from "@/lib/site";

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
    subtitle: "Where the server lives between patches.",
    sections: [
      {
        paragraphs: [
          "Mereth runs on Discord as much as it runs on SkyMP. That is not a convenience: your Discord account is your login, so the server and the community are the same membership.",
        ],
      },
      {
        heading: "What happens there",
        bullets: [
          "Release notes, which land near-daily.",
          "Tickets, which is how every rule question, dispute, bug report and whitelist application reaches staff.",
          "Whitelist postings. The Jarl seats and the Dark Brotherhood are the two the rulebook names; anything else that needs an application is posted here too.",
          "Faction and organisation recruitment. Lore factions have their own servers; everything else shares one, with categories separated by role.",
          "The out-of-character conversation that most in-character plots are arranged in.",
        ],
      },
      {
        heading: "House style, out of character too",
        paragraphs: [
          "The Discord rules are short and enforced: be respectful, no spam, no advertising, no adult content, no hate speech or iconography, and do not ping staff. Keep personal information to yourself, and to other people.",
        ],
      },
    ],
    cta: { label: "Join the Discord", href: DISCORD_INVITE },
  },

  discord: {
    title: "Discord",
    subtitle: "The login, the front door, and the only support channel.",
    sections: [
      {
        paragraphs: [
          "Mereth authenticates through Discord rather than a username and password. The client has separate failures for being outside our Discord and for never having logged in through it, so joining is not optional: it is the account system.",
        ],
      },
      {
        heading: "First things to do once you are in",
        bullets: [
          "Read the rules. Mereth is 18+ and the standard is serious roleplay.",
          "Set your Discord name to your character's name. That is rule CRE.3.",
          "Download the launcher. It installs the whole mod list for you; do not assemble it by hand.",
          "Open a ticket for anything that needs staff, and bring clips with context rather than fifteen seconds of a fight.",
        ],
      },
      {
        heading: "If the game will not connect",
        paragraphs: [
          "Bring the exact error text. The client distinguishes far more failures than most, and the wording tells you which one you have before anyone has to guess.",
        ],
      },
    ],
    cta: { label: "Join the Discord", href: DISCORD_INVITE },
  },

  privacy: {
    title: "Privacy",
    subtitle: "What this website collects, which is very little.",
    sections: [
      {
        paragraphs: [
          "This website is static. It has no accounts, no login, no comments and no forms, so there is nothing here to sign up for and nothing to hand over.",
        ],
      },
      {
        heading: "What the website stores",
        bullets: [
          "Nothing in a database, because it has no database.",
          "A skill plan lives entirely in the address bar, in the part after the hash, which is never sent to any server. Sharing a plan means sharing that link and nothing else.",
          "Standard web server request logs, which any host keeps.",
          "No analytics, no advertising, no third-party trackers, and no cookies set by this site.",
        ],
      },
      {
        heading: "The game server is separate",
        paragraphs: [
          "Mereth itself authenticates through Discord and handles its own data, including what Discord shares with us when you authorise the login. Nothing on this website is connected to your Mereth account, and this website could not read it if it tried.",
        ],
      },
      {
        heading: "Discord and tickets",
        paragraphs: [
          "Tickets, clips and whitelist submissions live in Discord and are held under Discord's own terms. Staff read them to handle the matter you opened them for. Do not put personal information into a ticket that the matter does not require.",
        ],
      },
    ],
  },

  terms: {
    title: "Terms",
    subtitle: "What this site is, and the boundaries around what it describes.",
    sections: [
      {
        heading: "What this is",
        paragraphs: [
          "The official website for Mereth Roleplay: our handbook, our rules, our roadmap, and a reference built from the plugins and the client our own launcher installs.",
        ],
      },
      {
        heading: "Accuracy",
        paragraphs: [
          "We ship almost daily, so anything here can go out of date between one visit and the next. Every reference page shows the date its data was indexed. The rulebook is the authority on rules, the release notes are the record of what shipped, and this site is kept in step with both rather than replacing either.",
        ],
      },
      {
        heading: "Not affiliated",
        paragraphs: [
          "Mereth Roleplay is not associated with ZeniMax Entertainment, Bethesda Softworks or Nexus Mods in any way. The Elder Scrolls and Skyrim are the property of Bethesda Softworks.",
        ],
      },
      {
        heading: "Mods and credits",
        paragraphs: [
          "Our launcher installs mods made by other people. Each is linked to its Nexus page so you can read the credits and permissions, and endorse the authors whose work makes Mereth possible. We do not host or redistribute anything we do not have permission to.",
        ],
      },
    ],
  },

  refunds: {
    title: "Refunds",
    subtitle: "Where to ask, and what to bring.",
    sections: [
      {
        paragraphs: [
          "This website sells nothing and takes no payments. Anything you have contributed went through our own support channels, and a question about it goes to staff.",
        ],
      },
      {
        heading: "How to ask",
        bullets: [
          "Open a ticket in Discord rather than a direct message to a staff member.",
          "Include the date and the platform the payment went through.",
          "One ticket per issue, and confirm with staff before it closes.",
        ],
      },
      {
        heading: "What support does not entitle you to",
        paragraphs: [
          "Supporting the server buys no advantage in play, no whitelisted role and no exemption from the rulebook. A refund request is handled on its own merits, and neither affects nor is affected by anything about your character.",
        ],
      },
    ],
    cta: { label: "Open a ticket", href: "/discord" },
  },
};

export function simplePage(slug: string): SimplePageContent | null {
  return simplePages[slug] ?? null;
}
