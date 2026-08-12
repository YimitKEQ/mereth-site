import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { PlateImage } from "@/components/ui/Plate";
import { Discord } from "@/components/ui/icons";
import { DISCORD_INVITE, footerColumns, legalLinks, site } from "@/lib/site";
import { counts, mereth } from "@/lib/mereth";

/**
 * The footer.
 *
 * Rebuilt because the flow was wrong: five equal columns across the full 1560px
 * put the wordmark on an island at the far left and stretched four short link
 * lists into thin ribbons with nothing holding them together.
 *
 * Now it reads as two things. A brand block on the left with the lockup, one
 * sentence and the way in, then the link columns grouped tight beside it. The
 * whole thing sits on a picture rather than a flat plate, because the page it
 * closes is full of them and a plain black band under all that art looks like
 * the site ran out.
 */
export function SiteFooter() {
  const built = new Date(mereth.builtAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <footer className="relative mt-28 w-full overflow-hidden border-t border-brand-accent/25">
      {/* Atmosphere, heavily graded. It is a floor, not a feature. */}
      <div className="absolute inset-0" aria-hidden="true">
        <PlateImage
          slug="winter-port"
          aspect="h-full"
          sizes="100vw"
          className="h-full [&>span]:hidden"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #0b1013f5 0%, #0b1013e6 45%, #080c0f 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[84rem] px-6 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
          <div className="flex flex-col items-start gap-5">
            <Logo variant="stacked" />
            <p className="max-w-[30ch] text-[0.88rem] leading-relaxed text-text-muted">
              A serious roleplay Skyrim server, set in 4E 185. Ten years after the Great War, and
              the peace is thinner than it looks.
            </p>
            <Link
              href={DISCORD_INVITE}
              className="ornate-glow inline-flex items-center gap-2.5 border border-brand-accent/50 bg-black/40 px-4 py-2.5 font-display text-[0.78rem] tracking-[2px] text-brand-accent uppercase transition-colors hover:border-brand-accent hover:text-brand-glow"
            >
              <Discord className="text-sm" />
              Join the Discord
            </Link>
          </div>

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <nav key={column.heading} aria-label={column.heading} className="flex flex-col gap-3">
                <span className="font-display border-b border-brand-accent/20 pb-2.5 text-[10px] tracking-[2.5px] text-brand-accent uppercase">
                  {column.heading}
                </span>
                {column.links.map((link) => (
                  <Link
                    prefetch={false}
                    key={link.href}
                    href={link.href}
                    className="text-[0.85rem] text-text-light transition-colors duration-[var(--duration-fast)] hover:text-brand-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border-subtle pt-7 text-[0.78rem] text-text-muted md:flex-row md:items-center md:justify-between">
          <p>
            {site.copyright}. Not associated with ZeniMax Entertainment, Bethesda Softworks or Nexus
            Mods in any way.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-text-muted/70">
              Built by{" "}
              <span className="text-brand-accent/80">Levitate</span>. Reference indexed {built},
              from {counts.plugins} plugins
            </span>
            <ul className="flex flex-wrap gap-5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    prefetch={false}
                    href={link.href}
                    className="transition-colors hover:text-brand-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
