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
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-xs tracking-widest",
  md: "h-12 px-6 text-sm tracking-widest",
  lg: [
    "h-[var(--size-button-height-mobile)] md:h-[var(--size-button-height)]",
    "min-w-[var(--size-button-min-width-mobile)] md:min-w-[var(--size-button-min-width)]",
    "px-8 text-[var(--text-button-mobile)] md:text-2xl tracking-heading",
  ].join(" "),
};

const VARIANTS: Record<Variant, string> = {
  solid:
    "bg-brand-accent text-brand-dark hover:bg-brand-accent/90 text-shadow-none",
  outline:
    "bg-black/40 text-brand-accent hover:bg-nav-hover/30 hover:text-white text-shadow-drop",
};

function classes(variant: Variant, size: Size, className: string): string {
  return [
    "relative inline-flex items-center justify-center",
    "font-display border border-brand-accent/80",
    "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-default)]",
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
      <FrameCorners weight={size === "lg" ? "thick" : "thin"} />
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
      <FrameCorners weight={size === "lg" ? "thick" : "thin"} />
      <span className="relative">{children}</span>
    </Link>
  );
}
