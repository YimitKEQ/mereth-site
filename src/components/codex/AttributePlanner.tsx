"use client";

import { useEffect, useMemo, useState } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { useSkillPlan } from "@/components/codex/useSkillPlan";
import {
  ATTR_MAX,
  ATTRS,
  bankFor,
  floorOf,
  formatBuild,
  GOVERNS,
  governorOf,
  luckEffects,
  parseBuild,
  playsAt,
  poolsOf,
  RACES,
  racialBase,
  RESET_COOLDOWNS,
  skillBonus,
  spentOn,
  type AttrKey,
  type Attrs,
  type Race,
  type Sex,
} from "@/lib/attributes";
import type { Attribute, Skill, Tier } from "@/lib/mereth";

/**
 * The attribute half of character creation, beside the skill plan.
 *
 * Players asked for this because attributes now move skills: every five points
 * above 50 in the governing attribute is a skill level, every five below costs
 * one, and the server adds it on top of the tier your memory points bought. A
 * skill plan read without the attributes beside it was the wrong number.
 *
 * The build lives in `?build=` rather than the hash, because the hash already
 * belongs to the skill plan and both should survive one shared link.
 */

interface Props {
  skills: Skill[];
  attributes: Attribute[];
  tiers: (Tier & { cost: number })[];
}

/* The server falls back to the Imperial row for an unknown race (L6534). */
const DEFAULT_RACE = RACES.find((r) => r.id === "imperial") as Race;
const UNTOUCHED = formatBuild(DEFAULT_RACE, "m", 1, racialBase(DEFAULT_RACE, "m"), racialBase(DEFAULT_RACE, "m"));

const percent = (n: number): string => `${Math.round(n * 100)}%`;
const signed = (n: number): string => (n > 0 ? `+${n}` : String(n));

export function AttributePlanner({ skills, attributes, tiers }: Props) {
  const [race, setRace] = useState(DEFAULT_RACE);
  const [sex, setSex] = useState<Sex>("m");
  const [masterLevel, setMasterLevel] = useState(1);
  const [attrs, setAttrs] = useState<Attrs>(() => racialBase(DEFAULT_RACE, "m"));
  const [copied, setCopied] = useState(false);

  const { chosen } = useSkillPlan(skills, tiers);
  const nameOf = useMemo(() => new Map(skills.map((s) => [s.key, s.name])), [skills]);
  const blurbOf = useMemo(() => new Map(attributes.map((a) => [a.key, a])), [attributes]);

  useEffect(() => {
    const text = new URLSearchParams(window.location.search).get("build");
    const loaded = text === null ? null : parseBuild(text);
    if (loaded === null) return;
    setRace(loaded.race);
    setSex(loaded.sex);
    setMasterLevel(loaded.masterLevel);
    setAttrs(loaded.attrs);
  }, []);

  const base = useMemo(() => racialBase(race, sex), [race, sex]);
  const bank = bankFor(masterLevel);
  const left = bank - spentOn(base, attrs);
  const pools = poolsOf(attrs, race);
  const luck = luckEffects(attrs.luck);
  const link = formatBuild(race, sex, masterLevel, base, attrs);

  /* `replaceState` with a search-only URL keeps the hash, so the skill plan in
     it survives every attribute click. */
  useEffect(() => {
    const url = new URL(window.location.href);
    /* An untouched planner is not a build, so it leaves the URL alone. */
    if (!url.searchParams.has("build") && link === UNTOUCHED) return;
    /* Written by hand rather than through `searchParams.set`, which would
       escape every colon and comma and turn a readable build into noise. The
       build only ever holds letters, digits, dots, colons, commas and minus. */
    window.history.replaceState(null, "", `${url.pathname}?build=${link}${url.hash}`);
  }, [link]);

  /* Changing race or sex starts from the new racial base: a spend that was
     legal for a Nord is not necessarily legal for a Breton. */
  const pick = (nextRace = race, nextSex = sex): void => {
    setRace(nextRace);
    setSex(nextSex);
    setAttrs(racialBase(nextRace, nextSex));
  };

  const bump = (key: AttrKey, delta: number): void => {
    setAttrs((prev) => {
      const value = prev[key] + delta;
      if (value < floorOf(base[key]) || value > ATTR_MAX) return prev;
      if (delta > 0 && left <= 0) return prev;
      return { ...prev, [key]: value };
    });
  };

  const setLevel = (raw: string): void => {
    const next = Math.min(200, Math.max(1, Math.floor(Number(raw)) || 1));
    /* Losing Master Levels strips the latest spends on the server; here the
       build simply resets if it no longer fits. */
    if (spentOn(base, attrs) > bankFor(next)) setAttrs(base);
    setMasterLevel(next);
  };

  const share = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // The link is in the address bar either way.
      setCopied(false);
    }
  };

  const chip =
    "h-8 cursor-pointer border px-3 text-[0.8rem] transition-colors disabled:cursor-not-allowed disabled:opacity-30";
  const on = "border-brand-accent bg-brand-accent text-brand-dark";
  const off = "border-brand-accent/25 text-text-muted hover:border-brand-accent/60 hover:text-text-primary";

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,42rem)_20rem] lg:gap-14">
      <div className="min-w-0 space-y-10">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-4 border-b border-border-subtle pb-6">
          <label className="block">
            <span className="font-display mb-2 block text-[10px] tracking-[2px] text-text-muted uppercase">
              Race
            </span>
            <select
              value={race.id}
              onChange={(e) => pick(RACES.find((r) => r.id === e.target.value) ?? race)}
              className="h-8 border border-brand-accent/40 bg-black/50 px-2 text-[0.9rem] text-text-primary"
            >
              {RACES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="font-display mb-2 block text-[10px] tracking-[2px] text-text-muted uppercase">
              Body
            </span>
            <span className="flex gap-1" role="group" aria-label="Body">
              {(["m", "f"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={sex === s}
                  onClick={() => pick(race, s)}
                  className={`${chip} ${sex === s ? on : off}`}
                >
                  {s === "m" ? "Male" : "Female"}
                </button>
              ))}
            </span>
          </div>

          <label className="block">
            <span className="font-display mb-2 block text-[10px] tracking-[2px] text-text-muted uppercase">
              Master Level
            </span>
            <input
              type="number"
              min={1}
              max={200}
              value={masterLevel}
              onChange={(e) => setLevel(e.target.value)}
              className="h-8 w-20 border border-brand-accent/40 bg-black/50 px-2 text-[0.9rem] tabular-nums text-text-primary"
            />
          </label>
        </div>

        <ul className="space-y-1.5">
          {ATTRS.map((key) => {
            const info = blurbOf.get(key);
            const value = attrs[key];
            const bonus = skillBonus(value);
            const governed = key === "luck" ? [] : GOVERNS[key].filter((k) => nameOf.has(k));
            const label = info?.label ?? key;

            return (
              <li key={key} className="border-b border-border-subtle py-3 last:border-0">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.95rem] text-text-primary">
                      {label}
                      <span className="ml-2 text-[0.75rem] tabular-nums text-text-muted">
                        base {base[key]}
                      </span>
                    </span>
                    {info === undefined ? null : (
                      <span className="block text-[0.78rem] text-text-muted">{info.blurb}</span>
                    )}
                  </span>

                  <span className="flex shrink-0 items-center gap-2">
                    {key === "luck" ? null : (
                      <span
                        className={`w-14 text-right text-[0.78rem] tabular-nums ${
                          bonus > 0 ? "text-brand-accent" : bonus < 0 ? "text-[#d08a76]" : "text-text-muted"
                        }`}
                        title="Hidden skill levels this adds to every skill it governs"
                      >
                        {bonus === 0 ? "no bonus" : `${signed(bonus)} lvl`}
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={`Lower ${label}`}
                      onClick={() => bump(key, -1)}
                      disabled={value <= floorOf(base[key])}
                      className={`${chip} w-8 px-0 ${off}`}
                    >
                      -
                    </button>
                    <span
                      className={`w-9 text-center font-display text-lg tabular-nums ${
                        value > base[key] ? "text-brand-accent" : value < base[key] ? "text-[#d08a76]" : "text-text-primary"
                      }`}
                    >
                      {value}
                    </span>
                    <button
                      type="button"
                      aria-label={`Raise ${label}`}
                      onClick={() => bump(key, 1)}
                      disabled={left <= 0 || value >= ATTR_MAX}
                      className={`${chip} w-8 px-0 ${off}`}
                    >
                      +
                    </button>
                  </span>
                </div>
                {governed.length === 0 ? null : (
                  <p className="mt-1.5 text-[0.75rem] leading-relaxed text-text-muted/80">
                    {governed.map((k) => nameOf.get(k)).join(", ")}
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        <section>
          <h3 className="font-display mb-4 text-[0.95rem] tracking-heading text-brand-accent uppercase">
            Your skill plan with these attributes
          </h3>
          {chosen.length === 0 ? (
            <p className="text-[0.9rem] leading-relaxed text-text-muted">
              Plan your skills on the Planner or Skill menu tab and they appear here, with the level
              each one actually plays at once you reach its tier&apos;s ceiling.
            </p>
          ) : (
            <table className="w-full text-left text-[0.85rem]">
              <thead>
                <tr className="font-display text-[10px] tracking-[1.6px] text-text-muted uppercase">
                  <th className="pb-2 font-normal">Skill</th>
                  <th className="pb-2 font-normal">Tier ceiling</th>
                  <th className="pb-2 font-normal">Attribute</th>
                  <th className="pb-2 text-right font-normal">Plays at</th>
                </tr>
              </thead>
              <tbody>
                {chosen.map(({ skill, tier }) => {
                  const t = tiers[tier - 1];
                  const gov = governorOf(skill.key);
                  const bonus = gov === null ? 0 : skillBonus(attrs[gov]);
                  const ceiling = t?.to ?? 0;
                  const plays = playsAt(ceiling, bonus);
                  return (
                    <tr key={skill.key} className="border-t border-border-subtle">
                      <td className="py-2 text-text-primary">{skill.name}</td>
                      <td className="py-2 tabular-nums" style={{ color: t?.color }}>
                        {t?.name} {ceiling}
                      </td>
                      <td className="py-2 text-text-muted">
                        {gov === null ? "none" : `${blurbOf.get(gov)?.label ?? gov} ${signed(bonus)}`}
                      </td>
                      <td
                        className={`py-2 text-right tabular-nums ${
                          plays > ceiling ? "text-brand-accent" : plays < ceiling ? "text-[#d08a76]" : "text-text-light"
                        }`}
                      >
                        {plays}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <p className="mt-4 text-[0.8rem] leading-relaxed text-text-muted">
            The server adds the attribute bonus on top of your trained level, so it can carry a skill
            past the tier you bought, up to 99. Racial skill bonuses, gear, buffs and hold ranks add
            on top and are not counted here. A skill you have not trained at all gets no bonus.
          </p>
        </section>
      </div>

      <aside className="lg:sticky lg:top-[140px] lg:self-start">
        <div className="relative border border-brand-accent/45 bg-black/45 p-6 backdrop-blur-[var(--blur-panel)]">
          <FrameCorners weight="thin" size={18} />

          <div className="relative">
            <p className="font-display text-[11px] tracking-[2px] text-text-muted uppercase">
              Attribute points
            </p>
            <p className="mt-2 flex items-baseline gap-2">
              <span
                className={`font-display text-5xl tabular-nums ${
                  left === 0 ? "text-brand-action" : "text-brand-accent"
                }`}
              >
                {left}
              </span>
              <span className="text-sm text-text-muted">of {bank} left</span>
            </p>
            <p className="mt-2 text-[0.78rem] leading-relaxed text-text-muted">
              12 at creation, 3 more per Master Level. Lowering an attribute, up to 5 below its base,
              gives the point back.
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border-subtle pt-5">
              {(
                [
                  ["Health", pools.health],
                  ["Magicka", pools.magicka],
                  ["Stamina", pools.stamina],
                  ["Carry", pools.carry],
                  ["Spell points", pools.spellPoints],
                  ["Study slots", pools.studySlots],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className="font-display text-[10px] tracking-[1.6px] text-text-muted uppercase">
                    {label}
                  </dt>
                  <dd className="font-display text-xl tabular-nums text-text-primary">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[0.78rem] text-text-muted">
              Study takes {percent(pools.studyTime)} of the normal time.
            </p>

            <div className="mt-5 border-t border-border-subtle pt-5 text-[0.8rem] leading-relaxed text-text-light">
              <p className="font-display mb-2 text-[10px] tracking-[1.6px] text-text-muted uppercase">
                Luck {attrs.luck}
              </p>
              <p>Crafting and gathering failures: {percent(luck.failRate)} of normal</p>
              <p>
                {luck.yieldRoll >= 0 ? "Bonus" : "Lost"} yield roll: {percent(Math.abs(luck.yieldRoll))}
              </p>
              <p>Gathering extra item: {percent(luck.extraItem)}</p>
              <p>Loot amount: {percent(luck.loot)}</p>
            </div>

            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setAttrs(base)} className={`${chip} ${off}`}>
                Back to racial base
              </button>
              <button type="button" onClick={share} className={`${chip} ${on}`}>
                {copied ? "Link copied" : "Copy link"}
              </button>
            </div>
            <p className="mt-4 text-[0.75rem] leading-relaxed text-text-muted">
              In game, spend these at a temple. A reset there refunds everything, with a cooldown that
              grows with each reset in 30 days: {RESET_COOLDOWNS.join(", then ")}.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
