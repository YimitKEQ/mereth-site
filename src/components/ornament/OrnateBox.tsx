import type { CSSProperties, ReactNode } from "react";

/**
 * The frame, built the way the reference builds it.
 *
 * Not a border with corners drawn on top. Four corner brackets are pinned to
 * the corners, and four bars run *between* them, inset by the corner size, so
 * the bracket is the only thing at each corner and the rule visibly stops short
 * of it. That gap is what makes the ornament read as metalwork rather than as a
 * box with decoration stuck on.
 *
 *   bar-top     height 2px, left/right inset by the corner size
 *   bar-left    width 2px,  top/bottom inset by the corner size
 *   corner      one asset, mirrored into the other three
 *
 * The reference uses an image for the corner; this draws it, so it recolours
 * with the token and stays sharp at any size.
 */

export type OrnateSize = "sm" | "md" | "lg";

/** Corner size and bar thickness per scale, from the reference's own values. */
const CORNER: Record<OrnateSize, number> = { sm: 14, md: 28, lg: 48 };
const BAR: Record<OrnateSize, number> = { sm: 2, md: 2, lg: 3 };

/**
 * Top-left bracket. A square spiral that turns inward, mirrored into the other
 * three corners so the motif always winds the same way around the frame.
 */
function Bracket({ size, bar }: { size: number; bar: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={(bar / size) * 32}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      {/* Outer arm, flush with where the bars pick up */}
      <path d="M1 32 V1 H32" />
      {/* Return */}
      <path d="M9 32 V9 H32" />
      {/* Inward terminus, the detail that makes it a key rather than a chevron */}
      <path d="M17 24 V17 H24" />
    </svg>
  );
}

export interface OrnateBoxProps {
  children?: ReactNode;
  size?: OrnateSize;
  /** Fill drawn inside the rule. Omit for a frame over its own artwork. */
  fill?: string;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
}

export function OrnateBox({
  children,
  size = "md",
  fill = "var(--color-bg-card)",
  className = "",
  contentClassName = "",
  style,
}: OrnateBoxProps) {
  const c = CORNER[size];
  const b = BAR[size];
  const rail: CSSProperties = {
    position: "absolute",
    background: "currentColor",
    pointerEvents: "none",
    zIndex: 1,
  };

  return (
    <div
      className={`relative text-brand-accent ${className}`}
      style={{ ...style }}
    >
      {fill ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ inset: b, background: fill }}
        />
      ) : null}

      {/* Bars, stopping short of each corner by exactly the bracket size */}
      <span aria-hidden="true" style={{ ...rail, top: 0, left: c, right: c, height: b }} />
      <span aria-hidden="true" style={{ ...rail, bottom: 0, left: c, right: c, height: b }} />
      <span aria-hidden="true" style={{ ...rail, left: 0, top: c, bottom: c, width: b }} />
      <span aria-hidden="true" style={{ ...rail, right: 0, top: c, bottom: c, width: b }} />

      {/* Brackets, one drawing mirrored four ways */}
      <span className="pointer-events-none absolute" style={{ top: 0, left: 0, zIndex: 2 }}>
        <Bracket size={c} bar={b} />
      </span>
      <span
        className="pointer-events-none absolute"
        style={{ top: 0, right: 0, zIndex: 2, transform: "scaleX(-1)" }}
      >
        <Bracket size={c} bar={b} />
      </span>
      <span
        className="pointer-events-none absolute"
        style={{ bottom: 0, left: 0, zIndex: 2, transform: "scaleY(-1)" }}
      >
        <Bracket size={c} bar={b} />
      </span>
      <span
        className="pointer-events-none absolute"
        style={{ bottom: 0, right: 0, zIndex: 2, transform: "rotate(180deg)" }}
      >
        <Bracket size={c} bar={b} />
      </span>

      <div className={`relative text-text-primary ${contentClassName}`} style={{ zIndex: 3 }}>
        {children}
      </div>
    </div>
  );
}
