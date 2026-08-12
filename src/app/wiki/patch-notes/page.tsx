import type { Metadata } from "next";
import Link from "next/link";

import { PageHeading } from "@/components/layout/PageHeading";
import { OrnateBox } from "@/components/ornament/OrnateBox";
import { releases, topics } from "@/lib/reference";

export const metadata: Metadata = {
  title: "Patch notes",
  description: "What has changed on the server, taken from the published releases.",
};

const KIND_ORDER = ["Added", "Changed", "Fixed", "Removed"];

export default function PatchNotesPage() {
  return (
    <div className="mx-auto max-w-site px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <nav aria-label="Breadcrumb" className="mb-6 flex justify-center">
        <ol className="flex flex-wrap items-center gap-2 text-xs tracking-widest text-text-muted uppercase">
          <li><Link href="/wiki" className="hover:text-brand-accent">Archive</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-accent">Patch notes</li>
        </ol>
      </nav>

      <PageHeading
        title="Patch notes"
        subtitle="Shipped, not planned. Every line below is from a release that already went out."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <ol className="flex flex-col gap-6">
          {releases.map((release) => {
            const grouped = new Map<string, string[]>();
            for (const note of release.notes) {
              const kind = note.kind ?? "Changed";
              if (!grouped.has(kind)) grouped.set(kind, []);
              grouped.get(kind)!.push(note.text);
            }
            const kinds = [...grouped.entries()].sort(
              (a, b) => KIND_ORDER.indexOf(a[0]) - KIND_ORDER.indexOf(b[0]),
            );

            return (
              <li key={release.version}>
                <OrnateBox size="sm" contentClassName="p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="font-display text-lg tracking-heading text-brand-accent">
                      {release.version}
                    </h2>
                    {release.date ? (
                      <time className="text-xs text-text-muted tabular-nums">{release.date}</time>
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-col gap-5">
                    {kinds.map(([kind, notes]) => (
                      <div key={kind}>
                        <h3 className="font-display text-[11px] tracking-widest text-text-muted uppercase">
                          {kind}
                        </h3>
                        <ul className="mt-2 flex flex-col gap-2">
                          {notes.map((text, index) => (
                            <li key={index} className="flex gap-3 text-sm leading-relaxed text-text-primary">
                              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-brand-accent" />
                              <span>{text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </OrnateBox>
              </li>
            );
          })}
        </ol>

        <aside className="lg:sticky lg:top-[132px] lg:self-start">
          <OrnateBox size="sm" contentClassName="p-6">
            <h2 className="font-display text-xs tracking-heading text-brand-accent">
              What gets worked on
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-text-muted">
              Counted across every release, so it is where the effort actually goes rather than
              where anyone says it goes.
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {topics.map((topic) => (
                <li key={topic.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-text-primary">{topic.name}</span>
                  <span className="shrink-0 text-xs text-text-muted tabular-nums">{topic.count}</span>
                </li>
              ))}
            </ul>
          </OrnateBox>
        </aside>
      </div>
    </div>
  );
}
