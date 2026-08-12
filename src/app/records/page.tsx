import type { Metadata } from "next";

import { CodexHeader } from "@/components/codex/CodexHeader";
import { RecordSearch } from "@/components/codex/RecordSearch";
import { Tabs } from "@/components/codex/Tabs";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { counts, mereth } from "@/lib/mereth";

export const metadata: Metadata = {
  title: "Records",
  description:
    "Search every named record in the plugins our launcher installs, plus the full mod list, the load order and the release history.",
};

export default function RecordsPage() {
  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <CodexHeader
        title="Records"
        lede={`Everything named in the ${counts.plugins} plugins our launcher installs, searchable.
          This knows that a thing **exists** and what kind of thing it is. It does not know where it
          stands, what it costs, or whether anyone will ever sell you one.`}
        facts={[
          { label: "Records read", value: counts.records.toLocaleString("en-GB") },
          { label: "Searchable", value: counts.searchable.toLocaleString("en-GB") },
          { label: "Plugins", value: String(counts.plugins) },
          { label: "Mods", value: String(counts.mods) },
        ]}
      />

      <Tabs
        tabs={[
          {
            id: "search",
            label: "Search",
            hint: "Everything with a name",
            content: <RecordSearch total={counts.searchable} />,
          },
          {
            id: "gear",
            label: "One of a kind",
            hint: "Stands in exactly one place",
            content: (
              <div>
                <div className="relative mb-8 max-w-3xl border border-brand-accent/40 bg-black/35 px-6 py-5">
                  <FrameCorners weight="thin" size={16} />
                  <p className="relative text-[0.92rem] leading-relaxed text-text-light">
                    Weapons and armour that stand in exactly one named interior in the whole
                    province, so going there is a way to find them.{" "}
                    <strong className="font-semibold text-text-primary">
                      An empty result elsewhere is never proof that something is unobtainable.
                    </strong>{" "}
                    A placement walk only sees objects standing in the world, so anything from a
                    container, levelled loot, a vendor, a quest or a forge appears nowhere.
                  </p>
                </div>

                <ul className="grid gap-x-10 md:grid-cols-2">
                  {mereth.oneOfAKind.map((item) => (
                    <li
                      key={`${item.name}:${item.where}`}
                      className="flex items-baseline justify-between gap-4 border-b border-border-subtle py-2.5"
                    >
                      <span className="min-w-0 truncate text-[0.92rem] text-text-primary">
                        {item.name}
                      </span>
                      <span className="shrink-0 text-[0.78rem] text-text-muted">{item.where}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          },
          {
            id: "modlist",
            label: "The mod list",
            hint: `${counts.mods} mods, in order`,
            content: (
              <div className="grid gap-12 lg:grid-cols-2">
                <section>
                  <h3 className="font-display mb-4 text-[0.95rem] tracking-heading text-brand-accent uppercase">
                    Mods the launcher installs
                  </h3>
                  <ul className="columns-1 gap-x-8 sm:columns-2 lg:columns-1 xl:columns-2">
                    {mereth.mods.map((mod) => (
                      <li
                        key={`${mod.modId}:${mod.name}`}
                        className="break-inside-avoid py-1 text-[0.85rem] text-text-light"
                      >
                        {mod.name}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="font-display mb-4 text-[0.95rem] tracking-heading text-brand-accent uppercase">
                    Load order
                  </h3>
                  <p className="mb-4 text-[0.85rem] leading-relaxed text-text-muted">
                    Order matters as much as files. A plugin present but in the wrong slot fails the
                    same way a missing one does, which is why this is the launcher&apos;s job and
                    not yours.
                  </p>
                  <ol className="columns-1 gap-x-8 sm:columns-2 lg:columns-1 xl:columns-2">
                    {mereth.plugins.map((plugin, index) => (
                      <li
                        key={plugin}
                        className="flex break-inside-avoid gap-3 py-1 font-mono text-[0.78rem] text-text-light"
                      >
                        <span className="w-6 shrink-0 text-right tabular-nums text-text-muted">
                          {index + 1}
                        </span>
                        <span className="min-w-0 truncate">{plugin}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            ),
          },
          {
            id: "releases",
            label: "Releases",
            hint: `${counts.releases} since launch`,
            content: (
              <div className="max-w-3xl space-y-9">
                {mereth.releases.map((release) => (
                  <article key={release.version}>
                    <h3 className="flex items-baseline gap-4">
                      <span className="font-display text-[1.05rem] tracking-heading text-brand-accent">
                        {release.version}
                      </span>
                      {release.date !== null ? (
                        <span className="text-[0.8rem] tabular-nums text-text-muted">
                          {release.date}
                        </span>
                      ) : null}
                    </h3>
                    <ul className="mt-3 space-y-1.5 border-l border-brand-accent/20 pl-5">
                      {release.notes.map((note, i) => (
                        <li key={i} className="text-[0.88rem] leading-relaxed text-text-light">
                          {note.text}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
