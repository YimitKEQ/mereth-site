import type { Metadata } from "next";
import Link from "next/link";

import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ButtonLink } from "@/components/ui/Button";
import { pageMeta } from "@/lib/seo";
import { counts, mereth } from "@/lib/mereth";
import { DISCORD_INVITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  path: "/credits",
  title: "Credits",
  description:
    "The mod authors whose work the launcher installs, the projects Mereth is built on, and the people who run it.",
});

/**
 * Credits.
 *
 * The mod list is the substance here and it is real: author, version and what
 * each one contributes, joined from the launcher manifest and a sweep of the
 * archives themselves. Listing somebody's mod without naming them is not a
 * credit, so anything missing an author says so rather than quietly appearing
 * uncredited.
 *
 * The team section is deliberately thin. Roles change, and a stale roster of
 * real people is worse than a short honest one; names go here when the team
 * decides which names to publish.
 */
export default function CreditsPage() {
  /** Grouped by author so a person appears once with everything they made. */
  const byAuthor = new Map<string, typeof mereth.mods>();
  const uncredited: typeof mereth.mods = [];

  for (const mod of mereth.mods) {
    if (mod.author === null) {
      uncredited.push(mod);
      continue;
    }
    const list = byAuthor.get(mod.author) ?? [];
    list.push(mod);
    byAuthor.set(mod.author, list);
  }

  const authors = [...byAuthor.entries()].sort((a, b) =>
    a[0].toLowerCase().localeCompare(b[0].toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />

      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          The Realm
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          Credits
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
          Mereth runs on {counts.mods} mods made by {authors.length} authors, none of whom work for
          us. Every one is linked to its Nexus page: read the credits, and endorse the people whose
          work makes the province look and behave the way it does.
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {[
            { label: "Mods installed", value: String(counts.mods) },
            { label: "Authors credited", value: String(authors.length) },
            { label: "Plugins loaded", value: String(counts.plugins) },
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

      <OrnateDivider className="my-12" />

      <section className="grid gap-10 lg:grid-cols-3">
        {[
          {
            title: "Built on",
            body: (
              <>
                <p className="mb-3">
                  <strong className="text-text-primary">SkyMP</strong>, the open source multiplayer
                  framework for Skyrim Special Edition. Mereth is a fork of it with a great deal
                  added on top, and it would not exist without that project.
                </p>
                <p>
                  <strong className="text-text-primary">SKSE</strong>, the Skyrim Script Extender,
                  and <strong className="text-text-primary">Skyrim Platform</strong>, without which
                  none of the client-side systems would be possible.
                </p>
              </>
            ),
          },
          {
            title: "The team",
            body: (
              <>
                <p className="mb-3">
                  Mereth is run by <strong className="text-text-primary">BStarRP</strong>, a roleplay
                  community that came to Skyrim from FiveM and RedM. Development, art, moderation and
                  the whitelists are all handled by volunteers.
                </p>
                <p className="mb-3">
                  Roles change often enough that a roster here would be wrong within a month. The
                  current staff list lives in Discord, where it is kept up to date.
                </p>
                <p>
                  This site was built by{" "}
                  <strong className="text-text-primary">Levitate</strong>, from the server's own
                  client files, its release notes and its rulebook.
                </p>
              </>
            ),
          },
          {
            title: "Not affiliated",
            body: (
              <>
                <p className="mb-3">
                  The Elder Scrolls and Skyrim are the property of Bethesda Softworks. Mereth
                  Roleplay is not associated with ZeniMax Entertainment, Bethesda Softworks or Nexus
                  Mods in any way.
                </p>
                <p>
                  We host and redistribute nothing we do not have permission to. The launcher
                  downloads each mod from Nexus, so authors keep their downloads and their
                  endorsements.
                </p>
              </>
            ),
          },
        ].map((block) => (
          <div key={block.title} className="relative border border-brand-accent/25 bg-black/30 p-6">
            <FrameCorners size={14} />
            <h2 className="font-display relative mb-4 text-[1rem] tracking-heading text-brand-accent uppercase">
              {block.title}
            </h2>
            <div className="relative space-y-3 text-[0.9rem] leading-relaxed text-text-muted">
              {block.body}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="font-display mb-3 text-xl tracking-heading text-brand-accent uppercase">
          Mod authors
        </h2>
        <p className="mb-9 max-w-[68ch] text-[0.98rem] leading-relaxed text-text-muted">
          Alphabetical by author. Where somebody made more than one of the mods we install, they are
          listed once with all of them.
        </p>

        <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
          {authors.map(([author, list]) => (
            <li key={author} className="border-b border-border-subtle pb-5">
              <p className="text-[0.95rem] text-text-primary">{author}</p>
              <ul className="mt-2 space-y-1">
                {list.map((mod) => (
                  <li key={`${mod.modId}:${mod.name}`} className="text-[0.82rem] text-text-muted">
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
                    {mod.version === null ? null : (
                      <span className="ml-2 tabular-nums text-text-muted/60">v{mod.version}</span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {uncredited.length > 0 ? (
          <div className="relative mt-10 max-w-3xl border border-[#a8503c]/50 bg-black/30 px-6 py-5">
            <FrameCorners size={14} />
            <p className="font-display relative mb-2 text-[10px] tracking-[2px] text-[#d08a76] uppercase">
              Author not yet recorded
            </p>
            <p className="relative text-[0.9rem] leading-relaxed text-text-light">
              {uncredited.map((mod) => mod.name).join(", ")}. Newly added to the manifest and not yet
              picked up by our metadata sweep. If one of these is yours,{" "}
              <Link
                href={DISCORD_INVITE}
                className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 hover:decoration-brand-glow"
              >
                tell us in Discord
              </Link>{" "}
              and it is fixed the same day.
            </p>
          </div>
        ) : null}
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display mb-4 text-xl tracking-heading text-brand-accent uppercase">
          Something missing or wrong?
        </h2>
        <p className="text-[0.98rem] leading-[1.8] text-text-light">
          If your work is installed by our launcher and you are not credited here the way you want to
          be, or at all, open a ticket and we will correct it. That includes removal: if you would
          rather your mod was not used by a multiplayer server, say so and we will take it out.
        </p>
        <div className="mt-7">
          <ButtonLink href={DISCORD_INVITE} variant="solid" size="md">
            Open a ticket
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
