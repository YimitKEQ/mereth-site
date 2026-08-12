import Image from "next/image";
import Link from "next/link";

import { site } from "@/lib/site";

/**
 * Mereth's own mark, recoloured for a dark page by `scripts/build-logo.mjs`.
 *
 * The drawn plaque this replaced was a stand-in for artwork we did not have,
 * and it overhung the bar because the reference's emblem does. With a real mark
 * that overhang stops being a design decision and starts being a misalignment:
 * the glyph is a piece of lettering, not a crest, so it sits **on** the bar's
 * baseline with the wordmark beside it.
 */
export function Logo({
  variant = "bar",
  className = "",
}: {
  /** `bar` is the glyph plus wordmark for the navbar. `stacked` is the footer lockup. */
  variant?: "bar" | "stacked";
  className?: string;
}) {
  if (variant === "stacked") {
    return (
      <Link href="/" className={`inline-block ${className}`} aria-label={`${site.name} home`}>
        <Image
          src="/brand/mereth-lockup.png"
          alt={`${site.name} Roleplay`}
          width={985}
          height={713}
          sizes="200px"
          className="h-auto w-[168px] opacity-90"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3.5 ${className}`}
      aria-label={`${site.name} home`}
    >
      <Image
        src="/brand/mereth-mark.png"
        alt=""
        width={799}
        height={605}
        priority
        sizes="52px"
        aria-hidden="true"
        className="h-[38px] w-auto transition-[filter] duration-[var(--duration-fast)] group-hover:brightness-125 xl:h-[44px]"
      />
      <span className="flex flex-col justify-center leading-none">
        <span className="font-display text-[1.15rem] leading-none tracking-[3px] text-text-primary text-shadow-heading xl:text-[1.35rem]">
          {site.name.toUpperCase()}
        </span>
        <span className="font-display mt-[5px] text-[8px] leading-none tracking-[3.2px] text-brand-accent/75 xl:text-[9px]">
          {site.tagline.toUpperCase()}
        </span>
      </span>
    </Link>
  );
}
