// The attribute rules, checked against the worked examples the server's own
// numbers give (DEV gamemode.js, read 28 October 2026).
//
//   npm test

import assert from "node:assert/strict";
import test from "node:test";

import {
  bankFor,
  GOVERNS,
  isLegal,
  luckEffects,
  parseBuild,
  formatBuild,
  playsAt,
  poolsOf,
  RACES,
  racialBase,
  skillBonus,
  spentOn,
} from "../src/lib/attributes.ts";
import mereth from "../src/data/mereth.json" with { type: "json" };

const race = (id) => RACES.find((r) => r.id === id);

test("the skill bonus matches the server's examples", () => {
  assert.deepEqual([70, 100, 50, 45, 30].map(skillBonus), [4, 10, 0, -1, -4]);
});

test("a bonus can lift a skill past its tier, but never past 99, and an untrained skill gets nothing", () => {
  assert.equal(playsAt(79, 4), 83);
  assert.equal(playsAt(99, 10), 99);
  assert.equal(playsAt(0, 10), 0);
  assert.equal(playsAt(100, -4), 100);
  assert.equal(playsAt(3, -4), 1);
});

test("the bank is 12 plus 3 per Master Level past the first", () => {
  assert.equal(bankFor(1), 12);
  assert.equal(bankFor(4), 21);
});

test("racial bases read the right row, and Luck is always 50", () => {
  const orcF = racialBase(race("orc"), "f");
  assert.equal(orcF.personality, 25);
  assert.equal(orcF.willpower, 45);
  assert.equal(orcF.luck, 50);
  assert.equal(racialBase(race("breton"), "m").intelligence, 50);
});

test("lowering refunds one for one, only down to five below base", () => {
  const base = racialBase(race("nord"), "m");
  const build = { ...base, luck: 45, strength: base.strength + 17 };
  assert.equal(spentOn(base, build), 12);
  assert.ok(isLegal(base, build, 12));
  assert.ok(!isLegal(base, { ...base, luck: 44 }, 12), "six below base");
  assert.ok(!isLegal(base, { ...base, strength: 101 }, 99), "over the cap");
  assert.ok(!isLegal(base, { ...base, strength: base.strength + 13 }, 12), "over the bank");
});

test("pools follow the server formulas, magicka bonus and carry floor included", () => {
  const p = poolsOf(racialBase(race("altmer"), "m"), race("altmer"));
  assert.equal(p.magicka, 3 * 50 + 40 + 100);
  assert.equal(p.health, 2 * 40 + 40);
  const weak = { strength: 0, intelligence: 50, willpower: 50, agility: 0, speed: 0, endurance: 0, personality: 0, luck: 50 };
  assert.equal(poolsOf(weak, race("nord")).carry, 40);
  assert.equal(poolsOf({ ...weak, intelligence: 85, willpower: 65 }, race("nord")).studySlots, 2);
});

test("luck scales both ways around 50", () => {
  assert.equal(luckEffects(100).failRate, 0.7);
  assert.ok(Math.abs(luckEffects(0).failRate - 1.3) < 1e-9);
  assert.equal(luckEffects(50).loot, 1);
});

test("every skill on the site that the server governs is a real skill key", () => {
  const keys = new Set(mereth.skills.map((s) => s.key));
  const unknown = Object.values(GOVERNS).flat().filter((k) => !keys.has(k) && k !== "firstaid");
  assert.deepEqual(unknown, []);
});

test("a share link round-trips, and a doctored one is refused", () => {
  const r = race("khajiit");
  const base = racialBase(r, "f");
  const attrs = { ...base, agility: 62, luck: 45, personality: 35 };
  const text = formatBuild(r, "f", 1, base, attrs);
  assert.deepEqual(parseBuild(text)?.attrs, attrs);
  assert.equal(parseBuild("khajiit.f.1.agi:40"), null);
  assert.equal(parseBuild("gnome.m.1."), null);
  assert.equal(parseBuild("nord.x.1."), null);
});
