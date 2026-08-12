/**
 * The FAQ.
 *
 * Written in Mereth's own voice: these are our answers, so they are stated
 * plainly rather than attributed. What survived from the earlier version is the
 * evidence, because it is genuinely useful:
 *
 *   quote  a message the client itself prints, verbatim, punctuation and all.
 *          A player matching an error on screen to an answer needs the exact
 *          string, so these are never tidied to house style.
 *   cite   a pattern matched against dated release notes, so an answer about
 *          something that changed shows when it changed.
 *
 * One question is marked `open`. It is asked constantly and has no decided
 * answer, and saying so is better than inventing one.
 */

export interface Answer {
  q: string;
  /** Body copy in the inline markup grammar from `@/lib/markup`. */
  a: string;
  /** True when there is genuinely no decided answer yet. */
  open?: boolean;
  /** A message the client prints, shown under the answer. */
  quote?: string;
  /** A pattern matched against release notes to date the answer. */
  cite?: RegExp;
}

export interface FaqSection {
  id: string;
  title: string;
  blurb?: string;
  items: Answer[];
}

export const faqSections: FaqSection[] = [
  {
    id: "first",
    title: "Before you apply",
    blurb: "The questions people ask before they have an account, in the order they usually ask them.",
    items: [
      {
        q: "What is Mereth?",
        a: `A serious roleplay Skyrim server running on SkyMP, built by a team with years of
          experience in FiveM and RedM. Everyone is in the same province at the same time, on a
          shared world clock, playing characters rather than the Dragonborn. The systems underneath
          it exist to give those characters something to be about.`,
      },
      {
        q: "Who is it for?",
        a: `Anyone willing to play a character properly, whether you have thousands of hours in
          Skyrim or have never opened it. Mereth is an **18+ community** and the standard is serious
          roleplay: stay in character, think about consequences, and treat what happens to your
          character as though it happened.`,
      },
      {
        q: "What do I need to own and install?",
        a: `Skyrim Special Edition on PC, SKSE, and our launcher. The launcher reads the live
          manifest, installs the full mod list in a fixed order and checks your files against the
          server before you connect. **Do not assemble the list by hand**, and do not update mods
          yourself: a newer version of the right mod fails exactly like a missing one.`,
      },
      {
        q: "How do I log in?",
        a: `Through Discord, not a username and password. Your Discord account is your account, so
          membership of our Discord is the gate. The client will also refuse a ban, an expired
          session, an expired token, or a login from a different IP.`,
      },
      {
        q: "Is AI-written roleplay allowed?",
        a: `No. Rule **SRP.3** forbids it in any form, and roles, factions and whitelist
          applications require original backstories written by you. Write your own character.`,
      },
    ],
  },

  {
    id: "setting",
    title: "Setting and lore",
    items: [
      {
        q: "When is this set?",
        a: `4E 185, ten years after the White-Gold Concordat ended the Great War between the Empire
          and the Aldmeri Dominion. This is an **alternate timeline** from Skyrim: named characters
          from the post-war period are removed and replaced by players.`,
      },
      {
        q: "What is the situation?",
        a: `Skyrim is at peace and increasingly divided. Imperial banners still fly, taxes are still
          collected in the Emperor's name, and the Moot still recognises a High King. Beneath that,
          trust in Imperial authority is rotting: the Thalmor gained their foothold in 4E 176, the
          Embassy enforces the ban on Talos worship, and the Reach has not healed since the Forsworn
          Uprising. Tension is the point of the setting, not a background detail.`,
      },
      {
        q: "Can I play a character from Elder Scrolls lore?",
        a: `No. You may see familiar names, especially clans, but copy-paste characters from the
          games or the lore are not played here. You can aim to recreate similar events, or fill
          that role in Mereth's own timeline.`,
      },
      {
        q: "Why does everyone say magic feels different here?",
        a: `Magic itself is not different. The aesthetic is. We are returning Nordic character to
          the Fatherland, and Clevercraft is the ancestral tradition of Skyrim's people, so wherever
          you find magic and Nords together, expect shamanistic or druidic atmosphere.`,
      },
      {
        q: "Which races can I play?",
        a: `The ten playable races of Tamriel. Race is a real roleplay constraint here rather than a
          stat block: a Dunmer in Windhelm and an Altmer anywhere under Imperial law are both
          walking into a situation ten years after a war the Dominion won.`,
      },
      {
        q: "When does the civil war start?",
        open: true,
        a: `**No answer yet.** It is asked constantly and it does not have a decided answer, so this
          entry stays here until it does rather than being filled with a guess.`,
      },
    ],
  },

  {
    id: "skills",
    title: "Skills and memory points",
    blurb:
      "The part most new players get wrong, and worth reading before you spend anything. Skills are caps bought once, not ladders climbed forever.",
    items: [
      {
        q: "How does the skill system work?",
        a: `You get **18 memory points** at character creation and spend them to set the highest
          tier each skill can ever reach. They are not levels you grind toward: the rank you choose
          is a ceiling. Choose carefully, because these choices define who your character is.`,
      },
      {
        q: "What does each tier cost?",
        a: `Novice 1 point, Apprentice 2, Adept 3, Expert 5, Master 8. Eighteen does not go far when
          Master alone costs 8, so plan the build before you sit down.
          The [planner](/skills) does the arithmetic and will not let you overspend.`,
      },
      {
        q: "Where do I allocate?",
        a: `In the starting room, or at any temple in the province.`,
      },
      {
        q: "Can I earn more memory points?",
        a: `Yes. At the end of every month you may submit clips of your character **learning a skill
          in roleplay** through a ticket, and earn a point to allocate. Points come from playing the
          learning, not from grinding the skill.`,
      },
      {
        q: "How many levels are in a tier?",
        a: `Nineteen. Reaching the twentieth advances you to the next tier if your cap allows it. A
          cap buys the ceiling; experience carries you up to it.`,
      },
      {
        q: "What happens if I remove a memory point later?",
        a: `You lose the experience for the tier you dropped out of, though only if you had any in
          it.`,
      },
      {
        q: "How do I gain experience?",
        a: `By using the skills you have locked in. Nothing else counts, and some actions refuse
          outright without the skill assigned.`,
        quote: "Assign Lockpicking in your skill plan at a temple",
      },
      {
        q: "What is diminishing returns?",
        a: `Repeating the same thing pays less over time. Killing the same creature again and again,
          or spamming one recipe like daggers, earns steadily less. Rotating is worth more than
          grinding the most convenient thing.`,
      },
      {
        q: "What is the purple exhaustion bar?",
        a: `Your experience budget, not a debuff. It drops as you earn and only begins refilling
          once fully spent, faster at an inn. If your gains have gone flat, check it before blaming
          the skill. [Full detail here.](/survival#exhaustion)`,
      },
      {
        q: "Can I reach Legendary?",
        a: `Legendary is level 100 and cannot be bought with memory points at all. A plan caps at
          Master. Legendary is what happens at the very top of a Master skill, not a tier to plan
          for.`,
      },
      {
        q: "Do perks work differently?",
        a: `Perks unlock every ten levels on skills that grant them, halved from every twenty at the
          end of July.`,
        cite: /unlock every/i,
      },
    ],
  },

  {
    id: "combat",
    title: "Fighting",
    items: [
      {
        q: "Why can I not hurt anything with this sword?",
        a: `Because you have no points in that weapon skill. With no points you deal **no damage at
          all** with that weapon. If your blade is doing nothing, this is why, and it is not a bug.`,
      },
      {
        q: "Why is that a rule rather than a penalty?",
        a: `To keep civilians civilian, to give a reason to roleplay clumsiness with a weapon your
          character never trained on, and to make specialists actually feel like specialists. A
          swordsman should look like a swordsman and an archer like an archer.`,
      },
      {
        q: "How good is my character with a weapon at each tier?",
        a: `There is no table, and that is deliberate. The tier text for weapons is written as
          description rather than numbers, because **a fighter's reputation is meant to be earned in
          front of other people**. If you want to know whether someone is better than you with a
          blade, the answer is a duel, a spar or a witness. [More on what is published and what
          is not.](/progression#foic)`,
      },
      {
        q: "Does armour matter much?",
        a: `More than it used to. Damage mitigation was reworked in August and armour became roughly
          ten times more effective, so a build that dodged damage rather than absorbing it changed
          underneath its owner.`,
        cite: /mitigation/i,
      },
      {
        q: "Does my gear wear out?",
        a: `Yes. Durability and tempering are both modelled, so equipment degrades and needs a smith
          or a grindstone. Budget for repairs the way you budget for food.`,
        cite: /durabilit|temper/i,
      },
    ],
  },

  {
    id: "crafting",
    title: "Crafting and professions",
    items: [
      {
        q: "Is crafting one skill?",
        a: `No. It is split into separate skills rather than one umbrella smithing stat. A
          blacksmith might hold any combination of Weapon Smithing, Armor Smithing, Carpentry and
          Leatherworking.`,
      },
      {
        q: "Why does that matter?",
        a: `Because craftsmen end up genuinely uneven. The town swordsmith may be a Master of weapons
          and only an Adept at armour, so anyone wanting quality work has to find a master of that
          specific craft. Finding the best leatherworker in the hold becomes its own quest, and that
          quest is the economy.`,
      },
      {
        q: "What should I make first?",
        a: `Carry capacity. A 200 carry weight chest comes off the carpentry bench at level 5 and
          needs materials from several professions; a 50 carry weight satchel comes from
          leatherworking at 5 for less. Both are worth more as trade goods than most weapons.`,
        cite: /carryweight|carry weight/i,
      },
      {
        q: "Which gathering professions exist?",
        a: `Mining, fishing, saltmaking, hunting, herbalism, woodcutting, farming and beekeeping,
          each with its own nodes around the province. Unlike weapons, **gathering tiers name exactly
          what opens up**: the ore, the bait, the salt. [Read the tier text](/skills) before you
          commit a point.`,
      },
    ],
  },

  {
    id: "magic",
    title: "Magic",
    blurb:
      "A roleplay system rather than a menu, and the one we are asked about most. It is gated behind a person and behind time on purpose.",
    items: [
      {
        q: "How do I learn magic?",
        a: `Magic must be taught by a Master of the specialisation. Two things are required for any
          spell: **a Master Mage or Wizard willing to teach you, and a spellbook for that spell.** No
          master, no book, no magic.`,
      },
      {
        q: "How do I get my first spell?",
        a: `Usually through a Hold's Court Wizard, who runs aspiring mages through a three week
          apprenticeship and sends them off with their first spellbook. You need at least one spell
          already before the College of Winterhold will take you.`,
      },
      {
        q: "What does the College of Winterhold teach?",
        a: `Three semesters of formal instruction, priced increasingly: Novice, Apprentice, Adept.
          To advance past Adept you stay on as a researcher or a professor's assistant rather than
          as an ordinary student.`,
      },
      {
        q: "Where do spellbooks come from?",
        a: `The College library, effectively unlimited for students. A Court Wizard's limited
          starting selection. The East Empire Company, for purchase. And adventuring: spellbooks are
          placed randomly in dungeons on a bi-monthly cycle.`,
      },
      {
        q: "Can a magical organisation outside the College teach?",
        a: `Yes, and the number of such organisations is limited. They have no spellbook access by
          default: the head may be a Master Wizard and may teach apprentices, but every book has to
          be acquired through roleplay.`,
      },
      {
        q: "What tier is a given spell, and where is the list?",
        a: `Every spell carries its own tier, from Novice to Master, and the full list is on the
          [magic page](/magic) filterable by school and by tier. That tier is read from the spell
          itself rather than estimated.`,
      },
      {
        q: "What kinds of spells will I see?",
        a: `Mostly utility. Magelight, Candlelight, Detect Life, Detect Dead and the like. Every
          school is being redone around roleplay-friendly spells rather than raw combat power.
          Expect tools, not just weapons.`,
      },
      {
        q: "Who handles healing?",
        a: `Priests. Temple priests hold Master Restoration, are authorised to teach disciples, and
          serve as Mereth's doctors. If you need healing, find a temple, or a faction like the
          Vigilants of Stendarr.`,
      },
      {
        q: "Can I play a mage from the start?",
        a: `You can have a mage background in your history, but **new players do not start with
          magic. No exceptions.** Demonstrate it with \`/mes\` in roleplay and earn the mechanics the
          way everyone else does.`,
      },
      {
        q: "Is magic legal everywhere?",
        a: `No, and this catches people out. **Every hold sets its own magical law.** What is fine in
          Winterhold may not be in Markarth, Windhelm or Solitude. Check which spells are legal
          where you are, whether teaching requires a licence, and any local restriction on
          Conjuration, Destruction or Illusion. Ignorance is not a defence in any Jarl's court.`,
      },
      {
        q: "How long does advancing a tier take?",
        a: `Study runs about a week per tier, and a master of the school can teach you directly or
          speed the process up.`,
        cite: /spell training/i,
      },
    ],
  },

  {
    id: "jarl",
    title: "Rank, holds and becoming a Jarl",
    blurb: "The most demanding position on the server, and the rules that apply to every aspiring ruler.",
    items: [
      {
        q: "How do I become a Jarl?",
        a: `You must pass the whitelist posted in our Discord. It asks for a minimum of **ten pages
          of written submission**, **no AI usage of any kind**, and **a voice interview with staff**.
          The role demands depth, dedication, and a voice you can actually hold a court with.`,
      },
      {
        q: "Can I become a Jarl as a non-Nord?",
        a: `No. Jarls in Mereth are limited to Nords. We are roleplaying the province of Skyrim and
          immersion is the methodology. The Jarls of Skyrim are Nords, full stop.`,
      },
      {
        q: "Can I lead a rebellion and take over a hold?",
        a: `Short answer, yes. Long answer, no. By seizing a hold you bypass the sacred tradition of
          a Moot. You will be regarded as an Usurper by all other Jarls, they will eventually move
          to retake the hold, and when that day comes your character will be executed. **You may sit
          the throne for a time. You will not keep it.**`,
      },
      {
        q: "What happens if a Jarl dies?",
        a: `The court convenes a Moot. All thanes, sword-thanes, shield-thanes and court members
          select the next leader from among their own ranks, and **the vote must be unanimous**. If
          the court is divided the Moot continues until consensus is reached. No shortcut, no
          majority rule, no tiebreaker.`,
      },
      {
        q: "Can I challenge a Jarl for the throne?",
        a: `Not for the throne itself. You may challenge a Jarl to an honour duel with a relevant and
          meaningful roleplay reason, and "I want control" is not one. Most Nords will accept on
          honour alone, but acceptance is not guaranteed. Defeating a Jarl in a duel does not make
          you the next Jarl: a Moot must still be held.`,
      },
      {
        q: "How many people can be in my organisation?",
        a: `Lore factions cap at 25; houses, Orc strongholds and clans at 12; mercenary guilds,
          organisations, knightly orders and bandit factions at 10; Khajiit caravans at 6. Every
          organisation gets two businesses and one headquarters, and **you may only belong to one
          organisation at a time**. [The full organisation rules.](/factions)`,
      },
    ],
  },

  {
    id: "world",
    title: "The world, and your things",
    items: [
      {
        q: "How do I own a house or a shop?",
        a: `Through parcels. A hold divides into named parcels that jarls and stewards grant to
          citizens, each with an access mode, an optional minimum rank, and keys. Doors and
          containers bind to a parcel as fixtures.`,
      },
      {
        q: "Where can I store things safely?",
        a: `In a container bound to a parcel. Ordinary containers regenerate their contents, so
          anything left in one may not survive. Binding it through the holdstone stops that, and
          that is what makes a chest actually yours.`,
        cite: /attached to a parcel/i,
      },
      {
        q: "Do I have to live in the hold my parcel is in?",
        a: `No. Parcel access can be granted to people outside the hold entirely, so a workshop, a
          shop back room or a stash can be shared across hold lines.`,
        cite: /fine grained access/i,
      },
      {
        q: "I cleared a dungeon, does it come back?",
        a: `Yes. Once you leave and it idles it seals, waits on a timer, regenerates and reopens.
          Nothing left inside survives that, and keys found in there vanish after thirty minutes.`,
        cite: /Added Dungeon system/i,
      },
      {
        q: "How do the notice boards work?",
        a: `Every hold has a missive board that doubles as a player pinboard. One note per person,
          three days before it expires, and you cannot remove anyone else's note.`,
        cite: /missive board/i,
      },
      {
        q: "Why does everyone show as Stranger?",
        a: `Names are not free. Your title is Stranger until somebody introduces themselves, which is
          the introduce interaction on \`H\`. Other titles come from mastering skill categories.`,
      },
      {
        q: "Can somebody rob me of everything?",
        a: `No. Robbery is bounded by rules, not by opportunity: one equipped weapon, three inventory
          items and carried gold, never the same person twice in 24 hours, and a one hour cooldown
          between jobs. Storage theft is capped at three items and 500 gold and may never empty a
          container. [The robbery rules in full.](/rules#robbery)`,
      },
      {
        q: "Can another player kill my character permanently?",
        a: `Only in two ways, and both are consented to or approved. **A duel**, which both parties
          agree to knowing the loser perma-kills. Or **a Dark Brotherhood contract**, which needs
          staff approval, in-character justification and clips, and can be refused.
          [How contracts work.](/rules#brotherhood)`,
      },
    ],
  },

  {
    id: "connect",
    title: "It will not connect",
    blurb:
      "The client distinguishes an unusual number of separate failures, which means the exact wording on your screen is worth reading before you change anything.",
    items: [
      {
        q: "It says my mod list does not match the server",
        a: `The most common failure, with four causes the client tells apart: a plugin missing, a
          plugin present that the server does not allow, the right plugins in the wrong order, or
          the right plugins with the wrong light flag. Read which one it printed. Reinstalling
          through the launcher fixes all four faster than hunting the difference.`,
        quote: "Disconnected: your mod list does not match the server.",
      },
      {
        q: "It lists plugins I definitely have installed",
        a: `Having the file is not the same as loading it. The check reads your active load order,
          so a plugin sitting in Data unticked counts as missing.`,
        quote: "Having a file in Data is not enough",
      },
      {
        q: "It complains about ESL or light flags",
        a: `A plugin can be the correct file and still fail if it is flagged light on your side and
          regular on ours, or the reverse. The flag changes how form ids resolve, so it is compared.`,
        quote: "Plugin ESL/light flags do not match the server.",
      },
      {
        q: "It says my SKSE plugins do not match",
        a: `SKSE DLLs are checked by name, size and checksum, not just presence, so a different build
          of the same plugin fails. Replace them with the server versions rather than updating to
          the newest.`,
        quote: "An SKSE DLL name, size, or checksum does not match the server.",
      },
      {
        q: "My plugin list is longer or shorter but every name matches",
        a: `That is duplicates or failed loads rather than missing content, and the client says so
          specifically. Look for a plugin loaded twice, or one that failed quietly.`,
        quote: "check for duplicate or failed loads",
      },
      {
        q: "It disconnects immediately, before anything loads",
        a: `That is the connection rather than your mods. The client separates a dropped link, a
          timed out link, and never receiving any server data at all, so the wording tells you
          whether you reached us.`,
        quote: "Disconnected before any server data was received",
      },
    ],
  },
];

export const faqCount = faqSections.reduce((total, section) => total + section.items.length, 0);
