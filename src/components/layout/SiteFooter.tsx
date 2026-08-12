import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { OrnateDivider } from "@/components/ornament/Divider";
import { Discord } from "@/components/ui/icons";
import { footerColumns, legalLinks, site } from "@/lib/site";
import { counts, mereth } from "@/lib/mereth";

/**
 * The footer carries the site's provenance, which no other surface does.
 *
 * A fan-built handbook for somebody else's server has to say so somewhere, and
 * has to say where its facts came from. Putting that on every page in the
 * footer is more honest than an about page nobody opens.
 *
 * The plate is the page's own cold slate rather than the reference's forest
 * green: the green was that site's brand and reads as a mistake against this
 * palette.
 */
export function SiteFooter() {
  const built = new Date(mereth.builtAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <footer className="relative mt-24 w-full">
      <OrnateDivider />

      <div className="relative overflow-hidden border-t border-brand-accent/35 bg-[#0b1013]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 0%, #1b2429 0%, #121a1e 44%, #080c0f 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-site px-6 py-14 md:px-8">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] md:gap-10">
            <div className="flex flex-col gap-5">
              <Logo />
              <p className="max-w-xs text-[0.85rem] leading-relaxed text-text-muted">
                A player-built handbook for Mereth Roleplay. Read out of the client their launcher
                installs, their published manifest, and their dated release notes.
              </p>
              <Link
                href="/discord"
                aria-label="Discord"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-base text-text-light transition-colors duration-[var(--duration-fast)] hover:bg-brand-accent hover:text-brand-dark"
              >
                <Discord />
              </Link>
            </div>

            {footerColumns.map((column) => (
              <nav key={column.heading} aria-label={column.heading} className="flex flex-col gap-3.5">
                <span className="font-display text-[11px] tracking-[2px] text-brand-accent uppercase">
                  {column.heading}
                </span>
                {column.links.map((link) => (
                  <Link
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

          <div className="mt-12 flex flex-col gap-3 border-t border-border-subtle pt-7 text-[0.78rem] text-text-muted md:flex-row md:items-center md:justify-between">
            <p>
              {site.copyright}. Not affiliated with Bethesda, ZeniMax, or the Mereth Roleplay team.
            </p>
            <ul className="flex flex-wrap gap-5">
              <li>
                Indexed {built} from {counts.plugins} plugins and {counts.releases} releases
              </li>
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-brand-accent">
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
