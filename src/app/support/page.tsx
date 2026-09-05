import type { Metadata } from "next";
import Link from "next/link";

import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ClientMessages } from "@/components/handbook/ClientMessages";
import { ButtonLink } from "@/components/ui/Button";
import { connectionMessages } from "@/lib/handbook/client-messages";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/support",
  title: "Getting help",
  description:
    "Where to take a problem with Mereth, which failures you can fix yourself, and what the client's own error messages mean.",
});

/**
 * Routing, not a form.
 *
 * A form here would be a second inbox nobody watches, and tickets already live
 * in Discord where staff and clips are. So this page routes instead: the fast
 * answer for the self-inflicted failures, and a ticket for everything else.
 */
const routes = [
  {
    problem: "It will not connect",
    answer:
      "Almost always your mod list, and the client says which of four causes it is. Read the exact wording before changing anything, then reinstall through the launcher.",
    href: "/faq#connect",
    label: "The six connection failures",
  },
  {
    problem: "My lockpick does nothing",
    answer:
      "The skill is not locked into your plan. Lockpicking and pickpocketing refuse outright until assigned, which reads exactly like a bug and is not one.",
    href: "/faq#skills",
    label: "How memory points work",
  },
  {
    problem: "My weapon barely does anything",
    answer:
      "Almost always the plan rather than the weapon. Combat skills feed the damage formula, so a weapon whose specialisation is not on your plan performs like nobody trained on it.",
    href: "/faq#combat",
    label: "Why that is a rule",
  },
  {
    problem: "My chest emptied itself",
    answer:
      "Ordinary containers regenerate their contents. Only a container bound to a parcel through the holdstone keeps what you put in it.",
    href: "/world#holds",
    label: "Parcels and property",
  },
  {
    problem: "A rule question, or a dispute with another player",
    answer:
      "Staff, through a Discord ticket. Mereth adjudicates conduct and consequences by hand, and nothing in the game records an accusation for you.",
    href: "/discord",
    label: "Open a ticket",
  },
  {
    problem: "A bug, or something genuinely broken",
    answer:
      "Discord. They ship near-daily and triage quickly, and a report with your exact error text is worth ten without it.",
    href: "/discord",
    label: "Report it",
  },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-[70rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />

      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          Help
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          Getting help
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
          Most problems have a published answer, and the ones that do not need a ticket. This page
          sorts them: what you can fix in a minute, and what staff need to see.
        </p>
      </header>

      <OrnateDivider className="my-12" />

      <div className="grid max-w-4xl gap-4 md:grid-cols-2">
        {routes.map((route) => (
          <article
            key={route.problem}
            className="relative flex flex-col border border-brand-accent/30 bg-black/30 p-6"
          >
            <FrameCorners weight="thin" size={16} />
            <h2 className="font-display relative text-[1rem] tracking-heading text-brand-accent uppercase">
              {route.problem}
            </h2>
            <p className="relative mt-3 flex-1 text-[0.9rem] leading-relaxed text-text-muted">
              {route.answer}
            </p>
            <Link
              href={route.href}
              className="relative mt-4 text-[0.85rem] text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
            >
              {route.label} <span aria-hidden="true">&rarr;</span>
            </Link>
          </article>
        ))}
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-xl tracking-heading text-brand-accent uppercase">
          Read the error, not the forum
        </h2>
        <p className="mt-4 text-[0.98rem] leading-[1.85] text-text-light">
          Mereth&apos;s client distinguishes an unusual number of separate failures, which means the
          exact wording on your screen tells you what to do. Find yours below.
        </p>

        {/* The same explanations the guide renders, from the same file. This
            page used to print the raw strings through a slightly different
            filter, so the two disagreed about which errors existed and neither
            said what to do about any of them. */}
        <ClientMessages messages={connectionMessages} />

        <div className="mt-9 flex flex-wrap gap-4">
          <ButtonLink href="/guide#stuck" variant="solid" size="md">
            The full install guide
          </ButtonLink>
          <ButtonLink href="/discord" size="md">
            Open a ticket
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
