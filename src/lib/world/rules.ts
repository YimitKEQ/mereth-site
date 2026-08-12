/**
 * The rulebook, structured.
 *
 * Transcribed from the official Rules and Regulations document, keeping the
 * rule codes (CRE.1, NVL.2, PPI.5 and so on) because staff and players cite
 * them in tickets and a rule you cannot cite is a rule nobody can appeal.
 *
 * The document is the authority. This is a readable index of it, not a
 * replacement, and the page says so and links to it.
 */

export interface Rule {
  /** The code as it appears in the document, e.g. "NVL.2". */
  code: string;
  text: string;
  /** Rules that end a character or an account, called out rather than buried. */
  severe?: boolean;
}

export interface RuleSection {
  id: string;
  title: string;
  blurb?: string;
  rules: Rule[];
}

export const ruleSections: RuleSection[] = [
  {
    id: "summary",
    title: "The short version",
    blurb: "Four things that sit above everything else in the document.",
    rules: [
      { code: "S.1", text: "Staff hold the right to change any and all rules and regulations at any time." },
      { code: "S.2", text: "Mereth RP is an 18+ community." },
      { code: "S.3", text: "Staff hold the right to take disciplinary action against any member of the community for any infraction outlined in these rules." },
      { code: "S.4", text: "Voice changers and modulators are allowed, but must maintain a realistic pitch. Not too low, not too high." },
    ],
  },
  {
    id: "character",
    title: "Your character",
    rules: [
      { code: "CRE.1", text: "Names and appearance must be lore-appropriate for Skyrim in the Fourth Era, and should fit your race's naming conventions. If your character was raised by another culture and their name reflects that, explain it in your whitelist backstory." },
      { code: "CRE.2", text: "No historical figures, legendary figures, celebrities, characters from another IP, or joke names. Ulfric Stormcloak, the Dragonborn, Tiber Septim, Sheogorath, Jon Snow, Geralt of Rivia and Ben Dover are all out." },
      { code: "CRE.3", text: "Your Discord name must match your character's name." },
      { code: "CRE.4", text: "Your character must be 18 or older." },
    ],
  },
  {
    id: "serious",
    title: "Serious roleplay",
    blurb: "The standard the whole server is built on, and the rule most newcomers trip over.",
    rules: [
      { code: "SRP.1", text: "Keep it professional. We are all here for a good time, but maintain a level of seriousness appropriate for immersive roleplay." },
      { code: "SRP.2", text: "Everything your character does should be considered as if it were their real life. Think about consequences and how your actions affect your character's future in Skyrim." },
      { code: "SRP.3", text: "No AI writing, in any form. Certain roles, factions and whitelist applications require original backstories written by you.", severe: true },
      { code: "B.1", text: "Out-of-character talk in character is prohibited. If an issue arises, remove yourself from the scene quickly but methodically and handle it in a ticket or a direct message." },
      { code: "B.2", text: "A ticket is out of character. Do not discuss one in character." },
    ],
  },
  {
    id: "intent",
    title: "Intent to roleplay",
    blurb: "No intent to roleplay is exactly how it sounds: zero intention from the player to play the scene.",
    rules: [
      { code: "N.1", text: "Failing to roleplay injuries, refusing reasonable in-character requests from guards or authority, or using mechanics to escape restraint without roleplay. That last one is also powergaming." },
      { code: "N.2", text: "Obvious attempts at trolling or griefing." },
      { code: "N.3", text: "Modern slang breaks the Fourth Era. Bruh, cap and YOLO are not permitted." },
      { code: "N.4", text: "Use in-universe expressions instead. By the Nine. Talos preserve us. Milk-drinker. S'wit, N'wah, fetcher. By Y'ffre. May your road lead to warm sands. Walk with the shadows." },
    ],
  },
  {
    id: "life",
    title: "Valuing your life",
    rules: [
      { code: "NVL.1", text: "Value your character's life at all times. Roleplay over ruleplay. If someone has a blade to your throat or a spell aimed at you, consider your options carefully, and fight realistically using cover." },
      { code: "NVL.2", text: "Outnumbered five to one or worse and you retaliate, that is not valuing life. This includes against guards. The aggressors must have weapons drawn or spells readied and aimed for it to apply." },
      { code: "NVL.3", text: "If you hear combat, do not run toward it unless you are directly involved or are responding as a guard or authority figure." },
    ],
  },
  {
    id: "conduct",
    title: "Conduct toward other people",
    blurb: "Breaking any of these results in an irreversible ban.",
    rules: [
      { code: "T.1", text: "No language that is homophobic or mocks any real-world culture, ethnicity, religion, sexual orientation or political belief. This includes hate speech and iconography.", severe: true },
      { code: "T.2", text: "No excessive toxicity, slurs, or telling people to kill themselves.", severe: true },
      { code: "T.3", text: "No toxicity or harassment in Discord, on stream, or in direct messages.", severe: true },
      { code: "T.4", text: "In-universe prejudice rooted in Elder Scrolls lore is permitted: Nordic distrust of elves, Dunmer views on outsiders, and so on. It must stay strictly in character, and must never be a cover for real-world bigotry or used to make another player genuinely uncomfortable.", severe: true },
      { code: "T.5", text: "Smack talk is allowed, with a line. Players may give their characters handicaps such as missing limbs, chronic illness or speech impediments. These may be referenced in character until the player says it should go no further. Continuing after that is toxicity.", severe: true },
      { code: "ERP.1", text: "No erotic roleplay, in public view or private. Romance is allowed; if it progresses to an adult level, fade to black or take it to direct messages." },
      { code: "ERP.2", text: "Non-consensual erotic roleplay, including sexual assault and harassment, and degrading acts on downed or incapacitated players, is a permanent and irreversible ban.", severe: true },
    ],
  },
  {
    id: "initiation",
    title: "Initiating on another player",
    blurb: "You cannot attack or restrain somebody who has not been given the chance to respond.",
    rules: [
      { code: "PPI.1", text: "You may only attack the person or people you initiated with." },
      { code: "PPI.2", text: "Your group may join in if they were present for the initiation." },
      { code: "PPI.3", text: "Archers, mages and any ranged support must be announced before acting. You need not give a precise location: \"I've got eyes on you from a distance\" is enough." },
      { code: "PPI.4", text: "No restraining or attacking without proper initiation first." },
      { code: "PPI.5", text: "Initiation must be long enough for the victim to exit any menu or animation, and they must comply before you can restrain or attack. Staying in a menu to avoid roleplay is itself against the rules." },
      { code: "PPI.6", text: "Initiation must be clear and direct. \"If I see you again, you're dead\" is not initiation." },
      { code: "PPI.7", text: "Leave a scene and you have ten minutes to return and act before you must initiate again." },
      { code: "PPI.8", text: "A quickdraw must be with a one-handed weapon or a readied spell. Pulling a two-hander off your back and swinging immediately is powergaming." },
    ],
  },
  {
    id: "robbery",
    title: "Robbery and theft",
    blurb: "All robberies carry a one hour cooldown before your group may commit another of any type. Avoid confrontations in towns and cities where you can.",
    rules: [
      { code: "1.1", text: "No pocket wiping. You may take one equipped weapon, three inventory items (stackables count as one), and all carried gold. Nothing else." },
      { code: "1.2", text: "Robbing as a group, only one person takes items from the victim." },
      { code: "1.4", text: "Do not harm victims after the robbery is complete, unless they are a genuine threat to your freedom or life." },
      { code: "1.5", text: "You may not rob someone you have just healed or revived, and you may not camp a downed player waiting to rob them." },
      { code: "1.6", text: "Sixty minutes real time between player-to-player robberies. No chain robbing." },
      { code: "1.7", text: "You may not rob the same person twice within 24 hours." },
      { code: "1.8", text: "No changing clothes or appearance for 30 minutes after a robbery." },
      { code: "1.9", text: "You may not force anyone to withdraw items or gold from storage, a bank or any safe location." },
      { code: "2.2", text: "Storage theft is capped at three items and 500 gold, and you may never empty a container. Leave something behind." },
      { code: "2.4", text: "One hour real time before you may steal from storage again, and never the same player or faction twice within 48 hours." },
      { code: "2.6", text: "Breaking in must be roleplayed. Running in and looting is powergaming." },
    ],
  },
  {
    id: "torture",
    title: "Torture and duelling",
    rules: [
      { code: "3.1", text: "Torture roleplay requires consent, and consent for each individual action. Ask with /do, receive with /me, act only on a yes." },
      { code: "3.2", text: "If consent is denied, no torture takes place. If a player's response avoids a specific act, you may not retry that act." },
      { code: "3.3", text: "Never remove heads or limbs without consent. This can be a ban for toxicity.", severe: true },
      { code: "4.1", text: "Duelling is permitted. Both parties must agree, and the loser must understand their character will be permanently killed. Losing and refusing to perma-kill draws disciplinary action.", severe: true },
      { code: "4.2", text: "A sanctioned duel has guards or an authority present as witness and its outcome is lawful. An unsanctioned duel may see the winner face criminal charges in character." },
    ],
  },
  {
    id: "death",
    title: "Death, injury and perma-kills",
    rules: [
      { code: "P.1", text: "Downed and treated by an NPC healer, you only vaguely remember what led to it. Treated by a player healer, you remember everything." },
      { code: "P.2", text: "While a player healer treats you, you are in their custody until discharged. Guards can enforce this." },
      { code: "P.3", text: "Downed and healed, you cannot rejoin the scene." },
      { code: "P.4", text: "No respawning while in the custody of another player, a guard or a healer." },
      { code: "P.5", text: "You may not use an NPC healer when a player healer is present and available." },
      { code: "P.6", text: "You may not respawn to avoid roleplay." },
      { code: "P.7", text: "You may roleplay a terminal illness, but you must be prepared to perma-kill from it based on the healer's examination, must roleplay with player medical staff, and may not infect other players." },
      { code: "P.8", text: "Seeing Sovngarde costs you the thirty minutes before your death." },
      { code: "PD.1", text: "A perma-killed character is gone for good, and requires a ticket so staff can delete it.", severe: true },
      { code: "PD.2", text: "A will must be filed by ticket at least two days before the perma-kill for it to be valid." },
      { code: "PD.3", text: "A will may pass items, weapons and gold to another player. It may never pass anything to another character of your own, and your next character cannot inherit a home or gold." },
      { code: "PD.4", text: "Perma-kill while owning a business or home and you must appoint a new owner in the will. Unappointed property returns to the hold." },
      { code: "PD.5", text: "Your next character may rejoin the same whitelisted faction or job, but starts at the lowest position and waits 15 days." },
      { code: "PD.6", text: "You cannot join a criminal organisation for two weeks after a perma-kill." },
      { code: "PD.7", text: "Serious crimes may end your character. Staff try to be fair and offer a choice where they can: life imprisonment, banishment from the hold, or execution." },
      { code: "PD.8", text: "Jarls may execute the leader of a bandit faction once criteria set and communicated by staff have been met." },
    ],
  },
  {
    id: "brotherhood",
    title: "The Dark Brotherhood",
    blurb:
      "A whitelisted faction with its own rules, because a contract is the only sanctioned way to perma-kill another player's character without their consent.",
    rules: [
      { code: "DB.2", text: "A contract must be submitted by ticket to the Head Government and approved before any attempt. It requires valid in-character justification with clips; an out-of-character grudge is never valid. The target must have committed significant offences or have a compelling narrative reason: betrayal, witnessed crimes, broken oaths." },
      { code: "DB.3", text: "The requester performs the Black Sacrament and submits a ticket with the reasoning and a picture of the sacrament. Staff review whether it is valid and narratively compelling. The target is never told out of character that a contract exists." },
      { code: "DB.4", text: "The assassin must initiate proper roleplay before any attempt. A silent execution is permitted only against a target caught completely unaware and alone. If the target escapes or wins, the contract has failed and the assassin perma-kills if caught and killed. A failed contract cannot be retried for 14 days." },
      { code: "DB.5", text: "No more than two approved contracts server-wide at once. No player may be targeted more than once in 30 days. Contracts on jarls, guards or essential figures need explicit Head Government approval and a significant lore reason." },
      { code: "DB.6", text: "A successful contract means the victim perma-kills. The Brotherhood does not boast publicly. Both parties stay respectful out of character, and clips go to staff for verification." },
      { code: "DB.7", text: "Abusing the contract system for grudges, harassment or repeat targeting means removal from the faction and a possible server ban.", severe: true },
    ],
  },
  {
    id: "work",
    title: "Businesses and jobs",
    rules: [
      { code: "B.1", text: "One business per player, across all of your characters." },
      { code: "B.2", text: "Two jobs per player. A guard captain may permit a second job, but you cannot be on duty while working it, and you may only report crime rather than react to it." },
      { code: "B.3", text: "Businesses are limited to ten employees, not counting the owner." },
      { code: "B.5", text: "One co-owner per business, not counted as an employee." },
    ],
  },
  {
    id: "tickets",
    title: "Tickets",
    rules: [
      { code: "PT.1", text: "Clips must include the context leading up to the issue. Fifteen seconds of a fight will not do." },
      { code: "PT.2", text: "One ticket per issue." },
      { code: "PT.3", text: "Confirm with staff that your issue is resolved before the ticket closes." },
      { code: "PT.4", text: "Corruption tickets involving guards, jarls or other officials must be approved by the Head Government or senior staff." },
      { code: "PT.5", text: "Asked to open a ticket, you have 24 hours to do it." },
      { code: "PT.6", text: "Do not be a ticket warrior. Roleplay over ruleplay." },
    ],
  },
];

/** The Jarl whitelist, which is its own process rather than a rule. */
export const jarlPath = {
  requirements: [
    "A minimum of ten pages of written submission.",
    "No AI usage of any kind.",
    "A voice interview with staff.",
  ],
  facts: [
    {
      q: "Can I become a Jarl as a non-Nord?",
      a: `No. Jarls in Mereth are Nords only. We are roleplaying the province of Skyrim and immersion
        is the methodology. The Jarls of Skyrim are Nords, full stop.`,
    },
    {
      q: "Can I lead a rebellion and take a hold?",
      a: `Short answer, yes. Long answer, no. Seizing a hold bypasses the sacred tradition of the
        Moot. You will be regarded as an Usurper by every other Jarl, they will move to retake the
        hold, and when that day comes your character will be executed. You may sit the throne for a
        time. You will not keep it.`,
    },
    {
      q: "What happens if a Jarl dies?",
      a: `The court convenes a Moot. All thanes, sword-thanes, shield-thanes and court members select
        the next leader from among their own ranks, and **the vote must be unanimous**. If the court
        is divided the Moot continues until consensus. There is no shortcut, no majority rule and no
        tiebreaker.`,
    },
    {
      q: "Can I challenge a Jarl for the throne?",
      a: `Not for the throne itself. You may challenge a Jarl to an honour duel with a relevant and
        meaningful roleplay reason, and "I want control" is not one. Most Nords will accept on
        honour alone, but acceptance is not guaranteed. Winning does not make you Jarl: a Moot must
        still be held.`,
    },
  ],
};


