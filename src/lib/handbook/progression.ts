import type { HandbookPage } from "./blocks";

/**
 * Progression: what a tier actually means, and where the answer is deliberately
 * not written down.
 *
 * This page exists because the same confusion keeps arriving: players read
 * "Adept" and expect a number. Sometimes there is one. Often there is not, and
 * pretending otherwise is worse than saying so, because half the point of the
 * skill design is that a smith's reputation is earned in play rather than read
 * off a table.
 *
 * So the page is explicit about which of three kinds each answer is:
 *
 *   concrete   the tier text names the ore, the bait, the salt. Published.
 *   rule       a hard mechanical rule. Published, because guessing it costs an
 *              evening (the no-points-no-damage rule especially).
 *   in play    the tier text is flavour. There is no table, on purpose. Ask a
 *              master in character.
 */
export const progression: HandbookPage = {
  title: "Progression",
  lede: `What a tier is actually worth, how long one takes, and which questions we publish an answer
    to. For gathering and crafting we list the exact materials each tier opens up. For weapons and
    armour we do not, on purpose, and this page explains why rather than leaving you to wonder
    whether the table is just missing.`,

  sections: [
    {
      id: "shape",
      title: "The shape of a character",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `Every skill has two numbers and they work differently. **The tier is a ceiling you buy
              once**, at character creation, out of eighteen memory points. **The level is
              experience you earn** by using the skill, and it climbs toward that ceiling and stops.`,
            `So a Master smith and an Apprentice smith are not the same person further along the
              same road. They are two different characters, and the Apprentice can never become
              the Master by playing longer.`,
          ],
        },
        { kind: "data", name: "tiers" },
        {
          kind: "note",
          tone: "key",
          title: "Nineteen levels to a tier",
          body: `Each tier spans nineteen levels, and reaching the twentieth advances you to the
            next one **if your cap allows it**. If it does not, you stop there permanently. That is
            why a hold's best armourer and its best weaponsmith are usually two different people.`,
        },
        {
          kind: "prose",
          paragraphs: [
            `Legendary sits alone at level 100. It cannot be bought with memory points at any
              price. It is what happens at the very top of a Master skill, not a sixth tier to plan
              for.`,
          ],
        },
      ],
    },

    {
      id: "budget",
      title: "What eighteen points actually buys",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `Novice costs 1, Apprentice 2, Adept 3, Expert 5, Master 8. The cost rises faster than the
              tier does, so one Master takes 8 of your 18 points.`,
          ],
        },
        {
          kind: "table",
          head: ["A build like this", "Costs", "Reads as"],
          rows: [
            ["One Master, one Adept, and change", "8 + 3 + 7", "A specialist with a trade and hobbies"],
            ["Two Experts and change", "5 + 5 + 8", "Genuinely good at two things"],
            ["Three Adepts, three Apprentices, three Novices", "9 + 6 + 3", "Competent everywhere, sought out for nothing"],
            ["Everything at Novice", "18 across 18 skills", "A character nobody has a reason to find"],
          ],
        },
        {
          kind: "note",
          tone: "warn",
          title: "Spreading thin is the common mistake",
          body: `Eighteen points buys roughly two specialisms and a hobby. Spread them across nine skills and
            you are Novice at all of them, which means no job needs you specifically.
            [Work it out on the planner](/skills) before you sit down.`,
        },
        {
          kind: "prose",
          paragraphs: [
            `**You can earn more.** At the end of every month you may submit clips of your
              character learning a skill in roleplay, through a ticket, and earn a memory point to
              allocate. The clip has to show your character being taught or practising in roleplay; grinding the
          skill on its own does not qualify.`,
            `**Taking a point back costs you.** You lose the experience earned in the tier you
              dropped out of, though only if you had any in it.`,
          ],
        },
      ],
    },

    {
      id: "attributes",
      title: "The eight attributes",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `Skills say what your character can do. **Attributes say what their body and mind are
              like**, and in September they became the other half of progression: every number on
              your character sheet that is not a skill now comes from them.`,
            `There are eight, the Elder Scrolls set, each capped at 100. You spend points into them
              **at a temple**, the same place you set your skill plan, and the menu simply refuses
              anywhere else.`,
          ],
        },
        { kind: "data", name: "attributes" },
        {
          kind: "note",
          tone: "key",
          title: "Health, magicka, stamina and carry are arithmetic now",
          body: `There is no per-level health bonus any more, it was removed in 0.72.19 so that
            levelling does not inflate the world around it. Your four pools are worked out from
            your attributes and nothing else, by these formulas, which the menu, the server and the
            native plugin all share.`,
        },
        { kind: "data", name: "pools" },
        {
          kind: "prose",
          paragraphs: [
            `Two races get magicka on top of that: **Bretons +50, High Elves +100**. Carry never
              drops below 40 whatever you do to it.`,
            `**Attributes also feed back into skills.** Every five points above 50 in a relevant
              attribute is worth roughly a skill level, applied as a hidden modifier rather than as
              a visible +1. It will not push a skill past the ceiling your plan bought, so it makes
              you better inside your tier rather than promoting you out of it.`,
          ],
        },
        {
          kind: "note",
          tone: "warn",
          title: "You can rob one attribute to pay another, up to five points",
          body: `You may push an attribute as far as **five below your racial base** and spend what
            that frees elsewhere. It is the one way to sharpen a character past what their race
            hands them. **Do not do it to Luck.** Below 50, Luck actively works against you: thinner
            yields, more failures, worse finds. A dumped Luck is a tax on every gathering and
            crafting roll you will ever make.`,
        },
        {
          kind: "prose",
          paragraphs: [
            `**Reset is possible and it is not free.** The Reset button in the stats panel returns
              every spent point to your pool and starts a cooldown before you may do it again, so it
              is a change of direction rather than a per-evening respec. Reset in a temple like
              everything else. If your points ever look wrong, a reset recalculates them from
              scratch, which is what the 0.72.28 fix for miscounted points does.`,
            `The same panel is where your defensive numbers live: armour, damage, and resistance to
              magic, fire, frost, shock, poison and disease, plus your Master Level and how long you
              have played. Press \`K\`, then the stats tab.`,
          ],
        },
        { kind: "cite", pattern: /attribute|endurance|willpower|intelligence/i, limit: 4 },
      ],
    },

    {
      id: "expect",
      title: "What to expect at each tier",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `This is the question that causes the most confusion, and the honest answer is that it
              depends entirely on the kind of skill.`,
          ],
        },
        {
          kind: "table",
          head: ["Kind of skill", "Is there a published table?", "Where the answer is"],
          rows: [
            [
              "Gathering",
              "**Yes, exactly.**",
              "The tier text names the ore, the bait and the salt. On the [skills page](/skills).",
            ],
            [
              "Crafting and trades",
              "**Mostly.**",
              "Tier text names materials and benches. Specific recipes are on [crafting](/crafting).",
            ],
            [
              "Magic schools",
              "**Yes, per spell.**",
              "Every spell carries its own tier. The full list is on [magic](/magic).",
            ],
            [
              "Weapons and armour",
              "**No, on purpose.**",
              "Find out in character. See below.",
            ],
            [
              "Movement, stealth, performance",
              "**No.**",
              "Find out in character.",
            ],
          ],
        },
      ],
    },

    {
      id: "foic",
      title: "Weapons, and why there is no table",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `Every weapon specialisation has five tiers of text, and none of it is numbers. Swords
              at Adept reads "You parry more than luck allows". Maces at Expert reads "Few can stand
              a clean connection".`,
            `That is deliberate. If we published a damage table, anyone could work out how dangerous
              your character is by asking which tier you bought, without ever meeting you. **We
              would rather that took a spar, a witness or a reputation.** So to find out whether
              somebody is better than you with a blade: spar them, watch them fight, or ask
              somebody who has.`,
          ],
        },
        {
          kind: "note",
          tone: "warn",
          title: "Weapon skill is in the damage formula, so spread points hit like it",
          body: `Combat skills were tied into damage in 0.31.0 and the weapon specialisations exist
            to carry that, so what you are holding only performs if the matching specialisation is
            on your plan. A civilian who picked up a sword swings like a civilian. If your blade
            feels like it is doing nothing, check your plan before you report a bug.`,
        },
        {
          kind: "prose",
          paragraphs: [
            `The other published mechanical fact: **armour was reworked in August and matters
              roughly ten times more than it did.** A build that dodged damage rather than absorbing
              it changed underneath its owner.`,
          ],
        },
        { kind: "cite", pattern: /mitigation|armor|armour/i, limit: 3 },
      ],
    },

    {
      id: "earning",
      title: "How experience actually accrues",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `**Only locked-in skills earn.** Experience accrues on the skills in your plan and
              nowhere else. Some actions refuse outright without the skill assigned: lockpicking
              and pickpocketing simply do not function.`,
          ],
        },
        { kind: "quote", text: "Assign Lockpicking in your skill plan at a temple before you can pick locks." },
        {
          kind: "prose",
          paragraphs: [
            `**Fighting pays properly again.** Combat used to tail off as you repeated a target.
              That was removed in 0.72.34 and the per-target cooldown cut to a second, so a long
              fight earns what it looks like it should. The change names combat only: nothing has
              been published about gathering or crafting, so a whole evening on one ore vein is
              untested rather than blessed.`,
            `**The purple bar is Energy, not an experience budget.** Activity spends it, sitting
              refills it and an inn refills it faster, which is the real reason to go indoors. At
              zero you are Exhausted until you rest, and nothing refills while you are hungry or
              thirsty.`,
          ],
        },
        {
          kind: "note",
          tone: "key",
          title: "Well Rested is now the biggest single bonus in the game, and it is rationed",
          body: `It was ten percent. Since 0.71.0 the first one is **double experience for an hour**,
            the second 50 percent, the third 20, and then it goes on a **16 hour cooldown**. You
            pick it up five minutes after your energy fills at an inn, and you can refresh it while
            you are still there. So it is no longer a habit to keep topped up, it is three charges a
            day: spend them on the session you actually mean to level in, not on the walk to it.`,
        },
        { kind: "cite", pattern: /well.?rested|exhaustion|diminishing/i, limit: 3 },
      ],
    },

    {
      id: "magic",
      title: "Magic advances differently",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `A magic **skill** climbs on use like any other, by casting. A **spell** does not. Each
              one is studied out of a tome or taught by a Teacher, and the study is a fixed wait:
              **5 days for a Novice spell, 10, 15, 25, and 35 for a Master one.** The whole ladder
              below Master was shortened in 0.72.9; a Teacher takes a day off it per lesson.`,
            `So "how long to an Adept spell" has a real answer, a fortnight of study or rather less
              with somebody teaching you, while "how long to a good swordsman" does not, because
              that one depends on who you fight and who sees it. Every spell you can learn, with its
              tier, is on the [magic page](/magic).`,
          ],
        },
        { kind: "cite", pattern: /spell training|masters of a school|spell points/i, limit: 3 },
      ],
    },
  ],
};
