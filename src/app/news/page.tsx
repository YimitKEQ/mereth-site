import type { Metadata } from "next";

import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { counts, mereth } from "@/lib/mereth";

export const metadata: Metadata = {
  title: "Chronicle",
  description:
    "What Mereth has actually shipped, taken from their own dated release notes and grouped by the system each change touched.",
};

/**
 * The chronicle is Mereth's real release history, not written announcements.
 *
 * Written announcements go on Discord, where people actually read them. What
 * belongs here is the record: dated release notes, in the words they shipped
 * with, so a player can find out exactly when something changed under them.
 */
export default function ChroniclePage() {
  const active = mereth.systems.slice(0, 8);

  return (
    <div className="mx-auto max-w-[70rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />

      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          The Realm
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          Chronicle
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
          What has actually shipped, taken from our release notes and dated. Announcements go out
          on Discord; this page is the record, so you can find exactly when something changed
          under you.
        </p>
      </header>

      <OrnateDivider className="my-12" />

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
        <div className="min-w-0 max-w-3xl space-y-12">
          {mereth.releases.map((release) => (
            <article key={release.version}>
              <h2 className="flex items-baseline gap-4">
                <span className="font-display text-xl tracking-heading text-brand-accent">
                  {release.version}
                </span>
                {release.date !== null ? (
                  <span className="text-[0.85rem] tabular-nums text-text-muted">{release.date}</span>
                ) : null}
              </h2>
              <ul className="mt-4 space-y-2 border-l border-brand-accent/20 pl-5">
                {release.notes.map((note, i) => (
                  <li key={i} className="text-[0.92rem] leading-relaxed text-text-light">
                    {note.text}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <aside className="lg:sticky lg:top-[140px] lg:self-start">
          <div className="relative border border-brand-accent/35 bg-black/35 p-6">
            <FrameCorners weight="thin" size={16} />
            <p className="font-display relative text-[11px] tracking-[2px] text-text-muted uppercase">
              Where the effort goes
            </p>
            <p className="relative mt-3 text-[0.82rem] leading-relaxed text-text-muted">
              Release notes clustered by the system each one touches, across all{" "}
              {counts.releases} releases since launch.
            </p>
            <ul className="relative mt-5 space-y-2.5">
              {active.map((system) => {
                const share = Math.round((system.count / (active[0]?.count ?? 1)) * 100);
                return (
                  <li key={system.name}>
                    <span className="flex items-baseline justify-between gap-3 text-[0.85rem]">
                      <span className="text-text-primary">{system.name}</span>
                      <span className="tabular-nums text-text-muted">{system.count}</span>
                    </span>
                    <span className="mt-1 block h-0.5 w-full bg-white/10">
                      <span
                        className="block h-full bg-brand-accent/70"
                        style={{ width: `${share}%` }}
                      />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
