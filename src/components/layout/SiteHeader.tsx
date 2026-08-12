"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/layout/Logo";
import { OrnateBox } from "@/components/ornament/OrnateBox";
import { ButtonLink } from "@/components/ui/Button";
import { ChevronDown, Menu, X } from "@/components/ui/icons";
import { communityMenu, primaryNav } from "@/lib/site";

/**
 * The bar, rebuilt to the reference's geometry rather than to a guess at it.
 *
 * It is not a flex row. It is a sticky wrapper with three absolutely positioned
 * children, which is what lets the emblem overhang the pill on both edges
 * without changing the header's height:
 *
 *   wrapper   sticky, top 0, fixed height, pointer-events none, overflow visible
 *   emblem    absolute top left, above the pill in z order
 *   pill      absolute, inset from both sides, rounded, its own height
 *   language  absolute, outside the pill entirely
 *
 * `pointer-events: none` on the wrapper with `auto` on its children is what
 * stops the empty band beside the emblem from swallowing clicks on the page
 * beneath it. Geometry lives in globals.css so the breakpoint steps read as a
 * group instead of being scattered through class strings.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const communityRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string): boolean =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Outside click and Escape close the dropdown. Both are expected of a menu,
  // and both are what hand-rolled ones usually miss.
  useEffect(() => {
    if (!communityOpen) return;
    const onPointerDown = (event: MouseEvent): void => {
      if (communityRef.current && !communityRef.current.contains(event.target as Node)) {
        setCommunityOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setCommunityOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [communityOpen]);

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
    setCommunityOpen(false);
  }, [pathname]);

  const linkClass = (href: string): string =>
    [
      "font-display uppercase whitespace-nowrap text-shadow-drop cursor-pointer",
      "text-[1rem] xl:text-[var(--text-nav)]",
      "tracking-[0.96px] xl:tracking-nav",
      "transition-colors duration-[var(--duration-fast)]",
      // Nav links lift to green on hover in the reference, not to the brand gold.
      "hover:text-[#5cbf4a] hover:[text-shadow:0_0_6px_#5cbf4a4d]",
      isActive(href) ? "text-brand-accent" : "text-text-primary",
    ].join(" ");

  return (
    <header className="navbar-wrapper">
      <a href="#main" className="navbar-skip-link">
        Skip to content
      </a>

      <div className="navbar-logo-link">
        <Logo />
      </div>

      <div className="navbar-pill">
        <div className="navbar-pill-content">
          <nav className="navbar-links" aria-label="Primary">
            {primaryNav.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}

            <div className="relative" ref={communityRef}>
              <button
                type="button"
                onClick={() => setCommunityOpen((value) => !value)}
                aria-expanded={communityOpen}
                aria-haspopup="menu"
                className={`${linkClass("/community")} inline-flex items-center gap-2 border-0 bg-transparent p-0`}
              >
                Community
                <ChevronDown
                  className={`text-[var(--color-chevron)] transition-transform duration-[var(--duration-fast)] ${
                    communityOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {communityOpen ? (
                <div className="navbar-dropdown" role="menu" aria-label="Community">
                  <OrnateBox size="sm" fill="var(--color-bg-overlay)" contentClassName="py-2">
                    {communityMenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className="font-display block px-6 py-3 text-sm tracking-nav text-text-primary uppercase transition-colors duration-[var(--duration-fast)] hover:bg-[#dde46b14] hover:text-brand-accent"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </OrnateBox>
                </div>
              ) : null}
            </div>
          </nav>

          <div className="navbar-actions">
            <ButtonLink href="/login" size="nav">
              Login
            </ButtonLink>
            <ButtonLink href="/register" size="nav">
              Register
            </ButtonLink>
          </div>
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

      <div className="navbar-language-selector">
        <OrnateBox size="sm">
          <button type="button" className="flex h-11 items-center gap-2 px-4 text-white">
            <span className="text-[10px] tracking-widest text-text-muted">GB</span>
            <span className="font-display text-sm tracking-nav">English</span>
            <ChevronDown className="text-[var(--color-chevron)]" />
          </button>
        </OrnateBox>
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
          <OrnateBox size="sm" fill="var(--color-bg-overlay)" contentClassName="p-6">
            <nav className="flex flex-col gap-4" aria-label="Mobile">
              {primaryNav.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                  {link.label}
                </Link>
              ))}
              {communityMenu.map((item) => (
                <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-3">
              <ButtonLink href="/login" size="nav" className="w-full">
                Login
              </ButtonLink>
              <ButtonLink href="/register" size="nav" className="w-full">
                Register
              </ButtonLink>
            </div>
          </OrnateBox>
          </div>
        </>
      ) : null}
    </header>
  );
}
