import type { Metadata } from "next";

import { Chapters } from "@/components/handbook/Chapters";
import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ButtonLink } from "@/components/ui/Button";
import { pageMeta } from "@/lib/seo";
import {
  groundedIn,
  patterns,
  selfCheck,
  swapGroups,
  whenSomebodyElseBreaks,
} from "@/lib/world/language";

export const metadata: Metadata = pageMeta({
  path: "/language",
  title: "Roleplay Language",
  description:
    "How to say it in character on Mereth: what to say instead of skills, levels, respawns and second characters, the in-world expressions the rules ask for, and what to do when somebody else drops out of character.",
});

/**
 * The page that did not exist and should have.
 *
 * Almost nobody breaks character on purpose. They want to join the Legion and
 * they say "I'll make a new character for that", because nobody has ever shown
 * them what the in-world version of that sentence sounds like. The rulebook
 * already forbids it in one line and moves on. This page is the missing half:
 * not the rule, the phrasing.
 *
 * Every rule quoted is a real code. Everything else is guidance and is written
 * as guidance, because the rulebook is the authority and a page like this must
 * not quietly grow it.
 */
export default function LanguagePage() {
  const swapCount = swapGroups.reduce((n, g) => n + g.swaps.length, 0);

  return (
    <div className="mx-auto max-w-[76rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />

      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          The Handbook
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          Roleplay Language
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
          Nobody arrives knowing how to talk in character. The most common way a scene falls apart
          here is not trolling, it is somebody saying a perfectly reasonable sentence that belongs to
          the player rather than to the person they are playing. This page is the translation.
        </p>
        <div className="mt-7 flex flex-wrap gap-4">
          <ButtonLink href="/rules" variant="solid" size="md">
            The rulebook
          </ButtonLink>
          <ButtonLink href="/start" size="md">
            New here? Start there
          </ButtonLink>
        </div>
      </header>

      <div className="relative mt-9 max-w-3xl border border-brand-accent/40 bg-black/35 px-6 py-5">
        <FrameCorners weight="thin" size={16} />
        <p className="relative text-[0.95rem] leading-relaxed text-text-light">
          <strong className="font-semibold text-text-primary">
            This page is guidance, not a rule.
          </strong>{" "}
          The rules it is built on are quoted below with their codes, and the rulebook stays the
          authority. Everything else here is phrasing: {swapCount} things people actually say, and
          what to say instead.
        </p>
      </div>

      <OrnateDivider className="my-12" />

      <Chapters
        chapters={[
          {
            id: "why",
            title: "Why it matters",
            content: (
              <>
                <p className="mb-5 text-[0.98rem] leading-[1.8] text-text-light">
                  Everyone in a scene is spending their evening on it. When one person steps outside
                  the fiction, everybody else has to decide whether to pretend they did not hear it.
                  That is the cost, and it is paid by the people around you rather than by you.
                </p>
                <p className="mb-5 text-[0.98rem] leading-[1.8] text-text-light">
                  It is also the difference between a clip worth posting and a clip nobody can use.
                  A scene where a bandit demands your purse is a story. The same scene with one
                  sentence about skill tiers in it is a video game lobby, and no amount of editing
                  gets it back.
                </p>
                <p className="text-[0.98rem] leading-[1.8] text-text-muted">
                  None of this is about being good at improvising. It is vocabulary, and vocabulary
                  is learnable in an evening.
                </p>
              </>
            ),
          },
          {
            id: "rules",
            title: "The rules this comes from",
            content: (
              <>
                <p className="mb-6 text-[0.98rem] leading-[1.8] text-text-muted">
                  Cited exactly as they appear in the rulebook, because staff and players cite them
                  by code in tickets.
                </p>
                <ul className="space-y-3">
                  {groundedIn.map((rule) => (
                    <li
                      key={rule.code}
                      className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-4 border-l-2 border-brand-accent/25 py-2 pl-4"
                    >
                      <span className="font-mono text-[0.78rem] text-brand-accent/80">
                        {rule.code}
                      </span>
                      <span className="text-[0.95rem] leading-[1.75] text-text-light">
                        {rule.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ),
          },
          ...swapGroups.map((group) => ({
            id: group.id,
            title: group.title,
            content: (
              <>
                <p className="mb-7 text-[0.98rem] leading-[1.8] text-text-muted">{group.blurb}</p>
                <ul className="space-y-6">
                  {group.swaps.map((swap) => (
                    <li key={swap.ooc} className="border-l-2 border-brand-accent/25 pl-5">
                      {/* The pairing is the whole point, so the two halves are
                          labelled in words rather than only by colour: the
                          distinction has to survive greyscale and a screen
                          reader. */}
                      <p className="text-[0.95rem] leading-[1.7] text-[#c98a76]">
                        <span className="font-display mr-2 text-[10px] tracking-[2px] uppercase opacity-80">
                          Instead of
                        </span>
                        {swap.ooc}
                      </p>
                      <p className="mt-2 text-[0.98rem] leading-[1.75] text-text-primary">
                        <span className="font-display mr-2 text-[10px] tracking-[2px] text-brand-accent uppercase">
                          Say
                        </span>
                        {swap.ic}
                      </p>
                      {swap.why === undefined ? null : (
                        <p className="mt-2 text-[0.9rem] leading-[1.7] text-text-muted">
                          {swap.why}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            ),
          })),
          {
            id: "patterns",
            title: "Saying the hard things",
            content: (
              <>
                <p className="mb-7 text-[0.98rem] leading-[1.8] text-text-muted">
                  Four things newcomers most often need to do and do not yet have the words for.
                  These are shapes, not scripts. Fill them with your own character.
                </p>
                <div className="space-y-8">
                  {patterns.map((pattern) => (
                    <div key={pattern.id}>
                      <h3 className="font-display text-[0.95rem] tracking-heading text-brand-accent uppercase">
                        {pattern.title}
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {pattern.lines.map((line) => (
                          <li
                            key={line}
                            className="relative pl-5 text-[0.95rem] leading-[1.75] text-text-light before:absolute before:top-[0.75em] before:left-0 before:h-1 before:w-1 before:bg-brand-accent"
                          >
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </>
            ),
          },
          {
            id: "others",
            title: "When somebody else breaks character",
            content: (
              <>
                <p className="mb-6 text-[0.98rem] leading-[1.8] text-text-light">
                  {whenSomebodyElseBreaks.lead}
                </p>
                <ol className="mb-7 space-y-3">
                  {whenSomebodyElseBreaks.steps.map((step, index) => (
                    <li
                      key={step}
                      className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-l-2 border-brand-accent/25 py-1 pl-4"
                    >
                      <span className="font-mono text-[0.78rem] text-brand-accent/80">
                        {index + 1}
                      </span>
                      <span className="text-[0.95rem] leading-[1.75] text-text-light">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="relative border border-brand-accent/40 bg-black/35 px-6 py-5">
                  <FrameCorners weight="thin" size={16} />
                  <p className="relative text-[0.95rem] leading-relaxed text-text-light">
                    {whenSomebodyElseBreaks.closing}
                  </p>
                </div>
              </>
            ),
          },
          {
            id: "check",
            title: "Before you press talk",
            content: (
              <>
                <p className="mb-6 text-[0.98rem] leading-[1.8] text-text-muted">
                  Four questions. They take about a second each once they are habit, and they catch
                  nearly everything on this page.
                </p>
                <ul className="space-y-4">
                  {selfCheck.map((question) => (
                    <li
                      key={question}
                      className="border-l-2 border-brand-accent/25 pl-5 text-[1rem] leading-[1.7] text-text-primary"
                    >
                      {question}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-[0.95rem] leading-[1.8] text-text-muted">
                  Nobody gets this perfect, including people who have played here for months. The
                  standard is that you are trying, and that when you slip you do not make it
                  somebody else&apos;s problem to clean up.
                </p>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
