import type { HandbookPage } from "./blocks";

/**
 * Survival: the four bars, what each one does, and what refills it.
 *
 * Separated from the guide because players keep asking about the bars
 * specifically, and because two of them are commonly confused for each other:
 * the purple exhaustion bar is an experience budget, not a stamina or fatigue
 * meter, and nothing about it hurts you.
 */
export const survival: HandbookPage = {
  title: "Food, Drink and Exhaustion",
  lede: `Four things tick down while you play, and only two of them can kill you. The one people
    misread is the purple bar: it is an experience budget rather than a health problem, and being
    at zero costs you progress, not blood.`,

  sections: [
    {
      id: "bars",
      title: "The bars at a glance",
      blocks: [
        {
          kind: "table",
          head: ["Bar", "What it is", "What refills it", "What happens at zero"],
          rows: [
            [
              "**Food**",
              "Hunger. Ticks down as you play.",
              "Eating. Cooked food goes further than raw.",
              "Damage over time and weakness. It can kill you.",
            ],
            [
              "**Drink**",
              "Thirst. Ticks down faster than hunger.",
              "Water, ale, mead, anything drinkable.",
              "The same, and it arrives sooner.",
            ],
            [
              "**Energy**",
              "How rested you are. Governs regeneration.",
              "Sleeping, and time spent at an inn.",
              "Regeneration falls off and Well Rested is unavailable.",
            ],
            [
              "**Exhaustion**",
              "The purple bar. An experience budget.",
              "Refills only once fully spent. Faster at an inn.",
              "You stop earning experience. Nothing else.",
            ],
          ],
        },
      ],
    },

    {
      id: "thresholds",
      title: "Where the thresholds sit",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `Food and drink are the two the client actually enforces, and it warns you twice on the
              way down. These are its own numbers:`,
          ],
        },
        { kind: "data", name: "needs" },
        {
          kind: "note",
          tone: "warn",
          title: "Low is a warning, critical is a deadline",
          body: `Passing the low threshold is the game telling you to plan a meal. Passing critical
            is the game telling you to eat now. Do not carry a critical bar into a dungeon: there is
            nothing to eat down there, and dying to hunger in a barrow is an embarrassing way to
            need a healer.`,
        },
        {
          kind: "prose",
          paragraphs: [
            `A third need, **Rest**, driven by a fatigue stat, is written into the client and
              commented out. It is intent rather than a mechanic, so nothing tracks it today.`,
          ],
        },
      ],
    },

    {
      id: "exhaustion",
      title: "The purple bar, explained properly",
      blocks: [
        {
          kind: "note",
          tone: "key",
          title: "It is a budget, not a debuff",
          body: `Exhaustion drops every time you use a skill and gain experience. **It does not hurt
            you, slow you or weaken you.** When it is empty you simply stop earning, and it only
            begins refilling once it is fully spent. If your gains have gone flat and you cannot
            work out why, this is almost always the answer.`,
        },
        {
          kind: "prose",
          paragraphs: [
            `Because it refills only after being fully spent, there is no benefit to resting early.
              Spend it, then rest. **Resting at an inn refills it noticeably faster than resting
              anywhere else**, which is the real mechanical reason to go indoors rather than sleep
              in a field.`,
            `A bard performing in the room speeds that recovery up further, which is why inns with
              a bard are worth walking to.`,
          ],
        },
        { kind: "cite", pattern: /exhaustion|musicanship|musicianship|bard/i, limit: 3 },
      ],
    },

    {
      id: "buffs",
      title: "Buffs worth planning around",
      blocks: [
        {
          kind: "note",
          tone: "key",
          title: "Well Rested",
          body: `Needs full energy and five minutes at an inn. Once you have it, it re-triggers
            every five minutes while you stay. It is the cheapest standing experience bonus in the
            game and the single best habit to build: park before you log off, and park before you
            head out.`,
        },
        {
          kind: "note",
          tone: "key",
          title: "Comfort",
          body: `Fifty percent health regeneration for being near a camp fire, and interior firepits
            count. It drops the moment you walk away, so fight near the fire rather than away from
            it.`,
        },
        {
          kind: "note",
          tone: "warn",
          title: "Blessings do not stack",
          body: `A blessing lasts eight hours and you cannot take a second until the first wears
            off. Taking a weak one early locks you out of a better one for the rest of the session.
            Choose once.`,
        },
        {
          kind: "note",
          tone: "warn",
          title: "Standing stones are on a day-long cooldown",
          body: `Swapping is blocked outright if you have used an ability that is still cooling
            down, and the swap itself is on a twenty four hour cooldown. Pick before you spend
            anything.`,
        },
        { kind: "cite", pattern: /well.?rested|comfort|blessing|standing stone/i, limit: 4 },
      ],
    },

    {
      id: "hurt",
      title: "When it goes wrong",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `**Priests are the doctors.** Temple priests hold Master Restoration, are authorised to
              teach disciples, and are who you look for when someone is hurt. A faction like the
              Vigilants of Stendarr fills the same role on the road.`,
            `**A player healer outranks an NPC one.** If a player healer is available you must seek
              them out rather than use a local NPC healer, and while they are treating you, you are
              in their custody until they discharge you. That can be enforced by guards.`,
            `**What you remember depends on who treated you.** Brought to an NPC healer, your
              character only vaguely recalls what led to the injury. Brought to a player healer, you
              remember everything. Seeing Sovngarde costs you the previous thirty minutes.`,
          ],
        },
        {
          kind: "note",
          tone: "warn",
          title: "Addiction is modelled and it is long",
          body: `Skooma carries a 72 hour addiction timer, and Cure Addiction exists for a reason.
            Three days is a long time to play around a debuff you took for one scene.`,
        },
        { kind: "cite", pattern: /addiction|disease|healer|downed/i, limit: 3 },
      ],
    },
  ],
};
