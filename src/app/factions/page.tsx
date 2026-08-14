import type { Metadata } from "next";
import Link from "next/link";

import { CodexHeader } from "@/components/codex/CodexHeader";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { pageMeta } from "@/lib/seo";
import { inline } from "@/lib/markup";
import { factions, orgCaps, orgLimits } from "@/lib/world/factions";
import { PlateFigure } from "@/components/ui/Plate";

export const metadata: Metadata = pageMeta({
  path: "/factions",
  title: "Factions",
  description:
    "The lore factions, what each one is right now, what joining actually offers, and the rules every organisation plays by.",
});

/**
 * Factions, and the organisation rules.
 *
 * The lore is the pitch and the caps are the constraint, so they belong on one
 * page. A player deciding where to belong needs both: what a faction is for,
 * and the fact that they may only be in one at a time.
 */
export default function FactionsPage() {
  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <CodexHeader
        title="Factions"
        lede={`Three lore factions have a published standing in 4E 185, and none of them is the
          version you remember from the games. **You may belong to one organisation at a time**, and
          that is one per player, not one per character.`}
        facts={[
          { label: "Lore factions", value: String(factions.length) },
          { label: "Member cap", value: "25" },
          { label: "Businesses each", value: "2" },
          { label: "Headquarters each", value: "1" },
        ]}
      />

      {/* Groups of players with a shared purpose, which is what this page is
          about. The Legion, a muster and a dungeon patrol used to sit here and
          none of them is one of the three orders below. */}
      <div className="mb-12 grid gap-5 md:grid-cols-2">
        <PlateFigure slug="under-arms" sizes="(max-width: 768px) 100vw, 50vw" />
        <PlateFigure slug="the-terrace" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>

      <div className="space-y-6">
        {factions.map((faction) => (
          <article key={faction.name} className="relative border border-brand-accent/30 bg-black/30 p-7">
            <FrameCorners weight="thin" size={18} />

            <div className="relative flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-display text-xl tracking-heading text-brand-accent uppercase">
                {faction.name}
              </h2>
              <span className="text-[0.8rem] text-text-muted">
                up to {faction.cap} members
              </span>
            </div>

            <p className="relative mt-3 text-[1rem] leading-relaxed text-text-primary">
              {faction.standing}
            </p>

            <div className="relative mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
              <div className="space-y-3.5">
                {faction.lore.map((paragraph, i) => (
                  <p key={i} className="text-[0.92rem] leading-[1.8] text-text-light">
                    {inline(paragraph)}
                  </p>
                ))}
              </div>

              <div>
                <h3 className="font-display mb-3 text-[10px] tracking-[2px] text-brand-accent uppercase">
                  What joining offers
                </h3>
                <ul className="space-y-2.5">
                  {faction.play.map((item, i) => (
                    <li
                      key={i}
                      className="relative pl-4 text-[0.88rem] leading-[1.75] text-text-muted before:absolute before:top-[0.7em] before:left-0 before:h-1 before:w-1 before:bg-brand-accent"
                    >
                      {inline(item)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div>
          <h2 className="font-display mb-5 text-xl tracking-heading text-brand-accent uppercase">
            How big an organisation may be
          </h2>
          <p className="mb-6 text-[0.95rem] leading-relaxed text-text-muted">
            Caps exist so that no single group can absorb the server. They are reviewed as it grows.
          </p>
          <table className="w-full border-collapse text-left text-sm">
            <tbody>
              {orgCaps.map((row) => (
                <tr key={row.kind} className="border-b border-border-subtle last:border-0">
                  <td className="py-3 pr-6 text-text-light">{row.kind}</td>
                  <td className="w-16 py-3 text-right tabular-nums text-brand-accent">{row.cap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="font-display mb-5 text-xl tracking-heading text-brand-accent uppercase">
            What an organisation may hold
          </h2>
          <ul className="space-y-3">
            {orgLimits.map((item, i) => (
              <li
                key={i}
                className="relative pl-5 text-[0.95rem] leading-[1.8] text-text-light before:absolute before:top-[0.75em] before:left-0 before:h-1 before:w-1 before:bg-brand-accent"
              >
                {inline(item)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-display mb-4 text-xl tracking-heading text-brand-accent uppercase">
          The Dark Brotherhood
        </h2>
        <p className="text-[0.98rem] leading-[1.85] text-text-light">
          Whitelisted, and deliberately not listed above as something to join. A Brotherhood
          contract is the only sanctioned way for one player to permanently kill another
          player&apos;s character without their consent, which makes it a rules topic rather than a
          recruitment pitch. Every contract needs staff approval, in-character justification with
          clips, and it can be refused.{" "}
          <Link
            href="/rules#brotherhood"
            className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
          >
            The contract rules in full
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
