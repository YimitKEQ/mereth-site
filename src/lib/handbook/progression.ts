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
            `Two numbers decide everything, and they behave differently. **The tier is a ceiling you
              buy once**, at character creation, out of eighteen memory points. **The level is
              experience you earn**, and it climbs toward that ceiling and stops.`,
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
            next one **if your cap allows it**. If it does not, you stop. That stop is the whole
            design: it is what makes finding the right craftsman an errand worth doing.`,
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
            `Novice costs 1, Apprentice 2, Adept 3, Expert 5, Master 8. The curve is deliberately
              cruel at the top: one Master eats nearly half your character.`,
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
          body: `Eighteen points buys roughly two specialisms and a hobby. A character who is
            mediocre at nine things is never the person anyone goes looking for, and being gone
            looking for is the game. [Work it out on the planner](/skills) before you sit down.`,
        },
        {
          kind: "prose",
          paragraphs: [
            `**You can earn more.** At the end of every month you may submit clips of your
              character learning a skill in roleplay, through a ticket, and earn a memory point to
              allocate. Points are earned by playing the learning, not by grinding the skill.`,
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
            `That is deliberate. We could publish a damage table, and the moment we did every
              player would know exactly how dangerous every other player is without ever having
              met them. **The point of a reputation is that somebody had to watch you earn it.**
              So if you want to know whether a person is better than you with a blade: spar them,
              watch them fight, or ask somebody who has.`,
          ],
        },
        {
          kind: "note",
          tone: "warn",
          title: "The one weapon rule that is published, because guessing it costs an evening",
          body: `**No points in a weapon skill means no damage at all with that weapon.** Not
            reduced damage. None. It is deliberate: a civilian should not pick up a sword and fight
            like a warrior, and a specialist should feel like a specialist. If your blade is doing
            nothing, this is why, and it is not a bug.`,
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
            `**Repetition pays less.** Diminishing returns are real: farming one creature or
              spamming one recipe such as daggers earns steadily less. Rotating targets and recipes
              is worth more than grinding the single most convenient one.`,
            `**The purple bar is a budget, not a debuff.** Exhaustion drops every time you earn
              experience and only begins refilling once it is fully spent. Resting at an inn refills
              it noticeably faster, which is the real reason to go indoors. If your gains have gone
              flat, check the bar before you blame the skill.`,
          ],
        },
        {
          kind: "note",
          tone: "key",
          title: "Well Rested is the cheapest bonus in the game",
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
            `That means a mage's progression is a calendar and a set of relationships rather than a
              grind, and it is why "how long to Adept" has a real answer where "how long to a good
              swordsman" does not. Every spell in the province with its tier is on the
              [magic page](/magic).`,
          ],
        },
        { kind: "cite", pattern: /spell training|masters of a school|spell points/i, limit: 3 },
      ],
    },
  ],
};
