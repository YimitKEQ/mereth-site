import type { HandbookPage } from "./blocks";

/**
 * Combat, because the server replaced it and the handbook never said so.
 *
 * On 28 August 0.70.21 dropped Valhalla Combat, TK Dodge and Improved Camera in
 * one patch, and the fortnight after it rebuilt poise, crowd control, stamina
 * and target lock on top. Anyone whose last session was in August came back to
 * a different game, and the only written account of it was forty patch notes in
 * reverse order.
 *
 * The rule this page keeps is the one the rest of the handbook keeps: the
 * mechanics are published, because guessing them costs an evening, and the
 * damage numbers are not, because Mereth does not publish them and inventing a
 * table here would be worse than saying so. Every mechanical claim below is in a
 * patch note, and the `cite` blocks put those notes on the page.
 */
export const combat: HandbookPage = {
  title: "Combat",
  lede: `Combat was rebuilt at the end of August and again through September. Timed blocks, a poise
    bar, a dodge on double tap, crowd control that can be resisted, and stamina as the thing that
    actually decides a fight. If you learned to fight here before that, most of this is new.`,

  sections: [
    {
      id: "what-changed",
      title: "What changed, and when",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `**0.70.21, 28 August.** Valhalla Combat went in, blended with Mereth's own systems
              rather than replacing them. TK Dodge came with it, and so did Improved Camera, which
              is why you now have a body in first person and the animations that go with it.`,
            `**The fortnight after** rebuilt the pieces around it: poise and stagger, crowd control
              with diminishing returns, a target lock that stays locked, stamina returned on a clean
              hit, stances, and a dual wield block. The tuning is still moving, and the patch notes
              say so in as many words, so treat specific timings as current rather than settled.`,
          ],
        },
        {
          kind: "note",
          tone: "key",
          title: "The one thing to know first",
          body: `**Stamina decides fights now.** Not health. Blocking, bashing, dodging and power
            attacks all draw on it, a clean unblocked hit gives half of it back, and at zero you
            are not out of options, you are out of defence. Watch your own bar before you watch
            theirs.`,
        },
      ],
    },

    {
      id: "defence",
      title: "Blocking, parrying and poise",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `Holding block still works and still costs stamina. What is new is the **timed parry**:
              block in the window as a blow lands and you turn it rather than absorb it.`,
            `**Your Block skill sets the size of that window.** That is the clearest answer on the
              server to "what does a skill point actually buy": a Novice and a Master pressing the
              same key at the same moment do not get the same result.`,
          ],
        },
        {
          kind: "note",
          tone: "key",
          title: "Poise, and why stun locks stopped",
          body: `Everything that staggers now drains a **poise bar** rather than interrupting you
            directly. You are staggered only when that bar reaches zero, and then any stagger lands
            in full. TrueHUD shows the bar the moment it starts dropping. This is what stopped a
            fast weapon holding somebody in place until they died, and it is why trading hits
            recklessly is now a losing plan rather than a fast one.`,
        },
        {
          kind: "prose",
          paragraphs: [
            `**Dual wielders can block.** Press \`X\`. It arrived in 0.72.9 and was fixed twice
              after, so if you learned that two blades cannot defend, that is out of date.`,
            `**A bash does bash damage.** It used to do a full weapon hit, which quietly made the
              shield bash the strongest opener in the game. That was corrected in 0.70.21.`,
          ],
        },
        { kind: "cite", pattern: /parry|poise|stagger|dual wield block|bash/i, limit: 4 },
      ],
    },

    {
      id: "dodge",
      title: "The dodge",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `**Double tap a direction key to dodge.** Forward, back or either side, and you roll
              that way. On a controller it is a double tap of the stick in a direction, or your
              bound d-pad movement.`,
            `Two corrections worth knowing if you tried it early and gave up: the double tap has to
              be **the same key twice**, which is what 0.70.49 fixed, and the window was tightened
              in 0.72.9 so that ordinary running stopped throwing you into rolls. What a roll costs
              in stamina was reduced as well.`,
          ],
        },
        { kind: "cite", pattern: /dodge|roll/i, limit: 3 },
      ],
    },

    {
      id: "control",
      title: "Crowd control, and how it is resisted",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `Knockdowns, stuns, silences and concussion are all handled as **crowd control**, which
              means they obey the same three rules rather than each behaving differently.`,
          ],
        },
        {
          kind: "table",
          head: ["Rule", "What it means in a fight"],
          rows: [
            [
              "**Diminishing returns**",
              "Landing the same control twice in quick succession makes the second one weaker. Chaining them does not hold anybody indefinitely.",
            ],
            [
              "**Level scales it**",
              "A control spell used on somebody above the level it was meant for loses three seconds per level over, until it is resisted outright.",
            ],
            [
              "**Resistance counts**",
              "Spell resistance and every kind of ward now apply to control effects, not only to damage. Magic resistance is a real defence against being held.",
            ],
          ],
        },
        {
          kind: "note",
          tone: "warn",
          title: "Silence stops a cast in progress",
          body: `A silence does not merely stop the next spell, it breaks casting and concentration
            outright. For a mage in a fight, being silenced is the emergency, not being hit.`,
        },
        {
          kind: "prose",
          paragraphs: [
            `The **knockdown** is Valhalla's shoulder tap, and it works on players and creatures
              alike. It crashed on creatures for a while in September and was rerouted through the
              engine's own knockdown to fix it, so it behaves like a vanilla knockdown now.`,
          ],
        },
        { kind: "cite", pattern: /crowd control|knockdown|silence|concussion/i, limit: 4 },
      ],
    },

    {
      id: "stamina",
      title: "Stamina, properly",
      blocks: [
        {
          kind: "table",
          head: ["What happens", "What it does to your stamina"],
          rows: [
            [
              "A clean unblocked melee hit lands",
              "**Half of it comes back.** Connecting is how you stay in a fight.",
            ],
            [
              "You run out",
              "Exhaustion clears at **30 percent** rather than at full, so you are back in the fight sooner than you were.",
            ],
            ["You roll or jump", "Less than it used to cost. Both were reduced in 0.70.35."],
            ["You fall", "Falling costs stamina, but it stopped also being counted as a jump."],
          ],
        },
        {
          kind: "note",
          tone: "key",
          title: "Attack speed comes from Agility",
          body: `Agility raises how fast your weapons swing, and the perks that key off speed, such
            as Dual Flurry, are wired to it. The **Haste** spell, Adept Alteration, does the same
            for a while. Both sit with the rest of the attributes on
            [progression](/progression#attributes).`,
        },
        { kind: "cite", pattern: /stamina|agility|haste/i, limit: 4 },
      ],
    },

    {
      id: "camera",
      title: "Target lock, and the body you now have",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `**Target lock holds.** Once you have a target you keep it until you release with the
              middle mouse button. Drifting the mouse left, right, up or down moves which part of
              them you are aimed at, and snaps back to centre. It stopped swapping targets on its
              own, which is what had made it unusable in a crowd.`,
            `**You have a body in first person now**, with the third person animations playing on
              it, leaning included. That is Improved Camera, shipped in the same patch as the combat
              overhaul. If a first person view suddenly showed you your own arms and chest in late
              August, nothing is broken.`,
            `Aim sync for spells and bows was rebuilt at the same time, so where another player
              appears to be pointing is now much closer to where they are actually pointing.`,
          ],
        },
        { kind: "cite", pattern: /target lock|first person|improved camera|aiming/i, limit: 3 },
      ],
    },

    {
      id: "damage",
      title: "What your damage actually comes from",
      blocks: [
        {
          kind: "prose",
          paragraphs: [`Three things, and only one of them is published as a number.`],
        },
        {
          kind: "table",
          head: ["Source", "Published?"],
          rows: [
            [
              "**The weapon specialisation in your plan**",
              "No numbers, on purpose. A civilian holding a sword swings like a civilian: if a blade feels like it is doing nothing, check your plan before you report a bug.",
            ],
            [
              "**Your attributes**",
              "Yes. The formulas are on [progression](/progression#attributes). Strength and Endurance carry health and melee, Agility carries speed and stamina.",
            ],
            [
              "**What you are wearing and holding**",
              "Partly. The material tiers on every custom weapon and armour were re-scaled in 0.70.34 so that they progress properly.",
            ],
          ],
        },
        {
          kind: "note",
          tone: "key",
          title: "Unarmed reads your gloves",
          body: `Bare-handed damage now comes from the armour rating of your gloves, and that
            overrides racial damage. Argonian claws are innate and stack on top of the base instead.
            So the fist fighter's weapon slot is their gauntlets.`,
        },
        {
          kind: "note",
          tone: "warn",
          title: "There is still no damage table, and that is deliberate",
          body: `Mereth does not publish one, so neither does this page. If we listed it, anyone
            could work out how dangerous your character is by asking which tier you bought, without
            ever meeting you. Find out by sparring, by watching, or by asking somebody who has.`,
        },
        { kind: "cite", pattern: /unarmed|claw|armor rating|material/i, limit: 3 },
      ],
    },

    {
      id: "against-players",
      title: "Fighting other players",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `The mechanics above are the same against a player. The rules are not. Killing, robbery,
              kidnapping and the rest are governed by the rulebook rather than by what your
              character could physically do, and the penalties for getting that wrong are real.
              **Read [the rules](/rules) before you start a fight with somebody**, not after.`,
            `Two things the server enforces on its own, for the avoidance of doubt: a parcelled lock
              cannot be picked while every member attached to it is offline, and the character
              creation sliders clamp whatever a client tries to load. Both landed as quiet lines in
              the patch notes, and both are worth knowing before somebody tries them.`,
          ],
        },
      ],
    },
  ],
};
