import { ArtPlaceholder } from "@/components/ui/ArtPlaceholder";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { features } from "@/lib/content";

/**
 * Three across on desktop. The frame belongs to the image only: the title and
 * body sit outside it on the page background, which is what keeps the grid
 * feeling open rather than like six boxed cards.
 */
export function FeatureGrid() {
  return (
    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <article key={feature.slug} className="flex flex-col text-center">
          <div className="relative text-brand-accent">
            <FrameCorners weight="thin" />
            <ArtPlaceholder
              seed={feature.slug}
              label={feature.title}
              className="aspect-[16/10] w-full border border-brand-accent/70"
            />
          </div>
          <h3 className="font-display mt-5 text-lg tracking-heading text-brand-accent text-shadow-drop md:text-xl">
            {feature.title}
          </h3>
          <p className="mx-auto mt-3 max-w-[34ch] text-sm leading-relaxed text-text-muted text-shadow-subtle">
            {feature.body}
          </p>
        </article>
      ))}
    </div>
  );
}
