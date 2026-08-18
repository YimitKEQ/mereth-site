import { InterlaceKnot } from "@/components/ornament/NordicMarks";
import { inline } from "@/lib/markup";
import type { Proclamation as ProclamationData } from "@/lib/world/holds";

/**
 * A court document, reproduced rather than summarised.
 *
 * The first use of the vellum surface the palette reserves for writs. Every
 * other panel on the site is a cold dark card, so a warm sheet reads instantly
 * as a different kind of object: not the site telling you about a hold, but a
 * piece of paper the hold nailed to a post. That is worth the one warm rectangle
 * on an otherwise cold page, and it is the reason the block is kept to a single
 * column at reading width instead of stretched across the grid.
 *
 * Flat, per the elevation rule. The depth is a double rule and an inset margin,
 * the way a printed notice is set, not a shadow.
 */
export function Proclamation({ document }: { document: ProclamationData }) {
  return (
    <article className="mx-auto max-w-[52rem] bg-vellum text-vellum-ink">
      {/* The inner rule. A notice is set inside its own margin, and that inset
          is what stops a cream rectangle reading as an empty div. */}
      <div className="m-[10px] border border-vellum-ink/20 px-7 py-10 md:px-14 md:py-14">
        <p className="font-display text-center text-[10px] tracking-[3px] text-vellum-ink/55 uppercase">
          {document.place}
          <span className="mx-2 text-vellum-ink/35" aria-hidden="true">
            /
          </span>
          {document.date}
        </p>

        <h3 className="font-display mt-4 text-center text-[1.15rem] leading-snug tracking-[2px] text-vellum-ink uppercase md:text-[1.35rem]">
          {document.title}
        </h3>

        <div className="mt-6 flex items-center justify-center gap-3" aria-hidden="true">
          <span className="h-px w-16 bg-vellum-ink/30" />
          <InterlaceKnot size={14} className="text-vellum-ink/45" />
          <span className="h-px w-16 bg-vellum-ink/30" />
        </div>

        <p className="font-document mt-8 text-[0.98rem] leading-[1.9] text-vellum-ink/85 italic">
          {document.salutation}
        </p>

        <div className="font-document mt-5 space-y-5">
          {document.body.map((paragraph, i) => (
            <p key={i} className="text-[1rem] leading-[1.95] text-vellum-ink">
              {inline(paragraph)}
            </p>
          ))}
        </div>

        {/* Signed to the right, the way a hand signs a sheet it has just set
            down. The rule above it is short on purpose: it is a signature line,
            not another divider. */}
        <div className="mt-10 flex flex-col items-end">
          <span className="mb-3 h-px w-24 bg-vellum-ink/30" aria-hidden="true" />
          {document.signature.map((line, i) => (
            <p
              key={line}
              className={
                i === 0
                  ? "font-display text-[1rem] tracking-[1.5px] text-vellum-ink uppercase"
                  : "font-document mt-1 text-[0.85rem] text-vellum-ink/65"
              }
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
