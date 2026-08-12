import Link from "next/link";

import { site } from "@/lib/site";

/**
 * Stand-in for the emblem.
 *
 * The reference's mark is a painted gold plaque and is not ours to copy, so this
 * is a drawn plaque in the same silhouette: a wide bevelled lozenge with the
 * wordmark over a small caps subtitle. It occupies the same footprint, so
 * dropping in real artwork later is a straight swap with no layout change.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group relative inline-flex shrink-0 items-center justify-center ${className}`}
      aria-label={`${site.name} home`}
    >
      <svg
        viewBox="0 0 240 64"
        className="h-14 w-[210px] md:h-16 md:w-[240px]"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="plaque-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#123016" />
            <stop offset="50%" stopColor="#08210b" />
            <stop offset="100%" stopColor="#0a250d" />
          </linearGradient>
          <linearGradient id="plaque-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f2f6a8" />
            <stop offset="45%" stopColor="#dde46b" />
            <stop offset="100%" stopColor="#8d9433" />
          </linearGradient>
        </defs>
        {/* Bevelled lozenge, wider than tall with clipped corners */}
        <path
          d="M18 4 H222 L236 32 L222 60 H18 L4 32 Z"
          fill="url(#plaque-fill)"
          stroke="url(#plaque-edge)"
          strokeWidth="2.5"
        />
        <path
          d="M24 10 H216 L227 32 L216 54 H24 L13 32 Z"
          fill="none"
          stroke="url(#plaque-edge)"
          strokeWidth="1"
          opacity="0.55"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-brand-accent text-lg leading-none tracking-[2px] text-shadow-heading md:text-xl">
          {site.name}
        </span>
        <span className="font-display mt-1 text-[7px] leading-none tracking-[2.5px] text-brand-accent/70 md:text-[8px]">
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
