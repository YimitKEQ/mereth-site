import { ButtonLink } from "@/components/ui/Button";
import { ArtPlaceholder } from "@/components/ui/ArtPlaceholder";
import { site } from "@/lib/site";

/**
 * The closing panel, and the only piece of ornament the site does not reuse: a
 * run of pagoda roofs crowning the frame, with heavier gold posts down the
 * sides. Drawn as one SVG so the roof line scales with the panel.
 */
/**
 * Gabled roof line crowning the panel, taken from the timber gables in the hero
 * painting: steep pitch, carved bargeboards, a ridge post at each apex. Drawn as
 * one SVG so the roof scales with the panel.
 */
function GableCrown() {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -top-[78px] left-0 h-[84px] w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="roof-slate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b4a54" />
          <stop offset="60%" stopColor="#232f36" />
          <stop offset="100%" stopColor="#151d22" />
        </linearGradient>
      </defs>
      {[200, 600, 1000].map((cx, index) => {
        const w = index === 1 ? 200 : 170;
        const apex = index === 1 ? 26 : 42;
        return (
          <g key={cx}>
            {/* Steep pitch with a slight flare at the eaves */}
            <path
              d={`M${cx - w} 106 L${cx} ${apex} L${cx + w} 106 L${cx + w - 16} 106 L${cx} ${apex + 22} L${cx - w + 16} 106 Z`}
              fill="url(#roof-slate)"
              stroke="#9fb8c4"
              strokeWidth="2"
            />
            {/* Ridge post */}
            <path
              d={`M${cx} ${apex} V${apex - 16}`}
              stroke="#9fb8c4"
              strokeWidth="3"
              fill="none"
            />
          </g>
        );
      })}
      {/* Beam the gables stand on */}
      <path d="M0 106 H1200" stroke="#9fb8c4" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

export function CommunityCta() {
  return (
    <section className="relative mx-auto mt-28 max-w-site px-6 md:px-8">
      <div className="relative">
        <GableCrown />

        <div className="relative border-[3px] border-brand-accent/80">
          {/* Side posts, the heavier gold uprights framing the plate */}
          <span className="absolute inset-y-0 -left-[6px] w-[6px] bg-gradient-to-b from-brand-accent/80 via-brand-accent/40 to-brand-accent/80" />
          <span className="absolute inset-y-0 -right-[6px] w-[6px] bg-gradient-to-b from-brand-accent/80 via-brand-accent/40 to-brand-accent/80" />

          <div className="relative overflow-hidden">
            <ArtPlaceholder seed="community-cta" label="" className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-black/55" aria-hidden="true" />

            <div className="relative flex flex-col items-center px-6 py-16 text-center md:py-24">
              <h2 className="font-display text-xl tracking-heading text-brand-accent text-shadow-page-heading md:text-3xl">
                Take the road to {site.name}
              </h2>
              <p className="mt-4 max-w-md text-sm text-text-muted text-shadow-subtle md:text-base">
                Applications are read by a person, not a bot. Bring a character who wants
                something and we will find them somewhere to want it.
              </p>
              <ButtonLink href="/discord" variant="solid" size="md" className="mt-8 min-w-[240px]">
                Apply to play
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
