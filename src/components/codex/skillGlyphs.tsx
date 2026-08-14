/**
 * A glyph for every skill, drawn here rather than installed.
 *
 * The client uses Font Awesome Pro, which is licensed per seat and cannot be
 * redistributed on a public site, so these are originals. They follow the shape
 * of their choices where that reads best (a pickaxe for mining, a flask for
 * alchemy) because those are the obvious symbols rather than anybody's design.
 *
 * One grid and one weight for all of them: 24 by 24, stroked in `currentColor` at
 * 1.6, round caps and joins, no fills. That is what makes fifty-one drawings by
 * one hand look like a set instead of a collection, and it is why they stay
 * legible at the 26 pixels the cards actually render them at.
 *
 * Several skills share a glyph, exactly as they do upstream: an axe is an axe
 * whether it is being swung at a tree or a person.
 */

import type { ReactElement } from "react";

const G = {
  pickaxe: (
    <>
      <path d="M5 19 14.5 9.5" />
      <path d="M8.5 6.2c3.4-2 7.4-1.4 10.3 1.6" />
      <path d="M11.4 12.6 16 8" />
    </>
  ),
  fish: (
    <>
      <path d="M3 12c3.6-4 8.6-4 12.2 0-3.6 4-8.6 4-12.2 0Z" />
      <path d="M15.2 12 20 8.4v7.2Z" />
      <circle cx="7.2" cy="11.2" r="0.9" />
    </>
  ),
  shovel: (
    <>
      <path d="M12 3v11" />
      <path d="M9.4 3h5.2" />
      <path d="M8.6 14h6.8l-1.2 5.4a2.6 2.6 0 0 1-4.4 0Z" />
    </>
  ),
  bow: (
    <>
      <path d="M6 3c7 2.6 10.4 10.4 9 18" />
      <path d="M6 3 20.2 20.4" />
      <path d="M4 12h9" />
      <path d="M10.4 9.4 13 12l-2.6 2.6" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c0-8 5-13 16-14 1 11-4 16-12 16-2.2 0-4-1-4-2Z" />
      <path d="M11 13c2.4-2.4 5-4 8-5" />
    </>
  ),
  axe: (
    <>
      <path d="M5 20 14 11" />
      <path d="M12 4.6c3.6-1 6.6 0.4 8 3.4-2.6 2-5.6 2.4-8.4 1.2Z" />
    </>
  ),
  bee: (
    <>
      <ellipse cx="12" cy="14" rx="4" ry="5.4" />
      <path d="M8.2 12.4h7.6M8.2 15.6h7.6" />
      <path d="M12 8.6V6" />
      <path d="M9.4 10.4C7 8.2 4.6 8 3.6 9.4c-.8 1.2.4 3 2.6 3.6" />
      <path d="M14.6 10.4c2.4-2.2 4.8-2.4 5.8-1 .8 1.2-.4 3-2.6 3.6" />
    </>
  ),
  wheat: (
    <>
      <path d="M12 21V9" />
      <path d="M12 9c0-2.6 1.4-4.4 3.6-5.4.6 2.6-.4 4.8-3.6 5.4Z" />
      <path d="M12 9c0-2.6-1.4-4.4-3.6-5.4C7.8 6.2 8.8 8.4 12 9Z" />
      <path d="M12 15c0-2.4 1.4-4 3.6-4.8.6 2.4-.4 4.4-3.6 4.8Z" />
      <path d="M12 15c0-2.4-1.4-4-3.6-4.8C7.8 12.6 8.8 14.6 12 15Z" />
    </>
  ),
  furnace: (
    <>
      <path d="M5 21V8.6l7-4.6 7 4.6V21Z" />
      <path d="M9.4 21v-4.6a2.6 2.6 0 0 1 5.2 0V21" />
      <path d="M12 13.4c-1.4-1.6-.4-2.8 0-3.6.4.8 1.4 2 0 3.6Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.4 19 6v6c0 4.4-3 7.4-7 8.6-4-1.2-7-4.2-7-8.6V6Z" />
    </>
  ),
  shieldHeavy: (
    <>
      <path d="M12 3.4 19 6v6c0 4.4-3 7.4-7 8.6-4-1.2-7-4.2-7-8.6V6Z" />
      <path d="M12 6.6v11.2" />
      <path d="M7.4 11h9.2" />
    </>
  ),
  shieldLight: (
    <>
      <path d="M12 3.4 19 6v6c0 4.4-3 7.4-7 8.6-4-1.2-7-4.2-7-8.6V6Z" />
      <path d="M9.2 12.4 11.4 15l3.6-4.4" />
    </>
  ),
  anvil: (
    <>
      <path d="M3.4 9h11.2c2.6 0 4 1.6 6 1.6-1 2.6-3 4-6 4H9l-1 3.4h6v2H6l2.4-6.6H4.6A1.2 1.2 0 0 1 3.4 12Z" />
    </>
  ),
  gem: (
    <>
      <path d="M7.6 4h8.8l3.6 5-8 11-8-11Z" />
      <path d="M4 9h16" />
      <path d="M9.6 9 12 20 14.4 9 12 4Z" />
    </>
  ),
  hide: (
    <>
      <path d="M6.4 4c2 1.6 3.2 2.2 5.6 2.2S15.6 5.6 17.6 4c1.4 2.4 1.2 4.4-.6 6 1.6 2.6 1.6 5.4 0 8.4-3.2 1.4-6.8 1.4-10 0-1.6-3-1.6-5.8 0-8.4-1.8-1.6-2-3.6-.6-6Z" />
    </>
  ),
  needle: (
    <>
      <path d="M4 20 17 7" />
      <path d="M15 5c1.6-1.6 3.4-1.6 4.4-.6 1 1 1 2.8-.6 4.4Z" />
      <path d="M8.4 15.6c-2.4.8-3.6 2-4.4 4.4 2.4-.8 3.6-2 4.4-4.4Z" />
    </>
  ),
  hammer: (
    <>
      <path d="M4 20 12.6 11.4" />
      <path d="M11 6.4 14.4 3l6.6 6.6-3.4 3.4Z" />
      <path d="M12.6 8 16 11.4" />
    </>
  ),
  bottle: (
    <>
      <path d="M10 3h4v3.6l2.6 4a4 4 0 0 1 .6 2.2V19a2 2 0 0 1-2 2H8.8a2 2 0 0 1-2-2v-6.2c0-.8.2-1.6.6-2.2L10 6.6Z" />
      <path d="M7 14h10" />
    </>
  ),
  pot: (
    <>
      <path d="M4 9h16v5a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6Z" />
      <path d="M3 9h18" />
      <path d="M9 6c0-1.6 1.4-2 1.4-3M14 6c0-1.6 1.4-2 1.4-3" />
    </>
  ),
  horse: (
    <>
      <path d="M5 20c0-5 2.4-8.4 6-9.6l1.4-4.2 3 1.4 3.6-1.6-1 4c1.4 1.6 1.6 3.4.6 5.4" />
      <path d="M11 10.4c-2.6 1.4-4 3.6-4 6.6" />
      <circle cx="15.6" cy="8.4" r="0.8" />
    </>
  ),
  saddle: (
    <>
      <path d="M4 12c3-1.6 5.4-2.4 8-2.4s5 .8 8 2.4c-1.4 4-4.4 6-8 6s-6.6-2-8-6Z" />
      <path d="M8.4 10.4V6.6h7.2v3.8" />
    </>
  ),
  dagger: (
    <>
      <path d="M12 3 14.4 12h-4.8Z" />
      <path d="M8.4 12h7.2" />
      <path d="M12 12v9" />
    </>
  ),
  sword: (
    <>
      <path d="M13.6 3.4 15.4 5.2 8 12.6 6.2 10.8Z" />
      <path d="M6.6 14.6 9.4 17.4" />
      <path d="M4 20l3.4-3.4" />
      <path d="M11.6 9.4 20 17.8l-2.2 2.2-8.4-8.4" />
    </>
  ),
  greatsword: (
    <>
      <path d="M12 2 14.6 5v9.6h-5.2V5Z" />
      <path d="M7.6 14.6h8.8" />
      <path d="M12 14.6V22" />
      <path d="M10 18.6h4" />
    </>
  ),
  mace: (
    <>
      <path d="M4 20 11 13" />
      <circle cx="15.4" cy="8.6" r="4.4" />
      <path d="M15.4 4.2v8.8M11 8.6h8.8" />
    </>
  ),
  battleaxe: (
    <>
      <path d="M12 3v18" />
      <path d="M12 5.4c-3.4-.8-5.6.6-6.6 3.4 2.6 1.6 4.8 1.4 6.6-.6Z" />
      <path d="M12 5.4c3.4-.8 5.6.6 6.6 3.4-2.6 1.6-4.8 1.4-6.6-.6Z" />
    </>
  ),
  warhammer: (
    <>
      <path d="M12 8.4V21" />
      <path d="M6.4 3.4h11.2v5H6.4Z" />
      <path d="M9.4 8.4h5.2" />
    </>
  ),
  crossbow: (
    <>
      <path d="M4 7c2.6 1.4 4.4 3.4 5.4 6M20 7c-2.6 1.4-4.4 3.4-5.4 6" />
      <path d="M4 7h4M20 7h-4" />
      <path d="M12 4v16" />
      <path d="M8.6 16.6h6.8" />
    </>
  ),
  fist: (
    <>
      <path d="M5.4 10.4V8.6a1.8 1.8 0 0 1 3.6 0v1.2M9 9.6V7a1.8 1.8 0 0 1 3.6 0v2.6M12.6 10V7.8a1.8 1.8 0 0 1 3.6 0v3" />
      <path d="M16.2 11.6c1.6-.6 2.6.4 2.4 2l-.6 4c-.4 2.4-2 3.4-4.6 3.4h-3c-2.6 0-4.4-1.6-5-4L5 14.6c-.4-1.6 1.4-2.6 2.4-1.2" />
    </>
  ),
  vest: (
    <>
      <path d="M8.6 3 12 6l3.4-3 4.2 2.4-1.4 4.4 1 8.2H6.8l1-8.2L6.4 5.4Z" />
      <path d="M12 6v15" />
    </>
  ),
  plate: (
    <>
      <path d="M8.6 3 12 5.6 15.4 3l4.2 2.6-1.6 4 1 11.4H5l1-11.4-1.6-4Z" />
      <path d="M6.6 12.6h10.8M6.4 16.6h11.2" />
    </>
  ),
  spark: (
    <>
      <path d="M12 2.6 13.8 9l6.4 1.8-6.4 1.8L12 19l-1.8-6.4L3.8 10.8 10.2 9Z" />
      <path d="M18.4 16.4l.8 2.4 2.4.8-2.4.8-.8 2.4-.8-2.4-2.4-.8 2.4-.8Z" />
    </>
  ),
  flask: (
    <>
      <path d="M10 3h4v5.6l4 8.4a2.6 2.6 0 0 1-2.4 3.8H8.4A2.6 2.6 0 0 1 6 17l4-8.4Z" />
      <path d="M7.6 15.4h8.8" />
      <path d="M9 3h6" />
    </>
  ),
  skull: (
    <>
      <path d="M12 3c4.4 0 7 3 7 7 0 2.6-1.4 4-1.4 5.6V18H6.4v-2.4C6.4 14 5 12.6 5 10c0-4 2.6-7 7-7Z" />
      <circle cx="9.4" cy="10.4" r="1.6" />
      <circle cx="14.6" cy="10.4" r="1.6" />
      <path d="M9 18v3M12 18v3M15 18v3" />
    </>
  ),
  rune: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 5.6v12.8" />
      <path d="M12 9.4 16 6M12 9.4 8 6" />
      <path d="M12 15 16 18.4M12 15 8 18.4" />
    </>
  ),
  ward: (
    <>
      <path d="M12 3.4 19 6v6c0 4.4-3 7.4-7 8.6-4-1.2-7-4.2-7-8.6V6Z" />
      <circle cx="12" cy="11.6" r="3" />
    </>
  ),
  flame: (
    <>
      <path d="M12 21c-3.6 0-6-2.4-6-5.6 0-4 4-5.4 4-9.4 3 1.4 3.6 3.6 3 5.6 1-.6 1.6-1.6 1.6-3 2.2 2 3.4 4.4 3.4 6.8 0 3.2-2.4 5.6-6 5.6Z" />
    </>
  ),
  eye: (
    <>
      <path d="M2.6 12C5 8 8.4 6 12 6s7 2 9.4 6c-2.4 4-5.8 6-9.4 6s-7-2-9.4-6Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20.4C6.6 17 3.4 13.8 3.4 10.2A4.6 4.6 0 0 1 12 7.8a4.6 4.6 0 0 1 8.6 2.4c0 3.6-3.2 6.8-8.6 10.2Z" />
    </>
  ),
  key: (
    <>
      <circle cx="7.4" cy="8.6" r="4" />
      <path d="M10.2 11.4 20 21" />
      <path d="M17 18l2-2M14.4 15.4l2-2" />
    </>
  ),
  hand: (
    <>
      <path d="M8.4 12V5.4a1.8 1.8 0 0 1 3.6 0V11M12 10.6V4.6a1.8 1.8 0 0 1 3.6 0V12" />
      <path d="M15.6 12V7.6a1.8 1.8 0 0 1 3.6 0v7.8c0 3.4-2.2 5.6-5.6 5.6h-1.8c-3 0-4.4-1.6-5.6-4L4.6 14c-.6-1.4 1-2.8 2.2-1.6l1.6 1.8" />
    </>
  ),
  mask: (
    <>
      <path d="M4 8.6c5.4-1.6 10.6-1.6 16 0-.4 5.4-2 8.6-8 11.4-6-2.8-7.6-6-8-11.4Z" />
      <path d="M8 12.4c1.4-.8 2.6-.8 3.2 0M12.8 12.4c.6-.8 1.8-.8 3.2 0" />
    </>
  ),
  runner: (
    <>
      <circle cx="14.4" cy="5" r="2" />
      <path d="M15.6 9 11 11.4l1.6 3.6L11 21" />
      <path d="M12.6 15 17 17.4 19 21" />
      <path d="M11 11.4 6.4 10" />
      <path d="M4 16h4.6" />
    </>
  ),
  lute: (
    <>
      <path d="M14.6 9.4 20 4" />
      <path d="M18.2 2.4 21.6 5.8" />
      <ellipse cx="10" cy="14" rx="6" ry="6.6" transform="rotate(-20 10 14)" />
      <circle cx="10.6" cy="13.4" r="1.8" />
    </>
  ),
} satisfies Record<string, ReactElement>;

type GlyphName = keyof typeof G;

/**
 * Skill key to glyph. Sharing is deliberate and matches upstream: an axe is an
 * axe, and a bow does not change shape because the hand holding it is hunting.
 */
const FOR_SKILL: Record<string, GlyphName> = {
  // Gathering
  mining: "pickaxe",
  fishing: "fish",
  saltmaking: "shovel",
  hunting: "bow",
  herbalism: "leaf",
  woodcutting: "axe",
  beekeeping: "bee",
  farming: "wheat",

  // Crafting and trades
  smelting: "furnace",
  armoursmithing: "plate",
  weaponsmithing: "anvil",
  jewelcrafting: "gem",
  leatherworking: "hide",
  tailoring: "needle",
  carpentry: "hammer",
  brewing: "bottle",
  cooking: "pot",
  animaltaming: "horse",

  // Weapon specializations
  daggers: "dagger",
  mace: "mace",
  swords: "sword",
  axes: "axe",
  battleaxe: "battleaxe",
  greatsword: "greatsword",
  warhammer: "warhammer",
  bows: "bow",
  crossbows: "crossbow",
  unarmed: "fist",

  // Armor specializations
  lightarmour: "vest",
  heavyarmour: "plate",
  block: "shield",
  shieldlight: "shieldLight",
  shieldheavy: "shieldHeavy",

  // Magic schools
  spellcasting: "spark",
  alchemy: "flask",
  conjuration: "skull",
  enchanting: "rune",
  alteration: "ward",
  destruction: "flame",
  illusion: "eye",
  restoration: "heart",

  // Movement and stealth
  lockpicking: "key",
  pickpocketing: "hand",
  sneaking: "mask",
  sprinting: "runner",
  horseriding: "saddle",

  // Combat styles
  onehanded: "sword",
  twohanded: "greatsword",
  dualwield: "dagger",
  archery: "bow",

  // Performance
  musicianship: "lute",
};

export function SkillGlyph({ skill, size = 26 }: { skill: string; size?: number }) {
  const name = FOR_SKILL[skill];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* A skill with no glyph gets an honest placeholder rather than an empty
          box, so a new skill in the export is visible instead of silent. */}
      {name === undefined ? <circle cx="12" cy="12" r="7" strokeDasharray="3 3" /> : G[name]}
    </svg>
  );
}
