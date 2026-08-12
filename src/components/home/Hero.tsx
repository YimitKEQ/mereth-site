import Image from "next/image";

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
        Commissioned oil plate. Masked to transparent at the foot rather than
        faded to the page colour, because the fixed backdrop sits behind it and
        fading to an opaque colour leaves a visible seam.
      */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          maskImage: "linear-gradient(to bottom, black 58%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 58%, transparent 100%)",
        }}
      >
        <Image
          src="/art/mereth-banner.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_38%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1013e6] via-[#0b101399] to-transparent" />
      </div>

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
