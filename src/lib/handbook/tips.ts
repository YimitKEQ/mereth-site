import type { HandbookPage } from "./blocks";

/**
 * Tips: the numbers, the cooldowns and the small mechanical facts that decide
 * whether an evening goes well.
 *
 * The stance is optimisation, not exploitation: knowing the systems better,
 * never working around them. If something here ever reads as a way to break a
 * system rather than use it, that is a bug in the system and it goes in a
 * ticket, not on this page.
 */
export const tips: HandbookPage = {
  title: "Tips and tricks",
  lede: `Numbers, cooldowns and thresholds that are easy to miss and cost you an evening when you
    do. All of it is about using the systems well. If anything here ever looks like a way around a
    system rather than through it, tell us in a ticket so we can fix the system.`,

  sections: [
    {
      id: "first",
      title: "Before your first hour",
      blocks: [
        {
          kind: "note",
          tone: "key",
          title: "Plan your 18 points before you spend one",
          body: `Tiers are caps bought at character creation, not levels you grind into. Novice
            costs 1, Apprentice 2, Adept 3, Expert 5, Master 8, out of 18 total. One Master eats
            nearly half your budget. Allocate in the starting room or any temple, and decide the
            whole build first, because taking a point back later burns the experience you earned in
            that tier. [Work it out on the planner first.](/skills)`,
        },
        {
          kind: "note",
          tone: "warn",
          title: "Nothing works until it is locked in",
          body: `Experience only accrues on skills you have actually locked in, and the client
            refuses some actions outright without them: lockpicking and pickpocketing simply do not
            function. If a lockpick is doing nothing, this is why, not a bug.`,
        },
        {
          kind: "note",
          tone: "key",
          title: "Vary what you do, or earn less for it",
          body: `Experience from a target is capped with diminishing returns, so hitting the same
            creature over and over pays steadily less. Rotate what you fight rather than grinding
            the single most convenient thing.`,
        },
        {
          kind: "note",
          tone: "key",
          title: "The purple bar is Energy, not a debuff",
          body: `Energy is spent by activity and refills while you sit, faster at an inn. At zero the
            bar turns to grey stripes and you are Exhausted. It recovers nothing while you are
            hungry or thirsty, so eat and drink before you settle in.`,
        },
        {
          kind: "note",
          tone: "key",
          title: "Perks come every ten levels now, not twenty",
          body: `That halved the wait on any skill that grants perks, which changes whether a second
            skill is worth starting.`,
        },
        { kind: "cite", pattern: /unlock every/i, limit: 2 },
      ],
    },

    {
      id: "numbers",
      title: "Buffs worth timing",
      blocks: [
        {
          kind: "note",
          tone: "key",
          title: "Park at an inn for five minutes before you log off or head out",
          body: `Well Rested needs full energy and five minutes at an inn, and once you have it, it
            re-triggers every five minutes while you stay. It is the cheapest standing experience
            bonus in the game.`,
        },
        { kind: "cite", pattern: /well.?rested/i, limit: 2 },
        {
          kind: "note",
          tone: "key",
          title: "Stand near any fire for the Comfort buff",
          body: `Fifty percent health regeneration for being near a camp fire, and interior firepits
            count too. It drops the moment you walk away, so fight near the fire, not away from it.`,
        },
        { kind: "cite", pattern: /comfort/i, limit: 2 },
        {
          kind: "note",
          tone: "warn",
          title: "Blessings last eight hours and do not stack",
          body: `You cannot take a second blessing until the first wears off, so taking a weak one
            early locks you out of a better one for the rest of the session. Choose once.`,
        },
        { kind: "cite", pattern: /blessing/i, limit: 2 },
        {
          kind: "note",
          tone: "warn",
          title: "Pick your standing stone before you use anything on cooldown",
          body: `Swapping stones is on a twenty four hour cooldown and is blocked outright if you
            have used an ability that is still cooling down. The Tower gives +10 Lockpicking and
            Shadow gives +10 Sneak, which matter if theft is your plan.`,
        },
        { kind: "cite", pattern: /standing stone|tower stone|shadow stone/i, limit: 2 },
        {
          kind: "note",
          tone: "key",
          title: "Racial abilities are once a day, server side",
          body: `The cooldown is enforced on their machine, so relogging does nothing. Treat a
            racial as a daily resource and spend it on purpose.`,
        },
        { kind: "cite", pattern: /racial abilities/i, limit: 2 },
        {
          kind: "note",
          tone: "key",
          title: "Armour is worth ten times what it was",
          body: `Damage mitigation was reworked in August and armour got dramatically more
            effective. If you built around dodging damage rather than absorbing it, that arithmetic
            changed under you.`,
        },
        { kind: "cite", pattern: /mitigation/i, limit: 2 },
      ],
    },

    {
      id: "money",
      title: "Weight, storage and coin",
      blocks: [
        {
          kind: "note",
          tone: "key",
          title: "Carpentry level 5 is the carry weight answer",
          body: `A 200 carry weight chest comes off the carpentry bench at level 5, and it needs
            materials from several other professions, which makes it a trade good as much as a
            personal upgrade. Leatherworking level 5 gives a 50 carry weight satchel for less.`,
        },
        { kind: "cite", pattern: /carryweight|carry weight/i, limit: 2 },
        {
          kind: "note",
          tone: "key",
          title: "A container bound to a parcel stops regenerating loot",
          body: `An ordinary container regenerates its contents on a timer, so anything you leave in one
            can vanish. Binding it to a parcel through the holdstone stops that, and only then will
            it keep what you put in it.`,
        },
        { kind: "cite", pattern: /parcel/i, limit: 2 },
        {
          kind: "note",
          tone: "key",
          title: "Parcel access can be granted outside the hold",
          body: `You do not have to be a citizen of a hold to be given access to a parcel in it, so
            a workshop, a shop back room or a stash can be shared across hold lines.`,
        },
        {
          kind: "note",
          tone: "key",
          title: "Pickpocketing scales far higher than it used to",
          body: `The gold value band went from 1 to 100 up to 1 to 750, and player versus player
            success caps at 60 percent at max level. Equipped items only come off at Legendary, so
            the good targets need a fully finished skill.`,
        },
        { kind: "cite", pattern: /Rebalanced pickpocketing/i, limit: 2 },
        {
          kind: "note",
          tone: "key",
          title: "Musicianship pays per listener",
          body: `Bard experience scales with how many people are nearby, and Bardic Inspiration is a
            total multiplier granting health regeneration. Performing to an empty room earns
            nothing.`,
        },
        { kind: "cite", pattern: /musicanship|musicianship|Bardic Inspiration/i, limit: 2 },
      ],
    },

    {
      id: "traps",
      title: "Things that will cost you",
      blocks: [
        {
          kind: "note",
          tone: "warn",
          title: "Dungeon keys evaporate after thirty minutes",
          body: `You can pick up keys inside a dungeon and use them, but they disappear half an hour
            later. Open what you came for immediately; do not bank one for a later trip.`,
        },
        { kind: "cite", pattern: /Keys in a dungeon/i, limit: 2 },
        {
          kind: "note",
          tone: "warn",
          title: "Cleared dungeons seal themselves and come back",
          body: `Once you leave and it idles, a dungeon seals, waits on a timer, regenerates and
            reopens fully. Nothing you leave on the floor in there survives.`,
        },
        { kind: "cite", pattern: /Added Dungeon system/i, limit: 2 },
        {
          kind: "note",
          tone: "warn",
          title: "Skooma has a 72 hour addiction timer",
          body: `Three real days of withdrawal, which is a long time to carry a debuff you picked up for one
            scene. Cure Addiction removes it.`,
        },
        { kind: "cite", pattern: /addiction/i, limit: 2 },
        {
          kind: "note",
          tone: "warn",
          title: "You cannot pickpocket a creature, or while detected",
          body: `Both are hard refusals from the client, not a low chance. And a failed attempt puts
            the target on edge, which blocks a retry until they settle.`,
        },
        {
          kind: "note",
          tone: "warn",
          title: "One note each on the board, three days",
          body: `The missive board takes one note per person and expires it after three days. You
            cannot remove somebody else's, so a board full of stale notices stays full until they
            age out.`,
        },
        { kind: "cite", pattern: /missive board/i, limit: 2 },
      ],
    },
  ],
};
