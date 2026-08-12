"use client";

import { useMemo, useState } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { Search } from "@/components/ui/icons";
import type { Spell } from "@/lib/mereth";

/**
 * Every spell record in the province, by school.
 *
 * Two caveats, stated on the page rather than buried. This is read from the
 * plugins the launcher installs, so it is what **exists in the world**, not
 * what you can get: Mereth gates spells behind a teacher and a book. And a
 * spell record is not always a spell a person casts, because creature abilities
 * and quest effects live in the same table.
 *
 * Records sharing a name are merged into one row with the range of magicka
 * costs their variants span, since mods ship the same spell at many power
 * levels and fourteen rows of "Lightning Bolt" is not a catalogue.
 */

const SCHOOL_COLOUR: Record<string, string> = {
  Alteration: "#7fa8d4",
  Conjuration: "#a884c9",
  Destruction: "#c9705c",
  Illusion: "#c9a05c",
  Restoration: "#7fc99a",
};

export function SpellBrowser({ spells, initialQuery = "" }: { spells: Spell[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [school, setSchool] = useState<string | null>(null);

  const schools = useMemo(() => {
    const counts = new Map<string, number>();
    for (const spell of spells) counts.set(spell.school, (counts.get(spell.school) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [spells]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return spells
      .filter((spell) => school === null || spell.school === school)
      .filter(
        (spell) =>
          trimmed === "" ||
          spell.name.toLowerCase().includes(trimmed) ||
          spell.effects.some((effect) => effect.toLowerCase().includes(trimmed)),
      )
      .slice(0, 300);
  }, [spells, query, school]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex min-w-0 flex-1 items-center gap-3 border border-brand-accent/40 bg-black/35 px-4 py-3 md:max-w-md">
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

        <div className="flex flex-wrap gap-2">
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
      </div>

      <p className="mb-4 text-[0.8rem] text-text-muted">
        {results.length === 300 ? "First 300 of " : ""}
        {results.length.toLocaleString("en-GB")} shown
        {results.length === 300 ? ". Narrow the search to see the rest." : "."}
      </p>

      {results.length === 0 ? (
        <p className="text-sm text-text-muted">
          Nothing matches <span className="text-text-primary">{query}</span>.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="font-display border-b border-brand-accent/30 pb-2.5 pr-6 text-[11px] tracking-[1.6px] text-brand-accent uppercase">
                  Spell
                </th>
                <th className="font-display border-b border-brand-accent/30 pb-2.5 pr-6 text-[11px] tracking-[1.6px] text-brand-accent uppercase">
                  School
                </th>
                <th className="font-display border-b border-brand-accent/30 pb-2.5 pr-6 text-right text-[11px] tracking-[1.6px] text-brand-accent uppercase">
                  Magicka
                </th>
                <th className="font-display border-b border-brand-accent/30 pb-2.5 pr-6 text-right text-[11px] tracking-[1.6px] text-brand-accent uppercase">
                  Variants
                </th>
                <th className="font-display border-b border-brand-accent/30 pb-2.5 text-[11px] tracking-[1.6px] text-brand-accent uppercase">
                  Effects
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((spell) => (
                <tr
                  key={`${spell.school}:${spell.name}`}
                  className="border-b border-border-subtle last:border-0"
                >
                  <td className="py-2.5 pr-6 text-text-primary">{spell.name}</td>
                  <td className="py-2.5 pr-6" style={{ color: SCHOOL_COLOUR[spell.school] }}>
                    {spell.school}
                  </td>
                  <td className="py-2.5 pr-6 text-right tabular-nums text-text-muted">
                    {spell.cost === spell.costHigh
                      ? spell.cost
                      : `${spell.cost} to ${spell.costHigh}`}
                  </td>
                  <td className="py-2.5 pr-6 text-right tabular-nums text-text-muted">
                    {spell.variants === 1 ? "" : spell.variants}
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
