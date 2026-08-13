import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { DISCORD_INVITE } from "@/lib/site";

/**
 * The notice that this site is not finished.
 *
 * Deliberately out of character. Every other line on the home page is written
 * from inside the fiction, and this one must not be, because a reader has to
 * be able to tell the difference between the world being uncertain and the
 * website being unfinished. A player who reads a thin page and assumes the
 * system behind it is thin is the failure this prevents.
 *
 * Styled quiet on purpose. The category reflex is a yellow hazard stripe, which
 * would be the loudest object on a page whose whole argument is restraint, and
 * would read as broken rather than as honest. Hairline rules and frost at low
 * volume say the same thing without shouting, and brass is reserved for things
 * you can act on.
 */
export function UnderConstruction() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-16 md:px-8 md:pt-20">
      <aside className="relative border-y border-brand-accent/20 bg-black/25 px-6 py-5 text-center">
        <FrameCorners size={12} />

        <p className="font-display text-[10px] tracking-[3.5px] text-brand-accent/75 uppercase">
          This site is still being built
        </p>

        <p className="mx-auto mt-3 max-w-2xl text-[0.9rem] leading-relaxed text-text-muted">
          Pages are still being written and some are thinner than they will be. Anything here can
          change while the server does, so treat it as the current record rather than the final
          one. If something reads wrong or contradicts what you have seen in game, tell us on{" "}
          <a
            href={DISCORD_INVITE}
            className="text-brand-accent underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-accent"
          >
            Discord
          </a>{" "}
          and it gets fixed.
        </p>
      </aside>
    </section>
  );
}
