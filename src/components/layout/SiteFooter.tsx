import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { OrnateDivider } from "@/components/ornament/Divider";
import { Discord, Facebook, YouTube } from "@/components/ui/icons";
import { footerColumns, legalLinks, site } from "@/lib/site";

const SOCIALS = [
  { label: "Facebook", href: "/facebook", Icon: Facebook },
  { label: "Discord", href: "/discord", Icon: Discord },
  { label: "YouTube", href: "/youtube", Icon: YouTube },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-16 w-full">
      <OrnateDivider />

      {/*
        A deeper green plate than the page, lit from the middle. The reference
        puts a faint forest silhouette here; the radial stand-in keeps the same
        centre-lit falloff so the columns still read against it.
      */}
      <div className="relative overflow-hidden border-t border-brand-accent/50 bg-[#0d2410]">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 0%, #2f7a3a 0%, #16481d 38%, #071a09 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-site gap-10 px-6 py-12 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:gap-16 md:px-8">
          <div className="flex items-start justify-center md:justify-start">
            <Logo />
          </div>

          {footerColumns.map((column, index) => (
            <nav key={index} className="flex flex-col gap-4" aria-label={`Footer ${index + 1}`}>
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-display text-xs tracking-widest text-white transition-colors duration-[var(--duration-fast)] text-shadow-drop hover:text-brand-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}

          <div className="flex flex-col gap-4">
            <span className="text-sm text-text-muted">Follow Us:</span>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-base text-white transition-colors duration-[var(--duration-fast)] hover:bg-brand-accent hover:text-brand-dark"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex max-w-site flex-col gap-3 px-6 pb-8 text-xs text-text-muted md:flex-row md:items-center md:justify-between md:px-8">
          <p>{site.copyright}</p>
          <ul className="flex flex-wrap gap-5">
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
    </footer>
  );
}
