/**
 * The small Nordic marks the navbar is built from.
 *
 * The bar was the only surface on the site using none of the ornament
 * vocabulary: a plain rounded rectangle next to pages full of fret corners,
 * interlace brackets and rune bands. These are the pieces that tie it back in,
 * drawn rather than sliced so they recolour with the token and stay crisp.
 *
 * Restraint is the point. A navbar is chrome a reader looks past a hundred
 * times a session, so the ornament has to survive being ignored: two small
 * knots and a hairline, not a carved header.
 */

/**
 * A square interlace knot, the same weave as the panel brackets.
 *
 * Two strands crossing on the diagonal with a break in the under-strand where
 * the over-strand passes. That break is the whole motif; without it this reads
 * as a cross rather than as knotwork.
 */
export function InterlaceKnot({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="butt"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* Under-strand, broken where the other passes over it */}
      <path d="M3 16 L11 8" />
      <path d="M21 8 L29 16" />
      <path d="M3 16 L11 24" />
      <path d="M21 24 L29 16" />
      {/* Over-strand, unbroken, which is what makes the weave read */}
      <path d="M11 8 L21 24" />
      <path d="M11 24 L21 8" />
      {/* Terminal pegs, so the diagonals do not float */}
      <path d="M3 13 L3 19" />
      <path d="M29 13 L29 19" />
    </svg>
  );
}
