"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { fetchLiveModlist, type ModlistLive } from "@/lib/live-modlist";
import type { Mereth } from "@/lib/mereth";

/**
 * The modlist page, corrected against the live launcher manifest.
 *
 * Two components, sharing one fetch: `LiveModlistFacts` sits in the page header where the static
 * counts used to be, `LiveModlistLists` owns the two big lists further down. Both call
 * `fetchLiveModlist` independently, but the module-level cache in `live-modlist.ts` collapses
 * that into a single network request either way.
 *
 * Both start from exactly what the page renders today, the baked props. A reader with
 * JavaScript off, or one who loads the page while the fetch fails or is slow, sees precisely
 * that and nothing else: no spinner, no placeholder, no error. Only a successful fetch ever
 * changes what is on screen, and it can only correct the page forward, never break it.
 */

function useLiveModlist(mods: Mereth["mods"]): ModlistLive {
  const [live, setLive] = useState<ModlistLive>({ status: "unavailable" });

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    void fetchLiveModlist(mods, controller.signal).then((result) => {
      if (!cancelled) setLive(result);
    });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [mods]);

  return live;
}

/** The Mods / Plugins / SKSE plugins / Files checked row. Replaces the header's static facts. */
export function LiveModlistFacts({
  mods,
  plugins,
  checkedFiles,
}: {
  mods: Mereth["mods"];
  plugins: Mereth["plugins"];
  checkedFiles: number;
}) {
  const live = useLiveModlist(mods);

  const facts = [
    { label: "Mods", value: String(live.status === "ok" ? live.modList.length : mods.length) },
    { label: "Plugins", value: String(live.status === "ok" ? live.loadOrder.length : plugins.length) },
    { label: "SKSE plugins", value: live.status === "ok" ? String(live.sksePlugins) : "?" },
    // Every other figure on this row corrects itself, so this one has to as
    // well. A single baked number beside three live ones is a page claiming to
    // be current while quietly not being.
    {
      label: "Files checked",
      value: (live.status === "ok" && live.checkedFiles > 0 ? live.checkedFiles : checkedFiles).toLocaleString("en-GB"),
    },
  ];

  return (
    <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
      {facts.map((fact) => (
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
  );
}

interface ModRow {
  modId: number | null;
  name: string;
}

/** The live-check status box, the mod list, and the load order. */
export function LiveModlistLists({
  mods,
  plugins,
}: {
  mods: Mereth["mods"];
  plugins: Mereth["plugins"];
}) {
  const live = useLiveModlist(mods);

  const rows: ModRow[] =
    live.status === "ok"
      ? live.modList.map((mod) => ({ modId: mod.modId, name: mod.name }))
      : mods.map((mod) => ({ modId: mod.modId, name: mod.name }));

  const loadOrder = live.status === "ok" ? live.loadOrder : plugins;

  const readAt =
    live.status === "ok"
      ? new Date(live.fetchedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
      : null;

  return (
    <>
      <div className="relative mb-9 max-w-3xl border border-brand-accent/40 bg-black/35 px-6 py-5">
        <FrameCorners size={14} />
        <p className="relative text-[0.85rem] leading-relaxed text-text-light">
          <strong className="font-semibold text-text-primary">This page corrects itself.</strong>{" "}
          The lists below are read against the launcher&apos;s own live manifest in your browser.
          The launcher is always the final authority on what your install needs, whatever this
          page says.
        </p>

        {live.status === "ok" ? (
          <div className="relative mt-4 border-t border-brand-accent/20 pt-4">
            <p className="text-[0.8rem] leading-relaxed text-text-muted">
              Checked {readAt}.
              {live.minClientVersion !== null
                ? ` The launcher currently requires client build ${live.minClientVersion}.`
                : ""}
            </p>

            {live.added.length === 0 && live.removed.length === 0 ? (
              <p className="mt-2 text-[0.85rem] leading-relaxed text-text-light">
                Matches this page exactly. Nothing has changed since it was last built.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {live.added.length > 0 ? (
                  <p className="text-[0.85rem] leading-relaxed text-text-light">
                    <strong className="font-semibold text-text-primary">
                      Added since this page was built:
                    </strong>{" "}
                    {live.added.map((mod, i) => (
                      <span key={`${mod.modId}:${mod.label}`}>
                        {i > 0 ? ", " : ""}
                        <a
                          href={`https://www.nexusmods.com/skyrimspecialedition/mods/${mod.modId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 hover:decoration-brand-glow"
                        >
                          {mod.label}
                        </a>
                      </span>
                    ))}
                    .
                  </p>
                ) : null}

                {live.removed.length > 0 ? (
                  <p className="text-[0.85rem] leading-relaxed text-text-light">
                    <strong className="font-semibold text-text-primary">
                      Removed since this page was built:
                    </strong>{" "}
                    {live.removed.map((mod) => mod.name).join(", ")}.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
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
            {rows.map((mod) => (
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
            {loadOrder.map((plugin, index) => (
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
    </>
  );
}
