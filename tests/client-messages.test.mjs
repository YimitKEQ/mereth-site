// The explanations the site publishes for the client's own messages.
//
//   npm test
//
// One thing is being checked here and it is worth stating plainly: that every
// string we print as "this is what your screen says" is actually what the screen
// says. The page this replaced quoted "Assign Lockpicking in your skill plan"
// while the client says "Assign Lockpicking in your skill plan at a temple
// before you can pick locks." It had been trimmed to fit, and the half that got
// cut was the half naming the place you have to go. A player matching the site
// against their screen found a shorter, less useful version of their own error.
//
// So a `seen` line that no longer appears in the client fails the build. The
// server ships almost daily and these strings do get reworded; when that
// happens this test is how we find out, rather than a player finding out.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { connectionMessages, playMessages } from "../src/lib/handbook/client-messages.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const bundle = JSON.parse(
  fs.readFileSync(path.join(here, "..", "src", "data", "mereth.json"), "utf8"),
);

/** Every string the client is known to print, whichever bucket the sweep filed it under. */
const clientStrings = new Set([
  ...bundle.messages.rules,
  ...bundle.messages.troubles,
  ...bundle.messages.other,
]);

const all = [...connectionMessages, ...playMessages];

/**
 * Is this line one the client actually puts on screen?
 *
 * Most are a whole literal and match outright. Some are built by concatenation:
 * 0.72 replaced the per-skill refusals with `"Lock In your skill plan in the
 * Skills menu (K) before using " + title + "."`, so the literal in the bundle is
 * a sentence fragment and the sentence a player reads is not in there at all.
 * Refusing to quote those would push the site back to paraphrasing the one
 * message players report most. A line therefore also passes if a client literal
 * is its opening, which is as much as can be checked without running their code,
 * and it still catches text we made up whole.
 */
function clientPrints(line, clientStrings) {
  if (clientStrings.has(line)) return true;
  return [...clientStrings].some(
    (candidate) => candidate.length > 20 && line.startsWith(candidate),
  );
}

test("every quoted message is the client's, verbatim", () => {
  const invented = all.flatMap((message) =>
    message.seen
      .filter((line) => !clientPrints(line, clientStrings))
      .map((line) => `${message.title}: ${line}`),
  );
  assert.deepEqual(invented, [], "quoted text that the client does not actually print");
});

test("no message is quoted under two explanations", () => {
  // A player matching their error should land in one place. The same string
  // under two headings means one of the two explanations is the wrong one.
  const seen = new Map();
  for (const message of all) {
    for (const line of message.seen) {
      assert.equal(seen.get(line), undefined, `"${line}" is explained by both ${seen.get(line)} and ${message.title}`);
      seen.set(line, message.title);
    }
  }
});

test("nothing is published as a message that a player never sees", () => {
  // The bug this catches: the sweep files engine noise as player-facing, and a
  // render-time regex is not a good enough filter. "The listener must be a
  // function" is a JavaScript error and it sits in the `rules` bucket.
  const DEV_NOISE =
    /listener must be a function|Dynamic cast|Generator is already|loadUrl|CreateActor|auth data|skipping|falling back|attempt$|^Gets |Failed to (call|read|write|get|apply)/i;

  for (const message of all) {
    for (const line of message.seen) {
      assert.ok(!DEV_NOISE.test(line), `${message.title} quotes an internal string: "${line}"`);
    }
  }
});

test("nothing is published that was cut off mid sentence", () => {
  // Two of these were live on the guide page: "(belongs at load order #" and
  // "(no plugin at load index". They are not messages, they are the middle of
  // one, and they read as gibberish to somebody looking for their error.
  for (const message of all) {
    for (const line of message.seen) {
      assert.ok(!line.startsWith("("), `${message.title} quotes a fragment: "${line}"`);
      assert.ok(line.length > 12, `${message.title} quotes something too short to match: "${line}"`);
    }
  }
});

test("every explanation says what to do, not just what happened", () => {
  for (const message of all) {
    assert.ok(message.title.length > 0, "a message with no heading");
    assert.ok(
      message.body.length > 80,
      `"${message.title}" is too short to be an explanation: "${message.body}"`,
    );
    // The heading is the restatement of the error. The body has to add to it.
    assert.notEqual(message.body.trim(), message.title.trim());
  }
});

test("the house rule on dashes holds here too", () => {
  for (const message of all) {
    const text = `${message.title} ${message.body}`;
    assert.ok(!/[—–]/.test(text), `"${message.title}" carries a dash`);
  }
});

test("the connection errors a player actually hits are all covered", () => {
  // The load-order family is the overwhelming majority of failed connections,
  // so if any of these stops being explained the page has lost its main job.
  const mustExplain = [
    "Disconnected: your mod list does not match the server. Fix mods, then Connect.",
    "Your load order is missing required plugins.",
    "Your load order has extra plugins the server does not allow.",
    "Plugin ESL/light flags do not match the server.",
    "Your SKSE plugin DLLs do not match the server.",
  ];
  const covered = new Set(connectionMessages.flatMap((message) => message.seen));
  for (const line of mustExplain) {
    assert.ok(covered.has(line), `no explanation for "${line}"`);
  }
});

test("the skill refusals behind the bug reports are all covered", () => {
  const covered = new Set(playMessages.flatMap((message) => message.seen));
  // Updated for 0.72, which replaced the per-skill refusals with one templated
  // message and dropped "This lock requires a key." entirely. The two that went
  // are deliberately not listed as "should still exist": a list of strings the
  // client no longer prints is the same stale-quote problem one layer down.
  for (const line of [
    "Assign Pickpocketing in your skill plan at a temple before you can pick pockets.",
    "Assign Horse Riding on your skill plan and Lock In to ride horses.",
    "Lock In your skill plan before you can pickpocket. Use the Skills menu (K).",
    "You can't pickpocket while detected.",
  ]) {
    assert.ok(covered.has(line), `no explanation for "${line}"`);
  }
});
