import type { Metadata } from "next";
import Link from "next/link";

import { ChangelogBrowser } from "@/components/codex/ChangelogBrowser";
import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { counts, mereth } from "@/lib/mereth";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every patch note, searchable and filterable by kind. What was added, fixed, changed and removed, with the version and date it happened.",
};

/**
 * The changelog.
 *
 * Distinct from the roadmap on purpose: the roadmap is what we intend, this is
 * what happened. When the two disagree, this page is right.
 *
 * The notes are ours, in the wording they shipped with. They are not rewritten
 * for the website, because a player matching a bug they hit against the note
 * that fixed it needs the wording the note actually used.
 */
export default function ChangelogPage() {
  const latest = mereth.releases[0];
  const shownFrom = mereth.releases[mereth.releases.length - 1];

  return (
    <div className="mx-auto max-w-[76rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />

      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          The Realm
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          Changelog
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
          Every patch note, in the wording it shipped with. We have put out{" "}
          {counts.releases} releases since {mereth.server.firstRelease}, which works out at more
          than one a day, so this page is searchable rather than something to scroll.
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {[
            { label: "Latest", value: latest?.version ?? "?" },
            { label: "Shipped", value: latest?.date ?? "?" },
            { label: "Releases", value: String(counts.releases) },
          ].map((fact) => (
            <div key={fact.label}>
              <dt className="font-display text-[10px] tracking-[2px] text-text-muted uppercase">
                {fact.label}
              </dt>
              <dd className="font-display mt-1 text-2xl tabular-nums text-brand-accent">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="relative mt-9 max-w-3xl border border-brand-accent/40 bg-black/35 px-6 py-5">
        <FrameCorners size={14} />
        <p className="relative text-[0.95rem] leading-relaxed text-text-light">
          <strong className="font-semibold text-text-primary">This is what happened.</strong>{" "}
          <Link
            href="/roadmap"
            className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 hover:decoration-brand-glow"
          >
            The roadmap
          </Link>{" "}
          is what we intend. Where the two disagree, this page is right and the roadmap is what
          needs updating.
        </p>
      </div>

      <OrnateDivider className="my-12" />

      <ChangelogBrowser releases={mereth.releases} />

      <p className="mt-12 max-w-3xl text-[0.85rem] leading-relaxed text-text-muted">
        Showing the most recent {mereth.releases.length} releases, back to{" "}
        {shownFrom?.version} on {shownFrom?.date}. The full history from{" "}
        {mereth.server.firstRelease} onward is in the launcher.
      </p>
    </div>
  );
}
