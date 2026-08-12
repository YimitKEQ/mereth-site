import type { ReactNode } from "react";

/**
 * The frame motif the whole site is built from.
 *
 * Every panel, card, accordion row, button and input in the reference is the
 * same idea: a thin accent rule with a Chinese fret (回) bracket pinned to each
 * corner. It is drawn rather than sliced from an image so it stays crisp at any
 * size and recolours with the brand token.
 */

type Weight = "thin" | "thick" | "heavy";

const CORNER_SIZE: Record<Weight, number> = {
  thin: 16,
  thick: 22,
  heavy: 30,
};

const STROKE: Record<Weight, number> = {
  thin: 1.5,
  thick: 2,
  heavy: 2.5,
};

/**
 * One corner of the fret. Drawn for the top-left and rotated into the other
 * three, so the spiral always winds the same way around the frame.
 */
function FretCorner({ size, stroke }: { size: number; stroke: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      {/* Outer bracket, flush with the frame rule */}
      <path d="M1 23 V1 H23" />
      {/* Inner return */}
      <path d="M6 23 V6 H23" />
      {/* Spiral terminus, the detail that reads as a key pattern rather than a box */}
      <path d="M11 17 V11 H17" />
    </svg>
  );
}

/**
 * The four brackets on their own, for anything that draws its own border:
 * buttons, inputs, selects, accordion rows. Drop into a `relative` element.
 */
export function FrameCorners({ weight = "thin" }: { weight?: Weight }) {
  const size = CORNER_SIZE[weight];
  const stroke = STROKE[weight];
  const offset = -1;
  const corners = [
    { style: { top: offset, left: offset } },
    { style: { top: offset, right: offset, transform: "rotate(90deg)" } },
    { style: { bottom: offset, right: offset, transform: "rotate(180deg)" } },
    { style: { bottom: offset, left: offset, transform: "rotate(270deg)" } },
  ];
  return (
    <>
      {corners.map((corner, index) => (
        <span
          key={index}
          className="pointer-events-none absolute text-current"
          style={corner.style}
        >
          <FretCorner size={size} stroke={stroke} />
        </span>
      ))}
    </>
  );
}

export interface OrnateFrameProps {
  children: ReactNode;
  /** Rule and corner scale. `heavy` is the full-page panel, `thin` is a row. */
  weight?: Weight;
  /** Translucent black card fill. Off for frames laid over their own artwork. */
  filled?: boolean;
  className?: string;
  /** Applied to the inner content wrapper, for padding. */
  contentClassName?: string;
}

export function OrnateFrame({
  children,
  weight = "thick",
  filled = true,
  className = "",
  contentClassName = "",
}: OrnateFrameProps) {
  return (
    <div
      className={`relative border border-brand-accent/70 text-brand-accent ${
        filled ? "bg-bg-card backdrop-blur-[var(--blur-panel)]" : ""
      } ${className}`}
    >
      <FrameCorners weight={weight} />
      <div className={`text-text-primary ${contentClassName}`}>{children}</div>
    </div>
  );
}
