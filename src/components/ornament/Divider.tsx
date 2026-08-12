/**
 * The horizontal rule with a fret knot in the middle.
 *
 * Two uses in the reference: above the footer as a full-width rule, and inline
 * around a heading ("WANT TO USE YOUR OWN CLIENT?") where the rules run to
 * either side of the text.
 */

/**
 * A short band of Elder Futhark, carved rather than written.
 *
 * Six staves centred between the rules. They are drawn as strokes on a common
 * baseline so the band reads as one carved line, which is how runes appear on a
 * standing stone: the stave is the vertical, the meaning is in the branches.
 */
function RuneBand() {
  return (
    <svg
      width="132"
      height="20"
      viewBox="0 0 132 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      className="ornate-rune-band text-brand-accent"
    >
      {/* Fehu */}
      <path d="M6 3 V17 M6 5 L12 8 M6 10 L12 13" />
      {/* Raido */}
      <path d="M26 3 V17 M26 3 L32 6 L26 9 M26 9 L32 17" />
      {/* Thurisaz */}
      <path d="M46 3 V17 M46 6 L51 9 L46 12" />
      {/* Algiz, the centre stave, tallest */}
      <path d="M66 1 V19 M66 7 L60 2 M66 7 L72 2" />
      {/* Eihwaz */}
      <path d="M86 3 V17 M86 3 L91 1 M86 17 L81 19" />
      {/* Mannaz */}
      <path d="M106 3 V17 M118 3 V17 M106 4 L118 12 M118 4 L106 12" />
      {/* Ingwaz */}
      <path d="M126 6 L130 10 L126 14 L122 10 Z" />
    </svg>
  );
}

/** Full-width rule with the rune band centred. */
export function OrnateDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex w-full items-center ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-brand-accent/60" />
      <span className="px-2">
        <RuneBand />
      </span>
      <span className="h-px flex-1 bg-brand-accent/60" />
    </div>
  );
}

/** Rules to either side of a short uppercase label. */
export function OrnateLabelDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center gap-4">
      {/* The rules hide below sm and the label wraps. Forcing nowrap made a long
          label 545px wide inside a 390px viewport and pushed the page sideways. */}
      <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent to-brand-accent/60 sm:block" />
      <h3 className="font-display flex-1 text-center text-base tracking-heading text-brand-accent text-shadow-drop sm:flex-none sm:text-lg md:whitespace-nowrap">
        {children}
      </h3>
      <span className="hidden h-px flex-1 bg-gradient-to-l from-transparent to-brand-accent/60 sm:block" />
    </div>
  );
}
