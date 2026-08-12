/**
 * Stand-in for photography and key art.
 *
 * The reference's images are Blizzard artwork and are not ours to ship, so every
 * image slot renders a deterministic painted gradient instead. Deterministic
 * matters: the same seed gives the same plate on every render, so the grid looks
 * composed rather than random, and screenshot comparison stays stable.
 *
 * Each one keeps the reference's aspect ratio, so swapping in real art later
 * changes no layout.
 */

function hash(seed: string): number {
  let value = 0;
  for (let index = 0; index < seed.length; index += 1) {
    value = (value * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return value;
}

export function ArtPlaceholder({
  seed,
  className = "",
  label,
}: {
  seed: string;
  className?: string;
  label?: string;
}) {
  const value = hash(seed);
  // Cold northern range only: slate blue through steel, with a narrow ochre
  // window for firelight. The previous version swept greens and golds, which
  // fought the palette the moment the brand went cold.
  const hue = 196 + (value % 34);            // 196..229, slate to iron blue
  const warm = 36 + (value % 12);            // 36..47, tallow and rust
  const tilt = value % 50;
  const lift = 10 + (value % 12);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      role="img"
      aria-label={label ?? "Placeholder artwork"}
    >
      <div
        className="absolute inset-0"
        style={{
          background: [
            `radial-gradient(85% 70% at ${22 + (value % 40)}% 18%, hsl(${hue} 22% ${lift + 26}% / 0.9), transparent 72%)`,
            `radial-gradient(60% 50% at 78% 82%, hsl(${warm} 30% ${lift + 12}% / 0.55), transparent 68%)`,
            `linear-gradient(${tilt}deg, #0d141a 0%, #1b262d 55%, #0a1014 100%)`,
          ].join(","),
        }}
      />
      {/* A few soft strokes so it reads as painted rather than as a flat fill */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          background: `repeating-linear-gradient(${tilt + 20}deg, transparent 0 16px, rgba(232,228,217,0.05) 16px 21px)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080d10]/70 to-transparent" />
    </div>
  );
}
