"use client";

import { useEffect, useRef, useState } from "react";

import type { Skill, SkillCategory, Tier } from "@/lib/mereth";
import { BUDGET, useSkillPlan } from "@/components/codex/useSkillPlan";

/**
 * The planner, drawn as the menu you press K for.
 *
 * Rebuilt from the client's own `skillsMenu` feature, which is readable because
 * their UI shipped as a webpack development build. What is copied is the layout
 * and the measurements, both of which are facts about their design rather than
 * assets: cards are 100 by 118 at six pixel radius on a two pixel border, the
 * canvas is a fixed width scaled to fit rather than a fluid grid, and a planned
 * tier is shown as a coloured outline with a matching ring rather than as a fill.
 * The five tier colours are theirs exactly, and already ours: they are in the
 * exported bundle because both came from the same client.
 *
 * Three things are deliberately not copied.
 *
 *   The icons. Theirs are Font Awesome Pro, which is licensed per seat and
 *   cannot be redistributed on a public site. Their own perk gems already use a
 *   letter in a shape, so the cards use that motif instead. It is their design
 *   vocabulary and nobody's asset.
 *
 *   The sounds. Four wav files ship in that feature. They are Bethesda's.
 *
 *   The server half. In game this menu reads live state: experience, earned
 *   perks, whether you are standing in a temple, and a memory cost table the
 *   server sends. A website has none of that, so this plans and does not claim
 *   to be your character.
 */

const CARD_W = 100;
const CARD_H = 118;
/** Their canvas, exactly: five category columns of three cards each, plus gaps.
    Scaled down to whatever the page gives it, which is also what theirs does. */
const DESIGN_W = 1720;
/** Cards per category column. Theirs is three, which is what makes five
    categories sit side by side rather than wrapping into a ragged block. */
const COLS = 3;

interface Props {
  skills: Skill[];
  categories: SkillCategory[];
  tiers: (Tier & { cost: number })[];
}

/** Their own motif: the first letter, in a rotated square. */
function Gem({ label, colour }: { label: string; colour: string }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-[26px] w-[26px] shrink-0 items-center justify-center"
    >
      <span
        className="absolute inset-0 rotate-45 border"
        style={{ borderColor: colour, background: `${colour}1f` }}
      />
      <span
        className="font-display relative text-[11px] leading-none"
        style={{ color: colour }}
      >
        {label}
      </span>
    </span>
  );
}

export function SkillMenu({ skills, categories, tiers }: Props) {
  const { plan, spent, remaining, set, clear, affordable, chosen, share } = useSkillPlan(
    skills,
    tiers,
  );
  const [tier, setTier] = useState(1);
  const [hovered, setHovered] = useState<Skill | null>(null);
  const [copied, setCopied] = useState(false);

  /*
   * The canvas is a fixed width scaled down to whatever it is given, which is how
   * theirs works and the reason the layout never reflows: a card is always the
   * same shape and the whole board shrinks together. Measuring the wrapper rather
   * than the window because the page has margins and a sidebar the window does
   * not know about.
   */
  const wrap = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const outer = wrap.current;
    const inner = board.current;
    if (outer === null || inner === null) return undefined;

    /*
     * A transform does not change layout, so the scaled board keeps its full
     * unscaled height and leaves a hole under itself. The wrapper is given the
     * real painted height instead. Both elements are observed: the width decides
     * the scale, and the board's own height changes when it reflows into a
     * different number of rows.
     */
    const measure = (): void => {
      const next = Math.min(1, outer.clientWidth / DESIGN_W);
      setScale(next);
      setHeight(inner.offsetHeight * next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  const byKey = new Map(skills.map((s) => [s.key, s]));
  const colourOf = (t: number): string => tiers[t - 1]?.color ?? "#9D9E9E";
  const shown = hovered ?? chosen[0]?.skill ?? null;
  const shownTier = shown === null ? undefined : plan.get(shown.key);

  return (
    <div ref={wrap} className="w-full overflow-hidden" style={{ height }}>
      <div
        ref={board}
        style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: DESIGN_W }}
      >
        {/* Header. Theirs carries the instruction and the memory count on one
            line, which is worth keeping: it is the only place the rules appear. */}
        <div className="flex items-end justify-between border-b border-[#5a5a5a]/50 pb-3">
          <div>
            <p className="font-display text-[11px] tracking-[3px] text-[#9D9E9E] uppercase">
              Skills
            </p>
            <p className="mt-1 text-[13px] text-[#9D9E9E]/70">
              Pick a tier, then click a skill to assign it. Click the same tier again to clear it.
            </p>
          </div>
          <div className="flex items-baseline gap-2 text-right">
            <span className="font-display text-[28px] tabular-nums text-[#e8e4d9]">
              {remaining}
            </span>
            <span className="font-display text-[13px] tabular-nums text-[#9D9E9E]/70">
              / {BUDGET} memory
            </span>
          </div>
        </div>

        {/* Tier picker. Their footer row, moved up: on a page the reader chooses
            the tier before the skill, and a control below the board is missed. */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {tiers.map((t, index) => {
            const value = index + 1;
            const active = tier === value;
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => setTier(value)}
                className="font-display border px-3 py-1.5 text-[11px] tracking-[1.5px] uppercase transition-colors"
                style={{
                  borderColor: active ? t.color : "rgba(70,70,70,0.8)",
                  color: active ? t.color : "rgba(157,158,158,0.75)",
                  background: active ? `${t.color}1a` : "rgba(20,20,20,0.6)",
                  boxShadow: active ? `0 0 0 2px ${t.color}55` : undefined,
                }}
              >
                {t.name}
                <span className="ml-2 tabular-nums opacity-70">{t.cost}</span>
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
              className="font-display border border-[#5a5a5a]/70 px-3 py-1.5 text-[11px] tracking-[1.5px] text-[#9D9E9E] uppercase transition-colors hover:border-[#9D9E9E] disabled:opacity-40"
            >
              {copied ? "Copied" : "Share"}
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={plan.size === 0}
              className="font-display border border-[#5a5a5a]/70 px-3 py-1.5 text-[11px] tracking-[1.5px] text-[#9D9E9E] uppercase transition-colors hover:border-[#9D9E9E] disabled:opacity-40"
            >
              Clear
            </button>
          </span>
        </div>

        {/* The board. */}
        <div className="mt-5 flex flex-wrap items-start gap-x-10 gap-y-8">
          {categories.map((category) => (
            <section key={category.label}>
              <p className="font-display mb-2 text-[10px] tracking-[2.5px] text-[#9D9E9E]/60 uppercase">
                {category.label}
              </p>
              <ul className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, ${CARD_W}px)` }}>
                {category.keys.map((key) => {
                  const skill = byKey.get(key);
                  if (skill === undefined) return null;
                  const assigned = plan.get(key);
                  const colour = assigned === undefined ? undefined : colourOf(assigned);
                  const canAfford = affordable(key, tier);

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
                        title={
                          assigned === undefined && !canAfford
                            ? `Not enough memory for ${tiers[tier - 1]?.name}`
                            : skill.summary
                        }
                        className="flex flex-col items-center justify-start rounded-[6px] border-2 px-1 pt-3 pb-2 text-center transition-all duration-200"
                        style={{
                          width: CARD_W,
                          height: CARD_H,
                          borderColor: colour ?? "rgba(70,70,70,0.8)",
                          background: assigned === undefined ? "rgba(20,20,20,0.6)" : "rgba(32,32,32,0.85)",
                          color: colour ?? "rgb(157,158,158)",
                          opacity: assigned === undefined && !canAfford ? 0.35 : assigned === undefined ? 0.85 : 1,
                          boxShadow: colour === undefined ? undefined : `0 0 0 2px ${colour}80`,
                        }}
                      >
                        <Gem
                          label={skill.name.slice(0, 1).toUpperCase()}
                          colour={colour ?? "rgba(157,158,158,0.8)"}
                        />
                        <span className="mt-2 text-[11px] leading-[1.25]">{skill.name}</span>
                        {assigned === undefined ? null : (
                          <span className="font-display mt-auto text-[9px] tracking-[1.5px] uppercase">
                            {tiers[assigned - 1]?.name}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        {/* Their menu writes the hovered skill's tier prose into a panel. That
            prose is the most useful thing in the whole feature and it is already
            in our bundle, so it is here rather than in a tooltip that vanishes. */}
        <div className="mt-6 min-h-[92px] border-t border-[#5a5a5a]/50 pt-4">
          {shown === null ? (
            <p className="text-[13px] text-[#9D9E9E]/60">
              Hover a skill to read what its tiers actually unlock.
            </p>
          ) : (
            <>
              <p className="font-display text-[12px] tracking-[2px] text-[#e8e4d9] uppercase">
                {shown.name}
                {shownTier === undefined ? null : (
                  <span className="ml-3" style={{ color: colourOf(shownTier) }}>
                    {tiers[shownTier - 1]?.name}
                  </span>
                )}
              </p>
              <p className="mt-1.5 max-w-[80ch] text-[13px] leading-[1.7] text-[#9D9E9E]">
                {shownTier === undefined
                  ? shown.summary
                  : (shown.tiers[shownTier - 1] ?? shown.summary)}
              </p>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
