// The forum parser behind /peoples.
//
//   npm test
//
// The Lore Team writes for Discord, not for us, so these pin the reading rules:
// a people heading inside a thread splits it, links become further reading, and
// a merge never drops a people the forum has not written yet.

import assert from "node:assert/strict";
import test from "node:test";

import { mergePeoples, parseThread, readingLabel } from "../scripts/pocket-guide-parse.mjs";

test("a thread named for a people is about that people", () => {
  const [orcs] = parseThread("Orcs", [
    "- Orcs follow Malacath or Trinimac.\n\n**Useful reading:**\nhttps://en.uesp.net/wiki/Lore:Code_of_Malacath",
  ]);
  assert.equal(orcs.id, "orcs");
  assert.deepEqual(orcs.points, ["Orcs follow Malacath or Trinimac."]);
  assert.deepEqual(orcs.reading, [
    { label: "Code of Malacath", url: "https://en.uesp.net/wiki/Lore:Code_of_Malacath" },
  ]);
});

test("headings split a shared thread and the preamble is dropped", () => {
  const peoples = parseThread("Beast Races", [
    "Read this before you play one.\n## Argonians\nThe Hist matters.\n**Khajiit**\nThe moons matter.",
  ]);
  assert.deepEqual(
    peoples.map((p) => [p.id, p.points]),
    [["argonians", ["The Hist matters."]], ["khajiit", ["The moons matter."]]],
  );
});

test("dashes are rewritten, mentions skipped", () => {
  const [altmer] = parseThread("Altmer", ["It comes from somewhere \u2014 family.\n@Citizen"]);
  assert.deepEqual(altmer.points, ["It comes from somewhere: family."]);
});

test("merge replaces by id, keeps unwritten peoples, and orders them", () => {
  const seeded = [{ id: "khajiit", name: "Khajiit", points: ["old"], reading: [] }];
  const merged = mergePeoples(seeded, [{ id: "nords", name: "Nords", points: ["new"], reading: [] }]);
  assert.deepEqual(merged.map((p) => p.id), ["nords", "khajiit"]);
  assert.equal(readingLabel("https://en.uesp.net/wiki/Lore:Green_Pact"), "Green Pact");
});
