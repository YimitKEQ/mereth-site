"use client";

import { useMemo, useState } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ChevronDown, Search } from "@/components/ui/icons";
import type { Skill, Tier } from "@/lib/mereth";

/**
 * Every skill, with Mereth's own text for each of its five tiers.
 *
 * The tier text is the reason this page exists. It is not flavour: it names the
 * ore, the bait, the salt and the material that becomes available, so it is the
 * only honest answer to "what does another point in this actually buy me". It
 * is quoted rather than summarised.
 */
export function SkillList({
  skills,
  categories,
  tiers,
}: {
  skills: Skill[];
  categories: { label: string; keys: string[] }[];
  tiers: Tier[];
}) {
  const [query, setQuery] = useState("");
  const byKey = useMemo(() => new Map(skills.map((s) => [s.key, s])), [skills]);

  const trimmed = query.trim().toLowerCase();
  const matches = (item: Skill): boolean =>
    trimmed === "" ||
    item.name.toLowerCase().includes(trimmed) ||
    item.summary.toLowerCase().includes(trimmed) ||
    item.tiers.some((tier) => tier.toLowerCase().includes(trimmed));

  const groups = categories
    .map((category) => ({
      label: category.label,
      skills: category.keys
        .map((key) => byKey.get(key))
        .filter((item): item is Skill => item !== undefined && matches(item)),
    }))
    .filter((group) => group.skills.length > 0);

  const found = groups.reduce((total, group) => total + group.skills.length, 0);

  return (
    <div className="max-w-4xl">
      <div className="relative mb-8 flex max-w-md items-center gap-3 border border-brand-accent/40 bg-black/35 px-4 py-3">
        <FrameCorners weight="thin" size={14} />
        <Search className="relative shrink-0 text-brand-accent" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search skills, or what a tier unlocks"
          aria-label="Search skills"
          className="relative w-full bg-transparent text-[0.95rem] text-text-primary outline-none placeholder:text-text-placeholder"
        />
        {trimmed !== "" ? (
          <span className="relative shrink-0 text-xs tabular-nums text-text-muted">{found}</span>
        ) : null}
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-text-muted">
          No skill mentions <span className="text-text-primary">{query}</span>.
        </p>
      ) : (
        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.label}>
              <h3 className="font-display mb-5 text-[0.95rem] tracking-heading text-brand-accent uppercase">
                {group.label}
                <span className="ml-3 text-[11px] tracking-normal text-text-muted normal-case">
                  {group.skills.length}
                </span>
              </h3>
              <div className="space-y-2">
                {group.skills.map((item) => (
                  <SkillCard key={item.key} skill={item} tiers={tiers} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function SkillCard({ skill, tiers }: { skill: Skill; tiers: Tier[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div id={skill.key} className="scroll-mt-[140px]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="relative flex w-full cursor-pointer items-center justify-between gap-5 border border-brand-accent/30 bg-black/30 px-5 py-3.5 text-left transition-colors hover:border-brand-accent/60 hover:bg-black/45"
      >
        <FrameCorners weight="thin" size={14} />
        <span className="relative min-w-0 flex-1">
          <span className="block text-[1rem] text-text-primary">{skill.name}</span>
          <span className="block truncate text-[0.82rem] text-text-muted">{skill.summary}</span>
        </span>
        <ChevronDown
          className={`relative shrink-0 text-brand-accent transition-transform duration-[var(--duration-fast)] ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <ol className="mt-px border border-t-0 border-brand-accent/20 bg-black/20 px-5 py-4">
          {skill.tiers.map((text, index) => {
            const tier = tiers[index];
            return (
              <li key={index} className="flex gap-4 border-b border-border-subtle py-3 last:border-0">
                <span className="w-24 shrink-0">
                  <span
                    className="font-display block text-[11px] tracking-[1.4px] uppercase"
                    style={{ color: tier?.color }}
                  >
                    {tier?.name}
                  </span>
                  <span className="block text-[10px] tabular-nums text-text-muted">
                    level {tier?.from} to {tier?.to}
                  </span>
                </span>
                <p className="flex-1 text-[0.9rem] leading-relaxed text-text-light">{text}</p>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
