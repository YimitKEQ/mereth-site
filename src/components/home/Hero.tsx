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
      {/* No plate of its own: the background stage carries the art for the whole
          document, and layering a second copy here ghosted the wordmark. Only
          the scrim remains, to hold the copy off the moving image. */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(100deg, #0b1013f2 0%, #0b1013cc 38%, #0b101359 62%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-site px-6 pt-[190px] pb-16 md:px-8 md:pt-[260px] md:pb-28">
        <h1 className="font-display text-brand-accent text-5xl leading-none tracking-title text-shadow-page-heading md:text-7xl lg:text-8xl">
          {site.name}
        </h1>

        <p className="font-display mt-5 max-w-xl text-base tracking-heading text-brand-accent/95 text-shadow-drop md:text-xl">
          Skyrim roleplay, 4E 185
        </p>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-text-muted text-shadow-subtle md:text-base">
          Ten years after the White-Gold Concordat. Imperial law still runs in the holds, and
          the Thalmor are counting. Bring a character who wants something.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/discord" variant="solid" size="lg">
            Apply to play
          </ButtonLink>
          <ButtonLink href="/wiki" size="lg">
            Read the archive
          </ButtonLink>
        </div>

        <div className="mt-20 flex flex-col items-center text-center md:mt-[130px]">
          <p className="font-display text-xs tracking-heading text-brand-accent text-shadow-drop md:text-sm">
            The realm
          </p>
          <p className="font-display mt-2 text-xl text-text-primary text-shadow-heading md:text-3xl">
            {serverStatus.state}
          </p>
          <p className="font-display mt-6 text-[10px] tracking-heading text-brand-accent text-shadow-drop md:text-xs">
            Souls abroad
          </p>
          <p className="font-display mt-1 text-3xl text-text-primary text-shadow-heading md:text-4xl">
            {serverStatus.totalOnline}
          </p>
          <p className="mt-6 text-xs tracking-widest text-text-muted uppercase">
            {serverStatus.worldDate}
          </p>
        </div>
      </div>
    </section>
  );
}
