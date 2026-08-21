import type { HandbookPage } from "./blocks";
import { TEACHING_DOC_URL } from "@/lib/site";
import { spellTierRows, MAX_APPRENTICES, TEACHER_POINTS_REQUIRED } from "@/lib/magic";

/**
 * The Teaching Guidelines, Revision 1, as a page.
 *
 * Teaching is the one magical privilege that is applied for rather than earned
 * in play, and the guidelines behind it are long, specific, and easy to fall
 * foul of by accident. Somebody reading them for the first time wants the
 * requirements, then the stages, then what an audit will ask for, which is the
 * order this page runs in.
 *
 * Where the guidelines deliberately leave something to a Teacher's judgement,
 * this page says so instead of inventing a threshold. "Take it slow" carries no
 * number, and giving it one here would read as policy.
 */
export const teaching: HandbookPage = {
  title: "Teaching Magic",
  lede: `Every spell on the server was either read out of a tome or handed down by somebody who
    already knew it. That second route runs through Teachers, and a Teacher is a whitelisted role
    with an application, an interview, a mock lesson and an unannounced audit behind it. This is
    what it asks of you, and what it asks of your apprentices.`,

  sections: [
    {
      id: "role",
      title: "What a Teacher is",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `Reaching Master in a school makes you a master of that school. It does not make you a
              Teacher. **Teaching is a separate privilege, granted by staff through a whitelist**,
              and the Teach interaction stays unavailable until you hold it.`,
            `The trade is stated plainly in the guidelines: you are trusted to hand out spells, and
              in return you are expected to produce magical roleplay other people want to be part
              of. Teachers are held to a higher standard than other players, and they are audited
              against it.`,
          ],
        },
        {
          kind: "note",
          tone: "key",
          title: "You can be a Master and never teach",
          body: `Nothing obliges a Master to take apprentices. Applying is a choice, and everything
            on this page follows from making it.`,
        },
      ],
    },

    {
      id: "requirements",
      title: "Before you can apply",
      blocks: [
        {
          kind: "prose",
          paragraphs: [`Four things, and the first two are measured in months rather than evenings:`],
        },
        {
          kind: "list",
          items: [
            `**Master level experience in at least one school**: Alteration, Destruction,
              Conjuration, Illusion or Restoration.`,
            `**At least ${TEACHER_POINTS_REQUIRED} spell points' worth of spells learned.** Not
              ${TEACHER_POINTS_REQUIRED} spells: ${TEACHER_POINTS_REQUIRED} points, counted at 1 for
              a Novice spell and 8 for a Master one.`,
            `**No history of major infractions** on Mereth.`,
            `**A ticket** asking for a Teacher Whitelist Application.`,
          ],
        },
        {
          kind: "note",
          tone: "key",
          title: `${TEACHER_POINTS_REQUIRED} points is four fifths of your grimoire`,
          body: `Everybody starts with 50 spell points, and becoming a Teacher is the only route
            anyone has published for raising that ceiling. Meeting the requirement therefore means
            spending nearly everything you have on learning, which is the intent: it is meant to be
            a long road. The costs are on the [magic page](/magic).`,
        },
      ],
    },

    {
      id: "application",
      title: "The three stages",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `The application gauges lore literacy, magical and mundane, alongside effort,
              originality and what you actually intend to do with the role. It is peer reviewed, it
              is held to a high standard, and it is meant to be hard.`,
          ],
        },
        {
          kind: "table",
          head: ["Stage", "What happens"],
          rows: [
            ["**1. Written**", "A written application, provided inside your ticket."],
            [
              "**2. Interview**",
              "A voice interview over Discord, scheduled once the written stage is approved.",
            ],
            [
              "**3. Mock lesson**",
              "A lesson taught in game, to the interviewer, as though they were your apprentice.",
            ],
          ],
        },
        {
          kind: "note",
          tone: "warn",
          title: "A denial carries a cooldown",
          body: `A month before you may apply again after the first denial, and three months after
            any denial that follows it.`,
        },
      ],
    },

    {
      id: "interaction",
      title: "The Teach interaction",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `The interaction appears only for whitelisted Teachers, and only while **you have a
              spell equipped**. Whatever is in your hand is what gets taught, so check before you
              use it. It sits with the other roleplay interactions on \`Y\`, or \`RB\` on a pad,
              alongside [the rest of the interaction keys](/guide#controls).`,
            `Using it does not hand the spell over. It writes a timer into the apprentice's
              grimoire, and the timer is set by the tier of the spell:`,
          ],
        },
        {
          kind: "table",
          head: ["Spell tier", "What it costs the apprentice", "Time it adds to their grimoire"],
          rows: spellTierRows(),
        },
        {
          kind: "note",
          tone: "key",
          title: "Each further lesson takes a day off",
          body: `Using Teach again on an apprentice already studying that spell removes **one day**
            from the timer. That is what repeat lessons are for, and it is the only way to shorten a
            study that has already started.`,
        },
        {
          kind: "note",
          tone: "warn",
          title: "One spell at a time, on their side",
          body: `An apprentice can only study one spell at once. Teaching a second while the first
            is still running does not queue it, it fails. Ask what is in their grimoire before you
            reach for a new tome.`,
        },
      ],
    },

    {
      id: "roleplay",
      title: "The roleplay is the requirement, not the extra",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `Roleplay in teaching is not a recommendation. Using the interaction is the end of a
              lesson, not the lesson, and a Teacher who hands out spells without one **loses the
              role**.`,
          ],
        },
        {
          kind: "list",
          items: [
            `**Reinforce the learning.** Every use of the interaction, whether it grants a spell or
              shortens a timer, comes attached to instruction, discussion or practice.`,
            `**Be balanced.** One spell per rank is reckless, in lore and in progression. Teach a
              variety of concepts and spells at each rank before deciding somebody is ready for the
              next one. Take it slow.`,
            `**Be selective.** Aptitude and attitude are not the same thing. Somebody who wants
              Restoration to improve their odds in a dungeon is not the same student as somebody who
              can explain what Restoration is.`,
            `**Provide opportunity.** A Teacher is a roleplay leader. Set assignments, send
              apprentices on errands, give them a reason to be somewhere. There is more to the
              relationship than handing over spells.`,
            `**Know the edge of what you know.** Teach only what your character has learned,
              experienced or roleplayed, and send an apprentice to somebody better informed when you
              reach that edge.`,
            `**Take responsibility.** An apprentice breaking Mereth's rules reflects on their
              Teacher, in character and out of it. So do your own.`,
          ],
        },
        {
          kind: "note",
          tone: "key",
          title: "A lesson can end with nothing",
          body: `Nothing obliges you to grant a spell or take a day off a timer because a session
            happened. If an apprentice has not earned it, say so in character. Withholding is part of
            the role, and the guidelines say so outright.`,
        },
      ],
    },

    {
      id: "apprentices",
      title: "Three apprentices, and everybody else",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `A Teacher may hold **${MAX_APPRENTICES} apprentices at a time**, and may teach magic to
              those ${MAX_APPRENTICES} exclusively. What you can teach them stops at Adept: **past
              Adept means the College of Winterhold**, or approval from staff.`,
            `Everybody else is a non-apprentice. A Teacher may teach one non-apprentice **once a
              week**, and only after judging that they have the same aptitude a prospective
              apprentice would need. It can grant a new spell or take a day off one already being
              studied.`,
          ],
        },
        {
          kind: "note",
          tone: "warn",
          title: "The weekly limit is on your honour",
          body: `Nothing in the game enforces it. The cooldown refreshes every **Wednesday**, and
            counting it is your responsibility, which is one of the things an audit is in a position
            to check.`,
        },
        {
          kind: "prose",
          paragraphs: [
            `Teacher to teacher, the restrictions come off: **Teachers may teach one another any
              spell**, without regard to school or tier, and it counts as that week's non-apprentice
              lesson. Teaching somebody else's apprentice counts the same way, referred or not. What
              changes is the roleplay, peer to peer rather than master to apprentice.`,
          ],
        },
        {
          kind: "note",
          tone: "key",
          title: "Save the interaction for your own three",
          body: `The guidelines are explicit that a Teacher should reserve the interaction for
            reducing their apprentices' timers. A week's non-apprentice lesson spent on a passing
            stranger is a day one of your own three does not get.`,
        },
      ],
    },

    {
      id: "apprenticeships",
      title: "How long an apprenticeship lasts",
      blocks: [
        {
          kind: "list",
          items: [
            `As long as the two of you want. There is no cap and no mandatory graduation.`,
            `While it lasts, **an apprentice cannot seek out another apprenticeship**.`,
            `Taking somebody on commits you for **at least a week**: a new apprentice cannot be
              replaced before then.`,
            `A transfer between Teachers needs an open slot on the receiving side.`,
            `Sending an apprentice to another Teacher for a single lesson is not a transfer. It is
              that Teacher's non-apprentice lesson for the week.`,
          ],
        },
      ],
    },

    {
      id: "audits",
      title: "Audits, and the books you keep",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `Whitelisted Teachers are audited by the Magic Team and by staff, without warning. How
              an audit is conducted is not published. What it expects of you is.`,
          ],
        },
        {
          kind: "list",
          items: [
            `**Your books.** Organised, reliable records of every apprentice past and present,
              non-apprentices included, the spells you taught each of them, and how long each
              apprenticeship ran.`,
            `**Your clips.** Tangible evidence of teaching, from your own perspective or from your
              apprentices'.`,
            `**Your standards.** Poorly trained or rule-breaking apprentices reflect on the Teacher
              who trained them.`,
            `**Your compliance.** An auditor's requests are answered to the best of your ability.`,
            `**Your improvement.** Passing is the floor. Visible improvement in how you teach is
              what earns marks.`,
          ],
        },
        {
          kind: "note",
          tone: "warn",
          title: "Failing an audit revokes the whitelist",
          body: `And depending on what the audit found, it can extend to removal of your magic, a
            magic ban, or removal from Mereth Roleplay. Whether the role can be earned back depends
            on what cost you it, and where it is allowed at all it means the whole application
            again.`,
        },
      ],
    },

    {
      id: "questions",
      title: "Questions Teachers ask",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `**How does a Teacher learn more magic?** The same way anybody else does: a tome, or
              another Teacher. Teacher to teacher counts as a non-apprentice lesson, and the
              roleplay is peer to peer rather than master to apprentice.`,
            `**Can I reach Master and never teach?** Yes. Nothing about becoming a Master obliges
              you to teach, and the interaction simply stays unavailable.`,
            `**I need a long break. Do I lose the role?** Open a support ticket and tell staff
              before you go, so a future audit is not reading an absence as neglect. Leave is
              handled case by case and may or may not mean a temporary loss of permissions.`,
            `**Can revoked permissions be earned back?** It depends on how severe the infractions
              behind the revocation were. Where it is approved at all, it means completing a
              whitelist application again.`,
            `**A former apprentice broke a pile of rules months later. Am I answerable?** No, unless
              you were directly involved. Responsibility does not stretch indefinitely past the end
              of an apprenticeship.`,
            `**Does a cult teach differently from a court mage?** Not mechanically. Both run on this
              system and both answer to these guidelines. What differs is how the teaching is done
              in roleplay, and what it stands on.`,
          ],
        },
      ],
    },

    {
      id: "document",
      title: "The guidelines themselves",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            `This page follows **Teaching Guidelines, Revision 1**. The
              [full document](${TEACHING_DOC_URL}) is the authority and governs if the two ever
              differ, and anything neither of them answers goes to a **support ticket** rather than
              to a staff member's direct messages.`,
            `If you are not teaching but being taught, the mechanics are on the
              [magic page](/magic): what a spell costs, how long it takes, and what to do on your
              first evening as a mage.`,
          ],
        },
      ],
    },
  ],
};
