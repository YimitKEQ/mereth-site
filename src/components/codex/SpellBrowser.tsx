"use client";

import { useEffect, useMemo, useState } from "react";

import { useHashSeed } from "@/components/codex/hash-seed";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { Search } from "@/components/ui/icons";
import type { Spell, Tier } from "@/lib/mereth";

/**
 * The spellbook: every spell a player can be taught, by school and by tier.
 *
 * Tier is the column people came for, and it is real rather than guessed. It
 * comes from the casting perk on the spell record itself, the same field the
 * game uses to decide whether you are allowed to cast the thing, so Flames is
 * Novice and Fire Storm is Master because the record says so.
 *
 * Two things this list deliberately is not. It is not the SPEL table: records
 * without a casting perk are creature abilities, quest effects and diseases,
 * and they are excluded. And it is not a promise, because Mereth gates every
 * spell behind a teacher and a book.
 */

const SCHOOL_COLOUR: Record<string, string> = {
  Alteration: "#7fa8d4",
  Conjuration: "#a884c9",
  Destruction: "#c9705c",
  Illusion: "#c9a05c",
  Restoration: "#7fc99a",
};

const TIER_ORDER = ["Novice", "Apprentice", "Adept", "Expert", "Master"];

export function SpellBrowser({ spells, tiers }: { spells: Spell[]; tiers: Tier[] }) {
  const [query, setQuery] = useState("");
  const [school, setSchool] = useState<string | null>(null);
  const [tier, setTier] = useState<string | null>(null);

  /*
   * Seeded from `#spells&q=<name>`, which is how the command palette hands over
   * a spell. 351 rows is far too many to leave a reader hunting for the one
   * they just typed the name of.
   *
   * Applied, never written back. The hash belongs to `Tabs`, and two owners for
   * one string is how a filter starts fighting the reader every time they clear
   * the box. A later empty seed is ignored for the same reason: it means the
   * reader changed tabs, not that they wanted the search undone.
   */
  const seed = useHashSeed();
  useEffect(() => {
    const term = seed.get("q");
    if (term !== undefined && term !== "") setQuery(term);
  }, [seed]);

  const tierColour = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of tiers) map.set(t.name, t.color);
    return map;
  }, [tiers]);

  const schools = useMemo(() => {
    const counts = new Map<string, number>();
    for (const spell of spells) counts.set(spell.school, (counts.get(spell.school) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [spells]);

  const tierCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const spell of spells) counts.set(spell.tier, (counts.get(spell.tier) ?? 0) + 1);
    return TIER_ORDER.map((name) => [name, counts.get(name) ?? 0] as const).filter(([, n]) => n > 0);
  }, [spells]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return spells
      .filter((spell) => school === null || spell.school === school)
      .filter((spell) => tier === null || spell.tier === tier)
      .filter(
        (spell) =>
          trimmed === "" ||
          spell.name.toLowerCase().includes(trimmed) ||
          spell.effects.some((effect) => effect.toLowerCase().includes(trimmed)),
      );
  }, [spells, query, school, tier]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4">
        <div className="relative flex max-w-md items-center gap-3 border border-brand-accent/40 bg-black/35 px-4 py-3">
          <FrameCorners weight="thin" size={14} />
          <Search className="relative shrink-0 text-brand-accent" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search spells, or an effect"
            aria-label="Search spells"
            className="relative w-full bg-transparent text-[0.95rem] text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display mr-1 text-[10px] tracking-[2px] text-text-muted uppercase">
            School
          </span>
          <button
            type="button"
            onClick={() => setSchool(null)}
            aria-pressed={school === null}
            className={`cursor-pointer border px-3 py-1.5 text-[0.8rem] transition-colors ${
              school === null
                ? "border-brand-accent text-brand-accent"
                : "border-border-subtle text-text-muted hover:border-brand-accent/50 hover:text-text-light"
            }`}
          >
            All
          </button>
          {schools.map(([name, count]) => (
            <button
              key={name}
              type="button"
              onClick={() => setSchool(school === name ? null : name)}
              aria-pressed={school === name}
              className="cursor-pointer border px-3 py-1.5 text-[0.8rem] transition-colors"
              style={{
                borderColor: school === name ? SCHOOL_COLOUR[name] : "var(--color-border-subtle)",
                color: school === name ? SCHOOL_COLOUR[name] : "var(--color-text-muted)",
              }}
            >
              {name} <span className="tabular-nums opacity-60">{count}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display mr-1 text-[10px] tracking-[2px] text-text-muted uppercase">
            Tier
          </span>
          <button
            type="button"
            onClick={() => setTier(null)}
            aria-pressed={tier === null}
            className={`cursor-pointer border px-3 py-1.5 text-[0.8rem] transition-colors ${
              tier === null
                ? "border-brand-accent text-brand-accent"
                : "border-border-subtle text-text-muted hover:border-brand-accent/50 hover:text-text-light"
            }`}
          >
            All
          </button>
          {tierCounts.map(([name, count]) => (
            <button
              key={name}
              type="button"
              onClick={() => setTier(tier === name ? null : name)}
              aria-pressed={tier === name}
              className="cursor-pointer border px-3 py-1.5 text-[0.8rem] transition-colors"
              style={{
                borderColor: tier === name ? tierColour.get(name) : "var(--color-border-subtle)",
                color: tier === name ? tierColour.get(name) : "var(--color-text-muted)",
              }}
            >
              {name} <span className="tabular-nums opacity-60">{count}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-[0.8rem] text-text-muted">
        {results.length.toLocaleString("en-GB")} of {spells.length.toLocaleString("en-GB")} spells
        {school === null && tier === null ? "" : " shown"}.
      </p>

      {results.length === 0 ? (
        <p className="text-sm text-text-muted">
          Nothing matches <span className="text-text-primary">{query}</span>
          {tier === null ? "" : ` at ${tier}`}
          {school === null ? "" : ` in ${school}`}.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
            <thead>
              <tr>
                {["Spell", "Tier", "School", "Magicka", "Effects"].map((head, i) => (
                  <th
                    key={head}
                    className={`font-display border-b border-brand-accent/30 pb-2.5 text-[11px] tracking-[1.6px] text-brand-accent uppercase ${
                      i === 4 ? "" : "pr-6"
                    } ${head === "Magicka" ? "text-right" : ""}`}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((spell) => (
                <tr
                  key={`${spell.school}:${spell.name}`}
                  className="border-b border-border-subtle last:border-0"
                >
                  <td className="py-2.5 pr-6 text-text-primary">{spell.name}</td>
                  <td className="py-2.5 pr-6" style={{ color: tierColour.get(spell.tier) }}>
                    {spell.tier}
                  </td>
                  <td className="py-2.5 pr-6" style={{ color: SCHOOL_COLOUR[spell.school] }}>
                    {spell.school}
                  </td>
                  <td className="py-2.5 pr-6 text-right tabular-nums text-text-muted">
                    {spell.cost === spell.costHigh
                      ? spell.cost
                      : `${spell.cost} to ${spell.costHigh}`}
                  </td>
                  <td className="py-2.5 text-text-muted">{spell.effects.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
