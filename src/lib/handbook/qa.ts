/**
 * The community Q&A.
 *
 * Distinct from `/faq` on purpose, and the distinction is the same one the
 * changelog and the roadmap draw. Questions answers how the server works today.
 * This answers what the team intends, which is a different kind of statement and
 * ages differently, so it carries the date it was given and says so at the top.
 *
 * The wording is theirs. Where an answer hedges, the hedge is the answer: "no
 * complete overhaul planned right now" and "possibly down the road" are not the
 * same as yes, and flattening either into a promise would put something on an
 * official page that nobody agreed to. Anything genuinely undecided is marked
 * `open`, the same flag the FAQ uses, so it reads as open rather than as a
 * commitment somebody can hold the team to later.
 */

import type { Answer } from "@/lib/handbook/faq";

export interface QaSection {
  id: string;
  title: string;
  blurb?: string;
  items: Answer[];
}

/**
 * When these answers were given.
 *
 * A page of intentions with no date on it starts lying quietly the moment
 * something ships. The roadmap on the old site did exactly that.
 */
export const qaAnsweredOn = "August 2026";

export const qaSections: QaSection[] = [
  {
    id: "enchanting",
    title: "Enchanting",
    blurb:
      "Enchanting runs on Thaumaturgy rather than a system of our own, and the questions below are mostly about how far that goes.",
    items: [
      {
        q: "Will enchanting receive a complete overhaul?",
        a: `There is no complete overhaul planned right now. We are using **Thaumaturgy**, which
          already expands and improves enchanting quite a bit. There will definitely be balancing
          and fine-tuning as we go. Our priority was getting the system working first, then
          adjusting it based on how it performs.`,
      },
      {
        q: "Will I be able to learn all enchantments?",
        a: `Yes. Enchantments can be learned through disenchanting, and should remain learned
          afterward.`,
      },
      {
        q: "Will certain enchantments require a specific skill level?",
        a: `Yes. Enchanting is tiered, so stronger enchantments will require higher skill levels.`,
      },
      {
        q: "Will Rune Thanes or Court Enchanters eventually receive Hold bonuses similar to Court Mages?",
        a: `Possibly down the road. When the current Hold ranks were created, we started with a more
          universal rank structure that could work across every Hold. We can always expand that
          later.`,
        open: true,
      },
      {
        q: "Will enchanting be treated similarly to magic because of how powerful it can become?",
        a: `In a way, yes. Becoming a powerful enchanter requires a large investment of time and
          progression. The amount of effort required should help keep Master Enchanters limited to
          characters who actually dedicate themselves to it.`,
      },
      {
        q: "Can enchanting guilds or organizations be created?",
        a: `Absolutely. As long as it makes sense within TES lore and the RP surrounding it, players
          are free to create guilds, schools, businesses, orders, or other organizations around
          enchanting.`,
      },
      {
        q: "Will Master Enchanters eventually be able to teach other players?",
        a: `This is something we want to explore for all skills, not just enchanting. A possible
          system would allow a Master-level character to train another player and provide some form
          of temporary experience or learning bonus in that specific skill.`,
        open: true,
      },
    ],
  },

  {
    id: "crafting",
    title: "Crafting and progression",
    items: [
      {
        q: "Which crafting metals are coming next now that players are reaching steel?",
        a: `Higher-tier materials will continue being introduced as progression moves forward. We
          want proper support for things such as Dwarven, Orcish, Elven and higher-tier equipment,
          and higher-tier materials will also have better durability since they are made from
          stronger materials. When we eventually reach Tier 5, materials such as Ebony will still
          remain rare. Unlocking the tier does not mean rare materials suddenly become common.`,
      },
      {
        q: "Will more robes, mage clothing, equipment and spell mods be added?",
        a: `Yes. We are completely open to adding more clothing, armor, robes, equipment and spells.
          Now that the server has much better mod support, we have a lot more flexibility with
          future content. We especially want spells that offer something unique rather than simply
          being a fireball, but stronger.`,
      },
      {
        q: "Will starting Memory Points be increased to around 21 to 25?",
        a: `There are currently no plans to significantly increase starting Memory Points. The
          system is intentionally designed so one character cannot be great at everything. You can
          spread your points across multiple skills and be more versatile, or specialize heavily
          into fewer skills and become genuinely exceptional at them. We want becoming a Master in
          something to actually mean something. The long-term plan is for additional Memory Points
          to slowly unlock over time, but currently most players have not even filled all of the
          points already available.`,
      },
      {
        q: "Can weapon durability be increased?",
        a: `Durability has already received some adjustments and will continue being tuned.
          Higher-tier equipment will also naturally have significantly better durability than
          lower-tier equipment.`,
      },
      {
        q: "What about people repeatedly hitting each other to grind experience?",
        a: `There are already diminishing experience returns when attacking the same target
          repeatedly. This exists specifically to prevent players from standing around hitting each
          other over and over to power-level.`,
      },
    ],
  },

  {
    id: "world",
    title: "World and character features",
    items: [
      {
        q: "Will players eventually be able to change their appearance after character creation?",
        a: `Yes. Right now, players can contact staff if they need access to RaceMenu. Eventually we
          may create a cleaner system for changing specific cosmetic features without requiring
          staff assistance.`,
      },
      {
        q: "Are more location mods coming, such as Granite Hill or Brirgate?",
        a: `Yes. There are still roughly forty mods from the planned list that have not been added
          yet. Getting the initial release ready took priority, and some mods require additional
          preparation or testing before they can safely be added. More locations and content will
          continue rolling out as development progresses.`,
      },
      {
        q: "Will horse ownership and basic horse commands eventually be available?",
        a: `Some of this is already possible through the animal taming system. The goal is
          eventually to have horses functioning properly enough for ownership and useful commands.
          Once horses are working properly, we can also start exploring roles such as Stablemasters
          and other horse-related professions.`,
      },
      {
        q: "Will fishing be repaired or expanded?",
        a: `Yes. Fishing is something we would love to have working properly. There are limitations
          based on what Skyrim mods currently allow us to do without much heavier custom
          development, but the immediate goal is at minimum to get the base-game fishing system
          functioning reliably. After that, we can see how much further it can be expanded.`,
      },
    ],
  },

  {
    id: "rp",
    title: "RP rules and starter kits",
    items: [
      {
        q: "Will Fear RP rules receive clearer guidance?",
        a: `Potentially, yes. Our general philosophy is that staff should avoid interfering with
          active RP unless intervention is actually necessary. If someone repeatedly ignores obvious
          danger, runs directly into fights as an uninvolved civilian, or otherwise refuses to
          appropriately value their character's life, that can be reported through a ticket and
          reviewed case by case. If the community continues seeing this as a larger problem, we can
          also have a broader discussion about adding clearer Fear RP expectations to the rules.`,
        open: true,
      },
      {
        q: "Will more starter kits be added?",
        a: `Yes. The original kits were intentionally kept fairly basic so we could get the system
          launched. There is plenty of room to expand them with different combat styles and
          professions: one-handed fighters, two-handed fighters, dual-wield characters, different
          mage archetypes, crafting professions and other RP-focused professions. More kits can be
          added as we determine what players actually need.`,
      },
    ],
  },

  {
    id: "skills",
    title: "Sneak, lockpicking and development",
    items: [
      {
        q: "Will Sneak progression be improved?",
        a: `We have already made some changes, including allowing creatures to provide Sneak
          experience. The difficult part with skills like Sneak is giving players reasonable ways to
          train them without creating an extremely easy way to cheese experience. We want
          progression to feel achievable, but we also do not want everyone becoming a Master Sneak
          because someone discovered a five-minute grinding method. This will continue being
          adjusted.`,
      },
      {
        q: "Will practice locks be added for Lockpicking?",
        a: `The new dungeon system already includes locks of different difficulties. The intention is
          for players to naturally encounter different tiers of locks through exploration and
          gameplay, giving Lockpicking characters opportunities to progress while still keeping the
          skill connected to actual gameplay and RP.`,
      },
    ],
  },
];

export const qaCount = qaSections.reduce((total, section) => total + section.items.length, 0);
