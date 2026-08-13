import Link from "next/link";

import { QaList, type ResolvedAnswer } from "@/components/handbook/QaList";
import { Hero } from "@/components/home/Hero";
import { Misconceptions } from "@/components/home/Misconceptions";
import { Trailer } from "@/components/home/Trailer";
import { UnderConstruction } from "@/components/home/UnderConstruction";
import { OrnateLabelDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ButtonLink } from "@/components/ui/Button";
import { PlateCard, PlateImage } from "@/components/ui/Plate";
import { faqSections } from "@/lib/handbook/faq";
import { citations, counts, mereth } from "@/lib/mereth";
import { DISCORD_INVITE } from "@/lib/site";

/**
 * The home page, in the reference's rhythm.
 *
 * The reference's shape works and is followed deliberately: hero, then a grid
 * of framed pictures with the words underneath on the page rather than inside a
 * box, then updates, then questions, then one big invitation. Framing the
 * picture and not the paragraph is the whole trick, and it is what stops six
 * cards reading as six heavy panels.
 *
 * What is not borrowed is the substance. Every picture is from our own
 * province, and every figure is counted out of the plugins the launcher
 * installs.
 */

/** Six pictures, six things worth knowing. Ordered people first, systems after. */
const FEATURES = [
  {
    slug: "mead-hall",
    title: "It happens at a table",
    body: "Proximity voice with lip sync, a chat box, and no global out-of-character channel. To find something out, you go and ask somebody.",
    href: "/start",
  },
  {
    slug: "jarls-hall",
    title: "Holds hold themselves",
    body: "Nine holds, each with its own law and its own court, and every seat is held. Rank inside a hold is granted through the holdstone, and it can be taken back the same way.",
    href: "/holds",
  },
  {
    slug: "arriving",
    title: "Somebody has to make it",
    body: "Mining, smithing, farming, brewing, fishing, tailoring. A blacksmith is a job somebody does, and carry weight is a problem you craft your way out of.",
    href: "/crafting",
  },
  {
    slug: "old-ways",
    title: "Magic must be taught",
    body: "A master willing to teach you and a spellbook for the spell, or nothing. No self-teaching, and every hold sets its own law on casting.",
    href: "/magic",
  },
  {
    slug: "hold-guard",
    title: "Guards are players too",
    body: "There is no bounty meter and no NPC arresting you. The guard who stops you and the jarl who sentences you are both people, and the rulebook sets exactly what they may take off you.",
    href: "/rules",
  },
  {
    slug: "night-watch",
    title: "Some things you have to ask about",
    body: "This site explains the systems: skills, crafting, magic, the rules. It does not tell you how hard a bandit chief hits, what is at the bottom of a barrow, or who is running which gang. You find that out by playing, or by asking somebody who already has.",
    href: "/progression#foic",
  },
];

export default function HomePage() {
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

      <UnderConstruction />

      <section className="mx-auto max-w-5xl px-6 pt-20 md:px-8 md:pt-24">
        <Trailer />
      </section>

      <section className="mx-auto max-w-[84rem] px-6 pt-24 md:px-8 md:pt-28">
        <div className="text-center">
          <h2 className="font-display text-2xl tracking-heading text-brand-accent text-shadow-page-heading md:text-4xl">
            What this place is
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-relaxed text-text-muted">
            Six things that shape how a character actually lives here. All of it is on the live
            server now, not planned.
          </p>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <PlateCard
              key={feature.slug}
              slug={feature.slug}
              title={feature.title}
              body={feature.body}
              href={feature.href}
              aspect="h-[310px]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index < 3}
            />
          ))}
        </div>
      </section>

      <Misconceptions />

      <section className="mx-auto max-w-[84rem] px-6 pt-24 md:px-8 md:pt-28">
        <OrnateLabelDivider>Latest from Mereth</OrnateLabelDivider>
        <p className="mx-auto mt-5 max-w-xl text-center text-[0.95rem] leading-relaxed text-text-muted">
          We ship almost daily. These are the release notes, dated, in the words they shipped with.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {latest.map((release) => (
            <article
              key={release.version}
              className="relative border border-brand-accent/25 bg-black/35 p-6"
            >
              <FrameCorners size={14} />
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
            href="/changelog"
            className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
          >
            All {counts.releases} releases since launch
          </Link>
          <span className="mx-3 text-text-muted/50">&middot;</span>
          <Link
            href="/roadmap"
            className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
          >
            What is being built next
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-[84rem] px-6 pt-24 md:px-8 md:pt-28">
        <OrnateLabelDivider>Frequently asked</OrnateLabelDivider>
        <p className="mx-auto mt-5 max-w-xl text-center text-[0.95rem] leading-relaxed text-text-muted">
          Everything worth knowing before you begin. Clear, simple, and kept up to date.
        </p>
        <div className="mx-auto mt-12 max-w-3xl">
          <QaList items={questions} openFirst />
          <p className="mt-8 text-center text-[0.9rem] text-text-muted">
            <Link
              href="/faq"
              className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
            >
              All {faqSections.reduce((total, s) => total + s.items.length, 0)} questions
            </Link>
          </p>
        </div>
      </section>

      {/* The reference closes on one big framed invitation. So does this. */}
      <section className="mx-auto max-w-[84rem] px-6 pt-24 pb-4 md:px-8 md:pt-28">
        <div className="relative text-brand-accent">
          <FrameCorners size={30} />
          <div className="relative overflow-hidden border border-brand-accent/60">
            <PlateImage
              slug="longfire"
              aspect="aspect-[16/7] md:aspect-[3/1]"
              sizes="100vw"
              className="[&>span]:hidden"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, #0b1013cc 0%, #0b1013ed 100%)" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <h2 className="font-display text-xl tracking-heading text-brand-accent text-shadow-page-heading md:text-3xl">
                Bring a character who wants something
              </h2>
              <p className="mx-auto mt-4 hidden max-w-lg text-[0.95rem] leading-relaxed text-text-light text-shadow-subtle sm:block">
                Six steps from here to standing in Skyrim with a plan. Two of them happen before you
                launch the game.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <ButtonLink href="/start" variant="solid" size="md">
                  Start here
                </ButtonLink>
                <ButtonLink href={DISCORD_INVITE} size="md">
                  Join the Discord
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
