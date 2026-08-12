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
  const hue = 70 + (value % 90); // greens through to warm golds
  const hue2 = (hue + 40 + (value % 30)) % 360;
  const tilt = value % 60;

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
            `radial-gradient(80% 70% at ${25 + (value % 40)}% 20%, hsl(${hue} 55% 46% / 0.95), transparent 70%)`,
            `radial-gradient(90% 80% at 80% 85%, hsl(${hue2} 45% 22% / 0.95), transparent 65%)`,
            `linear-gradient(${tilt}deg, #0b1f0d 0%, #16351a 55%, #0a1a0c 100%)`,
          ].join(","),
        }}
      />
      {/* A few soft strokes so it reads as painted rather than as a flat fill */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          background: `repeating-linear-gradient(${tilt + 20}deg, transparent 0 18px, rgba(255,255,255,0.06) 18px 22px)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}
