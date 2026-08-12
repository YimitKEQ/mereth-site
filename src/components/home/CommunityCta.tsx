import { ButtonLink } from "@/components/ui/Button";
import { ArtPlaceholder } from "@/components/ui/ArtPlaceholder";
import { site } from "@/lib/site";

/**
 * The closing panel, and the only piece of ornament the site does not reuse: a
 * run of pagoda roofs crowning the frame, with heavier gold posts down the
 * sides. Drawn as one SVG so the roof line scales with the panel.
 */
function PagodaCrown() {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -top-[86px] left-0 h-[92px] w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="roof-jade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#63b45c" />
          <stop offset="45%" stopColor="#358036" />
          <stop offset="100%" stopColor="#17431a" />
        </linearGradient>
      </defs>
      {[150, 600, 1050].map((cx, index) => {
        const w = index === 1 ? 210 : 190;
        const top = index === 1 ? 44 : 56;
        return (
          <g key={cx}>
            {/* Sweeping eave: shallow ridge lifting into upturned tips */}
            <path
              d={`M${cx - w} 104
                  Q${cx - w + 34} 66 ${cx - 86} ${top + 6}
                  L${cx + 86} ${top + 6}
                  Q${cx + w - 34} 66 ${cx + w} 104
                  Q${cx + 110} 88 ${cx} 85
                  Q${cx - 110} 88 ${cx - w} 104 Z`}
              fill="url(#roof-jade)"
              stroke="#dde46b"
              strokeWidth="2.5"
            />
            {/* Ridge cap and finial */}
            <rect
              x={cx - 52}
              y={top - 6}
              width="104"
              height="14"
              rx="4"
              fill="#2c6b2f"
              stroke="#dde46b"
              strokeWidth="2"
            />
            <rect
              x={cx - 10}
              y={top - 30}
              width="20"
              height="26"
              rx="4"
              fill="#17431a"
              stroke="#dde46b"
              strokeWidth="2"
            />
          </g>
        );
      })}
      {/* Beam tying the three roofs together, sitting on the panel edge */}
      <path d="M0 104 H1200" stroke="#dde46b" strokeWidth="3" fill="none" />
    </svg>
  );
}

export function CommunityCta() {
  return (
    <section className="relative mx-auto mt-28 max-w-site px-6 md:px-8">
      <div className="relative">
        <PagodaCrown />

        <div className="relative border-[3px] border-brand-accent/80">
          {/* Side posts, the heavier gold uprights framing the plate */}
          <span className="absolute inset-y-0 -left-[6px] w-[6px] bg-gradient-to-b from-brand-accent/80 via-brand-accent/40 to-brand-accent/80" />
          <span className="absolute inset-y-0 -right-[6px] w-[6px] bg-gradient-to-b from-brand-accent/80 via-brand-accent/40 to-brand-accent/80" />

          <div className="relative overflow-hidden">
            <ArtPlaceholder seed="community-cta" label="" className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-black/55" aria-hidden="true" />

            <div className="relative flex flex-col items-center px-6 py-16 text-center md:py-24">
              <h2 className="font-display text-xl tracking-heading text-brand-accent text-shadow-page-heading md:text-3xl">
                Join the {site.name} Community
              </h2>
              <p className="mt-4 max-w-md text-sm text-text-muted text-shadow-subtle md:text-base">
                Connect with rest of the {site.name} community on discord. Stay informed with
                updates, events and details.
              </p>
              <ButtonLink href="/discord" variant="solid" size="md" className="mt-8 min-w-[240px]">
                Join Discord
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
