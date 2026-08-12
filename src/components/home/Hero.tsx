import { ServerStatus } from "@/components/home/ServerStatus";
import { ButtonLink } from "@/components/ui/Button";
import { DISCORD_INVITE, site } from "@/lib/site";

/**
 * The opening plate.
 *
 * Centred, and deliberately short. An earlier version ran the copy down the
 * left with four counted statistics under it, which put a lot of numbers in
 * front of somebody who has not yet been told what the place is. The reference
 * gets this right: wordmark, one line, two actions, then the live status. That
 * is all a landing screen owes anybody.
 *
 * The status block underneath is the only live thing on the page, which is why
 * it is the only part fetched in the browser.
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
            "linear-gradient(180deg, #0b1013d9 0%, #0b101373 30%, #0b101359 62%, #0b1013e6 100%)",
        }}
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pt-[150px] pb-20 text-center md:pt-[186px] md:pb-24">
        <p className="font-display text-[11px] tracking-[4px] text-brand-accent/80 uppercase text-shadow-drop">
          Serious roleplay, 4E 185
        </p>

        <h1 className="font-display mt-4 text-5xl leading-none tracking-title text-brand-accent text-shadow-page-heading md:text-7xl">
          {site.name}
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-text-light text-shadow-subtle md:text-lg">
          A Skyrim roleplay server set ten years after the Great War. Eighteen memory points, spent
          once. Magic you have to be taught. Property a jarl grants you.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <ButtonLink href={DISCORD_INVITE} variant="solid" size="lg">
            Join Discord
          </ButtonLink>
          <ButtonLink href="/start" size="lg">
            Start here
          </ButtonLink>
        </div>

        <div className="mt-16 w-full md:mt-20">
          <ServerStatus />
        </div>
      </div>
    </section>
  );
}
