import type { Metadata } from "next";
import Link from "next/link";

import { Clip } from "@/components/gallery/Clip";
import { Gallery } from "@/components/gallery/Lightbox";
import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ButtonLink } from "@/components/ui/Button";
import { plates } from "@/lib/images";
import { DISCORD_INVITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Screenshots from the province, and the custom work being built for it: interiors, and models from our own artist.",
};

/**
 * The gallery.
 *
 * Two halves, and they are honest about which is which. The screenshots are
 * real and in hand. The interiors and the models are announced but not
 * delivered, so those sections say so plainly instead of standing in grey
 * boxes pretending to be pictures.
 *
 * That distinction matters more than it looks: a placeholder that looks like
 * content is a promise the page cannot keep, and on a server whose players
 * check this page for what is actually built, that is the wrong first
 * impression. An empty section that names what is coming ages into real
 * content; a fake one has to be found and removed.
 */

/** Everything except the two that are interface rather than world. */
const WORLD_PLATES = Object.values(plates).filter(
  (plate) => plate.slug !== "skill-menu" && plate.slug !== "holds-map",
);

interface Awaited {
  title: string;
  by: string;
  body: string;
}

/*
 * Sections with nothing in them yet.
 *
 * Written so that adding the work is the only change needed: drop the images
 * into MerethPics, run the image build, and swap the section for a <Gallery>.
 */
const AWAITING: Awaited[] = [
  {
    title: "Interiors",
    by: "Built in the Creation Kit by our own team",
    body: "Custom interiors made for Mereth rather than dressed from vanilla: halls, shops, and the rooms holds actually meet in. They are being built now and will be shown here as they go live.",
  },
  {
    title: "Models",
    by: "Made by our artist",
    body: "Original 3D work, modelled and textured for the province rather than pulled from a mod. Weapons, furniture and set pieces. Shown here once they are in the game.",
  },
];

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />

      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          The Realm
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          Gallery
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">
          Screenshots from the province, taken in play rather than staged. Every one is a real
          moment on the live server: a hall at dinner, a gate under guard, a shaman at a fire.
        </p>
        <div className="mt-8">
          <ButtonLink href={DISCORD_INVITE} size="md">
            Send us yours
          </ButtonLink>
        </div>
      </header>

      <OrnateDivider className="my-12" />

      {/* The one moving piece, above the stills rather than in the grid with them.
          A tile that animates inside a grid of photographs pulls the eye off every
          other tile permanently, and the grid is the point of the page. Given its
          own band it reads as the opening shot instead of as a distraction. */}
      <Clip
        slug="the-long-walk"
        align="center"
        title="The long walk"
        caption="Most of the province is between places. There is no fast travel here, so the road is somewhere you actually spend your evening, and the weather gets a say in it."
      />

      <OrnateDivider className="my-12" />

      <Gallery plates={WORLD_PLATES} />

      <section className="mt-20">
        <h2 className="font-display mb-3 text-xl tracking-heading text-brand-accent uppercase">
          Being built now
        </h2>
        <p className="mb-9 max-w-[68ch] text-[0.98rem] leading-relaxed text-text-muted">
          Two things are in progress and neither is ready to show. Rather than fill this space with
          stand-ins, here is what is coming and who is making it.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {AWAITING.map((item) => (
            <article
              key={item.title}
              className="relative flex flex-col border border-dashed border-brand-accent/30 bg-black/25 p-7"
            >
              <FrameCorners size={16} />

              <div className="relative flex items-baseline justify-between gap-4">
                <h3 className="font-display text-[1rem] tracking-heading text-brand-accent uppercase">
                  {item.title}
                </h3>
                <span className="font-display shrink-0 border border-brand-accent/30 px-2.5 py-1 text-[10px] tracking-[1.4px] text-text-muted uppercase">
                  In progress
                </span>
              </div>

              <p className="relative mt-1.5 text-[0.82rem] text-text-muted/80">{item.by}</p>
              <p className="relative mt-4 flex-1 text-[0.92rem] leading-relaxed text-text-light">
                {item.body}
              </p>

              {/* A drawn placeholder, obviously a placeholder. Nothing here
                  should be mistaken for a picture of finished work. */}
              <div
                aria-hidden="true"
                className="relative mt-6 flex h-28 items-center justify-center border border-brand-accent/15"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, #9fb8c40a 0 10px, transparent 10px 20px)",
                }}
              >
                <span className="font-display text-[10px] tracking-[2px] text-text-muted/50 uppercase">
                  Nothing to show yet
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display mb-4 text-xl tracking-heading text-brand-accent uppercase">
          Send us a screenshot
        </h2>
        <p className="text-[0.98rem] leading-[1.8] text-text-light">
          If you take something worth looking at, post it in Discord. We would rather this page
          filled up with your evenings than with ours, and anything used here is credited to the
          person who took it.{" "}
          <Link
            href="/credits"
            className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 hover:decoration-brand-glow"
          >
            Credits
          </Link>{" "}
          works the same way for the mods we install.
        </p>
      </section>
    </div>
  );
}
