/**
 * The client's skill icons, on the website.
 *
 * These are the same Font Awesome Pro icons the game draws, transcribed one for
 * one from the client's own table at
 * `devkit/data/ui-source/src/features/skillsMenu/skillIcons.ts`. A player who
 * has learned an icon in the skill menu sees that icon here, which is the whole
 * point of a planner: it is a tool for a game, not a separate product.
 *
 * **On the licence, because it was got wrong once.** The Pro licence permits
 * exactly this. "Creators may Embed Pro Icons in websites, e-books, and apps."
 * What it forbids is publishing standalone copies for people who are not
 * licensed: "Creators may not make, share, or publish standalone copies of Pro
 * Icons or Pro Software for non-Creators." Importing named icons into our own
 * pages is embedding. Committing the package, or a dump of its icon files, so
 * that others could take it would not be, so do not do that.
 *
 * Two rules follow, and both matter:
 *
 * 1. **Import icons by name, never the whole set.** Named imports are what lets
 *    the bundler drop the other several thousand, so the build carries the
 *    fifty one we use rather than a copy of the library.
 * 2. **The token never enters the repository.** `.npmrc` points at Font
 *    Awesome's registry and reads `FONTAWESOME_NPM_AUTH_TOKEN` from the
 *    environment, which is Font Awesome's own recommendation. Set it before
 *    `npm install` or the Pro packages fail to resolve. See the README.
 *
 * Several skills deliberately share an icon, because the client shares them:
 * unarmed, one-handed and block are all `hand-back-fist` there and are all
 * `hand-back-fist` here. Where the client repeats itself, so does this. Keeping
 * the two tables identical is the feature; improving on it quietly is how they
 * drift apart.
 *
 * If the client's table changes, change this one. It is the source of truth.
 */

import {
  faAxe,
  faAxeBattle,
  faBolt,
  faBowArrow,
  faBug,
  faCrosshairs,
  faDagger,
  faEye,
  faFireBurner,
  faFishingRod,
  faFlaskPotion,
  faGavel,
  faGem,
  faHammer,
  faHand,
  faHandBackFist,
  faHands,
  faHeartPulse,
  faHorseHead,
  faHorseSaddle,
  faKeySkeleton,
  faLeafOak,
  faMandolin,
  faPersonRunning,
  faPickaxe,
  faScissors,
  faShield,
  faShieldHalved,
  faShovel,
  faSword,
  faUserSecret,
  faUtensils,
  faVest,
  faWandMagic,
  faWandMagicSparkles,
  faWandSparkles,
  faWheatAwn,
  faWineBottle,
} from "@fortawesome/pro-solid-svg-icons";

/**
 * Typed from one of the icons rather than from `@fortawesome/fontawesome-svg-core`.
 * That package exists to render icons at runtime and would be a whole dependency
 * pulled in for a single type, when the shape is already available here.
 */
type Icon = typeof faPickaxe;

/** Skill key to icon, mirroring the client's `SKILL_ICONS` exactly. */
const SKILL_ICONS: Record<string, Icon> = {
  // Gathering
  mining: faPickaxe,
  fishing: faFishingRod,
  saltmaking: faShovel,
  hunting: faBowArrow,
  herbalism: faLeafOak,
  woodcutting: faAxe,
  beekeeping: faBug,
  farming: faWheatAwn,
  // Stealth
  lockpicking: faKeySkeleton,
  pickpocketing: faHand,
  sneaking: faUserSecret,
  sprinting: faPersonRunning,
  // Crafting
  smelting: faFireBurner,
  armoursmithing: faShieldHalved,
  weaponsmithing: faSword,
  jewelcrafting: faGem,
  leatherworking: faVest,
  tailoring: faScissors,
  carpentry: faHammer,
  brewing: faWineBottle,
  cooking: faUtensils,
  // Riding
  animaltaming: faHorseHead,
  horseriding: faHorseSaddle,
  // Weapons
  daggers: faDagger,
  mace: faGavel,
  swords: faSword,
  axes: faAxe,
  battleaxe: faAxeBattle,
  greatsword: faSword,
  warhammer: faHammer,
  bows: faBowArrow,
  crossbows: faCrosshairs,
  unarmed: faHandBackFist,
  onehanded: faHandBackFist,
  twohanded: faAxeBattle,
  dualwield: faHands,
  archery: faBowArrow,
  // Armour and defence
  lightarmour: faVest,
  heavyarmour: faShieldHalved,
  shieldlight: faShield,
  shieldheavy: faShield,
  block: faHandBackFist,
  // Magic
  spellcasting: faWandMagicSparkles,
  conjuration: faWandSparkles,
  alchemy: faFlaskPotion,
  enchanting: faWandMagicSparkles,
  alteration: faWandMagic,
  destruction: faBolt,
  illusion: faEye,
  restoration: faHeartPulse,
  // Performance
  musicianship: faMandolin,
};

/**
 * Rendered as a plain inline `<svg>` rather than through `<FontAwesomeIcon>`.
 *
 * The React component ships a runtime, mutates a global icon library and, in a
 * statically exported app, resizes on hydration. None of that buys anything
 * here: an icon definition is a viewBox and a path, and writing those two into
 * the markup means the icon is in the exported HTML, styles from
 * `currentColor`, and costs no JavaScript at all.
 */
export function SkillGlyph({ skill, size = 40 }: { skill: string; size?: number }) {
  const icon = SKILL_ICONS[skill];

  // A skill with no icon gets an honest placeholder rather than an empty box,
  // so a new skill in the export is visible instead of silent.
  if (icon === undefined) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="7" strokeDasharray="3 3" />
      </svg>
    );
  }

  const [width, height, , , path] = icon.icon;
  // Duotone icons carry two paths. The solid set does not, but the type allows
  // it, so join rather than assume and render half an icon if that ever changes.
  const d = Array.isArray(path) ? path.join(" ") : path;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
