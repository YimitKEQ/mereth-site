"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/layout/Logo";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ButtonLink } from "@/components/ui/Button";
import { ChevronDown, Menu, X } from "@/components/ui/icons";
import { primaryNav } from "@/lib/site";

/**
 * The bar: one gradient strip with an accent rule, the emblem overhanging its
 * left edge, links, then the auth pair. The language selector sits outside the
 * strip as its own framed pill, which is why it is a sibling and not a child.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string): boolean =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className="relative w-full px-4 pt-4 md:px-8"
      style={{ zIndex: "var(--z-navbar)" }}
    >
      <div className="mx-auto flex w-full items-center gap-3">
        {/* Main strip */}
        <div
          className="relative flex h-14 flex-1 items-center rounded-md border border-brand-accent/80 pr-2 pl-[176px] md:h-16 md:pl-[262px]"
          style={{ backgroundImage: "var(--gradient-nav-bar)" }}
        >
          {/*
            Wrapped rather than positioned through Logo's own className: Logo
            sets `relative` for its text overlay, and passing `absolute` in only
            produced two position declarations where the stylesheet order, not
            the class order, decided the winner.
          */}
          <span className="absolute top-1/2 left-0 -translate-y-1/2">
            <Logo />
          </span>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-display text-base tracking-nav transition-colors duration-[var(--duration-fast)] text-shadow-drop hover:text-brand-accent xl:text-lg ${
                  isActive(link.href) ? "text-brand-accent" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <ButtonLink href="/login" size="sm" className="min-w-[120px]">
              Login
            </ButtonLink>
            <ButtonLink href="/register" size="sm" className="min-w-[120px]">
              Register
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="ml-auto p-2 text-brand-accent lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Language pill, its own frame outside the strip */}
        <button
          type="button"
          className="relative hidden h-14 shrink-0 items-center gap-2 rounded-md border border-brand-accent/80 bg-black/60 px-4 text-white md:flex md:h-16"
        >
          <FrameCorners size={14} />
          <span className="relative text-[10px] tracking-widest text-text-muted">GB</span>
          <span className="font-display relative text-sm tracking-nav">English</span>
          <ChevronDown className="relative text-[var(--color-chevron)]" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="mx-auto mt-2 w-full rounded-md border border-brand-accent/60 bg-black/80 p-4 backdrop-blur-[var(--blur-modal)] lg:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`font-display tracking-nav text-base ${
                  isActive(link.href) ? "text-brand-accent" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex gap-2 md:hidden">
            <ButtonLink href="/login" size="sm" className="flex-1">
              Login
            </ButtonLink>
            <ButtonLink href="/register" size="sm" className="flex-1">
              Register
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
