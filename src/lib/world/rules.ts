/**
 * The rulebook, structured.
 *
 * Transcribed from the official Rules and Regulations document, keeping the
 * rule codes (CRE.1, NVL.2, PPI.5 and so on) because staff and players cite
 * them in tickets and a rule you cannot cite is a rule nobody can appeal.
 *
 * The document is the authority. This is a readable index of it, not a
 * replacement, and the page says so and links to it.
 *
 * Chapter ids are linked from the FAQ, the factions page and the search index,
 * so an id, once published, stays put even when its chapter is rewritten.
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
    blurb:
      "Mereth is built around players creating a world together. The alliances you build, the enemies you make and the choices you live with should come from roleplay. Everyone needs room to contribute, and everyone needs to be able to lose. These rules apply to players, faction leaders and staff alike.",
    rules: [
      { code: "S.1", text: "Staff hold the right to change any and all rules and regulations at any time." },
      { code: "S.2", text: "Mereth RP is an 18+ community." },
      { code: "S.3", text: "Staff hold the right to take disciplinary action against any member of the community for any infraction outlined in these rules." },
      { code: "S.4", text: "Voice changers and modulators are allowed, but must maintain a realistic pitch. Not too low, not too high." },
    ],
  },
  {
    id: "discord",
    title: "The Discord",
    blurb: "These keep the Discord safe, and they apply every time you use it.",
    rules: [
      { code: "D.1", text: "Be respectful. No mean, rude or harassing comments. Treat others the way you want to be treated." },
      { code: "D.2", text: "No spamming. Do not send a run of small messages one after another; keep messages at least five words long." },
      { code: "D.3", text: "No invasive advertising for other communities or streams. Content that is relevant and genuinely useful to the community goes in the media channel." },
      { code: "D.4", text: "Keep your name and profile picture appropriate." },
      { code: "D.5", text: "Threats are forbidden." },
      { code: "D.6", text: "Follow the Discord Community Guidelines." },
      { code: "D.7", text: "Do not share your own personal information, or anybody else's without their consent. Phone numbers, addresses and anything else sensitive." },
      { code: "D.8", text: "No links to illegal or pirated content, such as copyrighted material or stolen software. It breaks Discord's terms of service and can get you banned from the server." },
      { code: "D.9", text: "Fact-check what you share and use reliable sources. False or misleading information undermines the trust the community runs on." },
      { code: "D.10", text: "No sharing or distributing hacks, cheats, or other unauthorised tools or services." },
      { code: "D.11", text: "No adult, explicit or graphic content, including images, text and nicknames." },
      { code: "D.12", text: "No hate speech, hateful iconography or real-life political topics." },
      { code: "D.13", text: "Do not ping staff." },
    ],
  },
  {
    id: "character",
    title: "Your character",
    rules: [
      { code: "CRE.1", text: "Names and appearance must be lore-appropriate for Skyrim in the Fourth Era, and names should fit your race's conventions: Nordic names for Nords, Dunmeri names for Dark Elves. Staff can point you to resources. If your character was raised by another culture and their name reflects that, explain it in your whitelist backstory." },
      { code: "CRE.2", text: "No historical figures, legendary figures, celebrities, characters from another IP, or joke names. Ulfric Stormcloak, the Dragonborn, Tiber Septim, Sheogorath, Jon Snow, Geralt of Rivia and Ben Dover are all out." },
      { code: "CRE.3", text: "Your Discord name must match your character's name." },
      { code: "CRE.4", text: "Your character must be 18 or older." },
      { code: "CRE.5", text: "Mereth is collaborative storytelling. Making your character extremely powerful through unfair means, circumventing the usual processes, or bending rules with malicious or selfish intent breaches this rule." },
    ],
  },
  {
    id: "conduct",
    title: "Conduct toward other people",
    blurb: "Breaking any of the T rules results in an irreversible ban.",
    rules: [
      { code: "T.1", text: "No language that is homophobic or mocks any real-world culture, ethnicity, religion, sexual orientation or political belief. This includes hate speech and iconography.", severe: true },
      { code: "T.2", text: "No excessive toxicity, slurs, or telling people to kill themselves.", severe: true },
      { code: "T.3", text: "No toxicity or harassment in the server's Discord, on stream, or in direct messages.", severe: true },
      { code: "T.4", text: "In-universe prejudice rooted in Elder Scrolls lore is permitted: Nordic distrust of elves, Dunmer views on outsiders, tension between Khajiit and other races. It must stay strictly in character, and must never be a cover for real-world bigotry or used to make another player genuinely uncomfortable. \"Racist\" is not a word in the lore, so do not use it at somebody who discriminates in character.", severe: true },
      { code: "T.5", text: "Smack talk is allowed, with a line. Players may give their characters handicaps such as missing limbs, chronic illness or speech impediments. These may be referenced in character until the player says it should go no further. Continuing after that is toxicity.", severe: true },
      { code: "ERP.1", text: "No erotic roleplay on the server, in public view or private. Romance is allowed; if it progresses to an adult level, fade to black or take it to direct messages." },
      { code: "ERP.2", text: "Non-consensual erotic roleplay, including sexual assault and harassment, and degrading acts on downed or incapacitated players, is a permanent and irreversible ban.", severe: true },
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
      { code: "B.1", text: "Out-of-character talk in character is prohibited. If an issue arises, remove yourself from the scene quickly but methodically and handle it in a ticket (a \"prayer\") or a direct message." },
      { code: "B.2", text: "A ticket is out of character. Do not discuss one in character; staff handle tickets in the proper channels." },
      { code: "OIB.1", text: "Do not let IC (your character) and OOC (you) bleed into each other. Robbed in character, deal with it in character, not by messaging the player afterwards. Your character hating theirs does not mean you have a problem with them. What you learn in Discord your character does not know. An in-character argument does not continue in Discord, voice or DMs. Do not ask staff to change an in-character outcome because you are upset about it. And something said out of character cannot be used against anyone in character." },
      { code: "OIB.2", text: "The only exceptions are sorting Discord roles, setting up events, and explaining rules and roleplay functions." },
    ],
  },
  {
    id: "meta",
    title: "Metagaming and powergaming",
    blurb:
      "Metagaming is using information your character has not legitimately gained. Powergaming is forcing outcomes on other players, claiming abilities you do not have, or slipping past rules and consequences to secure a result.",
    rules: [
      { code: "MG.1", text: "Keep player knowledge and character knowledge separate. Your character knows what they witnessed, were told through valid roleplay, or would reasonably know from their background. Knowing the lore yourself does not mean they know every creature's weakness, a stranger's identity or the answer to a mystery. Common knowledge need not be rediscovered; specific secrets need an in-character source." },
      { code: "MG.2", text: "Out-of-character information stays out of character. Discord, DMs, streams, screenshots, player lists, nameplates and staff information never become character knowledge by themselves. A name above someone's head does not introduce them; a Discord role does not reveal their allegiance. Information from tickets or staff observation must never be used for advantage or passed to someone who will use it." },
      { code: "MG.3", text: "Respect what your character could actually witness. Chat on your screen is not something your character heard; distance, walls and closed doors matter. News must reach your character before they react, and you cannot invent a messenger afterwards. Your camera and graphics settings are not extra senses: peeking round corners in third person, watching someone behind you, stripping grass or shadows, or raising brightness to see through darkness is all metagaming. Normal third person and reasonable performance or accessibility settings are fine, so long as the extra visibility never becomes character knowledge." },
      { code: "MG.4", text: "Your characters have separate knowledge. Information, relationships and grudges do not carry between them, and you may not switch characters to retaliate for something only another one experienced. Routing out-of-character information through a friend, an alt or an invented contact does not make it legitimate." },
      { code: "MG.5", text: "Coordinate through roleplay. No out-of-character calls or messages to summon help, report enemy positions, warn of an arrest or arrange a response. Scheduling and rule questions are fine. Group and faction roleplay uses Mereth's approved channels: unofficial outside Discords for Mereth groups are prohibited, while the official faction Discords under O.6 remain authorised." },
      { code: "MG.6", text: "Avoiding something can be metagaming too. Changing your route, hiding belongings, cancelling a meeting or suddenly distrusting someone because of out-of-character information counts just as much. Reasonable suspicion from real in-character clues is fine; picking a suspect from OOC knowledge and staging an investigation to justify it is not." },
      { code: "PG.1", text: "Emote attempts when the outcome is contested, and give the other player a chance to respond. \"/me reaches for his wrist, trying to pull the dagger away\" leaves room. \"/me breaks his wrist, takes the dagger and knocks him unconscious\" decides three outcomes for them. Once an outcome is properly resolved, it can be described as done." },
      { code: "PG.2", text: "Give a fair response in return. A chance to respond is not a licence to dodge everything, escape every hold or refuse every consequence. Do not rush several contested actions through before the other player can answer, and do not use silence or repeated objections to stall the scene." },
      { code: "PG.3", text: "Resolve the scene the proper way: the combat rules, agreed rolls and staff event systems. Agree what a roll decides before rolling, and do not reroll until you like the result. A high roll cannot grant an ability you lack, reveal what your action could not uncover, or override death rules. A valid outcome does not need fresh permission because somebody dislikes it." },
      { code: "PG.4", text: "Play the abilities and resources you actually have. Backstory, rank, age or lore knowledge are not unlimited power, and special abilities need Mereth's approvals. Do not invent extra guards, witnesses, wards, hidden gear or divine intervention to win a scene. A Jarl's authority and a mage's training matter in roleplay; neither guarantees success." },
      { code: "PG.5", text: "Carry the consequences forward. Injuries, restraints, exhaustion and effects established through valid roleplay or event rulings are played until resolved. A refilled health bar does not erase an injury, and you cannot declare yourself immune, healed or unaffected by a failed roll without a valid basis." },
      { code: "PG.6", text: "No technical escapes. Exploiting bugs, clipping through obstacles, switching characters or disconnecting to avoid a scene or its consequences is prohibited. A genuine crash is a technical issue: reconnect when you can and contact staff if the scene cannot be resumed fairly." },
      { code: "PG.7", text: "Lasting outcomes follow their own rules. Permanent injuries, character death and other lasting changes need their applicable approvals, and one emote or roll cannot bypass them. Equally, those protections do not let anyone reject ordinary hostile roleplay or a loss resolved within the rules. Torture, out-of-combat mind-altering illusion and other interactions with their own consent rules keep them." },
      { code: "Reports", text: "Think either was broken? Preserve the evidence and open a ticket with enough context to show what each character knew and how the outcome was reached. Ask for staff help immediately if needed; otherwise keep the dispute out of the scene and out of public argument. Staff review fairly: an unexpected arrival or a lost fight is not proof of a rule break. Honest mistakes get guidance, deliberate or repeated abuse falls under the existing punishment policy, and staff access, rank, donations and friendships exempt nobody." },
    ],
  },
  {
    id: "intent",
    title: "Intent to roleplay",
    blurb: "No intent to roleplay is exactly how it sounds: zero intention from the player to play the scene.",
    rules: [
      { code: "N.1", text: "Failing to roleplay injuries (even when healed by magic, acknowledge the wound), refusing reasonable in-character requests from guards or authority, or using exploits and mechanics to escape restraint or capture without roleplay. That last one is also powergaming." },
      { code: "N.2", text: "Obvious attempts at trolling or griefing." },
      { code: "N.3", text: "Modern slang breaks the Fourth Era. Bruh, cap and YOLO are not permitted." },
      { code: "N.4", text: "Use in-universe expressions instead. By the Nine. Talos preserve us (careful around the Thalmor). Milk-drinker. S'wit, N'wah, fetcher. By Y'ffre. May your road lead to warm sands. Walk with the shadows." },
    ],
  },
  {
    id: "life",
    title: "Valuing your life",
    rules: [
      { code: "NVL.1", text: "Value your character's life at all times. Roleplay over ruleplay. If someone has a blade to your throat or a spell aimed at you, consider your options carefully, and fight realistically using cover." },
      { code: "NVL.2", text: "Outnumbered five to one or worse and you retaliate, that is not valuing life. This includes against guards. The aggressors must have weapons drawn or spells readied and aimed for it to apply." },
      { code: "NVL.3", text: "If you hear combat, do not run toward it unless you are directly involved or are responding as a guard or authority figure." },
      { code: "NVL.4", text: "Killed by a guard, you remain at the temple to be arrested and may not flee. Using death to avoid roleplay is powergaming." },
      { code: "NVL.5", text: "Suicide roleplay is not allowed, for any reason." },
    ],
  },
  {
    id: "supernatural",
    title: "Supernatural and cultists",
    blurb:
      "Monster hunting is not consequence-free. These rules enforce valuing your life around dangerous things and set out when a supernatural encounter can end a character.",
    rules: [
      { code: "SC.1.1", text: "Hunting is mutual high-stakes risk. Hunt, confront or try to expose a supernatural character or cultist and lose the fight, and your character faces an immediate perma-kill.", severe: true },
      { code: "SC.1.2", text: "Unless you belong to an officially recognised Supernatural Hunter faction, you may not actively seek out or hunt supernatural creatures." },
      { code: "SC.1.3", text: "It goes both ways. Supernaturals and cultists who are hunted can be perma-killed if they lose.", severe: true },
      { code: "SC.1.4", text: "The same rules apply to cults. Exposed taking part in cult activity, whitelisted cult or not, and you are immediately open to a perma-kill.", severe: true },
      { code: "SC.2.1", text: "If a hunt, confrontation or exposure happens, contact staff immediately through a ticket." },
      { code: "SC.2.2", text: "Staff verify the target was a real supernatural player or authorised cultist, not somebody pretending. For non-whitelisted cult activity under SC.1.4, staff verify the activity itself; not being in an official cult does not remove the risk." },
      { code: "SC.3.1", text: "The feeding exception. Hunted by a vampire or werewolf for food, or killed in a scenario unconnected to a hunt or exposure, you are immune to a perma-kill under the hunting rules." },
      { code: "SC.3.2", text: "Hunt perma-kills apply only when a supernatural or cultist is actively being hunted or exposed by players. Ordinary self-defence or being fed on does not trigger one, though SC.4.3 still applies when its conditions are met." },
      { code: "SC.4.1", text: "Treating dangerous creatures casually, mocking them (\"Oh, who's a good dog!\"), or instantly begging to join them without deep, case-by-case roleplay is forbidden." },
      { code: "SC.4.2", text: "Failing to roleplay proper fear of these creatures is not valuing life." },
      { code: "SC.4.3", text: "Fail to show fear and die for it, and the perma-kill is automatic. Staff still verify.", severe: true },
      { code: "SC.4.4", text: "Staff may adjust or override these rules during sanctioned, scripted events with official actors." },
    ],
  },
  {
    id: "magic",
    title: "Magic",
    blurb:
      "Magical powergaming is using out-of-character, repetitive or mechanical methods to gain magic quickly, the kind that breaks immersion and treats magic like an MMO. Teaching is a privilege, not a right, and staff can remove magic from a teacher who breaks these rules.",
    rules: [
      { code: "MP.1", text: "No MMO tactics such as dungeon farming for tomes. No clearing the same location repeatedly, waiting on respawns, or treating the world as a dungeon crawl." },
      { code: "MP.2", text: "No farming or camping high-value locations for magic items: soul gems, staves, enchanted gear, rare ingredients and the like." },
      { code: "MP.3", text: "No exploiting magic bugs, magical or otherwise. The speed bug and carry weight bug, for instance." },
      { code: "MP.4", text: "No mass production of enchanted items without roleplay to justify it." },
      { code: "MP.5", text: "No using out-of-character knowledge to locate rare items." },
      { code: "MP.6", text: "Secret or restricted areas, such as Shalidor's Maze, Blackreach and the Forgotten Vale, need staff approval and roleplay to back it." },
      { code: "TR.1", text: "No abusing the Teach interaction to teach beyond your three apprentices. As the server and its organisations grow, more teachers may be approved." },
      { code: "TR.2", text: "No rushing a student to Master by teaching only one spell per rank." },
      { code: "TR.3", text: "No teaching magic without the roleplay to support it." },
      { code: "TR.4", text: "Teaching beyond Adept (Expert and Master) needs a ticket approving the roleplay and process behind it." },
      { code: "TR.5", text: "No payment, favours or services in exchange for accelerated or improper teaching." },
      { code: "TR.6", text: "Teachers keep standards. Repeatedly producing poorly trained or powergamed students can cost you your teaching privileges." },
      { code: "TR.7", text: "No abandoning or neglecting active apprentices without a proper roleplay resolution." },
      { code: "IM.1", text: "Mind-altering illusions such as Calm and Fear may not be used out of combat. With out-of-character consent they may be, under Mereth's rules for player interactions. Without mechanics to protect player agency this is the only workable line for now, and it may change." },
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
      { code: "PPI.8", text: "A quickdraw must be with a one-handed weapon or a readied spell. Pulling a two-hander off your back and swinging immediately can be powergaming." },
    ],
  },
  {
    id: "robbery",
    title: "Robbery and theft",
    blurb:
      "Every robbery shares one 60 minute cooldown, covering player robberies and storage thefts alike and everyone involved, lookouts and accomplices included. Only septims count as currency: ore, ingots and other valuables are items, whatever they are worth.",
    rules: [
      { code: "R.1.1", text: "The cooldown starts when the encounter ends, pursuit included. Successful, failed, interrupted and abandoned attempts all count, and you cannot start another while one is still going." },
      { code: "R.1.2", text: "Cooldowns and repeat-target limits apply to every participant. Switching characters, splitting up, changing groups or picking a different collector does not reset them, and you may not send others to rob for you while restricted." },
      { code: "R.1.3", text: "One designated person collects the loot, in player and storage robberies alike. Nobody else takes anything extra." },
      { code: "R.1.4", text: "Switching between robbing players and robbing storage does not bypass the cooldown. No chain robbing." },
      { code: "R.1.5", text: "Forced trades, dropped items, \"gifts\" and payments demanded under threat count toward the limits. A robbery dressed up as a toll is still a robbery, and you may not destroy, hide, discard or move belongings beyond what you may take." },
      { code: "R.1.6", text: "Keys, quest items and anything staff have marked protected cannot be stolen without staff approval." },
      { code: "R.1.7", text: "For 30 minutes after the encounter, no changing clothes, armour or appearance, masks and disguises included." },
      { code: "R.1.8", text: "Robbing in cities, towns and busy inns is allowed but discouraged, given the witnesses and guards. Choosing to rob there never gives you permission to harm witnesses." },
      { code: "R.1.9", text: "Every robbery, theft and attempt leaves an in-game scene with F3 at the location: disturbed belongings, marks on a lock, tracks, signs of a struggle, whatever fits. If danger stops you, place it as soon as it is safe, or contact staff if you cannot return." },
      { code: "R.1.10", text: "Scene text describes what another character could reasonably observe. No invented actions, witnesses or evidence, no naming anyone nobody saw, no declaring guilt. Covering your tracks is fine to roleplay, but the scene is still required." },
      { code: "R.2.1", text: "No pocket wiping. From each victim you may take at most one equipped weapon, three unequipped non-weapon items and 100 septims, and at least one of their original items, other than septims, must stay with them." },
      { code: "R.2.2", text: "A stackable item is one item choice, capped at 150 per victim, and identical items across several stacks are still one choice. Septims are never one of the three items; ore and ingots are." },
      { code: "R.2.3", text: "The weapon must be equipped when the robbery begins; bows and staves count. Equipped armour, clothing, jewellery and shields cannot be taken, extra weapons cannot be taken as items, and forcing someone to equip or unequip changes nothing." },
      { code: "R.2.4", text: "A group can be robbed in one encounter, with the limits applied per victim and only the collector taking. You may not pull in passing travellers or move on to keep a robbery running past the cooldown." },
      { code: "R.2.5", text: "A robbery begins with roleplay and gives the victim a chance to respond. No attacking someone without roleplay to get at their inventory." },
      { code: "R.2.6", text: "No robbing someone already downed or unconscious when you found them. If they are downed during the robbery the normal limits still apply, and downing, killing or reviving never grants a second allowance." },
      { code: "R.2.7", text: "No robbing someone you or your group healed or revived during that encounter, and no camping a downed player waiting to rob them." },
      { code: "R.2.8", text: "Do not harm victims once the robbery is complete, unless they become an immediate, genuine threat to your life or freedom. Recognising you, insulting you or perhaps reporting you is not enough." },
      { code: "R.2.9", text: "No participant may rob the same player again within 24 hours of the last encounter ending, even if it failed or nothing was taken." },
      { code: "R.2.10", text: "You may not force anyone to withdraw from storage, a bank or any safe place, or make them unlock containers or give access to stored belongings." },
      { code: "R.3.1", text: "Thieves may steal from player-owned or faction-owned chests, lockboxes and stashes while sneaking, within the limits below." },
      { code: "R.3.2", text: "One storage robbery takes at most three items and 500 septims. Weapons count toward the three; a stackable is one choice capped at 150; ore and ingots are items, not septims." },
      { code: "R.3.3", text: "Those limits cover the whole robbery, not each chest. Opening another container grants nothing extra." },
      { code: "R.3.4", text: "Never empty a container. Each one keeps some of its original contents, and anything the thieves put in does not count." },
      { code: "R.3.5", text: "No participant may steal from the same player or faction again within 48 hours, failed and abandoned attempts included. That covers all of the owner's storage, wherever it is." },
      { code: "R.3.6", text: "The shared 60 minute cooldown still applies after a storage robbery or attempt." },
      { code: "R.3.7", text: "Breaking in must be roleplayed through lockpicking, sneaking and the rest. Running in and looting is powergaming." },
      { code: "R.3.8", text: "Caught in the act, normal rules apply. Value your life and respond accordingly." },
    ],
  },
  {
    id: "torture",
    title: "Torture and duelling",
    rules: [
      { code: "TORT.1", text: "Torture roleplay requires consent, and consent for each individual action. Ask with /do, receive with /me, act only on a yes." },
      { code: "TORT.2", text: "If consent is denied, no torture takes place. If a player's response avoids a specific act, you may not retry that act." },
      { code: "TORT.3", text: "Never remove heads or limbs without consent. This can be a ban for toxicity.", severe: true },
      { code: "DUEL.1", text: "Duelling is permitted. Both parties must agree, and the loser must understand their character will be permanently killed. Losing and refusing to perma-kill draws disciplinary action.", severe: true },
      { code: "DUEL.2", text: "A sanctioned duel has guards or an authority present as witness and its outcome is lawful. An unsanctioned duel may see the winner face criminal charges in character." },
    ],
  },
  {
    id: "organisations",
    title: "Organisations and holdstones",
    blurb: "Member limits are subject to change as the server grows.",
    rules: [
      { code: "O.1", text: "Lore factions take up to 30 members. Houses and clans, 20. Mercenary guilds, organisations, knightly orders and bandit factions, 17. Khajiit caravans, 12. Orc strongholds, 21." },
      { code: "O.2", text: "Every organisation is limited to two official businesses or operations." },
      { code: "O.3", text: "Every organisation is limited to one official hideout or headquarters. Members' personal homes may not be used for organisation activity unless designated as that hideout." },
      { code: "O.4", text: "One mercenary organisation, guild or knightly order per hold." },
      { code: "O.5", text: "The organisation leader keeps the roster up to date in the relevant Mereth RP Discord." },
      { code: "O.6", text: "Recruitment and out-of-character communication happen in an official Mereth RP Discord. Every lore faction has its own; other organisations and clans share one, with hidden categories per role." },
      { code: "O.7", text: "One faction, lore faction or organisation at a time. You may also belong to one clan or house alongside it, but never more than one house or clan." },
      { code: "O.8", text: "A cult or supernatural member may belong to another house, organisation or faction, but not to a second cult or supernatural faction." },
      { code: "HS.1", text: "Removing someone from a holdstone needs a valid in-character reason connected to the hold. Personal out-of-character disputes or dislike are not grounds. This binds Jarls, stewards and anyone else with holdstone permissions." },
      { code: "HS.2", text: "An active player must be told of their removal and its in-character reason first, through roleplay or a clear in-character notice. No silent removals. Being told does not give them a veto." },
      { code: "HS.3", text: "Removing an inactive player needs a ticket from the Jarl or steward, naming the player, the inactivity, the reason and any attempts to reach them." },
    ],
  },
  {
    id: "death",
    title: "Injury, prison and perma-kills",
    rules: [
      { code: "P.1", text: "Downed and brought to a player healer, you remember everything." },
      { code: "P.2", text: "While a player healer treats you, you are in their custody until discharged. Guards can enforce it, and staff-approved security may hold you until guards arrive." },
      { code: "P.3", text: "Downed and healed, you cannot rejoin the scene: no returning to the fight, chasing those involved or giving combat support. A revive, a potion or healing magic does not reset your part in the encounter." },
      { code: "P.4", text: "No respawning while in the custody of another player, a guard or a healer." },
      { code: "P.5", text: "Seek treatment from an available player healer whenever possible. If none is available, keep roleplaying the injury, call for help or move toward safety as it allows, and get treatment when you can." },
      { code: "P.6", text: "You may not respawn to avoid roleplay." },
      { code: "P.7", text: "You may roleplay a terminal illness, but you must be prepared to perma-kill from it based on the healer's examination, must roleplay with player medical staff, and may not infect other players." },
      { code: "P.8", text: "Seeing Sovngarde (respawning) costs you the thirty minutes before your death." },
      { code: "P.9", text: "Being downed is a serious injury. When you can move again, play the pain, weakness and limits of it. Do not jump up and sprint into or away from the scene as if nothing happened." },
      { code: "P.10", text: "Seek medical attention when your condition and surroundings allow. Do not skip available treatment to get back to what you were doing." },
      { code: "P.11", text: "If you are still in danger you may move toward cover, safety or help, believably for your injuries. This never permits returning to combat, ignoring restraints or escaping custody." },
      { code: "P.12", text: "Recovery is roleplayed. Magic, potions or a full health bar do not erase an injury; play out the treatment and stay with the healer until discharged under P.2." },
      { code: "P.13", text: "Taking an active part in a rebellion against the Thalmor or the Imperial Legion opens your character to a perma-kill at any time, whether or not they are rebelling at that moment.", severe: true },
      { code: "IP.1", text: "Custody awaiting sentencing is limited to two real hours. A sentence must be passed and told to the prisoner within that time." },
      { code: "IP.2", text: "The clock starts at cuffing and covers everything after it: the journey, transport, searches, questioning, processing and waiting for an official. Reaching a cell does not restart it." },
      { code: "IP.3", text: "Swapping guards, moving cells or holds, or releasing and re-detaining over the same incident does not reset the clock. No sentence in two hours means release." },
      { code: "IP.4", text: "A sentence that would perma-kill follows the existing perma-kill rules and approvals. Arrest, or reaching the two-hour limit, is never grounds for one by itself." },
      { code: "PD.1", text: "A perma-killed character is gone for good, and requires a ticket so staff can delete it.", severe: true },
      { code: "PD.2", text: "A will must be filed by ticket and completed at least two days before the perma-kill for it to be valid." },
      { code: "PD.3", text: "A will may pass items, weapons and gold to another player. To a character of your own it may leave at most 500 septims and three items in total, weapons included, however you split it; no homes or businesses, and every other transfer between your own characters stays prohibited. These limits may change." },
      { code: "PD.4", text: "Perma-kill while owning a business or home and you must appoint a new owner in the will. Unappointed property returns to the hold, and it cannot go to another character of yours." },
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
      "A whitelisted faction with its own rules. Outside duels, perma-kill sentences and the supernatural and cultist rules, a contract is the only sanctioned way to perma-kill another player's character without their consent.",
    rules: [
      { code: "DB.2", text: "A contract must be submitted by ticket to the Head Government and approved before any attempt. It requires valid in-character justification with clips; an out-of-character grudge is never valid. The target must have committed significant offences or have a compelling narrative reason: betrayal, witnessed crimes, broken oaths." },
      { code: "DB.3", text: "The requester performs the Black Sacrament and submits a ticket with the reasoning and a picture of the sacrament. Staff review whether it is valid and narratively compelling. The target is never told out of character that a contract exists." },
      { code: "DB.4", text: "The assassin must initiate proper roleplay before any attempt. A silent execution is permitted only against a target caught completely unaware and alone. If the target escapes or wins, the contract has failed and the assassin perma-kills if caught and killed. A failed contract cannot be retried for 14 days." },
      { code: "DB.5", text: "No more than two approved contracts server-wide at once. No player may be targeted more than once in 30 days. Contracts on Jarls, guards or essential figures need explicit Head Government approval and a significant lore reason, and members may not target their own faction or staff characters without approval." },
      { code: "DB.6", text: "A successful contract means the victim perma-kills, under the normal perma-kill and will rules. The Brotherhood does not boast publicly. Both parties stay respectful out of character, and clips go to staff for verification." },
      { code: "DB.7", text: "Abusing the contract system for grudges, harassment or repeat targeting means removal from the faction and a possible server ban.", severe: true },
    ],
  },
  {
    id: "work",
    title: "Businesses and jobs",
    rules: [
      { code: "BUS.1", text: "One business per player, across all of your characters." },
      { code: "BUS.2", text: "Two jobs per player. A guard captain may permit a second job, but you cannot be on duty while working it, and you may only report crime rather than react to it." },
      { code: "BUS.3", text: "Businesses are limited to ten employees, not counting the owner." },
      { code: "BUS.4", text: "One co-owner per business, not counted as an employee." },
    ],
  },
  {
    id: "bugs",
    title: "Bugs and exploits",
    blurb: "Hitting a bug is not a rule break. Using one is.",
    rules: [
      { code: "BR.1", text: "If a bug changes what your character can do or gives an unintended advantage, stop using the affected mechanic at once: walking through walls, abnormal speed, ignored restraints, broken combat, magic or inventory. Do not wait to be told." },
      { code: "BR.2", text: "Report it promptly in a ticket: your character, roughly when and where, what happened, what you were doing beforehand, and who else was affected. Say if combat, custody, theft or another live scene was involved." },
      { code: "BR.3", text: "Keep any clips or screenshots with the lead-up, and be honest about any advantage gained. Do not trigger the bug again for more footage, and missing footage is no reason to delay the report." },
      { code: "BR.4", text: "Relog promptly when you can do it without abandoning a scene, or follow staff instructions. A relog does not cancel a fight, arrest, restraint or other ongoing consequence." },
      { code: "BR.5", text: "No reproducing or experimenting with a known or suspected exploit without explicit staff authorisation for that specific testing. Filing a report is not permission." },
      { code: "BR.6", text: "Do not spend, use, sell, hide or transfer anything gained through a bug, or have someone benefit for you. Report the gains so staff can correct them." },
      { code: "BR.7", text: "Exploit details go to staff privately in a ticket. Never post reproduction steps publicly or teach or encourage others to try it." },
      { code: "BR.8", text: "\"Helping the developers\" or \"gathering evidence\" does not authorise continued use. Deliberate or continued misuse can also count as powergaming or no intent to roleplay, and staff may act without a warning." },
    ],
  },
  {
    id: "tickets",
    title: "Tickets and reimbursements",
    rules: [
      { code: "PT.1", text: "Clips must include the context leading up to the issue and be at least five minutes long. Fifteen seconds of a fight will not do." },
      { code: "PT.2", text: "One ticket per issue." },
      { code: "PT.3", text: "Confirm with staff that your issue is resolved before the ticket closes." },
      { code: "PT.4", text: "Corruption tickets involving guards, Jarls or other officials must be approved by the Head Government or senior staff." },
      { code: "PT.5", text: "Asked to open a ticket, you have 24 hours to do it." },
      { code: "PT.6", text: "Do not be a ticket warrior. Roleplay over ruleplay." },
      { code: "RB.1", text: "Reimbursement needs clear clips or screenshots proving you owned the claimed items, in the types and quantities claimed. Video must meet PT.1." },
      { code: "RB.2", text: "Open a ticket with your character's name, the missing items and quantities, roughly when and where they went, what happened, and your proof." },
      { code: "RB.3", text: "Staff make their best effort to reimburse verified items lost to a game bug, limited to what the evidence supports. Exact restoration is not always possible." },
      { code: "RB.4", text: "Theft reports are investigated. Items taken in breach of the robbery rules must be returned by whoever took them; items taken within the rules stay taken." },
      { code: "RB.5", text: "No false, inflated or duplicate claims. If items come back while your ticket is open, tell staff so you are not paid twice." },
    ],
  },
];

/**
 * How a hold gets its Jarl, which is its own process rather than a rule.
 *
 * There was an out-of-character application once, and it is gone. It existed to
 * seat the first nine courts before the province had any, and every seat it was
 * for has been filled. A seat changes hands in play now, at a Moot, so a page
 * that still pointed a reader at a Discord form would be sending them to a door
 * that no longer opens and, worse, teaching them that the throne is a staff
 * decision rather than something their character's peers grant them.
 */
export const jarlPath = {
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
