import type { Metadata } from "next";

import { CodexHeader } from "@/components/codex/CodexHeader";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { PlateFigure, PlateImage } from "@/components/ui/Plate";
import { pageMeta } from "@/lib/seo";
import { plate } from "@/lib/images";
import { inline } from "@/lib/markup";
import { holds } from "@/lib/world/holds";

export const metadata: Metadata = pageMeta({
  path: "/holds",
  title: "The Nine Holds",
  description:
    "Skyrim's nine holds in 4E 185, their seats and the jarls who hold them, and how rank and property work inside one.",
});

/**
 * The nine holds.
 *
 * Four seats have no published jarl. They are shown as vacant rather than
 * Every seat is held. Five courts have no published name yet and say so, which
 * is a different fact from a vacant throne and the more important one: a player
 * choosing where to belong must not build a character around taking a seat that
 * is already somebody else's. An invented jarl is the fastest way to break
 * another player's roleplay, so names are only ever transcribed.
 */
export default function HoldsPage() {
  const written = holds.filter((hold) => hold.jarl !== null);
  const awaiting = holds.filter((hold) => hold.jarl === null);

  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <CodexHeader
        title="The Nine Holds"
        lede={`Skyrim in 4E 185, a decade after the White-Gold Concordat. You pledge to one hold, hold
          a rank in it, and its jarl or steward grants the parcels that let you own a house or a
          workshop. **Each hold sets its own law**, including which spells are legal to cast in it,
          so the same act can be fine in Winterhold and a crime in Markarth.`}
        facts={[
          { label: "Holds", value: String(holds.length) },
          { label: "Seats held", value: String(holds.length) },
          { label: "Courts written up", value: String(written.length) },
        ]}
      />

      {/* The map is a document, not a backdrop. Shown whole at its own 4:3 and
          kept narrow: cropping a cartographer's map to a letterbox throws away
          the hold borders, which are the only reason to look at it. */}
      <figure className="mx-auto mb-14 max-w-2xl">
        <PlateImage
          slug="holds-map"
          scale="md"
          priority
          aspect="aspect-[4/3]"
          sizes="(max-width: 768px) 100vw, 42rem"
          className="[&_img]:object-contain [&_img]:bg-[#0b1013]"
        />
        <figcaption className="mt-3 text-center text-[0.82rem] text-text-muted">
          {plate("holds-map").caption}
        </figcaption>
      </figure>

      {/* Who actually sits in these places. The map says where a hold is; these
          say that the court inside it is staffed by people. */}
      <div className="mb-14 grid gap-5 md:grid-cols-3">
        <PlateFigure slug="hold-moot" />
        <PlateFigure slug="the-court" />
        <PlateFigure slug="a-jarl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {written.map((hold) => (
          <article key={hold.name} className="relative border border-brand-accent/30 bg-black/30 p-7">
            <FrameCorners weight="thin" size={18} />
            <h2 className="font-display relative text-xl tracking-heading text-brand-accent uppercase">
              {hold.name}
            </h2>
            <p className="relative mt-1 text-[0.85rem] text-text-muted">
              Seat of {hold.seat}
            </p>
            <p className="relative mt-4 text-[1rem] text-text-primary">{hold.jarl}</p>

            <div className="relative mt-4 space-y-3.5">
              {[...hold.jarlStory, ...hold.holdStory].map((paragraph, i) => (
                <p key={i} className="text-[0.92rem] leading-[1.8] text-text-light">
                  {inline(paragraph)}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>

      {awaiting.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display mb-4 text-[0.95rem] tracking-heading text-brand-accent uppercase">
            Held, and not yet written up
          </h2>
          {/* The distinction that matters on this page. These are not empty
              thrones: somebody holds each one, and building a character around
              taking a vacant seat here would be building on a mistake. */}
          <p className="mb-6 max-w-[68ch] text-[0.95rem] leading-relaxed text-text-muted">
            Every seat in Skyrim is held. These courts simply have no write-up here yet, which is a
            gap in this page rather than a gap in the province. None of them is a throne you can
            walk into: seizing a hold bypasses the Moot, and an Usurper is retaken and executed.
            Watch Discord for whitelist openings.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {awaiting.map((hold) => (
              <li
                key={hold.name}
                className="border border-border-subtle px-4 py-3 text-[0.9rem] text-text-light"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span>
                    {hold.name}
                    <span className="ml-2 text-text-muted">{hold.seat}</span>
                  </span>
                  {hold.title === undefined ? null : (
                    <span className="font-display shrink-0 text-[10px] tracking-[1.4px] text-brand-accent uppercase">
                      {hold.title}
                    </span>
                  )}
                </span>
                {hold.pending === undefined ? null : (
                  <span className="mt-1.5 block text-[0.82rem] leading-relaxed text-text-muted">
                    {hold.pending}
                  </span>
                )}
                {/* A hold can be described even when its court is not. Winterhold
                    is: its paragraph was written and was rendering nowhere. */}
                {hold.holdStory.map((paragraph) => (
                  <span
                    key={paragraph.slice(0, 40)}
                    className="mt-3 block text-[0.85rem] leading-relaxed text-text-light"
                  >
                    {paragraph}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
