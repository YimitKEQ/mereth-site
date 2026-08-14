import type { Metadata } from "next";
import Link from "next/link";

import { CodexHeader } from "@/components/codex/CodexHeader";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { pageMeta } from "@/lib/seo";
import { counts, mereth } from "@/lib/mereth";
import { LauncherDownload } from "@/components/ui/LauncherDownload";

export const metadata: Metadata = pageMeta({
  path: "/records",
  title: "Modlist",
  description:
    "Every mod the launcher installs, and the exact load order it installs them in.",
});

/**
 * The modlist and the load order. Nothing else.
 *
 * This page used to carry a searchable index of every named record in the
 * province, plus a list of unique weapons and armour and the exact interior
 * each one stands in. It was the most impressive thing on the site and it was
 * the wrong thing to build.
 *
 * Knowing where an artefact stands is not a convenience on a roleplay server,
 * it is somebody else's discovery, and a search box that hands it over in two
 * seconds quietly deletes a whole category of play. The rule we settled on:
 * publish what helps a player **decide** (what to install, what changed, how a
 * system works) and never what removes the reason to go and look.
 *
 * So: mods and load order. What is in the barrow stays in the barrow, and the
 * release history lives on /changelog, where it can be searched.
 */
export default function ModlistPage() {
  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <CodexHeader
        title="The Modlist"
        lede={`Everything the launcher installs, in the order it installs it. **You do not need to
          install any of this by hand:** the launcher reads the live manifest and does the whole
          thing for you. For what changed and when, see the [changelog](/changelog).`}
        facts={[
          { label: "Mods", value: String(counts.mods) },
          { label: "Plugins", value: String(counts.plugins) },
          { label: "Files checked", value: counts.checkedFiles.toLocaleString("en-GB") },
        ]}
      />

      <LauncherDownload className="mb-9 max-w-3xl" />

      <div className="relative mb-9 max-w-3xl border border-brand-accent/40 bg-black/35 px-6 py-5">
        <FrameCorners size={14} />
        <p className="relative text-[0.92rem] leading-relaxed text-text-light">
          <strong className="font-semibold text-text-primary">
            Order matters as much as files.
          </strong>{" "}
          A plugin present but in the wrong slot fails exactly the way a missing one does, and the
          server checks names, order, light flags and SKSE checksums before it lets you connect.
          That is the launcher&apos;s job, not yours. If it will not connect,{" "}
          <Link
            href="/faq#connect"
            className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 hover:decoration-brand-glow"
          >
            read the exact error first
          </Link>
          .
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <section className="min-w-0">
          <h2 className="font-display mb-4 text-[0.95rem] tracking-heading text-brand-accent uppercase">
            Mods the launcher installs
          </h2>
          <p className="mb-5 text-[0.85rem] leading-relaxed text-text-muted">
            Every one is somebody else&apos;s work. Endorse the authors: their mods are what makes
            the province look the way it does, and{" "}
            <Link
              href="/credits"
              className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 hover:decoration-brand-glow"
            >
              credits
            </Link>{" "}
            lists them by name.
          </p>
          <ul className="columns-1 gap-x-8 sm:columns-2 lg:columns-1 xl:columns-2">
            {mereth.mods.map((mod) => (
              <li
                key={`${mod.modId}:${mod.name}`}
                className="break-inside-avoid py-1 text-[0.85rem] break-words text-text-light"
              >
                {mod.modId === null ? (
                  mod.name
                ) : (
                  <a
                    href={`https://www.nexusmods.com/skyrimspecialedition/mods/${mod.modId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-brand-accent"
                  >
                    {mod.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="min-w-0">
          <h2 className="font-display mb-4 text-[0.95rem] tracking-heading text-brand-accent uppercase">
            Load order
          </h2>
          <p className="mb-5 text-[0.85rem] leading-relaxed text-text-muted">
            The exact order the server expects, top to bottom.
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
    </div>
  );
}
