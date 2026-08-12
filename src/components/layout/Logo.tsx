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
      {/*
        Sized to the reference's emblem footprint (320x155, stepping to 288x140
        at 1500px and smaller again on mobile). It is far taller than the pill
        on purpose: the emblem overhangs above and below it.
      */}
      <svg
        viewBox="0 0 320 155"
        className="h-[110px] w-[228px] min-[1200px]:h-[140px] min-[1200px]:w-[288px] min-[1501px]:h-[155px] min-[1501px]:w-[320px]"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="plaque-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#243139" />
            <stop offset="50%" stopColor="#111a20" />
            <stop offset="100%" stopColor="#0b1216" />
          </linearGradient>
          <linearGradient id="plaque-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d7e6ee" />
            <stop offset="45%" stopColor="#9fb8c4" />
            <stop offset="100%" stopColor="#5d737f" />
          </linearGradient>
        </defs>
        {/* Crest: a bevelled lozenge with a banner tail, centred in the box */}
        <path
          d="M40 30 H280 L306 74 L280 118 H40 L14 74 Z"
          fill="url(#plaque-fill)"
          stroke="url(#plaque-edge)"
          strokeWidth="3"
        />
        <path
          d="M50 40 H270 L292 74 L270 108 H50 L28 74 Z"
          fill="none"
          stroke="url(#plaque-edge)"
          strokeWidth="1.25"
          opacity="0.55"
        />
        {/* Wing flourishes, which is what gives the reference mark its width */}
        <path
          d="M14 74 L2 62 M14 74 L2 86 M306 74 L318 62 M306 74 L318 86"
          stroke="url(#plaque-edge)"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />
      </svg>
      <span className="absolute inset-x-0 top-[19%] bottom-[23%] flex flex-col items-center justify-center">
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
