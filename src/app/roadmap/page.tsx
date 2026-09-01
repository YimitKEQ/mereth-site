import type { Metadata } from "next";
import Link from "next/link";

import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { pageMeta } from "@/lib/seo";
import { counts } from "@/lib/mereth";
import { roadmap, type Stage } from "@/lib/world/roadmap";

export const metadata: Metadata = pageMeta({
  path: "/roadmap",
  title: "Roadmap",
  description:
    "What is finished, what is being built now, what is committed to, and what is wanted but not scheduled.",
});

const ACCENT: Record<Stage, string> = {
  done: "#7fc99a",
  building: "#e0b45c",
  planned: "#9fb8c4",
  later: "#8a7fa8",
};

/**
 * The roadmap.
 *
 * Four columns rather than a timeline, because a timeline implies dates and
 * these have none. The honest promise is an ordering, not a calendar, and the
 * page says so instead of drawing a gantt chart nobody can keep.
 */
export default function RoadmapPage() {
  const total = roadmap.reduce((sum, stage) => sum + stage.items.length, 0);
  const done = roadmap.find((s) => s.id === "done")?.items.length ?? 0;

  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />

      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          The Realm
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          Roadmap
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
          What is finished, what is being built now, what is committed to, and what is wanted but
          not scheduled. There are no dates on this page on purpose: the honest promise is an
          ordering, and a date we miss is worth less than an order you can rely on.
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {[
            { label: "Tracked", value: String(total) },
            { label: "Shipped", value: String(done) },
            { label: "Patches so far", value: String(counts.releases) },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="font-display text-[10px] tracking-[2px] text-text-muted uppercase">
                {stat.label}
              </dt>
              <dd className="font-display mt-1 text-2xl tabular-nums text-brand-accent">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <OrnateDivider className="my-12" />

      {/* `items-start`, so each column is as tall as its own contents. The
          stages are wildly uneven (twenty three shipped against one wanted) and
          a stretched grid turns the short column into a mostly empty rectangle,
          which reads as a panel that failed to load rather than as a short
          list. */}
      <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-4">
        {roadmap.map((stage) => (
          <section key={stage.id} className="relative border border-brand-accent/25 bg-black/30 p-6">
            <FrameCorners weight="thin" size={16} />
            <h2
              className="font-display relative text-[1rem] tracking-heading uppercase"
              style={{ color: ACCENT[stage.id] }}
            >
              {stage.title}
            </h2>
            <p className="relative mt-2 text-[0.82rem] leading-relaxed text-text-muted">
              {stage.blurb}
            </p>
            <p className="relative mt-1 font-display text-[0.75rem] tabular-nums text-text-muted">
              {stage.items.length} item{stage.items.length === 1 ? "" : "s"}
            </p>

            <ul className="relative mt-5 space-y-2.5">
              {stage.items.map((item) => (
                <li
                  key={item.text}
                  className="relative pl-4 text-[0.88rem] leading-[1.7] text-text-light"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-[0.65em] left-0 h-1 w-1"
                    style={{ background: ACCENT[stage.id] }}
                  />
                  {/* A named initiative leads with its name, because that is what
                      it gets called in Discord and a reader has to be able to
                      join the two up. Unnamed items stay a plain sentence. */}
                  {item.name === undefined ? null : (
                    <span className="text-text-primary">{item.name}. </span>
                  )}
                  {item.text}
                  {/* Evidence, for anything the release notes moved here. */}
                  {item.shipped === undefined ? null : (
                    <span className="ml-2 inline-block align-baseline text-[0.72rem] tabular-nums whitespace-nowrap text-text-muted/80">
                      {item.shipped.version} &middot; {item.shipped.date}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-12 max-w-3xl text-[0.9rem] leading-relaxed text-text-muted">
        This is the plan.{" "}
        <Link
          href="/changelog"
          className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow"
        >
          The chronicle
        </Link>{" "}
        is the record of what actually shipped, taken from dated release notes. When the two
        disagree, the release notes are what happened and this page is what needs updating.
      </p>
    </div>
  );
}
