"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import type { Skill, Tier } from "@/lib/mereth";

/**
 * The eighteen point planner.
 *
 * Mereth's skill tiers are caps bought once at character creation and expensive
 * to change: taking a point back burns the experience earned in the tier you
 * dropped out of. So the arithmetic is worth doing before you sit down, and
 * doing it on paper is exactly the chore a website should absorb.
 *
 * Three rules, all Mereth's:
 *
 *   18 points total, spent once.
 *   Tiers cost 1, 2, 3, 5 and 8, and buying a tier means buying it outright
 *   rather than paying the difference from the tier below.
 *   A plan tops out at Master. Legendary is level 100 and cannot be bought.
 *
 * The plan lives in the URL hash rather than in storage, because the thing a
 * player wants to do with a build is paste it to somebody else.
 */

const BUDGET = 18;

interface Props {
  skills: Skill[];
  categories: { label: string; keys: string[] }[];
  /** The five buyable tiers, in order, with their costs. */
  tiers: (Tier & { cost: number })[];
}

/**
 * `mining:3,archery:5` in the hash. Short, legible, and hand-editable.
 *
 * Because it is hand-editable it is also untrusted: a pasted link can name a
 * skill that does not exist, a tier that cannot be bought, or a build that
 * costs thirty points. Unknown keys and out of range tiers are dropped, and
 * entries are taken in order only while the budget holds, so a link can never
 * put the planner into a state the game would not allow.
 */
function parsePlan(hash: string, valid: Set<string>, costOf: (tier: number) => number): Map<string, number> {
  const plan = new Map<string, number>();
  const raw = hash.replace(/^#plan=/, "");
  if (raw === "" || raw === hash) return plan;

  /*
   * A shared plan arrives from somewhere we do not control, so the decode is
   * guarded. `decodeURIComponent` throws URIError on a lone or truncated
   * percent escape, and this runs in a mount effect, so `/skills#plan=%` took
   * the exception all the way out to the error boundary and replaced the page
   * with "Application error". An unreadable plan is an empty plan.
   */
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return plan;
  }

  let spent = 0;
  for (const pair of decoded.split(",")) {
    const [key, level] = pair.split(":");
    const tier = Number(level);
    if (key === undefined || !valid.has(key) || plan.has(key)) continue;
    if (!Number.isInteger(tier) || tier < 1 || tier > 5) continue;

    const cost = costOf(tier);
    if (spent + cost > BUDGET) continue;
    spent += cost;
    plan.set(key, tier);
  }
  return plan;
}

function formatPlan(plan: Map<string, number>): string {
  return [...plan.entries()].map(([key, tier]) => `${key}:${tier}`).join(",");
}

export function SkillPlanner({ skills, categories, tiers }: Props) {
  const byKey = useMemo(() => new Map(skills.map((s) => [s.key, s])), [skills]);
  const [plan, setPlan] = useState<Map<string, number>>(new Map());
  const [copied, setCopied] = useState(false);

  /*
   * Set by the reader, cleared by the writer, and it exists because the two
   * effects run in the same commit.
   *
   * The reader calls `setPlan` and React applies that on the next render, so
   * the writer that runs immediately afterwards still sees the empty starting
   * plan. It then wrote the empty plan to the URL and destroyed the fragment
   * the reader had just parsed: a shared link opened blank, every time. So the
   * writer skips exactly one turn after each read.
   */
  const justLoaded = useRef(false);

  // Read a shared plan out of the URL on arrival, and follow the back button.
  useEffect(() => {
    const valid = new Set(skills.map((s) => s.key));
    const costOf = (tier: number): number => tiers[tier - 1]?.cost ?? Number.POSITIVE_INFINITY;
    const load = (): void => {
      setPlan(parsePlan(window.location.hash, valid, costOf));
      justLoaded.current = true;
    };
    load();
    window.addEventListener("hashchange", load);
    return () => window.removeEventListener("hashchange", load);
  }, [skills, tiers]);

  /*
   * The URL follows the plan, from an effect rather than from inside the state
   * updater it used to live in. React is allowed to run an updater more than
   * once (StrictMode does exactly that), and a history write is not something
   * that should happen twice. `replaceState` does not fire `hashchange`, so the
   * reader effect above does not see this and there is no loop.
   */
  useEffect(() => {
    if (justLoaded.current) {
      justLoaded.current = false;
      return;
    }

    /* Never clear a fragment the planner does not own. Switching tabs writes
       `#planner`, and wiping that on mount threw away somebody else's state. */
    if (plan.size === 0 && !window.location.hash.startsWith("#plan=")) return;

    const next = plan.size === 0 ? window.location.pathname : `#plan=${formatPlan(plan)}`;
    window.history.replaceState(null, "", next);
  }, [plan]);

  const spent = useMemo(
    () => [...plan.values()].reduce((total, tier) => total + (tiers[tier - 1]?.cost ?? 0), 0),
    [plan, tiers],
  );
  const remaining = BUDGET - spent;

  const set = useCallback(
    (key: string, tier: number) => {
      setPlan((previous) => {
        const next = new Map(previous);
        // Clicking the tier you already hold clears the skill, which is the
        // only way to spend a point back out without a second control.
        if (next.get(key) === tier) next.delete(key);
        else next.set(key, tier);

        const total = [...next.values()].reduce((sum, t) => sum + (tiers[t - 1]?.cost ?? 0), 0);
        if (total > BUDGET) return previous;

        return next;
      });
      setCopied(false);
    },
    [tiers],
  );

  const clear = (): void => {
    setPlan(new Map());
    window.history.replaceState(null, "", window.location.pathname);
    setCopied(false);
  };

  const share = async (): Promise<void> => {
    const url = `${window.location.origin}${window.location.pathname}#plan=${formatPlan(plan)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard access can be refused. The URL is in the address bar anyway,
      // so there is nothing to recover from and nothing worth alarming about.
      setCopied(false);
    }
  };

  /** Whether a tier can still be afforded, given what this skill already costs. */
  const affordable = (key: string, tier: number): boolean => {
    const current = plan.get(key);
    const refund = current === undefined ? 0 : (tiers[current - 1]?.cost ?? 0);
    return (tiers[tier - 1]?.cost ?? 0) - refund <= remaining;
  };

  const chosen = [...plan.entries()]
    .map(([key, tier]) => ({ skill: byKey.get(key), tier }))
    .filter((row): row is { skill: Skill; tier: number } => row.skill !== undefined)
    .sort((a, b) => b.tier - a.tier || a.skill.name.localeCompare(b.skill.name));

  return (
    // The list is capped rather than fluid: the tier buttons sit at its right
    // edge, and on a wide screen a full-width row puts half a metre of empty
    // rule between the skill you read and the button you press.
    <div className="grid gap-10 lg:grid-cols-[minmax(0,42rem)_20rem] lg:gap-14">
      <div className="min-w-0 space-y-10">
        {/* Without this the five buttons read as an arbitrary 1 2 3 5 8. */}
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border-subtle pb-5">
          <li className="font-display text-[10px] tracking-[2px] text-text-muted uppercase">
            Cost per tier
          </li>
          {tiers.map((tier) => (
            <li key={tier.name} className="flex items-center gap-2 text-[0.78rem]">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5"
                style={{ background: tier.color }}
              />
              <span className="text-text-light">{tier.name}</span>
              <span className="tabular-nums text-text-muted">{tier.cost}</span>
            </li>
          ))}
        </ul>

        {categories.map((category) => (
          <section key={category.label}>
            <h3 className="font-display mb-4 text-[0.95rem] tracking-heading text-brand-accent uppercase">
              {category.label}
            </h3>
            <ul className="space-y-1.5">
              {category.keys.map((key) => {
                const item = byKey.get(key);
                if (item === undefined) return null;
                const current = plan.get(key);

                return (
                  <li
                    key={key}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border-subtle py-2.5 last:border-0"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.95rem] text-text-primary">{item.name}</span>
                      <span className="block truncate text-[0.78rem] text-text-muted">
                        {item.summary}
                      </span>
                    </span>

                    <span
                      className="flex shrink-0 gap-1"
                      role="group"
                      aria-label={`${item.name} tier`}
                    >
                      {tiers.map((tier, index) => {
                        const level = index + 1;
                        const active = current === level;
                        const canAfford = affordable(key, level);
                        return (
                          <button
                            key={tier.name}
                            type="button"
                            onClick={() => set(key, level)}
                            disabled={!active && !canAfford}
                            aria-pressed={active}
                            title={`${tier.name}, ${tier.cost} ${tier.cost === 1 ? "point" : "points"}`}
                            className={`h-7 w-7 cursor-pointer border text-[11px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-25 ${
                              active
                                ? "text-brand-dark"
                                : "border-brand-accent/25 text-text-muted hover:border-brand-accent/60 hover:text-text-primary"
                            }`}
                            style={
                              active
                                ? { background: tier.color, borderColor: tier.color }
                                : undefined
                            }
                          >
                            {tier.cost}
                          </button>
                        );
                      })}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <aside className="lg:sticky lg:top-[140px] lg:self-start">
        <div className="relative border border-brand-accent/45 bg-black/45 p-6 backdrop-blur-[var(--blur-panel)]">
          <FrameCorners weight="thin" size={18} />

          <div className="relative">
            <p className="font-display text-[11px] tracking-[2px] text-text-muted uppercase">
              Memory points
            </p>
            <p className="mt-2 flex items-baseline gap-2">
              <span
                className={`font-display text-5xl tabular-nums ${
                  remaining === 0 ? "text-brand-action" : "text-brand-accent"
                }`}
              >
                {remaining}
              </span>
              <span className="text-sm text-text-muted">of {BUDGET} left</span>
            </p>

            <div
              className="mt-4 h-1.5 w-full bg-white/10"
              role="progressbar"
              aria-valuenow={spent}
              aria-valuemin={0}
              aria-valuemax={BUDGET}
              aria-label="Memory points spent"
            >
              <div
                className="h-full bg-brand-accent transition-[width] duration-200"
                style={{ width: `${(spent / BUDGET) * 100}%` }}
              />
            </div>

            {chosen.length === 0 ? (
              <p className="mt-6 text-[0.85rem] leading-relaxed text-text-muted">
                Pick a tier beside any skill. The number on the button is what it costs. Eighteen
                points buys roughly two specialisms and a hobby.
              </p>
            ) : (
              <>
                <ul className="mt-6 space-y-2">
                  {chosen.map(({ skill: item, tier }) => {
                    const level = tiers[tier - 1];
                    return (
                      <li key={item.key} className="flex items-center justify-between gap-3 text-[0.85rem]">
                        <span className="min-w-0 flex-1 truncate text-text-primary">{item.name}</span>
                        <span style={{ color: level?.color }} className="shrink-0">
                          {level?.name}
                        </span>
                        <span className="w-4 shrink-0 text-right tabular-nums text-text-muted">
                          {level?.cost}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 flex gap-2">
                  <button
                    type="button"
                    onClick={share}
                    className="flex-1 cursor-pointer border border-brand-accent/50 bg-black/40 py-2 font-display text-[11px] tracking-[1.5px] text-brand-accent uppercase transition-colors hover:border-brand-accent hover:text-brand-glow"
                  >
                    {copied ? "Link copied" : "Copy link"}
                  </button>
                  <button
                    type="button"
                    onClick={clear}
                    className="cursor-pointer border border-border-subtle px-4 py-2 font-display text-[11px] tracking-[1.5px] text-text-muted uppercase transition-colors hover:border-brand-accent/50 hover:text-text-primary"
                  >
                    Clear
                  </button>
                </div>
              </>
            )}

            <p className="mt-6 border-t border-border-subtle pt-4 text-[0.75rem] leading-relaxed text-text-muted">
              A plan caps at Master. Legendary is level 100 and cannot be bought. Removing a point
              in game burns the experience you earned in the tier you drop out of, so this is the
              cheap place to change your mind.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
