"use client";

import { useEffect, useRef, useState } from "react";

import { SkillGlyph } from "@/components/codex/skillGlyphs";
import { BUDGET, useSkillPlan } from "@/components/codex/useSkillPlan";
import { ADVICE, PRESETS } from "@/lib/skill-advice";
import type { Skill, SkillCategory, Tier } from "@/lib/mereth";

/**
 * The planner, drawn as the menu you press K for.
 *
 * Rebuilt from the client's own `skillsMenu`, readable because their UI shipped
 * as a webpack development build with the eval devtool left on. What is taken is
 * layout and measurement, which are facts about their design rather than assets:
 * cards 100 by 118 at six pixel radius, three to a category column, five columns
 * spread across a fixed canvas that scales to fit, category labels centred over
 * their block, the short second row centred under the board, and the tier picker
 * sitting bottom right beside the description rather than above the board.
 *
 * The palette is the site's, not the game's. An earlier pass used the client's own
 * greys and the result read as a foreign application pasted into a page. The tier
 * colours stay theirs, because those are data rather than decoration: they are the
 * same five values the game paints, and a reader matching this against the menu in
 * front of them needs them to agree.
 *
 * Nothing of theirs is copied as a file. The icons are drawn in `skillGlyphs`
 * because theirs are Font Awesome Pro and licensed per seat. The frame is drawn in
 * CSS because theirs is nine-sliced from Bethesda's UI textures. Their four sound
 * effects are not reproduced at all.
 *
 * What a website cannot have is the server half: live experience, earned perks,
 * whether you are stood in a temple, and the memory cost table the server sends.
 * So this plans, and says so, rather than pretending to be your character.
 */

const CARD_W = 100;
const CARD_H = 118;
/** Five category columns of three cards, their gutters, and the frame's padding. */
const DESIGN_W = 1800;
/** Left to the page's own gutter when the menu breaks out of its container. */
const BLEED_PAD = 24;
/** Reserved for the sticky header and a little air above the board. */
const CHROME_H = 96;
/**
 * How far past the window the board may go before it is scaled down.
 *
 * Fitting it exactly made it small. A little overflow buys a lot of size and costs
 * one short scroll, which is the trade that was asked for.
 */
const OVERFLOW_ALLOWANCE = 1.18;
const COLS = 3;

interface Props {
  skills: Skill[];
  categories: SkillCategory[];
  tiers: (Tier & { cost: number })[];
}

export function SkillMenu({ skills, categories, tiers }: Props) {
  const { plan, remaining, set, clear, affordable, chosen, share, apply } = useSkillPlan(
    skills,
    tiers,
  );
  const [tier, setTier] = useState(1);
  const [hovered, setHovered] = useState<Skill | null>(null);
  const [copied, setCopied] = useState(false);

  const wrap = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [bleed, setBleed] = useState<{ width: number; marginLeft: number } | null>(null);
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const outer = wrap.current;
    const inner = board.current;
    if (outer === null || inner === null) return undefined;
    const parent = outer.parentElement;

    /*
     * Sized to the window rather than to the column, which is what theirs does.
     *
     * The breakout is measured rather than written in `vw`, because `100vw`
     * includes the scrollbar and a page with a vertical scrollbar would gain a
     * horizontal one. `document.documentElement.clientWidth` excludes it.
     */
    const measure = (): void => {
      const docW = document.documentElement.clientWidth;
      const left = parent === null ? 0 : parent.getBoundingClientRect().left;
      const width = Math.max(320, docW - BLEED_PAD * 2);
      setBleed({ width, marginLeft: BLEED_PAD - left });

      /* A transform does not change layout, so the scaled board keeps its full
         unscaled height and would leave a hole beneath it. The wrapper is given
         the painted height instead. */
      const natural = inner.offsetHeight;
      const room = Math.max(420, window.innerHeight - CHROME_H) * OVERFLOW_ALLOWANCE;
      const next = Math.min(1, width / DESIGN_W, natural === 0 ? 1 : room / natural);
      setScale(next);
      setHeight(natural * next);
      /* Centred in whatever it did not need, so it never hugs one edge. */
      setInset(Math.max(0, (width - DESIGN_W * next) / 2));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    if (parent !== null) observer.observe(parent);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const byKey = new Map(skills.map((s) => [s.key, s]));
  const colourOf = (t: number): string => tiers[t - 1]?.color ?? "#9fb8c4";
  const shown = hovered ?? chosen[0]?.skill ?? null;
  const shownTier = shown === null ? undefined : plan.get(shown.key);
  const notes = ADVICE.filter((rule) => rule.triggers(plan));

  /* Their board is one row of five and then a shorter row centred under it. */
  const topRow = categories.slice(0, 5);
  const bottomRow = categories.slice(5);

  const renderCategory = (category: SkillCategory) => (
    <section key={category.label}>
      {/* Centred over its block, as theirs is. Left aligned, these read as a list
          of headings down the page rather than as labels on columns. */}
      <p className="font-display mb-3 text-center text-[11px] tracking-[2px] text-brand-accent/75 uppercase">
        {category.label}
      </p>
      <ul className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, ${CARD_W}px)` }}>
        {category.keys.map((key) => {
          const skill = byKey.get(key);
          if (skill === undefined) return null;
          const assigned = plan.get(key);
          const colour = assigned === undefined ? undefined : colourOf(assigned);
          const dimmed = assigned === undefined && !affordable(key, tier);

          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => set(key, tier)}
                onMouseEnter={() => setHovered(skill)}
                onFocus={() => setHovered(skill)}
                onMouseLeave={() => setHovered(null)}
                onBlur={() => setHovered(null)}
                aria-pressed={assigned !== undefined}
                aria-label={`${skill.name}${assigned === undefined ? "" : `, ${tiers[assigned - 1]?.name}`}`}
                className="flex flex-col items-center justify-between rounded-[6px] border px-1.5 pt-3 pb-2.5 text-center transition-all duration-150 hover:brightness-[1.35]"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  borderWidth: assigned === undefined ? 1 : 2,
                  borderColor: colour ?? "rgba(159,184,196,0.22)",
                  background:
                    assigned === undefined
                      ? "rgba(16,22,26,0.55)"
                      : `linear-gradient(180deg, ${colour}1f, rgba(16,22,26,0.92))`,
                  color: colour ?? "rgba(185,194,196,0.75)",
                  opacity: dimmed ? 0.28 : 1,
                }}
              >
                <SkillGlyph skill={key} />
                <span
                  className="font-display text-[9px] tracking-[1.2px] uppercase"
                  style={{ opacity: assigned === undefined ? 0.5 : 0.95 }}
                >
                  {assigned === undefined ? "Assign" : tiers[assigned - 1]?.name}
                </span>
                <span className="text-[10.5px] leading-[1.15]">{skill.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );

  return (
    <>
      <p className="mb-6 border border-brand-accent/40 bg-black/35 px-5 py-4 text-[0.92rem] leading-relaxed text-text-light lg:hidden">
        <strong className="font-semibold text-text-primary">This one wants a wide screen.</strong>{" "}
        It is the in game menu at its real proportions, so on a phone every label shrinks past
        reading. Use the <strong className="font-semibold text-text-primary">Planner</strong> tab
        instead. It is built for a narrow column and spends exactly the same eighteen points.
      </p>

      <div
        ref={wrap}
        className="overflow-hidden"
        style={{ height, width: bleed?.width, marginLeft: bleed?.marginLeft }}
      >
        <div
          ref={board}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: DESIGN_W,
            marginLeft: inset,
          }}
        >
          <div className="relative border border-brand-accent/35 bg-bg-page/95">
            <Corner className="top-[-1px] left-[-1px]" />
            <Corner className="top-[-1px] right-[-1px] rotate-90" />
            <Corner className="right-[-1px] bottom-[-1px] rotate-180" />
            <Corner className="bottom-[-1px] left-[-1px] -rotate-90" />

            <header className="flex items-end justify-between border-b border-brand-accent/25 bg-bg-stone/60 px-9 py-4">
              <div>
                <p className="font-display text-[13px] tracking-[6px] text-text-primary uppercase">
                  Skills
                </p>
                <p className="mt-1.5 text-[12.5px] text-text-muted">
                  Choose a tier, then a skill. Clicking the tier it already holds gives the memory
                  back.
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-[10px] tracking-[3px] text-brand-accent/70 uppercase">
                  Memory
                </p>
                {/* Left, not spent. `0 / 18` on a full plan read as an empty one,
                    and the planner tab already says it this way. */}
                <p className="font-display mt-1 text-[30px] leading-none tabular-nums text-text-primary">
                  {remaining}
                  <span className="ml-1.5 text-[15px] text-text-muted">of {BUDGET} left</span>
                </p>
              </div>
            </header>

            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-brand-accent/15 px-9 py-3">
              <span className="font-display mr-1 text-[10px] tracking-[2.5px] text-text-muted/70 uppercase">
                Start from
              </span>
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => apply(preset.plan)}
                  title={`${preset.blurb} Spends all ${BUDGET}.`}
                  className="border border-brand-accent/25 bg-black/25 px-3 py-1.5 text-[11px] text-text-muted transition-colors hover:border-brand-accent hover:text-text-primary"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* The board. One row of five spread across the frame, then the short
                row centred beneath it, which is how theirs sits. */}
            <div className="px-9 pt-6 pb-7">
              <div className="flex items-start justify-between">{topRow.map(renderCategory)}</div>
              {bottomRow.length === 0 ? null : (
                <div className="mt-7 flex items-start justify-center gap-x-14">
                  {bottomRow.map(renderCategory)}
                </div>
              )}
            </div>

            {/* Description bottom left, controls bottom right, as theirs are. */}
            <footer className="grid grid-cols-[minmax(0,1fr)_23rem_auto] items-start gap-8 border-t border-brand-accent/25 bg-black/30 px-9 py-5">
              <div className="min-h-[96px]">
                {shown === null ? (
                  <p className="text-[13px] text-text-muted/70">
                    Point at a skill to read what its tiers actually unlock. The text is Mereth's
                    own, one paragraph per tier.
                  </p>
                ) : (
                  <>
                    <p className="font-display text-[12.5px] tracking-[2.5px] text-text-primary uppercase">
                      {shown.name}
                      {shownTier === undefined ? null : (
                        <span className="ml-3" style={{ color: colourOf(shownTier) }}>
                          {tiers[shownTier - 1]?.name}
                        </span>
                      )}
                    </p>
                    <p className="mt-2 max-w-[70ch] text-[13px] leading-[1.75] text-text-light">
                      {shownTier === undefined
                        ? shown.summary
                        : (shown.tiers[shownTier - 1] ?? shown.summary)}
                    </p>
                  </>
                )}
              </div>

              <div>
                <p className="font-display text-[10px] tracking-[2.5px] text-text-muted/70 uppercase">
                  Notes on this plan
                </p>
                {notes.length === 0 ? (
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-text-muted/70">
                    {plan.size === 0
                      ? "Nothing chosen yet."
                      : remaining > 0
                        ? `Nothing to flag. ${remaining} memory still unspent.`
                        : "Nothing to flag, and every point is spent."}
                  </p>
                ) : (
                  <ul className="mt-2.5 space-y-2.5">
                    {notes.map((note) => (
                      <li key={note.id} className="border-l-2 border-brand-action/70 pl-3">
                        <p className="text-[12.5px] leading-[1.45] text-text-primary">
                          {note.title}
                        </p>
                        <p className="mt-0.5 text-[11.5px] leading-[1.5] text-text-muted">
                          {note.detail}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  {tiers.map((t, index) => {
                    const value = index + 1;
                    const active = tier === value;
                    return (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => setTier(value)}
                        className="font-display border px-3.5 py-2 text-[11px] tracking-[2px] uppercase transition-colors duration-150"
                        style={{
                          borderColor: active ? t.color : "rgba(159,184,196,0.25)",
                          color: active ? t.color : "rgba(185,194,196,0.8)",
                          background: active ? `${t.color}1a` : "transparent",
                        }}
                      >
                        {t.name}
                        <span className="ml-2 tabular-nums opacity-60">{t.cost}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      void share().then((ok) => {
                        setCopied(ok);
                        if (ok) window.setTimeout(() => setCopied(false), 2400);
                      });
                    }}
                    disabled={plan.size === 0}
                    className="font-display border border-brand-accent/30 px-3.5 py-2 text-[11px] tracking-[2px] text-text-muted uppercase transition-colors hover:border-brand-accent hover:text-text-primary disabled:opacity-30"
                  >
                    {copied ? "Copied" : "Share"}
                  </button>
                  <button
                    type="button"
                    onClick={clear}
                    disabled={plan.size === 0}
                    className="font-display border border-brand-accent/30 px-3.5 py-2 text-[11px] tracking-[2px] text-text-muted uppercase transition-colors hover:border-brand-accent hover:text-text-primary disabled:opacity-30"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

/** A corner piece. Theirs is 64px of art; this is the same weight, drawn. */
function Corner({ className }: { className: string }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 text-brand-accent ${className}`}
    >
      <path d="M0 11V0h11" stroke="currentColor" strokeWidth="2" />
      <path d="M4.5 15V4.5H15" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <path d="M0 17v5M17 0h5" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}
