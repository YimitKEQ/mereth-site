import Link from "next/link";

import { QaList, type ResolvedAnswer } from "@/components/handbook/QaList";
import { CodexGrid } from "@/components/home/CodexGrid";
import { Hero } from "@/components/home/Hero";
import { Misconceptions } from "@/components/home/Misconceptions";
import { OrnateLabelDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ButtonLink } from "@/components/ui/Button";
import { faqSections } from "@/lib/handbook/faq";
import { citations, counts, mereth } from "@/lib/mereth";

/**
 * The home page's job is to get a reader into the handbook, so it is built as
 * a sequence of increasingly specific invitations: the promise, the three rules
 * that make people search in the first place, the doors into the codex, real
 * questions with real answers, and what the server shipped this week.
 *
 * No feature grid of stock adjectives, and no placeholder art. Everything on
 * this page is either a link into real content or a figure counted out of the
 * plugins the launcher installs.
 */
export default function HomePage() {
  // The questions people actually ask before they have an account.
  const opening = faqSections.find((section) => section.id === "first");
  const questions: ResolvedAnswer[] = (opening?.items ?? []).map((item) => ({
    q: item.q,
    a: item.a,
    open: item.open,
    quote: item.quote,
    notes: item.cite === undefined ? undefined : citations(item.cite, 2),
  }));

  const latest = mereth.releases.slice(0, 3);

  return (
    <>
      <Hero />

      <Misconceptions />

      <section className="mx-auto max-w-site px-6 pt-24 md:px-8 md:pt-32">
        <OrnateLabelDivider>The codex</OrnateLabelDivider>
        <p className="mx-auto mt-6 max-w-2xl text-center text-[0.95rem] leading-relaxed text-text-muted">
          Generated from the plugins and the client our launcher installs, so it matches the
          server rather than a wiki someone updated once. Press{" "}
          <kbd className="rounded-sm border border-brand-accent/30 px-1.5 py-0.5 font-mono text-[0.8em] text-text-light">
            Ctrl K
          </kbd>{" "}
          anywhere to search all of it at once.
        </p>
        <div className="mt-12">
          <CodexGrid />
        </div>
      </section>

      <section className="mx-auto max-w-site px-6 pt-24 md:px-8 md:pt-32">
        <OrnateLabelDivider>Before you apply</OrnateLabelDivider>
        <div className="mx-auto mt-12 max-w-3xl">
          <QaList items={questions} openFirst />
          <p className="mt-8 text-center text-[0.9rem] text-text-muted">
            There are a lot more.{" "}
            <Link
              href="/faq"
              className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
            >
              All {faqSections.reduce((total, section) => total + section.items.length, 0)} of them
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-site px-6 pt-24 md:px-8 md:pt-32">
        <OrnateLabelDivider>What shipped lately</OrnateLabelDivider>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {latest.map((release) => (
            <article key={release.version} className="relative border border-brand-accent/25 bg-black/30 p-6">
              <FrameCorners weight="thin" size={16} />
              <h3 className="relative flex items-baseline gap-3">
                <span className="font-display text-[1.05rem] tracking-heading text-brand-accent">
                  {release.version}
                </span>
                {release.date !== null ? (
                  <span className="text-[0.78rem] tabular-nums text-text-muted">{release.date}</span>
                ) : null}
              </h3>
              <ul className="relative mt-4 space-y-2">
                {release.notes.slice(0, 5).map((note, i) => (
                  <li key={i} className="text-[0.85rem] leading-relaxed text-text-muted">
                    {note.text}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-[0.9rem] text-text-muted">
          <Link
            href="/records"
            className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
          >
            All {counts.releases} releases since launch
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-site px-6 pt-24 pb-8 text-center md:px-8 md:pt-32">
        <h2 className="font-display text-2xl tracking-heading text-brand-accent text-shadow-page-heading md:text-[var(--text-section-heading)]">
          Bring a character who wants something
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[0.98rem] leading-relaxed text-text-muted">
          Six steps from here to standing in Skyrim with a plan. Two of them happen before you
          launch the game.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/start" variant="solid" size="lg">
            Start here
          </ButtonLink>
          <ButtonLink href="/discord" size="lg">
            Join the Discord
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
