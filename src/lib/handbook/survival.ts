import type { HandbookPage } from "./blocks";

/**
 * Survival: the three bars, what each one does, and what refills it.
 *
 * Separated from the guide because players keep asking about the bars
 * specifically, and because the purple one is routinely misread. It is Energy,
 * and it is a rest meter: at zero you are Exhausted, which is a state you
 * recover from by sitting down, not a penalty that damages you.
 */
export const survival: HandbookPage = {
  title: "Food, Drink and Energy",
  lede: `Three bars tick down while you play, and only Food and Drink can kill you. The purple one
    is Energy: it is spent by activity, it refills while you sit and faster at an inn, and at zero
    the bar turns to grey stripes and you are Exhausted.`,

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
              "The purple bar. How rested you are, spent by activity.",
              "Sitting down. An inn is faster. Not while hungry or thirsty.",
              "Grey stripes, and you are Exhausted until you rest.",
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
          body: `Low means find food soon. Critical means find food now, because damage starts and
            keeps going until you eat. Do not enter a dungeon on a critical bar: there is rarely
            anything edible inside and you cannot always leave quickly.`,
        },
        {
          kind: "prose",
          paragraphs: [
            `A fourth row, **Rest**, sits in the client's needs config as a commented-out
              example waiting on a fatigue value from the server. It is a note to a future
              developer rather than a mechanic, so nothing tracks it today.`,
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
          title: "Energy is a rest meter",
          body: `Activity spends it. At zero the bar turns to grey diagonal stripes and the client
            calls you Exhausted, which its own tooltip answers with **rest or visit an inn to
            recover faster**. There is no timer to wait out: it was removed, and energy now simply
            regenerates while you are sitting.`,
        },
        {
          kind: "note",
          tone: "warn",
          title: "You cannot recover energy while hungry or thirsty",
          body: `This is the one that catches people. Sitting in an inn with an empty food or drink
            bar recovers nothing at all. Eat and drink first, then rest, or you are just sitting.`,
        },
        {
          kind: "prose",
          paragraphs: [
            `**An inn is faster than anywhere else**, which is the real mechanical reason to go
              indoors rather than sit in a field, and base regeneration outside was halved in
              0.66.0 to widen that gap.`,
            `Full energy is also the gate on Well Rested, so the bar is worth keeping topped up
              before a session rather than after it. A bard performing in the room stacks with
              sitting and with being at an inn, so an inn with a bard in it is worth the walk.`,
          ],
        },
        { kind: "cite", pattern: /energy|exhaution|exhaustion|well rested|bard/i, limit: 4 },
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
          body: `Ten percent bonus experience for an hour. Needs full energy and five minutes at
            an inn, and once you have it, it re-triggers every five minutes while you stay. Cheap
            enough to be a habit worth building: park before you log off, and park before you head
            out.`,
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
          body: `Skooma carries a 72 hour addiction timer. That is three real days of playing around the
            withdrawal, so take it as a decision your character is making rather than as set
            dressing for one scene. Cure Addiction removes it.`,
        },
        { kind: "cite", pattern: /addiction|disease|healer|downed/i, limit: 3 },
      ],
    },
  ],
};
