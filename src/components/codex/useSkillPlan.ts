"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Skill, Tier } from "@/lib/mereth";

/**
 * The plan itself, separated from how it is drawn.
 *
 * Two surfaces now show the same plan: the list planner and the menu that mimics
 * the one in game. The rules are Mereth's and there is only one correct answer to
 * them, so they live here once rather than being written twice and drifting.
 *
 * Everything below the state is scar tissue and is why this is shared rather than
 * copied. Each comment marks a bug that reached a reader.
 */

export const BUDGET = 18;

/** `mining:3,archery:5`. Short, legible, and hand-editable. */
export function formatPlan(plan: Map<string, number>): string {
  return [...plan.entries()].map(([key, tier]) => `${key}:${tier}`).join(",");
}

/**
 * Because the hash is hand-editable it is also untrusted. A pasted link can name
 * a skill that does not exist, a tier that cannot be bought, or a build costing
 * thirty points. Unknown keys and out of range tiers are dropped, and entries are
 * taken in order only while the budget holds, so a link can never put the planner
 * into a state the game would refuse.
 */
export function parsePlan(
  hash: string,
  valid: Set<string>,
  costOf: (tier: number) => number,
): Map<string, number> {
  const plan = new Map<string, number>();
  const raw = hash.replace(/^#plan=/, "");
  if (raw === "" || raw === hash) return plan;

  /*
   * `decodeURIComponent` throws URIError on a lone or truncated percent escape,
   * and this runs in a mount effect, so `/skills#plan=%` took the exception all
   * the way to the error boundary and replaced the page with "Application
   * error". An unreadable plan is an empty plan.
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

export interface SkillPlan {
  plan: Map<string, number>;
  spent: number;
  remaining: number;
  /** Toggling the tier already held clears the skill. */
  set: (key: string, tier: number) => void;
  clear: () => void;
  /** Whether a tier is still affordable, counting what this skill already costs. */
  affordable: (key: string, tier: number) => boolean;
  chosen: { skill: Skill; tier: number }[];
  share: () => Promise<boolean>;
}

export function useSkillPlan(
  skills: Skill[],
  tiers: (Tier & { cost: number })[],
): SkillPlan {
  const byKey = useMemo(() => new Map(skills.map((s) => [s.key, s])), [skills]);
  const [plan, setPlan] = useState<Map<string, number>>(new Map());

  /*
   * Set by the reader, cleared by the writer, and it exists because the two
   * effects run in the same commit. The reader calls `setPlan` and React applies
   * that on the next render, so the writer running immediately afterwards still
   * saw the empty starting plan. It then wrote that empty plan to the URL and
   * destroyed the fragment the reader had just parsed, so a shared link opened
   * blank every time. The writer skips exactly one turn after each read.
   */
  const justLoaded = useRef(false);

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
   * updater this used to live in. React is allowed to run an updater more than
   * once, and StrictMode does exactly that, and a history write is not something
   * that should happen twice. `replaceState` fires no `hashchange`, so the
   * reader above does not see this and there is no loop.
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
        if (next.get(key) === tier) next.delete(key);
        else next.set(key, tier);

        const total = [...next.values()].reduce((sum, t) => sum + (tiers[t - 1]?.cost ?? 0), 0);
        if (total > BUDGET) return previous;
        return next;
      });
    },
    [tiers],
  );

  const clear = useCallback(() => {
    setPlan(new Map());
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const affordable = useCallback(
    (key: string, tier: number): boolean => {
      const current = plan.get(key);
      const refund = current === undefined ? 0 : (tiers[current - 1]?.cost ?? 0);
      return (tiers[tier - 1]?.cost ?? 0) - refund <= remaining;
    },
    [plan, tiers, remaining],
  );

  const chosen = useMemo(
    () =>
      [...plan.entries()]
        .map(([key, tier]) => ({ skill: byKey.get(key), tier }))
        .filter((row): row is { skill: Skill; tier: number } => row.skill !== undefined)
        .sort((a, b) => b.tier - a.tier || a.skill.name.localeCompare(b.skill.name)),
    [plan, byKey],
  );

  const share = useCallback(async (): Promise<boolean> => {
    const url = `${window.location.origin}${window.location.pathname}#plan=${formatPlan(plan)}`;
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      // Clipboard access can be refused. The URL is in the address bar anyway,
      // so there is nothing to recover from and nothing worth alarming about.
      return false;
    }
  }, [plan]);

  return { plan, spent, remaining, set, clear, affordable, chosen, share };
}
