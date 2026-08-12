import type { ReactNode } from "react";

/**
 * The frame motif the whole site is built from.
 *
 * Every panel, card, accordion row, button and input in the reference is the
 * same idea: a thin accent rule with a Chinese fret (回) bracket pinned to each
 * corner. It is drawn rather than sliced from an image so it stays crisp at any
 * size and recolours with the brand token.
 */

/*
 * Sizes and rule widths are the reference's own, read off its stylesheet rather
 * than estimated from a screenshot:
 *
 *   panel corners     48px, dropping to 34px on the how-to-play panel
 *   accordion corners 28px
 *   rule width        3px on small and medium panels, 4px on large
 *   panel shadow      0 0 6px #0006
 */
type Weight = "thin" | "thick" | "heavy";

const CORNER_SIZE: Record<Weight, number> = {
  thin: 28,
  thick: 34,
  heavy: 48,
};

const RULE_WIDTH: Record<Weight, number> = {
  thin: 3,
  thick: 3,
  heavy: 4,
};

const STROKE: Record<Weight, number> = {
  thin: 2,
  thick: 2,
  heavy: 2.25,
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
export function FrameCorners({
  weight = "thin",
  size: sizeOverride,
}: {
  weight?: Weight;
  /**
   * Explicit corner size. Controls need their own scale: a 28px bracket is
   * right on an accordion row and eats the label on a 36px button.
   */
  size?: number;
}) {
  const size = sizeOverride ?? CORNER_SIZE[weight];
  const stroke = STROKE[weight];
  const offset = -1;
  /*
   * The brackets sit above whatever they frame.
   *
   * Without this they lose to any positioned sibling that comes later in the
   * DOM, which is exactly the shape every picture uses: corners first, then a
   * `position: relative` box holding the image. Positioned elements paint in
   * document order at the same z-index, so the picture covered its own frame.
   * A z-index puts the ornament back on top wherever it is used, rather than
   * making every caller remember to order its children a particular way.
   */
  const corners = [
    { style: { top: offset, left: offset, zIndex: 5 } },
    { style: { top: offset, right: offset, zIndex: 5, transform: "rotate(90deg)" } },
    { style: { bottom: offset, right: offset, zIndex: 5, transform: "rotate(180deg)" } },
    { style: { bottom: offset, left: offset, zIndex: 5, transform: "rotate(270deg)" } },
  ];
  return (
    <>
      {corners.map((corner, index) => (
        <span
          key={index}
          className="ornate-corner pointer-events-none absolute text-current"
          style={corner.style}
        >
          <FretCorner size={size} stroke={stroke} />
        </span>
      ))}
    </>
  );
}

