/**
 * The horizontal rule with a fret knot in the middle.
 *
 * Two uses in the reference: above the footer as a full-width rule, and inline
 * around a heading ("WANT TO USE YOUR OWN CLIENT?") where the rules run to
 * either side of the text.
 */

function FretKnot() {
  return (
    <svg
      width="56"
      height="16"
      viewBox="0 0 56 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      className="text-brand-accent"
    >
      {/* Stepped key motif, mirrored around the centre block */}
      <path d="M0 8 H10 V3 H16 V13 H22 V8" />
      <path d="M56 8 H46 V3 H40 V13 H34 V8" />
      <rect x="24" y="4" width="8" height="8" />
    </svg>
  );
}

/** Full-width rule with the knot centred. */
export function OrnateDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex w-full items-center ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-brand-accent/60" />
      <span className="px-2">
        <FretKnot />
      </span>
      <span className="h-px flex-1 bg-brand-accent/60" />
    </div>
  );
}

/** Rules to either side of a short uppercase label. */
export function OrnateLabelDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center gap-4">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-accent/60" />
      <h3 className="font-display text-brand-accent tracking-heading text-lg whitespace-nowrap text-shadow-drop">
        {children}
      </h3>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-accent/60" />
    </div>
  );
}
