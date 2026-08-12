import type { Metadata } from "next";
import Link from "next/link";

import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ButtonLink } from "@/components/ui/Button";
import { mereth } from "@/lib/mereth";
import { PATREON_URL } from "@/lib/site";
import { tiers } from "@/lib/world/patronage";

export const metadata: Metadata = {
  title: "Supporting Mereth",
  description:
    "What patronage pays for, the six tiers and what each grants, and the line we will not cross: support buys no advantage in play.",
};

/**
 * Patronage.
 *
 * The tiers are named after the skill tiers, so each is coloured with that
 * tier's own colour taken from the client. That is not decoration: it is the
 * same visual language the skills page uses, and it quietly makes the point
 * that these are ranks of support rather than ranks of power.
 *
 * The page leads with what support does not buy, because on a roleplay server
 * that is the question people actually have.
 */
export default function DonatePage() {
  const colourOf = new Map(mereth.tiers.map((tier) => [tier.name, tier.color]));

  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />

      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          The Realm
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          Supporting Mereth
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
          Mereth is free to play and always will be. Hosting a synchronised province with a mod list
          this size, plus voice, plus the development behind it, is not free, and patronage is what
          covers it.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href={PATREON_URL} variant="solid" size="md">
            Become a patron
          </ButtonLink>
          <ButtonLink href="/discord" size="md">
            Ask in Discord first
          </ButtonLink>
        </div>
      </header>

      <div className="relative mt-9 max-w-3xl border border-brand-accent/40 bg-black/35 px-6 py-5">
        <FrameCorners size={14} />
        <p className="relative text-[0.95rem] leading-relaxed text-text-light">
          <strong className="font-semibold text-text-primary">
            Patronage buys no advantage in play.
          </strong>{" "}
          Not a skill, not a memory point, not a tier, not a whitelisted role, and not a different
          answer in a ticket. Every benefit below is a character slot, a title or a Discord role.
          The moment any of it becomes power, the professions stop meaning anything.
        </p>
      </div>

      <OrnateDivider className="my-12" />

      <h2 className="font-display mb-3 text-xl tracking-heading text-brand-accent uppercase">
        The six tiers
      </h2>
      <p className="mb-9 max-w-[68ch] text-[0.98rem] leading-relaxed text-text-muted">
        Named for the skill tiers, and coloured with the colours the game uses for them.
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => {
          const colour = colourOf.get(tier.rank) ?? "var(--color-brand-accent)";
          const bullet = (
            <span
              aria-hidden="true"
              className="mt-[0.55em] h-1 w-1 shrink-0"
              style={{ background: colour }}
            />
          );

          return (
            <article
              key={tier.name}
              className="relative flex flex-col border bg-black/35 p-6"
              style={{ borderColor: `color-mix(in srgb, ${colour} 45%, transparent)` }}
            >
              <FrameCorners size={14} />

              <div className="relative flex items-baseline justify-between gap-3">
                <h3
                  className="font-display text-[1rem] tracking-heading uppercase"
                  style={{ color: colour }}
                >
                  {tier.name}
                </h3>
                <span className="font-display text-[0.72rem] tracking-[1.5px] text-text-muted uppercase">
                  {tier.rank}
                </span>
              </div>

              <p className="relative mt-3 font-display text-2xl tabular-nums text-text-primary">
                ${tier.usd}
                <span className="ml-1.5 text-[0.68rem] tracking-wide text-text-muted">/ month</span>
              </p>

              <ul className="relative mt-5 space-y-2 border-t border-border-subtle pt-4">
                <li className="flex gap-2.5 text-[0.88rem] leading-relaxed text-text-light">
                  {bullet}
                  <span>
                    {tier.slots} extra character {tier.slots === 1 ? "slot" : "slots"}
                  </span>
                </li>
                <li className="flex gap-2.5 text-[0.88rem] leading-relaxed text-text-light">
                  {bullet}
                  <span>
                    The title <span className="text-text-primary">{tier.title}</span>
                  </span>
                </li>
                <li className="flex gap-2.5 text-[0.88rem] leading-relaxed text-text-light">
                  {bullet}
                  <span>A Discord role, and Discord access</span>
                </li>
              </ul>
            </article>
          );
        })}
      </div>

      {/* The thing that made this hard to pin down: reading the rendered Patreon
          page gives you your own currency, not the tier's. The definitions are
          in dollars. */}
      <p className="mt-6 max-w-3xl text-[0.85rem] leading-relaxed text-text-muted">
        Tiers are priced in US dollars. Patreon converts to your own currency when you subscribe,
        so the figure on your statement will not usually match the figure here.
      </p>

      <section className="mt-16 grid max-w-4xl gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display mb-4 text-xl tracking-heading text-brand-accent uppercase">
            What a character slot is
          </h2>
          <p className="text-[0.95rem] leading-[1.8] text-text-light">
            Room for another character, not another life. Each one is still capped at eighteen
            memory points, still starts as a Stranger, and still has to be taught magic by somebody
            who already knows it. Rule PD.3 stands either way: you may never will items, gold or
            property from one of your characters to another.
          </p>
        </div>
        <div>
          <h2 className="font-display mb-4 text-xl tracking-heading text-brand-accent uppercase">
            Cancelling, and refunds
          </h2>
          <p className="text-[0.95rem] leading-[1.8] text-text-light">
            Patreon handles billing, so cancelling happens there and takes effect at the end of the
            period you have already paid for. Anything that needs a person is a{" "}
            <Link
              href="/discord"
              className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 hover:decoration-brand-glow"
            >
              Discord ticket
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
