import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { OrnateDivider } from "@/components/ornament/Divider";
import { Discord } from "@/components/ui/icons";
import { footerColumns, legalLinks, site } from "@/lib/site";
import { counts, mereth } from "@/lib/mereth";

/**
 * The footer carries the provenance line, which no other surface does.
 *
 * The reference data on this site is generated from the plugins and the client
 * our launcher installs, so it can drift when the server ships. Stamping the
 * index date on every page is cheaper than a reader discovering the drift by
 * being wrong in front of somebody.
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
                A serious roleplay Skyrim server, set in 4E 185. Reference pages are generated from
                the plugins and the client our launcher installs.
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
              {site.copyright}. Not associated with ZeniMax Entertainment, Bethesda Softworks or
              Nexus Mods in any way.
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
