import Link from "next/link";

import { OrnateLabelDivider } from "@/components/ornament/Divider";
import { inline } from "@/lib/markup";

/**
 * The hook.
 *
 * Three rules that read as bugs until somebody explains them, and all three
 * cost a new player an evening. Leading the home page with them is the fastest
 * possible proof that this site is worth reading: a visitor who has already hit
 * one of these recognises it immediately, and a visitor who has not just
 * learned something before they installed anything.
 */
const misconceptions = [
  {
    heading: "Your sword swings like the plan you built",
    body: `**Weapon skill sits inside the damage formula**, and the specialisations exist to carry
      it. A build that spread its points thinly fights like one. Magic states the hard version of
      the same rule outright: without Spellcasting on your plan, spells have no combat effect.`,
    href: "/faq#combat",
    link: "Why it is a rule and not a penalty",
  },
  {
    heading: "Your skills are caps, and you buy them once",
    body: `Tiers are not levels you grind toward. **Eighteen memory points**, spent at character
      creation, set the ceiling each skill can ever reach. Novice costs 1 and Master costs 8, so
      one Master eats nearly half your character. Taking a point back later burns the experience
      you earned in the tier you dropped out of.`,
    href: "/skills",
    link: "Spend the eighteen on the planner",
  },
  {
    heading: "Nobody can teach themselves magic",
    body: `A Master willing to teach you **and** a spellbook for the specific spell, or nothing.
      New players never start with magic, the College runs on semesters, and every hold sets its
      own law about what is legal to cast there.`,
    href: "/magic",
    link: "How the pipeline actually works",
  },
];

export function Misconceptions() {
  return (
    <section className="mx-auto max-w-site px-6 pt-24 md:px-8 md:pt-32">
      <OrnateLabelDivider>Three things that cost people an evening</OrnateLabelDivider>

      <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {misconceptions.map((item, index) => (
          <article key={item.heading} className="flex flex-col">
            <span
              aria-hidden="true"
              className="font-display text-3xl leading-none text-brand-accent/30"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display mt-4 text-lg leading-tight tracking-heading text-text-primary uppercase">
              {item.heading}
            </h3>
            <p className="mt-4 flex-1 text-[0.95rem] leading-[1.8] text-text-muted">
              {inline(item.body)}
            </p>
            <Link
              href={item.href}
              className="mt-5 text-[0.85rem] text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
            >
              {item.link} <span aria-hidden="true">&rarr;</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
