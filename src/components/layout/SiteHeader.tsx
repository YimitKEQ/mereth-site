"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Logo } from "@/components/layout/Logo";
import { InterlaceKnot } from "@/components/ornament/NordicMarks";
import { OrnateBox } from "@/components/ornament/OrnateBox";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { ButtonLink } from "@/components/ui/Button";
import { ChevronDown, Menu, X } from "@/components/ui/icons";
import { DISCORD_INVITE, primaryNav, type NavItem } from "@/lib/site";

/**
 * One sticky pill, one row: mark, links, actions.
 *
 * An earlier version copied the reference's overhanging crest, absolutely
 * positioned so it could hang above and below the bar. That is right for a
 * painted crest and wrong for Mereth's mark, which is lettering: hanging it off
 * the edge reads as a misalignment rather than as ornament. So everything sits
 * on one centre line inside the pill.
 *
 * Geometry lives in globals.css so the breakpoint steps read as a group instead
 * of being scattered through class strings, and dropdowns are driven off
 * `primaryNav` so a sixth menu is a config change.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  /** Label of the open dropdown, or null. One at a time, like every real menu bar. */
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const isActive = useCallback(
    (href: string): boolean => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );

  /** A dropdown counts as active when the page you are on lives inside it. */
  const isItemActive = (item: NavItem): boolean =>
    item.href !== undefined
      ? isActive(item.href)
      : (item.menu ?? []).some((link) => isActive(link.href));

  // Outside click and Escape close the dropdown. Both are expected of a menu,
  // and both are what hand-rolled ones usually miss.
  useEffect(() => {
    if (openMenu === null) return;
    const onPointerDown = (event: MouseEvent): void => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  // The page must not scroll behind the mobile drawer.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Navigating anywhere dismisses both.
  useEffect(() => {
    setMenuOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  const linkClass = (active: boolean): string =>
    [
      "font-display uppercase whitespace-nowrap text-shadow-drop cursor-pointer",
      "text-[0.95rem] xl:text-[1.1rem]",
      "tracking-[0.96px] xl:tracking-nav",
      "transition-colors duration-[var(--duration-fast)]",
      // Frost lifted, matching every other hover on the site. The reference
      // lifted to green here, which was its brand and is not ours.
      "hover:text-[var(--color-nav-hover)] hover:[text-shadow:0_0_8px_#cfe2ea40]",
      active ? "text-brand-accent" : "text-text-primary",
    ].join(" ");

  return (
    <header className="navbar-wrapper">
      <a href="#main" className="navbar-skip-link">
        Skip to content
      </a>

      <div className="navbar-pill">
        {/* The carved band, drawn behind the row. See globals.css for why the
            shape cannot live on the pill itself. */}
        <span className="navbar-plate" aria-hidden="true" />

        <Logo />

        {/*
          The knot separates the mark from the links. It sat on the top and
          bottom edges first, where at 18px it lost the weave and read as two
          specks. Inside the bar it has dark around it and the interlace is
          legible, which is the only size ornament is worth having.
        */}
        <span className="navbar-divider" aria-hidden="true">
          <span className="navbar-divider__rule" />
          <InterlaceKnot size={19} className="text-brand-accent/60" />
          <span className="navbar-divider__rule" />
        </span>

        <nav className="navbar-links" aria-label="Primary" ref={navRef}>
            {primaryNav.map((item) => {
              if (item.href !== undefined) {
                return (
                  <Link key={item.label} href={item.href} className={linkClass(isActive(item.href))}>
                    {item.label}
                  </Link>
                );
              }

              const open = openMenu === item.label;
              return (
                <div key={item.label} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(open ? null : item.label)}
                    aria-expanded={open}
                    aria-haspopup="menu"
                    className={`${linkClass(isItemActive(item))} inline-flex items-center gap-1.5 border-0 bg-transparent p-0`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`text-[var(--color-chevron)] transition-transform duration-[var(--duration-fast)] ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {open ? (
                    <div className="navbar-dropdown" role="menu" aria-label={item.label}>
                      <OrnateBox size="sm" fill="var(--color-bg-overlay)" contentClassName="py-2">
                        {(item.menu ?? []).map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            role="menuitem"
                            className="group/item block border-l-2 border-transparent px-5 py-2.5 transition-colors duration-[var(--duration-fast)] hover:border-brand-accent hover:bg-[var(--color-menu-hover)]"
                          >
                            <span className="font-display block text-sm tracking-nav text-text-primary uppercase transition-colors group-hover/item:text-brand-glow">
                              {link.label}
                            </span>
                            {link.hint !== undefined ? (
                              <span className="mt-0.5 block text-[11px] leading-snug text-text-muted transition-colors group-hover/item:text-text-light">
                                {link.hint}
                              </span>
                            ) : null}
                          </Link>
                        ))}
                      </OrnateBox>
                    </div>
                  ) : null}
                </div>
              );
          })}
        </nav>

        {/*
          No Login button. The website has no accounts, and the game logs in
          through Discord, so the action here is the door to Discord rather than
          a form that cannot log anybody into anything.
        */}
        <div className="navbar-actions">
          <SearchTrigger />
          <ButtonLink href={DISCORD_INVITE} variant="solid" size="nav">
            Discord
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="navbar-hamburger text-brand-accent"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="text-2xl" /> : <Menu className="text-2xl" />}
        </button>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="navbar-scrim"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="navbar-mobile-drawer">
            <OrnateBox size="sm" fill="var(--color-bg-overlay)" contentClassName="max-h-[75vh] overflow-y-auto p-6">
              <nav className="flex flex-col gap-5" aria-label="Mobile">
                {primaryNav.map((item) =>
                  item.href !== undefined ? (
                    <Link key={item.label} href={item.href} className={linkClass(isActive(item.href))}>
                      {item.label}
                    </Link>
                  ) : (
                    <div key={item.label} className="flex flex-col gap-2.5">
                      <span className="font-display text-[11px] tracking-[2px] text-text-muted uppercase">
                        {item.label}
                      </span>
                      {(item.menu ?? []).map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`${linkClass(isActive(link.href))} pl-3`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ),
                )}
              </nav>
              <div className="mt-7">
                <ButtonLink href="/discord" variant="solid" size="nav" className="w-full">
                  Discord
                </ButtonLink>
              </div>
            </OrnateBox>
          </div>
        </>
      ) : null}
    </header>
  );
}
