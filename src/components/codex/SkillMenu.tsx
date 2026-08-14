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
 * a fixed canvas scaled to fit instead of a fluid grid, category columns three
 * cards across, cards 100 by 118 at six pixel radius on a two pixel border, and a
 * chosen tier shown as a coloured outline with a matching ring rather than a
 * fill. The five tier colours are theirs, and were already ours: both came out of
 * the same client.
 *
 * Nothing of theirs is copied as a file. The icons are drawn in `skillGlyphs`
 * because theirs are Font Awesome Pro and licensed per seat. The frame is drawn
 * in CSS because theirs is nine-sliced from Bethesda's UI textures. Their four
 * sound effects are not reproduced at all.
 *
 * What a website cannot have is the server half: live experience, earned perks,
 * whether you are stood in a temple, and the memory cost table the server sends.
 * So this plans, and says so, rather than pretending to be your character.
 */

const CARD_W = 100;
const CARD_H = 118;
/**
 * Wide enough that five category columns genuinely fit.
 *
 * Their canvas is 1720, but that is the whole overlay: the board inside it is
 * inset, and a column is three 100px cards plus two 8px gaps, so five columns and
 * four 36px gutters need 1724 of clear space. At 1720 minus the 64 of padding,
 * the fifth column wrapped and the board grew a whole row taller for nothing.
 */
const DESIGN_W = 1800;
/** Left to the page's own gutter when the menu breaks out of its container. */
const BLEED_PAD = 24;
/** Room left for the sticky header and a little air, so the board can be sized
    to the window rather than to the width alone. */
const CHROME_H = 104;
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
     * Sized to the window, not to the column, which is what theirs does and the
     * only way the whole board is on screen at once.
     *
     * Two things happen here. The menu breaks out of the page container, because
     * a 1720 canvas inside a 1344 column is scaled to 0.78 before anyone has
     * looked at it. And the scale takes the window height into account as well as
     * the width, so the answer is a board that fits rather than one that fits
     * across and then runs off the bottom.
     *
     * The breakout is measured rather than done in `vw`: `100vw` includes the
     * scrollbar, so a page with a vertical scrollbar gets a horizontal one too.
     * `clientWidth` on the document element excludes it.
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
      const room = Math.max(420, window.innerHeight - CHROME_H);
      const next = Math.min(1, width / DESIGN_W, natural === 0 ? 1 : room / natural);
      setScale(next);
      setHeight(natural * next);

      /* When the window is tall enough that height stops being the limit, the
         board is narrower than the space it was given, so it is centred in it.
         Without this it hugs the left edge and the whole screen looks lopsided. */
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
  const colourOf = (t: number): string => tiers[t - 1]?.color ?? "#9D9E9E";
  const shown = hovered ?? chosen[0]?.skill ?? null;
  const shownTier = shown === null ? undefined : plan.get(shown.key);

  /* Recomputed every render from the plan. Each note quotes the skill text it
     came from, so nothing here is a rule this site invented. */
  const notes = ADVICE.filter((rule) => rule.triggers(plan));

  return (
    <>
      {/* It is a fixed canvas at real proportions, so on a phone it shrinks past
          reading. Say that rather than let somebody pinch at it. */}
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
          {/* Their frame is nine-sliced from image assets, so this is the same
              anatomy drawn: a lit outer edge, a header band, a recessed body and
              corner pieces heavy enough to read as metal rather than as a border. */}
          <div className="relative border border-[#6f6a5e] bg-[#0d0e10] shadow-[0_0_0_1px_rgba(0,0,0,0.85)]">
            <Corner className="top-[-1px] left-[-1px]" />
            <Corner className="top-[-1px] right-[-1px] rotate-90" />
            <Corner className="right-[-1px] bottom-[-1px] rotate-180" />
            <Corner className="bottom-[-1px] left-[-1px] -rotate-90" />

            <header className="flex items-end justify-between border-b border-[#6f6a5e]/70 bg-[linear-gradient(180deg,#22241f,#141513)] px-8 py-4">
              <div>
                <p className="font-display text-[13px] tracking-[6px] text-[#cfc9ba] uppercase">
                  Skills
                </p>
                <p className="mt-1.5 text-[12px] text-[#9D9E9E]/75">
                  Choose a tier, then a skill. Clicking the tier it already holds gives the memory
                  back.
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-[10px] tracking-[3px] text-[#9D9E9E]/65 uppercase">
                  Memory
                </p>
                <p className="font-display mt-1 text-[30px] leading-none tabular-nums">
                  <span style={{ color: remaining === 0 ? "#E89555" : "#e8e4d9" }}>{remaining}</span>
                  <span className="ml-1.5 text-[15px] text-[#9D9E9E]/65">/ {BUDGET}</span>
                </p>
              </div>
            </header>

            <div className="px-8 pt-5 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                {tiers.map((t, index) => {
                  const value = index + 1;
                  const active = tier === value;
                  return (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => setTier(value)}
                      className="font-display border px-3.5 py-2 text-[11px] tracking-[2px] uppercase transition-all duration-150"
                      style={{
                        borderColor: active ? t.color : "rgba(110,105,95,0.5)",
                        color: active ? t.color : "rgba(157,158,158,0.8)",
                        background: active
                          ? `linear-gradient(180deg, ${t.color}26, transparent)`
                          : "rgba(20,20,20,0.5)",
                        /* A ring, not a glow. A blurred halo on a dark board
                           reads as bloom rather than as selection. */
                        boxShadow: active ? `0 0 0 1px ${t.color}66` : undefined,
                      }}
                    >
                      {t.name}
                      <span className="ml-2 tabular-nums opacity-60">{t.cost}</span>
                    </button>
                  );
                })}

                <span className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      void share().then((ok) => {
                        setCopied(ok);
                        if (ok) window.setTimeout(() => setCopied(false), 2400);
                      });
                    }}
                    disabled={plan.size === 0}
                    className="font-display border border-[#6f6a5e]/70 px-3.5 py-2 text-[11px] tracking-[2px] text-[#cfc9ba] uppercase transition-colors hover:border-[#cfc9ba] disabled:opacity-30"
                  >
                    {copied ? "Copied" : "Share"}
                  </button>
                  <button
                    type="button"
                    onClick={clear}
                    disabled={plan.size === 0}
                    className="font-display border border-[#6f6a5e]/70 px-3.5 py-2 text-[11px] tracking-[2px] text-[#cfc9ba] uppercase transition-colors hover:border-[#cfc9ba] disabled:opacity-30"
                  >
                    Clear
                  </button>
                </span>
              </div>

              <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-[#6f6a5e]/25 pt-3.5">
                <span className="font-display mr-1 text-[10px] tracking-[2.5px] text-[#9D9E9E]/55 uppercase">
                  Start from
                </span>
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => apply(preset.plan)}
                    title={`${preset.blurb} Spends all ${BUDGET}.`}
                    className="border border-[#6f6a5e]/40 bg-black/30 px-3 py-1.5 text-[11px] text-[#9D9E9E] transition-colors hover:border-[#cfc9ba] hover:text-[#cfc9ba]"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/*
                Rows, not CSS columns. Columns were tried to close the dead space
                under the short categories and made it worse: they fill greedily
                top to bottom, so the fifth column came out nearly empty, the board
                got narrower rather than wider, and reading order went vertical
                against a design that is laid out in rows.
              */}
              <div className="mt-5 flex flex-wrap items-start gap-x-9 gap-y-6">
                {categories.map((category) => (
                  <section key={category.label}>
                    <p className="mb-3 text-[11px] tracking-[2px] text-[#cfc9ba]/80 uppercase">
                      {category.label}
                    </p>
                    <ul
                      className="grid gap-2"
                      style={{ gridTemplateColumns: `repeat(${COLS}, ${CARD_W}px)` }}
                    >
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
                              /*
                               * Their card is an icon with a state word under it and
                               * the name at the foot, on a border so faint it is
                               * almost absent until something is chosen. The first
                               * pass put a hard border on all fifty-one and read as a
                               * grid of boxes rather than as a board.
                               */
                              className="flex flex-col items-center justify-between rounded-[6px] border px-1.5 pt-3 pb-2.5 text-center transition-all duration-150 hover:brightness-[1.35]"
                              style={{
                                width: CARD_W,
                                height: CARD_H,
                                borderWidth: assigned === undefined ? 1 : 2,
                                borderColor: colour ?? "rgba(150,145,132,0.22)",
                                background:
                                  assigned === undefined
                                    ? "rgba(18,19,20,0.55)"
                                    : `linear-gradient(180deg, ${colour}1f, rgba(13,13,13,0.92))`,
                                color: colour ?? "rgba(196,193,184,0.72)",
                                opacity: dimmed ? 0.28 : 1,
                              }}
                            >
                              <SkillGlyph skill={key} />
                              <span
                                className="text-[9px] tracking-[1.2px] uppercase"
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
                ))}
              </div>
            </div>

            <footer className="grid grid-cols-[minmax(0,1fr)_26rem] gap-9 border-t border-[#6f6a5e]/50 bg-black/40 px-8 py-4">
              <div className="min-h-[92px]">
                {shown === null ? (
                  <p className="text-[13px] text-[#9D9E9E]/55">
                    Point at a skill to read what its tiers actually unlock. The text is Mereth's
                    own, one paragraph per tier.
                  </p>
                ) : (
                  <>
                    <p className="font-display text-[12px] tracking-[2.5px] text-[#e8e4d9] uppercase">
                      {shown.name}
                      {shownTier === undefined ? null : (
                        <span className="ml-3" style={{ color: colourOf(shownTier) }}>
                          {tiers[shownTier - 1]?.name}
                        </span>
                      )}
                    </p>
                    <p className="mt-2 max-w-[76ch] text-[13px] leading-[1.75] text-[#9D9E9E]">
                      {shownTier === undefined
                        ? shown.summary
                        : (shown.tiers[shownTier - 1] ?? shown.summary)}
                    </p>
                  </>
                )}
              </div>

              <div>
                <p className="font-display text-[10px] tracking-[2.5px] text-[#9D9E9E]/55 uppercase">
                  Notes on this plan
                </p>
                {notes.length === 0 ? (
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-[#9D9E9E]/55">
                    {plan.size === 0
                      ? "Nothing chosen yet."
                      : remaining > 0
                        ? `Nothing to flag. ${remaining} memory still unspent.`
                        : "Nothing to flag, and every point is spent."}
                  </p>
                ) : (
                  <ul className="mt-2.5 space-y-2.5">
                    {notes.map((note) => (
                      <li key={note.id} className="border-l-2 border-[#E89555]/70 pl-3">
                        <p className="text-[12.5px] leading-[1.45] text-[#e8e4d9]">{note.title}</p>
                        <p className="mt-0.5 text-[11.5px] leading-[1.5] text-[#9D9E9E]/80">
                          {note.detail}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
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
      className={`pointer-events-none absolute z-10 ${className}`}
    >
      <path d="M0 11V0h11" stroke="#b9ad93" strokeWidth="2" />
      <path d="M4.5 15V4.5H15" stroke="#b9ad93" strokeWidth="1" opacity="0.55" />
      <path d="M0 17v5M17 0h5" stroke="#b9ad93" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}
