import { ButtonLink } from "@/components/ui/Button";
import { serverStatus } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * Full-bleed opening plate.
 *
 * The reference runs key art edge to edge behind the copy, sets the wordmark in
 * very large display caps, and drops the server status into the lower middle of
 * the same image rather than into a section of its own.
 */
export function Hero() {
  return (
    <section className="hero-bleed relative w-full overflow-hidden">
      {/*
        Art plate stand-in.
        Masked to transparent at the bottom rather than faded to the page colour:
        the fixed backdrop sits behind this, and fading to an opaque colour left
        a visible seam where the two met.
      */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          maskImage: "linear-gradient(to bottom, black 62%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 62%, transparent 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(60% 55% at 70% 40%, rgba(150,215,110,0.5), transparent 66%)",
              "radial-gradient(85% 65% at 22% 24%, rgba(70,150,80,0.4), transparent 70%)",
              "linear-gradient(180deg, #2a4f24 0%, #27501f 45%, #1e3a1a 100%)",
            ].join(","),
          }}
        />
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            background:
              "repeating-linear-gradient(102deg, transparent 0 40px, rgba(255,255,255,0.05) 40px 58px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-site px-6 pt-[190px] pb-16 md:px-8 md:pt-[260px] md:pb-28">
        <h1 className="font-display text-brand-accent text-5xl leading-none tracking-title text-shadow-page-heading md:text-7xl lg:text-8xl">
          {site.name}
        </h1>

        <p className="font-display mt-5 max-w-xl text-base tracking-heading text-brand-accent/95 text-shadow-drop md:text-xl">
          A quality Mists of Pandaria Plus+ experience
        </p>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-text-muted text-shadow-subtle md:text-base">
          Offering MoP gameplay focusing on the Mists of Pandaria Plus+ content. Made with
          passion. Under development in ALPHA stage. Want to engage? Join our Discord!
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/discord" variant="solid" size="lg">
            Join Discord
          </ButtonLink>
          <ButtonLink href="/faq" size="lg">
            FAQ
          </ButtonLink>
        </div>

        <div className="mt-20 flex flex-col items-center text-center md:mt-[130px]">
          <p className="font-display text-xs tracking-heading text-brand-accent text-shadow-drop md:text-sm">
            Server Status
          </p>
          <p className="font-display mt-2 text-xl text-white text-shadow-heading md:text-3xl">
            {serverStatus.state}
          </p>
          <p className="font-display mt-6 text-[10px] tracking-heading text-brand-accent text-shadow-drop md:text-xs">
            Total Online
          </p>
          <p className="font-display mt-1 text-3xl text-white text-shadow-heading md:text-4xl">
            {serverStatus.totalOnline}
          </p>
        </div>
      </div>
    </section>
  );
}
