/**
 * The FAQ.
 *
 * Every answer is labelled with where it came from, and the three labels mean
 * genuinely different things:
 *
 *   "mereth"  the team's own words, from what they have published. Authoritative.
 *             Reorganised and tightened here, never changed in substance.
 *   "client"  read out of the client their launcher installs, for the mechanical
 *             detail their own FAQ does not cover. Mostly connection failures.
 *   "open"    asked often, answered nowhere. Saying so is better than guessing.
 *
 * Where the team has stated a rule, that wording wins over anything read out of
 * the client. If those two ever disagree, the team is right and this file is wrong.
 *
 * `quote` is a string the client itself prints, verbatim. Quotes keep their own
 * punctuation, including dashes, because a tidied quote is not a quote.
 */

export type Source = "mereth" | "client" | "open";

export interface Answer {
  q: string;
  /** Body copy in the inline markup grammar from `@/lib/markup`. */
  a: string;
  source: Source;
  /** A message the client prints, shown under the answer as evidence. */
  quote?: string;
  /** A pattern matched against release notes to cite the claim. */
  cite?: RegExp;
}

export interface FaqSection {
  id: string;
  title: string;
  blurb?: string;
  items: Answer[];
}

export const sourceLabel: Record<Source, string> = {
  mereth: "Mereth's own answer",
  client: "Read from the client",
  open: "No answer published",
};

export const faqSections: FaqSection[] = [
  {
    id: "first",
    title: "Before you apply",
    blurb:
      "The questions people ask before they have an account, in the order they usually ask them.",
    items: [
      {
        source: "mereth",
        q: "What actually is Mereth?",
        a: `A serious roleplay Skyrim server running on SkyMP, which is a multiplayer framework for
          Skyrim Special Edition. Everyone is in the same province at the same time, on a shared
          world clock, playing characters rather than the Dragonborn. The systems underneath it
          (professions, holds, property, trade, law) exist to give those characters something to
          be about.`,
      },
      {
        source: "client",
        q: "What do I need to own and install?",
        a: `Skyrim Special Edition on PC, SKSE, and Mereth's launcher. The launcher reads a
          manifest, installs the mod list in a fixed order, and checks your files against the
          server before it will let you connect. You do not assemble the list by hand, and you
          should not try to.`,
      },
      {
        source: "client",
        q: "How do I log in?",
        a: `Through Discord, not a username and password. The client has separate failures for
          being outside their Discord and for never having logged in through it, so membership in
          the Discord is the gate. It will also refuse a ban, an expired session, an expired
          token, or a login from a different IP.`,
      },
      {
        source: "mereth",
        q: "Do I need to be good at roleplay?",
        a: `You need to be willing to do it. The server's rules are about conduct and consistency
          rather than prose quality: stay in character, do not metagame, do not write your
          character out of consequences. Nobody is grading your dialogue.`,
      },
      {
        source: "mereth",
        q: "Is AI-written roleplay allowed?",
        a: `No. Mereth's rules forbid it outright, and the whitelist applications for leadership
          roles ask about it directly. Write your own character.`,
      },
    ],
  },

  {
    id: "setting",
    title: "Setting and lore",
    items: [
      {
        source: "mereth",
        q: "When is this set?",
        a: `4E 185, ten years after the Great War between the Empire and the Aldmeri Dominion. It
          is an **alternate timeline**: named characters from after the Great War are removed and
          replaced by players.`,
      },
      {
        source: "mereth",
        q: "Can I play a character from Elder Scrolls lore?",
        a: `No. You may see familiar names, particularly clans, but copy-paste characters from the
          games or the lore are not played here. You can aim to recreate similar events, or try to
          fill that role in Mereth's own timeline.`,
      },
      {
        source: "mereth",
        q: "Why does everyone say magic feels different here?",
        a: `Magic itself is not different. The aesthetic is: Mereth is returning Nordic character
          to the Fatherland, and Clevercraft is the ancestral tradition of Skyrim's people. Where
          you find magic and Nords together, expect shamanistic or druidic atmosphere.`,
      },
      {
        source: "mereth",
        q: "Which races can I play?",
        a: `The ten playable races of Tamriel. Your race is a real roleplay constraint here rather
          than a stat block: a Dunmer in Windhelm and an Altmer anywhere in the Empire are walking
          into a political situation, ten years after a war the Dominion won.`,
      },
      {
        source: "open",
        q: "When does the civil war start?",
        a: `**This one has no published answer.** It is asked often enough that it belongs in the
          FAQ, but nothing in the patch notes, the client or any public file says. It needs an
          answer from the team rather than a guess from a reader.`,
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
        source: "mereth",
        q: "How does the skill system actually work?",
        a: `Skills are not levels you grind toward. They are **caps you set at character
          creation**. You get **18 memory points** and spend them to choose the highest tier your
          character can ever reach in each skill. You will not be a master of everything, and that
          is the point.`,
      },
      {
        source: "mereth",
        q: "What does each tier cost?",
        a: `Novice 1 point, Apprentice 2, Adept 3, Expert 5, Master 8. Eighteen points do not go
          far when Master alone costs 8, so plan the build before you sit down to allocate. There
          is a [planner on the skills page](/skills) that does the arithmetic for you.`,
      },
      {
        source: "mereth",
        q: "Where do I allocate?",
        a: `Either the starting room or any temple in the province. Both are valid, so pick
          whichever suits how your character arrived in Skyrim.`,
      },
      {
        source: "mereth",
        q: "How many levels are in a tier?",
        a: `Nineteen. Reaching the twentieth advances you to the next tier, if your cap allows it.
          So a cap buys you the ceiling, and experience carries you up to it.`,
      },
      {
        source: "mereth",
        q: "What happens if I remove a memory point later?",
        a: `You lose the experience for the tier you dropped out of. If you had experience in both
          Novice and Apprentice and you drop back to Novice, the Apprentice experience is gone. If
          you had no experience in that tier, you lose nothing.`,
      },
      {
        source: "mereth",
        q: "How do I gain experience?",
        a: `By using the skills you have locked in. Nothing else counts.`,
      },
      {
        source: "mereth",
        q: "What is diminishing returns?",
        a: `Repeating the same thing pays less over time. Killing the same creature again and
          again, or spamming one crafting recipe like daggers, earns steadily less.`,
      },
      {
        source: "mereth",
        q: "What is the purple exhaustion bar?",
        a: `Your experience budget. Every time you use a skill and gain experience the bar drops,
          and it only begins refilling once fully exhausted. Resting at an inn refills it
          noticeably faster.`,
      },
      {
        source: "mereth",
        q: "Can I reach Legendary?",
        a: `Legendary sits at level 100 and cannot be bought with memory points at all. A plan
          caps at Master. Legendary is what happens at the very top of a Master skill, not
          something you allocate toward.`,
      },
      {
        source: "client",
        q: "Do perks work differently?",
        a: `Perks unlock every ten levels on skills that grant them, halved from every twenty at
          the end of July.`,
        cite: /unlock every/i,
      },
    ],
  },

  {
    id: "combat",
    title: "Fighting",
    items: [
      {
        source: "mereth",
        q: "Why can I not hurt anything with this sword?",
        a: `Because you have no points in that weapon skill. With no points, you deal **no damage
          at all** with that weapon. It is deliberate: civilians should not pick up a sword and
          immediately fight like a warrior.`,
      },
      {
        source: "mereth",
        q: "Why is that a rule rather than just a penalty?",
        a: `To keep civilians civilian, to give a reason to roleplay clumsiness with a weapon your
          character never trained on, and to make specialists actually feel like specialists. A
          swordsman should look like a swordsman, and an archer like an archer.`,
      },
      {
        source: "client",
        q: "Does armour matter much?",
        a: `More than it used to. Damage mitigation was reworked in August and armour became
          roughly ten times more effective, so a build that dodged damage rather than absorbing it
          changed underneath you.`,
        cite: /mitigation/i,
      },
      {
        source: "client",
        q: "Does my gear wear out?",
        a: `Yes. Durability and tempering are both modelled, so equipment degrades with use and
          needs a smith or a grindstone. Budget for repairs the way you budget for food.`,
        cite: /durabilit|temper/i,
      },
    ],
  },

  {
    id: "crafting",
    title: "Crafting and professions",
    items: [
      {
        source: "mereth",
        q: "Is crafting one skill?",
        a: `No. It is split into separate skills rather than one umbrella smithing stat. A
          blacksmith might hold any combination of Weapon Smithing, Armor Smithing, Carpentry and
          Leatherworking.`,
      },
      {
        source: "mereth",
        q: "Why does that matter?",
        a: `Because craftsmen end up genuinely uneven. The town swordsmith may be a Master of
          weapons and only an Adept at armour, so anyone wanting quality work has to find a master
          of that specific craft. Finding the best leatherworker in the hold becomes its own
          errand, and that errand is the economy.`,
      },
      {
        source: "client",
        q: "What should I make first?",
        a: `Carry capacity. A 200 carry weight chest comes off the carpentry bench at level 5 and
          needs materials from several professions, and a 50 carry weight satchel comes from
          leatherworking at 5. Both are worth more as trade goods than most weapons.`,
        cite: /carryweight|carry weight/i,
      },
      {
        source: "client",
        q: "Which gathering professions exist?",
        a: `Mining, fishing, saltmaking, hunting, herbalism, woodcutting, farming and beekeeping,
          each with its own nodes placed around the province. What a tier unlocks is written into
          the skill itself, so [read the tier text](/skills) before you commit points.`,
      },
    ],
  },

  {
    id: "magic",
    title: "Magic",
    blurb:
      "The most complained about system on the server, and the most deliberate. Magic is a roleplay pipeline: a teacher, a book, and time.",
    items: [
      {
        source: "mereth",
        q: "How do I learn magic?",
        a: `You must be taught. Two things are required for any spell: a Master Mage or Wizard
          willing to teach you, and a spellbook for that spell. **No master, no book, no magic.**`,
      },
      {
        source: "mereth",
        q: "How do I get my very first spell?",
        a: `Usually through a Hold's Court Wizard, who runs aspiring mages through a three week
          apprenticeship and sends them off with their first spellbook. You need at least one
          spell already before the College of Winterhold will take you.`,
      },
      {
        source: "mereth",
        q: "Why is learning magic so slow?",
        a: `Because it is a roleplay system rather than a menu. It is gated behind finding a person
          willing to teach you and a book to teach from, and the College runs on semesters. That is
          the intended experience, not a bug.`,
      },
      {
        source: "mereth",
        q: "What does the College of Winterhold teach?",
        a: `Three semesters of formal instruction, priced increasingly: Novice, Apprentice, Adept.`,
      },
      {
        source: "mereth",
        q: "Can I get past Adept there?",
        a: `Yes, but not as an ordinary student. You stay on as a researcher or as a professor's
          assistant.`,
      },
      {
        source: "mereth",
        q: "Where do spellbooks come from?",
        a: `The College library, effectively unlimited for students. A Court Wizard's limited
          starting selection. The East Empire Company, for purchase. And adventuring: spellbooks
          are placed randomly in dungeons on a bi-monthly cycle.`,
      },
      {
        source: "mereth",
        q: "Can a magical organisation outside the College teach?",
        a: `Yes, but they have no spellbook access by default. The head may be a Master Wizard and
          may teach apprentices, but every book has to be acquired through roleplay: East Empire
          purchases, dungeon expeditions, trades.`,
      },
      {
        source: "mereth",
        q: "What kind of spells will I actually get?",
        a: `Mostly utility. Magelight, Candlelight, Detect Life, Detect Dead and the like. Every
          school is being redone around roleplay-friendly spells rather than raw combat power.
          Expect tools, not just weapons. [Browse what exists](/magic).`,
      },
      {
        source: "mereth",
        q: "Who heals people?",
        a: `Priests. Temple priests have Master Restoration, are authorised to teach disciples, and
          serve as Mereth's doctors. If you need healing, find a temple, or a faction like the
          Vigilants of Stendarr.`,
      },
      {
        source: "mereth",
        q: "Can I play a mage from the start?",
        a: `You can have a mage background in your history, but new players do not start with
          magic. No exceptions. Demonstrate it with \`/mes\` in roleplay, and earn the mechanics the
          same way everyone else does.`,
      },
      {
        source: "mereth",
        q: "Is magic legal everywhere?",
        a: `No, and this catches people out. **Every Hold sets its own magical law.** What is fine
          in Winterhold may not be in Markarth, Windhelm or Solitude. Check which spells are legal
          where you are, whether teaching requires a licence, and any local restrictions on
          Conjuration, Destruction or Illusion. Ignorance is not a defence in any Jarl's court.`,
      },
      {
        source: "client",
        q: "How long does advancing a tier take?",
        a: `Study runs about a week per tier, and a master of the school can teach you directly or
          speed the process up.`,
        cite: /spell training/i,
      },
    ],
  },

  {
    id: "world",
    title: "The world, and your things",
    items: [
      {
        source: "client",
        q: "How do I own a house or a shop?",
        a: `Through parcels. A hold divides into named parcels that jarls and stewards grant to
          citizens, each with an access mode, an optional minimum rank, and keys. Doors and
          containers bind to a parcel as fixtures.`,
      },
      {
        source: "client",
        q: "Where can I store things safely?",
        a: `In a container bound to a parcel. Ordinary containers regenerate their contents, which
          means anything left in one may not survive. Binding it through the holdstone stops that,
          and that is what makes a chest actually yours.`,
        cite: /attached to a parcel/i,
      },
      {
        source: "client",
        q: "Do I have to live in the hold I have a parcel in?",
        a: `No. Parcel access can be granted to people outside the hold entirely, so a workshop, a
          shop back room or a stash can be shared across hold lines.`,
        cite: /fine grained access/i,
      },
      {
        source: "client",
        q: "I cleared a dungeon, does it come back?",
        a: `Yes. Once you leave and it idles it seals, waits on a timer, regenerates and reopens.
          Nothing left inside survives that, and keys found in there vanish after thirty minutes.`,
        cite: /Added Dungeon system/i,
      },
      {
        source: "client",
        q: "How do the notice boards work?",
        a: `Every hold has a missive board that doubles as a player pinboard. One note per person,
          three days before it expires, and you cannot remove anyone else's note.`,
        cite: /missive board/i,
      },
      {
        source: "client",
        q: "Why does everyone show as Stranger?",
        a: `Names are not free. Your title is Stranger until somebody introduces themselves, which
          is the introduce interaction on \`H\`. Other titles come from mastering skill categories.`,
      },
      {
        source: "client",
        q: "Why will lockpicking not work?",
        a: `The skill is not locked in. Lockpicking and pickpocketing refuse outright until
          assigned, which is the memory point system showing its teeth.`,
        quote: "Assign Lockpicking in your skill plan at a temple",
      },
      {
        source: "client",
        q: "Is there a crime system?",
        a: `Not in the sense of bounties and guards who arrest you. What exists is a set of
          interactions players use on each other: tackle, cuff, shackle, or put your own hands up.
          Cuffing produces a real incapacitated state. Everything after that (the accusation, the
          sentence, the record) is roleplay and staff adjudication, not mechanics.`,
      },
    ],
  },

  {
    id: "connect",
    title: "It will not connect",
    blurb:
      "The client distinguishes an unusual number of separate failure messages, which means the exact wording on your screen is worth reading before you change anything.",
    items: [
      {
        source: "client",
        q: "It says my mod list does not match the server",
        a: `The most common failure, with four causes the client tells apart: a plugin missing, a
          plugin present the server does not allow, the right plugins in the wrong order, or the
          right plugins with the wrong light flag. Read which one it printed. Reinstalling through
          the launcher fixes all four faster than hunting the difference.`,
        quote: "Disconnected: your mod list does not match the server.",
      },
      {
        source: "client",
        q: "It lists plugins I definitely have installed",
        a: `Having the file is not the same as loading it. The check reads your active load order,
          so a plugin sitting in Data unticked counts as missing.`,
        quote: "Having a file in Data is not enough",
      },
      {
        source: "client",
        q: "It complains about ESL or light flags",
        a: `A plugin can be the correct file and still fail if it is flagged light on your side and
          regular on theirs, or the reverse. The flag changes how form ids resolve, so it is
          compared.`,
        quote: "Plugin ESL/light flags do not match the server.",
      },
      {
        source: "client",
        q: "It says my SKSE plugins do not match",
        a: `SKSE DLLs are checked by name, size and checksum, not just presence, so a different
          build of the same plugin fails. Replace them with the server versions rather than
          updating to the newest.`,
        quote: "An SKSE DLL name, size, or checksum does not match the server.",
      },
      {
        source: "client",
        q: "My plugin list is longer or shorter but every name matches",
        a: `That is duplicates or failed loads rather than missing content, and the client says so
          specifically. Look for a plugin loaded twice, or one that failed quietly.`,
        quote: "check for duplicate or failed loads",
      },
      {
        source: "client",
        q: "It disconnects immediately, before anything loads",
        a: `That is the connection rather than your mods. The client separates a dropped link, a
          timed out link, and never receiving any server data at all, so the wording tells you
          whether you reached them at all.`,
        quote: "Disconnected before any server data was received",
      },
    ],
  },
];

export const faqCount = faqSections.reduce((total, section) => total + section.items.length, 0);
export const merethAnsweredCount = faqSections
  .flatMap((section) => section.items)
  .filter((item) => item.source === "mereth").length;
