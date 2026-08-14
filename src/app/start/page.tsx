import type { Metadata } from "next";
import Link from "next/link";

import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ButtonLink } from "@/components/ui/Button";
import { pageMeta } from "@/lib/seo";
import { steps } from "@/lib/handbook/start";
import { inline } from "@/lib/markup";
import { counts } from "@/lib/mereth";
import { LauncherDownload } from "@/components/ui/LauncherDownload";

export const metadata: Metadata = pageMeta({
  path: "/start",
  title: "Start Here",
  description:
    "The path from hearing about Mereth to standing in Skyrim with a plan: install, character, memory points, keys, and your first evening.",
});

/**
 * The single most important page on the site.
 *
 * Six steps, in the order things actually block people, with the pitfall at
 * each step called out rather than buried. Numbered large on the left, because
 * a reader arriving here wants to know how many steps there are before they
 * start reading any of them.
 */
export default function StartPage() {
  return (
    <div className="mx-auto max-w-[70rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />
      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          The Handbook
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          Start Here
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
          Six steps from hearing about Mereth to standing in Skyrim with a character worth playing.
          Two of them happen before you launch the game, and the fourth is the one that lasts:
          eighteen memory points, spent once.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/skills" variant="solid" size="md">
            Plan a character
          </ButtonLink>
          <ButtonLink href="/faq" size="md">
            Jump to the questions
          </ButtonLink>
        </div>
      </header>

      <LauncherDownload className="mt-10 max-w-3xl" />

      <OrnateDivider className="my-12" />

      <ol className="max-w-3xl space-y-14">
        {steps.map((step, index) => (
          <li key={step.title} className="grid gap-6 md:grid-cols-[4rem_minmax(0,1fr)]">
            <span
              aria-hidden="true"
              className="font-display text-4xl leading-none text-brand-accent/35 md:text-5xl"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0">
              <h2 className="font-display text-xl tracking-heading text-brand-accent uppercase md:text-2xl">
                {step.title}
              </h2>
              <p className="mt-2 text-[1rem] leading-relaxed text-text-primary">
                {inline(step.summary)}
              </p>

              <div className="mt-5 space-y-4">
                {step.body.map((paragraph, i) => (
                  <p key={i} className="text-[0.98rem] leading-[1.85] text-text-light">
                    {inline(paragraph)}
                  </p>
                ))}
              </div>

              {step.pitfall !== undefined ? (
                <div className="relative mt-6 border border-[#a8503c]/55 bg-black/35 px-5 py-4">
                  <FrameCorners weight="thin" size={14} />
                  <p className="font-display relative mb-1.5 text-[10px] tracking-[2px] text-[#d08a76] uppercase">
                    Where people go wrong
                  </p>
                  <p className="relative text-[0.92rem] leading-relaxed text-text-light">
                    {inline(step.pitfall)}
                  </p>
                </div>
              ) : null}

              {step.link !== undefined ? (
                <Link
                  href={step.link.href}
                  className="mt-5 inline-flex items-center gap-2 text-[0.9rem] text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
                >
                  {step.link.label}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <OrnateDivider className="my-16 max-w-3xl" />

      <div className="max-w-3xl">
        <h2 className="font-display text-xl tracking-heading text-brand-accent uppercase md:text-2xl">
          Then keep this open
        </h2>
        <p className="mt-4 text-[0.98rem] leading-[1.85] text-text-light">
          The reference pages are generated from the plugins and the client our launcher installs:
          {" "}{counts.skills} skills with the in-game text for every tier,{" "}
          {counts.spells.toLocaleString("en-GB")} spells with their tiers, and{" "}
          {counts.ingredients} alchemy ingredients. Press{" "}
          <kbd className="rounded-sm border border-brand-accent/30 px-1.5 py-0.5 font-mono text-[0.8em] text-text-light">
            Ctrl K
          </kbd>{" "}
          anywhere to search all of it.
        </p>
        <div className="mt-7 flex flex-wrap gap-4">
          <ButtonLink href="/guide" size="md">
            The Guide
          </ButtonLink>
          <ButtonLink href="/tips" size="md">
            Tips
          </ButtonLink>
          <ButtonLink href="/progression" size="md">
            Progression
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
