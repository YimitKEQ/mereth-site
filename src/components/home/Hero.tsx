import { ButtonLink } from "@/components/ui/Button";
import { counts } from "@/lib/mereth";
import { site } from "@/lib/site";

/**
 * Full-bleed opening plate.
 *
 * The wordmark is large, the promise is one line, and the two actions are the
 * two things a visitor actually arrives to do: work out how to start, or look
 * something up. The old hero sold the server; this one sells the handbook,
 * because the server has its own site and this is not a second one.
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
            "linear-gradient(100deg, #0b1013f7 0%, #0b1013d9 40%, #0b101373 66%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-site px-6 pt-[180px] pb-24 md:px-8 md:pt-[240px] md:pb-32">
        <p className="font-display text-[11px] tracking-[4px] text-brand-accent/80 uppercase text-shadow-drop">
          The player&apos;s handbook
        </p>

        <h1 className="font-display mt-4 text-5xl leading-none tracking-title text-brand-accent text-shadow-page-heading md:text-7xl lg:text-8xl">
          {site.name}
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-text-light text-shadow-subtle md:text-lg">
          Serious Skyrim roleplay in 4E 185, ten years after the Great War. Eighteen memory points,
          spent once. Magic you have to be taught. Property a jarl grants you.{" "}
          <span className="text-text-primary">
            This is the part nobody explains before you log in.
          </span>
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <ButtonLink href="/start" variant="solid" size="lg">
            Start here
          </ButtonLink>
          <ButtonLink href="/skills" size="lg">
            Plan a character
          </ButtonLink>
        </div>

        <dl className="mt-16 flex flex-wrap gap-x-12 gap-y-6 md:mt-24">
          {[
            { label: "Skills documented", value: String(counts.skills) },
            { label: "Spells indexed", value: counts.spells.toLocaleString("en-GB") },
            { label: "Records read", value: counts.records.toLocaleString("en-GB") },
            { label: "Releases tracked", value: String(counts.releases) },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="font-display text-[10px] tracking-[2px] text-text-muted uppercase text-shadow-drop">
                {stat.label}
              </dt>
              <dd className="font-display mt-1 text-3xl tabular-nums text-text-primary text-shadow-heading">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
