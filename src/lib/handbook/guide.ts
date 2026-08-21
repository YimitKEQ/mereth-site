import type { HandbookPage } from "./blocks";

/**
 * The guide: how Mereth works, from installing it to holding a rank.
 *
 * Every mechanical claim here either quotes a message the client itself prints
 * or cites the dated release note that introduced it, and the page renders both
 * underneath the claim. That is not decoration: the server ships almost daily,
 * and a claim with a date on it can be checked against what actually shipped.
 */
export const guide: HandbookPage = {
  title: "The Guide",
  lede: `How the server works, from installing it to holding a rank in a hold. Where a rule depends on
    something that changed, the release note that changed it is shown underneath, so you can see when
    it changed and what it said.`,

  sections: [
    {
      id: "in",
      title: "Getting in",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `You need Skyrim Special Edition on PC, and our launcher. The launcher reads the live
              manifest and installs the rest, the script extender and the mod list, in the right
              order, then checks your files against the server before it will let you connect. You
              do not assemble the list by hand.`,
            `**Login is through Discord**, not a username and password, so you must be in our Discord to
              connect at all. The client reports being outside the Discord and never having logged
              in through it as two different errors, and it will also refuse a ban, an expired
              session, an expired token, or a login from a different IP.`,
            `**Your mod list is checked, not trusted.** Plugin names, order, and light versus
              regular flags must all match, and so must the SKSE DLLs by name, size and checksum.`,
          ],
        },
        { kind: "quote", text: "Having a file in Data is not enough" },
        {
          kind: "note",
          tone: "key",
          title: "The one thing to get right first",
          body: `Install through the launcher and let it own your load order. Nearly every
            connection problem on this page is a load order the launcher did not put there.`,
        },
      ],
    },

    {
      id: "stuck",
      title: "When it will not let you in",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `The client names the exact problem, and it separates cases that look identical from the
              outside. Read the wording before you change anything. These are its own messages:`,
          ],
        },
        { kind: "data", name: "troubles" },
        {
          kind: "note",
          tone: "warn",
          title: "Order matters as much as files",
          body: `A plugin present but in the wrong slot fails exactly the way a missing one does.
            Reinstalling through the launcher fixes both, and is faster than hunting the difference
            by hand.`,
        },
      ],
    },

    {
      id: "controls",
      title: "Controls",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `We add an interaction system on top of Skyrim's own controls. Aim at a person and press the
              key. All of these are bound in the client, on keyboard and on a pad.`,
          ],
        },
        { kind: "data", name: "binds" },
        {
          kind: "clip",
          slug: "the-interaction",
          title: "What it looks like",
          caption:
            "Aim at somebody and the prompt appears under them, with their title above it and only the keys that apply. Nobody is called by name here until they have been introduced.",
        },
        {
          kind: "prose",
          paragraphs: [
            `Beyond those: \`K\` opens your skills, \`F8\` opens your spell grimoire, \`F3\` re-aims
              the look target when a menu loses it, and \`X\` doubles as cancel while a menu is up.`,
          ],
        },
        { kind: "quote", text: "Look target lost" },
        {
          kind: "prose",
          paragraphs: [`The menus you will actually meet, by their own names in the client:`],
        },
        { kind: "data", name: "menus" },
        { kind: "prose", paragraphs: [`And the slash commands:`] },
        { kind: "data", name: "slash" },
      ],
    },

    {
      id: "skills",
      title: "Skills and memory points",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `The thing to understand before anything else: **tiers are caps you buy, not levels you
              grind.** At character creation you get **18 memory points** and spend them to set the
              highest tier each skill can ever reach.`,
            `You allocate in the starting room or at any temple in the province. After that,
              experience carries you up towards the cap you bought: each tier is nineteen levels,
              and the twentieth advances you, if your cap allows. Experience only comes from skills
              you have locked in, and repeating the same action pays less over time.`,
            `Take a memory point back out and you lose the experience for the tier you dropped out
              of, though only if you had any in it. The client enforces the plan hard: it refuses
              to let you pick a lock or a pocket at all until the skill is assigned.`,
          ],
        },
        { kind: "quote", text: "Assign Lockpicking in your skill plan" },
        { kind: "data", name: "tiers" },
        {
          kind: "prose",
          paragraphs: [
            `A plan reaches Master. Legendary sits above it at level 100 and cannot be bought with
              memory points at all. Perks unlock every ten levels on skills that grant them.`,
            `**The purple bar is Energy, and it is a rest meter.** Activity spends it, sitting
              refills it, and an inn refills it faster than anywhere else. It recovers nothing at
              all while you are hungry or thirsty, which is the part that catches people.`,
            `**Weapon skills feed the damage formula.** Skill was tied into damage in 0.31.0 and the
              weapon specialisations exist to carry it, so a character with no points in the
              specialisation for what they are holding is not a fighter. The documented absolute
              is on the magic side: without Spellcasting on your plan, spells have no combat
              effect at all.`,
            `Work your build out before you sit down: the [planner](/skills) holds the same 18
              points and the same costs, and will not let you overspend.`,
          ],
        },
        { kind: "cite", pattern: /perk progression|unlock every/i, limit: 2 },
      ],
    },

    {
      id: "work",
      title: "Professions",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `Crafting is split into separate skills rather than one smithing stat, so a blacksmith might
              hold any combination of Weapon Smithing, Armor Smithing, Carpentry and Leatherworking.
              Two smiths in the same hold will be good at different things, and anyone wanting
              quality work has to find the one who bought that specific skill.`,
            `Carry weight limits what you can move, and the containers that fix it are crafted: a 200
              carry weight chest from carpentry at level 5, a 50 carry weight satchel from
              leatherworking at 5. What each tier of each profession unlocks is written into the
              skill itself, so [read the tier text](/skills) before you commit a point.`,
          ],
        },
        { kind: "cite", pattern: /carpentry|leatherwork|tailoring|smelting/i, limit: 4 },
        { kind: "cite", pattern: /carryweight|carry weight|backpack|satchel/i, limit: 3 },
      ],
    },

    {
      id: "magic",
      title: "Magic",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `A spell comes from a tome or from a Teacher, and either way it is gated behind time:
              it sits in your grimoire for **7 days at Novice, up to 35 at Master** before it is
              yours. What a Teacher adds is speed, a day off the timer per lesson, and judgement
              about when you are ready for the next rank. Fifty spell points cap how much you can
              hold at once, and a rank in a hold can grant you more to work with.`,
            `The full pipeline, and what each school actually offers, is on the
              [magic page](/magic). Teaching is its own whitelisted role, with its own
              [guidelines](/teaching).`,
          ],
        },
        { kind: "cite", pattern: /spell training|masters of a school|spell points|learn.*spell/i, limit: 4 },
      ],
    },

    {
      id: "alive",
      title: "Staying alive",
      blocks: [
        { kind: "data", name: "needs" },
        {
          kind: "prose",
          paragraphs: [
            `Two needs are live. A third, Rest, is written into the client and currently disabled,
              so nothing tracks it today. Energy governs regeneration, and inns are how you get it
              back.`,
          ],
        },
        { kind: "cite", pattern: /well.?rested|energy|inn\b|comfort|camp ?fire/i, limit: 4 },
        {
          kind: "prose",
          paragraphs: [`**Gear wears out, and so do you.**`],
        },
        { kind: "cite", pattern: /durabilit|repair|temper/i, limit: 3 },
        { kind: "cite", pattern: /addiction|disease|affliction/i, limit: 3 },
      ],
    },

    {
      id: "holds",
      title: "Holds and parcels",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `The holdstone is the spine of the server. You pledge to a hold, hold a rank in it, and
              the rank grants real mechanical benefits rather than a title alone: a blacksmith rank
              carries smithing, guards carry light armour, a court mage carries spell points. Jarls
              and stewards control who gets what.`,
          ],
        },
        { kind: "cite", pattern: /holdstone|jarl|steward|pledge/i, limit: 5 },
        {
          kind: "prose",
          paragraphs: [
            `**Parcels are the property system.** A hold divides into named parcels, and a parcel is
              the closest thing Mereth has to owning something. They are granted to citizens and set
              to one access mode. Doors and containers bind to a parcel as fixtures, and holders
              carry parcel keys. The access modes are:`,
          ],
        },
        { kind: "data", name: "access" },
        {
          kind: "prose",
          paragraphs: [
            `A parcel can also demand a minimum rank, and access can be granted to people outside
              the hold entirely.`,
          ],
        },
        {
          kind: "note",
          tone: "key",
          title: "The storage fact nobody tells you",
          body: `An ordinary container regenerates its contents, so anything you leave in one may
            not survive. Bind it to a parcel through the holdstone and it stops. That is what makes
            a chest actually yours.`,
        },
        { kind: "cite", pattern: /parcel|fixture/i, limit: 4 },
      ],
    },

    {
      id: "rp",
      title: "Being a person",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `**You start as a Stranger.** Nobody sees your name until you give it to them: aim at a
              person, press \`H\`, and introduce yourself. Until you do, they see "Stranger" above
              you and you see the same above them. Other titles are earned by mastering a whole
              skill category.`,
          ],
        },
        { kind: "data", name: "races" },
        {
          kind: "prose",
          paragraphs: [
            `**Trading face to face.** \`E\` on another player opens a two sided trade window. Both
              put items and gold in, both mark ready, and it completes only when both confirm.
              Nothing moves on one person's word.`,
            `**The calendar.** World time is synced for everyone and runs on the Tamriel year:`,
          ],
        },
        { kind: "data", name: "months" },
      ],
    },

    {
      id: "trouble",
      title: "Trouble",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `There is no bounty system and there are no guards who arrest you. What exists is a set
              of interactions players use on each other: tackle, cuff, shackle, or put your own
              hands up. Cuffing produces a real incapacitated state, the same as being paralysed.`,
            `Everything after the cuffs (the accusation, the sentence, the record) is roleplay and
              staff adjudication. Nothing in the game remembers it for you.`,
          ],
        },
        { kind: "cite", pattern: /tackle|cuff|shackle|surrender|incapacitated/i, limit: 4 },
        {
          kind: "prose",
          paragraphs: [
            `**Theft** is modelled in exactly two places, lockpicking and pickpocketing, and both
              are fenced. You cannot pickpocket a creature, you cannot pickpocket while detected,
              and a failed attempt puts the target on edge, which blocks a retry until they settle.`,
          ],
        },
        { kind: "quote", text: "pickpocket while detected" },
        { kind: "cite", pattern: /pickpocket|lockpick/i, limit: 4 },
      ],
    },

    {
      id: "world",
      title: "The world",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `**Dungeons reset.** Cleared dungeons seal, sit on a timer, regenerate and reopen fully.
              Nothing you leave on the floor in there survives, and keys found inside are temporary.`,
          ],
        },
        { kind: "cite", pattern: /dungeon|sealed|regenerate/i, limit: 4 },
        {
          kind: "prose",
          paragraphs: [
            `**Boards.** Every hold has a missive board that doubles as a player pinboard. The menu
              offers exactly two actions, Pin note and Remove note, and you cannot take down
              somebody else's. One note per person, three days before it expires.`,
          ],
        },
        { kind: "cite", pattern: /missive board|pinboard/i, limit: 2 },
      ],
    },
  ],
};
