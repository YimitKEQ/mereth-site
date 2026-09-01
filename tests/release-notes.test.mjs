// The rules that turn Mereth's tags into patch notes, checked against a real
// changelog rather than an invented one.
//
//   npm test
//
// `tests/fixtures/changelog.json` is the launcher's own changelog, sent over by
// Bruin, covering 367 tags from 0.0.x in February to 0.70.54 on 30 August. Its
// bodies are byte identical to what GitHub's releases API returns for the same
// versions, checked across every tag the two have in common, so folding it
// exercises the real production path offline and for free.
//
// It is a fixture, not a data source, and the difference is worth writing down
// because it was not obvious. The file looks authoritative and is not: it holds
// 367 of the 607 tags upstream, and the 240 it omits include fully curated
// patches such as v0.69.0, v0.69.10 and v0.68.41. Reading the site from it
// would have deleted 233 patches from the changelog. What it is genuinely good
// for is this: a real history, with every awkward shape in it, held against the
// folding rules so a change to them cannot quietly drop somebody's patch note.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  compareVersions,
  foldReleases,
  isDevBuild,
  isVersion,
  mergeLive,
  notesFrom,
  publicVersion,
  summaryFrom,
} from "../src/lib/release-notes.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(fs.readFileSync(path.join(here, "fixtures", "changelog.json"), "utf8"));

/** The fixture's shape to the shape GitHub's API hands over. */
const asRaw = (entries) =>
  entries.map((entry) => ({ tag: entry.version, body: entry.notes, date: entry.date }));

const all = asRaw(fixture.releases);
const folded = foldReleases(all);
const byVersion = new Map(folded.map((release) => [release.version, release]));

test("versions order numerically, not lexically", () => {
  assert.ok(compareVersions("0.68.31", "0.68.9") > 0);
  assert.ok(compareVersions("0.70.9", "0.70.10") < 0);
  assert.equal(compareVersions("0.70.54", "0.70.54"), 0);
  assert.ok(compareVersions("1.0", "0.99.99") > 0);
});

test("a dev tag and its patch are the same version", () => {
  assert.equal(publicVersion("v0.70.54-dev"), "0.70.54");
  assert.equal(publicVersion("v0.70.54"), "0.70.54");
  assert.ok(isDevBuild("v0.70.54-dev"));
  assert.ok(!isDevBuild("v0.70.54"));
});

test("rolling pointers are not patches", () => {
  // `dev-latest` survives publicVersion unchanged and used to parse as version
  // zero, which dragged the changelog's first-release date back to it.
  assert.ok(!isVersion(publicVersion("dev-latest")));
  assert.ok(!isVersion(publicVersion("v")));
  assert.ok(isVersion("0.70.54"));
});

test("a bullet's own verb beats the heading above it", () => {
  const notes = notesFrom("## Changes\n- Fixed the thing\n- Added a thing\n- Polished a thing");
  assert.deepEqual(
    notes.map((note) => note.kind),
    ["Fixed", "Added", "Changed"],
  );
});

test("the summary is the prose, never the bullets", () => {
  const body = fixture.releases.find((entry) => entry.version === "0.70.21-dev").notes;
  const summary = summaryFrom(body);
  assert.ok(summary.startsWith("Long awaited update"));
  assert.ok(summary.includes("Valhalla Combat"));
  assert.ok(!summary.includes("- Added"), "bullets leaked into the summary");
  assert.ok(summary.includes("\n\n"), "the paragraph breaks were flattened");
});

test("a patch inherits the prose written on its dev build", () => {
  // 0.70.21 is bullets only. The paragraphs introducing that update were
  // written on 0.70.21-dev, and dropping them left the site's biggest patch of
  // the summer with no explanation of what it was.
  assert.equal(summaryFrom(fixture.releases.find((e) => e.version === "0.70.21").notes), null);
  assert.ok(byVersion.get("0.70.21").summary.startsWith("Long awaited update"));
});

test("a release without a summary reports none", () => {
  assert.equal(summaryFrom("# Patch notes\n\n## Changes\n- Fixed a thing"), null);
});

test("dev builds roll into the patch that collected them", () => {
  // Eighteen dev builds sat between 0.70.36 and 0.70.54 on 30 August, all
  // restating the same four lines. Each used to render as its own release.
  for (let patch = 37; patch <= 53; patch += 1) {
    assert.ok(!byVersion.has(`0.70.${patch}`), `0.70.${patch} was a dev build, not a patch`);
  }
  const collected = byVersion.get("0.70.54");
  assert.equal(collected.notes.length, 5);
  assert.ok(collected.shipped);
});

test("a build whose patch is missing rolls into the next one that exists", () => {
  // This fixture has no 0.69.10 entry, though upstream does: it is a partial
  // snapshot, which is the reason the site reads GitHub and not this file. The
  // twenty lines on 0.69.10-dev therefore have no patch of their own here, and
  // the first one above them is 0.70.21. Worth pinning, because it is the
  // shape of every gap: a patch nobody tagged must not take notes down with it.
  const collector = byVersion.get("0.70.21");
  assert.ok(
    collector.notes.some((note) => note.text.includes("Teaching now only reduces 24 hours")),
    "a dev-only note was dropped",
  );
});

test("no note in the source is lost", () => {
  const bulletsOf = (body) =>
    body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.slice(2).trim().toLowerCase());

  const source = new Set(fixture.releases.flatMap((entry) => bulletsOf(entry.notes)));
  const kept = new Set(folded.flatMap((release) => release.notes.map((n) => n.text.toLowerCase())));

  const missing = [...source].filter((text) => !kept.has(text));
  assert.deepEqual(missing, [], `${missing.length} notes went missing in the fold`);
});

test("every patch in the source is still a patch", () => {
  const shipped = fixture.releases
    .filter((entry) => !isDevBuild(entry.version))
    .map((entry) => entry.version);
  for (const version of shipped) {
    assert.ok(byVersion.has(version), `${version} vanished`);
  }
  assert.equal(folded.filter((release) => release.shipped).length, new Set(shipped).size);
});

test("patches come back newest first", () => {
  const shipped = folded.filter((release) => release.shipped);
  for (let i = 1; i < shipped.length; i += 1) {
    assert.ok(
      compareVersions(shipped[i - 1].version, shipped[i].version) > 0,
      `${shipped[i - 1].version} should sort above ${shipped[i].version}`,
    );
  }
});

test("notes are grouped by kind, curated wording first", () => {
  const order = ["Added", "Fixed", "Changed", "Removed"];
  for (const release of folded) {
    const ranks = release.notes.map((note) => order.indexOf(note.kind));
    for (let i = 1; i < ranks.length; i += 1) {
      assert.ok(ranks[i] >= ranks[i - 1], `${release.version} lists its kinds out of order`);
    }
  }
});

test("builds no patch has collected yet are held back, not dropped", () => {
  // Cut the fixture off above 0.70.36 so 0.70.37-dev onward have nowhere to go.
  const truncated = foldReleases(
    all.filter((entry) => compareVersions(publicVersion(entry.tag), "0.70.54") < 0),
  );
  const pending = truncated[0];
  assert.equal(pending.shipped, false);
  assert.equal(pending.version, "0.70.53");
  assert.ok(pending.notes.some((note) => note.text.includes("double tap dodge")));
  assert.equal(truncated.filter((release) => !release.shipped).length, 1, "one entry, not eighteen");
  assert.ok(truncated[1].shipped);
});

test("a live fetch adds to the baked page and never subtracts from it", () => {
  const baked = foldReleases(
    all.filter((entry) => compareVersions(publicVersion(entry.tag), "0.70.34") <= 0),
  );
  const live = foldReleases(all.slice(0, 30));

  const merged = mergeLive(baked, live);
  assert.equal(merged[0].version, "0.70.54");
  assert.equal(new Set(merged.map((r) => r.version)).size, merged.length, "duplicate versions");

  // Everything the server rendered is still there afterwards.
  for (const release of baked) {
    const after = merged.find((r) => r.version === release.version);
    assert.ok(after, `${release.version} disappeared when the live answer landed`);
    for (const note of release.notes) {
      assert.ok(
        after.notes.some((n) => n.text === note.text),
        `${release.version} lost "${note.text}" to the live merge`,
      );
    }
  }
});

test("a live entry in testing is replaced by the patch that collects it", () => {
  const baked = foldReleases(
    all.filter((entry) => compareVersions(publicVersion(entry.tag), "0.70.54") < 0),
  );
  assert.equal(baked[0].shipped, false, "the fixture should start with a pending entry");

  const merged = mergeLive(baked, foldReleases(all.slice(0, 30)));
  assert.equal(merged[0].version, "0.70.54");
  assert.equal(merged[0].shipped, true);
  assert.equal(
    merged.filter((release) => release.version === "0.70.54").length,
    1,
    "the pending entry and its patch both rendered",
  );
});

test("an empty or broken live answer leaves the page alone", () => {
  const baked = foldReleases(all);
  assert.deepEqual(mergeLive(baked, []), baked);
  assert.deepEqual(foldReleases([]), []);
  assert.deepEqual(foldReleases([{ tag: "v9.9.9", body: "", date: null, draft: true }]), []);
});
