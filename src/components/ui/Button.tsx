import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";

/**
 * Two treatments in the reference and no others:
 *
 *   solid    accent fill, dark text. The single primary action on a view.
 *   outline  dark translucent fill, accent rule and accent text.
 *
 * Both carry the fret corners. Sizes follow the size tokens: the hero pair are
 * 72px tall with a 332px minimum, and shrink on mobile.
 */

type Variant = "solid" | "outline";
type Size = "sm" | "md" | "lg" | "nav";

const SIZES: Record<Size, string> = {
  // The navbar pair: fixed 178x48, stepping down with the pill at 1500px.
  nav: "h-[44px] w-[162px] text-[1.146rem] tracking-[1.1px] xl:h-[48px] xl:w-[178px] xl:text-[var(--text-nav)] xl:tracking-nav",
  sm: "h-9 px-4 text-xs tracking-widest",
  md: "h-12 px-6 text-sm tracking-widest",
  lg: [
    "h-[var(--size-button-height-mobile)] md:h-[var(--size-button-height)]",
    "min-w-[var(--size-button-min-width-mobile)] md:min-w-[var(--size-button-min-width)]",
    "px-8 text-[var(--text-button-mobile)] md:text-2xl tracking-heading",
  ].join(" "),
};

/*
 * Hover lifts to the glow yellow rather than to white, and the outer glow comes
 * from `.ornate-glow`. Both were read off the reference's stylesheet; a static
 * screenshot cannot show either.
 */
const VARIANTS: Record<Variant, string> = {
  solid: "bg-[var(--color-brand-action)] text-brand-dark hover:brightness-110",
  outline:
    "bg-black/40 text-brand-accent hover:text-[var(--color-brand-glow)] text-shadow-drop hover:[text-shadow:0_0_6px_color-mix(in_srgb,var(--color-brand-glow)_40%,transparent)]",
};

/** Corner scale per button size, so the bracket never eats the label. */
const CORNER_FOR: Record<Size, number> = { sm: 12, md: 16, lg: 24, nav: 14 };

function classes(variant: Variant, size: Size, className: string): string {
  return [
    "ornate-glow relative inline-flex items-center justify-center",
    "font-display border-[2px] border-brand-accent/70",
    "cursor-pointer select-none",
    SIZES[size],
    VARIANTS[variant],
    className,
  ].join(" ");
}

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function Button({
  children,
  variant = "outline",
  size = "md",
  className = "",
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      <FrameCorners size={CORNER_FOR[size]} />
      <span className="relative">{children}</span>
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "outline",
  size = "md",
  className = "",
  ...rest
}: CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      <FrameCorners size={CORNER_FOR[size]} />
      <span className="relative">{children}</span>
    </Link>
  );
}
