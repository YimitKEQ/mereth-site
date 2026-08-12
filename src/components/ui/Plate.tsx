import Link from "next/link";
import type { ReactNode } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { plate, type Plate } from "@/lib/images";

/**
 * A picture in the site's frame.
 *
 * The reference frames the image and puts the words underneath on the page
 * background rather than inside a box. That is what keeps a grid of six from
 * reading as six heavy panels, so it is copied deliberately: frame the picture,
 * never the paragraph.
 *
 * Corner scale is tied to the card's own size rather than fixed. A 28px bracket
 * is right on a 400px card and eats a 200px one, and the whole ornament stops
 * working the moment it is out of proportion with the text beside it.
 *
 * The frame itself is the reference's, matched to its computed styles rather
 * than eyeballed: a 3px accent rule (`--border-ornate-thin`), a 2px backdrop
 * blur (`--blur-panel`), a resting `0 0 12px #0006` and a transition on
 * box-shadow alone at `--duration-normal`. Transitioning only the shadow is
 * what makes the hover feel like a light coming up rather than a card moving.
 */

type Scale = "sm" | "md" | "lg";

/** Bracket size per card scale, and the rule width that goes with it. */
const CORNER: Record<Scale, number> = { sm: 16, md: 22, lg: 30 };

/**
 * The srcset for a plate, from the widths that were actually emitted.
 *
 * next/image builds this itself normally, but `images: { unoptimized: true }`
 * is required on a host with no image server and it turns srcset generation
 * off entirely. The `sizes` prop below was therefore inert, and an 1800px file
 * was being sent to a 400px card: three of the home page's cards alone shipped
 * 533 KB where 94 KB would do. `scripts/build-images.mjs` bakes the narrow
 * copies at build time and this stitches them into the attribute the browser
 * needs, so `sizes` starts meaning something again.
 */
function srcSetFor(image: Plate): string {
  const narrow = image.widths.map((w) => `${image.src.replace(/\.webp$/, `-${w}.webp`)} ${w}w`);
  return [...narrow, `${image.src} ${image.width}w`].join(", ");
}

export function PlateImage({
  slug,
  scale = "md",
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
  aspect = "aspect-[16/10]",
}: {
  slug: string;
  scale?: Scale;
  /** Only for a picture above the fold. Everything else lazy loads. */
  priority?: boolean;
  className?: string;
  sizes?: string;
  aspect?: string;
}) {
  const image = plate(slug);

  return (
    <div className={`relative text-brand-accent ${className}`}>
      <FrameCorners size={CORNER[scale]} />
      <div
        className={`plate-frame relative w-full overflow-hidden ${aspect}`}
        style={{
          borderWidth: "var(--border-ornate-thin)",
          borderStyle: "solid",
          borderColor: "color-mix(in srgb, var(--color-brand-accent) 62%, transparent)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image
            drops srcSet under `unoptimized`, which is the whole point here. */}
        <img
          src={image.src}
          srcSet={srcSetFor(image)}
          sizes={sizes}
          alt={image.title}
          width={image.width}
          height={image.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            backgroundImage: `url(${image.blurDataURL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/*
          A hairline of the page's own dark at the foot of every picture. The
          screenshots are lit from every direction and some of them end in bright
          snow, which fights the caption sitting under it.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top, #0b1013b3 0%, transparent 32%)" }}
        />
      </div>
    </div>
  );
}

/**
 * The reference's card: framed picture, then a gold title and a short
 * paragraph on the page beneath it. Optionally a link, in which case the whole
 * card is the target.
 */
export function PlateCard({
  slug,
  title,
  body,
  href,
  scale = "md",
  priority = false,
  sizes,
  aspect,
}: {
  slug: string;
  /** Overrides the manifest's title when the card needs page-specific wording. */
  title?: string;
  body: ReactNode;
  href?: string;
  scale?: Scale;
  priority?: boolean;
  sizes?: string;
  aspect?: string;
}) {
  const image = plate(slug);
  const heading = title ?? image.title;

  const inner = (
    <>
      <PlateImage slug={slug} scale={scale} priority={priority} sizes={sizes} aspect={aspect} />
      <h3 className="font-display mt-5 text-base tracking-heading text-brand-accent uppercase text-shadow-drop md:text-lg">
        {heading}
      </h3>
      <p className="mt-2.5 text-[0.9rem] leading-relaxed text-text-muted text-shadow-subtle">
        {body}
      </p>
    </>
  );

  if (href === undefined) {
    return <article className="group flex flex-col">{inner}</article>;
  }

  return (
    <Link href={href} className="group flex flex-col">
      {inner}
      <span className="mt-3 text-[0.82rem] text-brand-accent/70 transition-colors group-hover:text-brand-glow">
        Read on <span aria-hidden="true">&rarr;</span>
      </span>
    </Link>
  );
}
