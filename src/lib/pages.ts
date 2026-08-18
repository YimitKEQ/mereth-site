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
          "Whitelist postings. The Dark Brotherhood is the one the rulebook names; anything else that needs an application is posted here too. Jarl seats are not among them, they are settled in character at a Moot.",
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
    subtitle: "Version 1.0, effective 23 July 2026. What Mereth collects, why, and for how long.",
    sections: [
      {
        paragraphs: [
          "This page is a readable version of the Mereth RP Privacy Policy. The authoritative copy, with its version number and integrity record, is available through the Bstar Launcher and the official Discord, and it is the one that governs if the two ever differ.",
          "Mereth RP is operated from Virginia, United States, by the Mereth RP Administration Team, an unincorporated community organisation. The policy covers the launcher, the game servers, the Discord, applications and tickets, and the moderation and security systems behind them. It does not govern Discord, Nexus Mods, Steam or Bethesda, who collect under their own terms.",
        ],
      },
      {
        heading: "Eighteen or over, without exception",
        paragraphs: [
          "Downloading the launcher, accepting in it, joining the Discord or connecting to the server is a statement that you are at least 18. An account we reasonably believe is under 18 is suspended while it is reviewed, and removed if it is not resolved. Do not send government identification, financial details or medical records unless a separate secure process has been created and specifically asks for them.",
        ],
      },
      {
        heading: "What is collected",
        bullets: [
          "Identifiers: Discord username and ID, Steam and Nexus identifiers where you provide them, Mereth account ID, character names, roles and permissions.",
          "Acceptance records: which documents you accepted, when, from which IP, in which launcher version, and the integrity hashes of those documents.",
          "Launcher technical data: IP address, launcher and game versions, operating system and compatibility information, mod names and versions, file validation results, and crash and connection diagnostics.",
          "Server and gameplay logs: logins, connections, location and movement, commands, chat, inventory, trades, property, deaths, combat, robbery and item transfers, plus administrative actions.",
          "Community records: whitelist and staff applications, tickets, reports, reimbursement requests, warnings, suspensions, bans and appeals.",
          "Evidence you submit yourself, and audit records of any staff observation.",
        ],
      },
      {
        heading: "Gameplay observation, and its limits",
        paragraphs: [
          "Specifically authorised staff may view your active Mereth session and, when it is genuinely needed, capture an image of the game window. It is limited to moderation, security, investigation, appeal and technical purposes, kept to the shortest period reasonable, and every use writes an audit record naming the staff member, the user, the time, the reason, the case, and whether an image was taken.",
          "The tool reaches the Mereth game environment and nothing else. It is not authorised to access your desktop, other applications, your browser, private Discord messages, email, personal files, webcam, microphone, passwords or keystrokes outside the game. Staff may not use it out of curiosity, for entertainment, for retaliation or for in-character advantage, and what is seen may not be passed to factions, guilds or other players.",
          "If that capability is ever materially widened, the policy says plainly that new affirmative acceptance is required first, and that this document will not be used to authorise general computer surveillance.",
        ],
      },
      {
        heading: "Voice",
        paragraphs: [
          "Interviews, appeals and investigations sometimes happen in voice. Participants are told before any approved recording starts, and anyone who declines can have the matter handled in writing instead. Staff are not authorised to record private conversations secretly.",
        ],
      },
      {
        heading: "How long it is kept",
        bullets: [
          "Connection and technical logs holding raw IP addresses: up to 12 months.",
          "Support and ordinary moderation cases: case closure plus up to 3 years.",
          "Screenshots and video evidence: appeal closure plus up to 1 year.",
          "Voice recordings: closure of the matter and any appeal, plus up to 1 year.",
          "Whitelist and staff applications: up to 2 years after last activity.",
          "Acceptance records: while the account is active, then 5 years.",
          "Backups: up to 90 days after deletion from live systems.",
          "Permanent ban records last as long as the ban stands. De-identified statistics may be kept indefinitely.",
        ],
      },
      {
        heading: "Not sold, not advertised against",
        paragraphs: [
          "Mereth does not sell, rent or trade personal information, and does not process it for third-party targeted advertising. Changing that would mean updating the policy and giving whatever notice, consent or opt-out the law requires beforehand.",
        ],
      },
      {
        heading: "Your requests",
        paragraphs: [
          "You can ask what is held about you, get a copy, have it corrected or deleted, withdraw consent, object to processing, or appeal a decision. Open a ticket in the Discord categorised as **Privacy Request** and include enough detail to identify the account. Do not post sensitive information in a public channel.",
          "Where the Virginia Consumer Data Protection Act applies, the response comes within 45 days and an appeal within 60. A request can be limited where the information is genuinely needed for security, an active investigation, enforcing a permanent ban, another person's privacy or a legal claim, and the reason will be given.",
        ],
      },
      {
        heading: "This website",
        paragraphs: [
          "The site you are reading is static and separate. It has no accounts, no database, no analytics, no advertising and no cookies of its own, and a skill plan lives entirely in the part of the address after the hash, which is never sent to any server.",
        ],
      },
    ],
  },

  terms: {
    title: "Terms",
    subtitle: "Version 1.0, effective 23 July 2026. The agreement behind playing here.",
    sections: [
      {
        paragraphs: [
          "This page is a readable version of the Mereth RP Terms of Service. The authoritative copy is available through the Bstar Launcher and the official Discord, and it governs if the two ever differ.",
          "You enter the agreement by accepting in the launcher. It covers the launcher, the game servers, the Discord, applications, tickets and the systems behind them, and it takes in the Privacy Policy, the launcher's own licence and the official server rules by reference. Mereth is an independent fan-operated community, not affiliated with or endorsed by Bethesda, ZeniMax, Microsoft, Valve, Nexus Mods or Discord.",
        ],
      },
      {
        heading: "Who can play",
        paragraphs: [
          "You must be at least 18 and able to enter a contract. Accounts are yours to protect: use multi-factor authentication where it is offered, do not share credentials, do not impersonate anybody, and tell staff promptly if you think an account has been compromised.",
        ],
      },
      {
        heading: "What you agree not to do",
        bullets: [
          "Cheat, exploit, duplicate items, interfere with logs, or use modified clients, automation or packet manipulation.",
          "Evade a warning, suspension or ban through another account, a VPN, or somebody else's login.",
          "Harass, threaten, stalk, discriminate against or sexually exploit anybody. Roleplay does not excuse it.",
          "Publish private information, credentials, restricted logs, staff-only material or unlawfully obtained recordings.",
          "Fabricate, alter, destroy or misrepresent evidence in a report, appeal or application.",
          "Sell or trade accounts, whitelist status, items, characters or currency for real-world value, unless a specific programme is authorised in writing.",
          "Distribute malware or phishing, or infringe anybody's copyright, trademark or privacy rights.",
        ],
      },
      {
        heading: "The launcher, and what it may do",
        paragraphs: [
          "Playing requires the Bstar Launcher and a specific set of third-party mods, and the launcher has its own end user licence covering the software itself. It may authenticate you, validate your files, detect altered content, install and update what the server needs, collect technical diagnostics, and refuse the connection when required versions or acceptance records are missing.",
          "You agree not to reverse engineer or bypass its security, validation, acceptance, logging or connection controls, except so far as the law expressly allows regardless of contract. Third-party mods stay under their authors' licences, and none of them is guaranteed to remain available.",
        ],
      },
      {
        heading: "Characters and items are permissions, not property",
        paragraphs: [
          "Characters, gold, items, property, titles, ranks, faction positions and whitelist status are permissions inside Mereth. They are not real-world property, have no guaranteed cash value, and carry no right to continued access or restoration. Data may be corrected, confiscated, restored, rebalanced, reset, rolled back or wiped to deal with bugs, exploits, rule breaches, balance or development, and a reimbursement can be refused where the evidence is missing or inconsistent.",
        ],
      },
      {
        heading: "Staff, evidence and appeals",
        paragraphs: [
          "Staff may investigate, gather and preserve evidence, restrict access, correct server data and take other reasonable action. Decisions rest on the evidence available rather than on courtroom rules, and ticket details, deliberations and restricted logs stay confidential to protect privacy, witnesses and investigations.",
          "Consequences run from guidance and warnings through role removal, suspension and permanent bans, and serious conduct can skip the warning. Where an appeal is offered it goes through the official process, within any posted deadline, and it has to be truthful and complete. The designated final reviewer's decision is final within Mereth.",
        ],
      },
      {
        heading: "What you write and record",
        paragraphs: [
          "You keep whatever ownership you already had in your roleplay writing, clips, applications and messages. You give Mereth a non-exclusive, royalty-free licence to host, store, display, moderate, archive and use that material as far as is reasonably needed to run, secure, document and improve the server and to enforce these terms. It ends when the content is removed from live systems, apart from backups, lawful archives and moderation evidence.",
        ],
      },
      {
        heading: "Donations",
        paragraphs: [
          "Donations support running the community. They do not buy ownership, staff authority, immunity from the rules, guaranteed access or a permanent in-game benefit. Payments are handled by an independent processor under its own terms, and Mereth does not collect or store full card details.",
        ],
      },
      {
        heading: "No guarantees, and what liability is capped at",
        paragraphs: [
          "The services are provided as is and as available, with no warranty that they will be uninterrupted, compatible, complete or error free. Features, rules, mods, worlds and technical requirements change, and any part of the service can be interrupted, reset or discontinued.",
          "Liability for indirect, incidental or consequential loss is excluded, and total liability is capped at the greater of what you paid Mereth in the previous 12 months or 100 US dollars. Neither limit applies to liability that cannot lawfully be excluded.",
        ],
      },
      {
        heading: "Law, disputes, and changes",
        paragraphs: [
          "Virginia law governs, and the parties consent to venue there. A dispute starts with a **Legal Notice** ticket and 30 days for good-faith resolution, emergencies aside. There is no arbitration clause and no class-action waiver, and adding either would require clear notice and fresh acceptance.",
          "Nothing here waives a right the law does not allow you to waive. Material changes, including wider monitoring or new data practices, require you to accept the updated terms before connecting: continued play on its own is not treated as agreement to them.",
        ],
      },
      {
        heading: "Copyright and legal notices",
        paragraphs: [
          "Copyright, trademark and other legal complaints go through a **Legal Notice** ticket in the official Discord, identifying the complainant, the material, where it appears, the legal basis and contact details. A direct message to an individual staff member is not formal notice.",
        ],
      },
      {
        heading: "This website",
        paragraphs: [
          "Reference pages here are generated from the plugins and the client the launcher installs, and each shows the date its data was indexed. The rulebook is the authority on rules and the release notes are the record of what shipped; this site is kept in step with both rather than replacing either. The Elder Scrolls and Skyrim are the property of Bethesda Softworks.",
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
