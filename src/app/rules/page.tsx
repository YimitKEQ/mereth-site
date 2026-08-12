import type { Metadata } from "next";

import { Chapters } from "@/components/handbook/Chapters";
import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ButtonLink } from "@/components/ui/Button";
import { inline } from "@/lib/markup";
import { jarlPath, ruleSections } from "@/lib/world/rules";
import { RULES_DOC_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rules",
  description:
    "Mereth's rules and regulations: character expectations, serious roleplay, initiation, robbery limits, perma-kills, and the Jarl whitelist.",
};

/**
 * The rulebook as a readable index, with the codes kept.
 *
 * Staff and players cite rules by code in tickets, so a rule you cannot cite is
 * a rule nobody can appeal. The document remains the authority and the page says
 * so at the top rather than in a footnote.
 */
export default function RulesPage() {
  const contents = ruleSections.map((section) => ({ id: section.id, title: section.title }));
  const severe = ruleSections.flatMap((s) => s.rules).filter((r) => r.severe === true).length;

  return (
    <div className="mx-auto max-w-[76rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />

      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          The Realm
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          Rules and Regulations
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
          Mereth is an 18+ serious roleplay community. Rule codes are kept exactly as they appear in
          the rulebook, because staff and players cite them in tickets and a rule you cannot cite is
          a rule nobody can appeal.
        </p>
        <div className="mt-7 flex flex-wrap gap-4">
          <ButtonLink href={RULES_DOC_URL} variant="solid" size="md">
            The full rulebook
          </ButtonLink>
          <ButtonLink href="/discord" size="md">
            Open a ticket
          </ButtonLink>
        </div>
      </header>

      <div className="relative mt-9 max-w-3xl border border-brand-accent/40 bg-black/35 px-6 py-5">
        <FrameCorners weight="thin" size={16} />
        <p className="relative text-[0.95rem] leading-relaxed text-text-light">
          <strong className="font-semibold text-text-primary">
            The document is the authority.
          </strong>{" "}
          This page is a readable index of it and is kept in step, but where the two ever differ the
          rulebook wins. Staff may change any rule at any time.{" "}
          <span className="text-[#d08a76]">{severe} rules on this page end a character or an account.</span>
        </p>
      </div>

      <OrnateDivider className="my-12" />

      <Chapters
        chapters={[
          ...ruleSections.map((section) => ({
            id: section.id,
            title: section.title,
            content: (
              <>
                {section.blurb === undefined ? null : (
                  <p className="mb-6 text-[0.98rem] leading-[1.8] text-text-muted">
                    {section.blurb}
                  </p>
                )}
                <ul className="space-y-3">
                  {section.rules.map((rule) => (
                    <li
                      key={rule.code}
                      className={`grid grid-cols-[4.25rem_minmax(0,1fr)] gap-4 border-l-2 py-2 pl-4 ${
                        rule.severe === true ? "border-[#a8503c]/70" : "border-brand-accent/25"
                      }`}
                    >
                      <span
                        className={`font-mono text-[0.78rem] ${
                          rule.severe === true ? "text-[#d08a76]" : "text-brand-accent/80"
                        }`}
                      >
                        {rule.code}
                        {/* The red border was the only marker, so the severity
                            vanished in greyscale and was silent to a screen
                            reader. This says it in words. */}
                        {rule.severe === true ? (
                          <span className="sr-only"> (ends a character or an account)</span>
                        ) : null}
                      </span>
                      <span className="text-[0.95rem] leading-[1.75] text-text-light">
                        {rule.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ),
          })),
          {
            id: "jarl",
            title: "Becoming a Jarl",
            content: (
              <>
                <p className="mb-6 text-[0.98rem] leading-[1.8] text-text-muted">
              The most demanding position on the server, and a whitelist rather than a rule. The
              application is posted in Discord.
            </p>

            <div className="relative mb-8 border border-brand-accent/40 bg-black/35 px-6 py-5">
              <FrameCorners weight="thin" size={16} />
              <p className="font-display relative mb-3 text-[10px] tracking-[2px] text-brand-accent uppercase">
                What the whitelist asks for
              </p>
              <ul className="relative space-y-2">
                {jarlPath.requirements.map((item) => (
                  <li
                    key={item}
                    className="relative pl-5 text-[0.95rem] leading-relaxed text-text-light before:absolute before:top-[0.7em] before:left-0 before:h-1 before:w-1 before:bg-brand-accent"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="relative mt-4 text-[0.9rem] leading-relaxed text-text-muted">
                The role demands depth, dedication, and a voice you can actually hold a court with.
              </p>
            </div>

            <div className="space-y-7">
              {jarlPath.facts.map((fact) => (
                <div key={fact.q}>
                  <h3 className="text-[1rem] text-text-primary">{fact.q}</h3>
                  <p className="mt-2 text-[0.95rem] leading-[1.8] text-text-light">
                    {inline(fact.a)}
                  </p>
                </div>
              ))}
            </div>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
