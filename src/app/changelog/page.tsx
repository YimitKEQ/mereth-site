import type { Metadata } from "next";
import Link from "next/link";

import { ChangelogBrowser } from "@/components/codex/ChangelogBrowser";
import { LatestRelease } from "@/components/codex/LatestRelease";
import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { pageMeta } from "@/lib/seo";
import { counts, mereth } from "@/lib/mereth";

export const metadata: Metadata = pageMeta({
  path: "/changelog",
  title: "Changelog",
  description:
    "Every patch note, searchable and filterable by kind. What was added, fixed, changed and removed, with the version and date it happened.",
});

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
        {/* The release count deliberately lives in one place, the row of facts below,
            because that row corrects itself against what has been published since this
            page was built. Repeating the figure in the prose meant the two disagreed by
            however many patches had shipped that day. */}
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
          Every patch note, in the wording it shipped with. More than one a day since{" "}
          {mereth.server.firstRelease}, so this page is searchable rather than something to
          scroll.
        </p>

        <LatestRelease releases={mereth.releases} bakedCount={counts.releases} />
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

      {/* No count here either. The window reaches back to a fixed release, which does not
          move, while the number of releases inside it grows every time one is published. */}
      <p className="mt-12 max-w-3xl text-[0.85rem] leading-relaxed text-text-muted">
        This page reaches back to {shownFrom?.version} on {shownFrom?.date}, and picks up
        anything published since it was built. The full history from{" "}
        {mereth.server.firstRelease} onward is in the launcher.
      </p>
    </div>
  );
}
