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
        { kind: "quote", text: "Assign Lockpicking in your skill plan" },
        {
          kind: "prose",
          paragraphs: [
            `**Repetition pays less.** Experience from a target is capped with diminishing returns,
              so hitting the same creature over and over earns steadily less. Rotate what you fight
              rather than grinding the single most convenient thing.`,
            `**The purple bar is Energy, not an experience budget.** Activity spends it, sitting
              refills it and an inn refills it faster, which is the real reason to go indoors. At
              zero you are Exhausted until you rest, and nothing refills while you are hungry or
              thirsty.`,
          ],
        },
        {
          kind: "note",
          tone: "key",
          title: "Well Rested is the cheapest bonus to keep",
          body: `Five minutes at an inn on full energy, and it re-triggers every five minutes while
            you stay. Park before you log off and before you head out.`,
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
            `Magic does not climb on use. It is taught. Each tier of study runs roughly **a week**,
              and a master of the school can teach you directly or shorten it.`,
            `So "how long to Adept" has a real answer, roughly three weeks of study with a teacher,
              while "how long to a good swordsman" does not, because that one depends on who you
              fight and who sees it. Every spell you can be taught, with its tier, is on the
              [magic page](/magic).`,
          ],
        },
        { kind: "cite", pattern: /spell training|masters of a school|spell points/i, limit: 3 },
      ],
    },
  ],
};
