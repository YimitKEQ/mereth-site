/**
 * The client's messages, explained.
 *
 * The site used to hand these to the reader raw. A player who could not connect
 * was shown fourteen strings scraped out of the client, in monospace, under the
 * line "these are its own messages", and left to work it out. Two of the
 * fourteen were not messages at all but fragments cut mid-sentence,
 * `(belongs at load order #` and `(no plugin at load index`. Three said the same
 * thing three ways. None of them said what to do.
 *
 * The intent behind that was sound and worth keeping: quote the client so a
 * player can match the words on their screen against the page, rather than
 * reading our paraphrase and hoping it is the same situation. What went wrong is
 * that the quote became the explanation instead of the evidence for it.
 *
 * So each entry here is the other way round. The heading says what happened in
 * plain words, the body says what to do about it, and the client's own wording
 * sits underneath as the thing you match against. One entry can carry several
 * strings, which is what removes the duplication: "Extra client SKSE DLL not on
 * server", "Extra client plugin not on server" and "Extra plugin not on the
 * server" are one situation and now read as one.
 *
 * Two rules for editing this file:
 *
 * 1. `seen` is verbatim. Not trimmed, not tidied, not shortened to fit. The
 *    whole point is that a player can match it character for character, and the
 *    previous version failed exactly here: it quoted "Assign Lockpicking in your
 *    skill plan" while the client says "Assign Lockpicking in your skill plan at
 *    a temple before you can pick locks." It cut the half that tells you where to
 *    go. `npm test` checks every string here against the shipped client strings
 *    for that reason, so a message the client rewords fails the build rather
 *    than quietly becoming a misquote.
 * 2. `body` says what to do, in the second person, in words a player who has
 *    never opened a mod manager can act on. "Reinstall through the launcher" is
 *    an instruction. "Your load order does not match" is a restatement of the
 *    error, and the error already said that.
 */

export interface ClientMessage {
  /** What happened, in plain words. */
  title: string;
  /** What it means and what to do about it. */
  body: string;
  /** The client's own wording, verbatim, for matching against the screen. */
  seen: string[];
}

/**
 * Why the game will not let you in.
 *
 * Ordered by how often it happens rather than alphabetically, because somebody
 * reading this is mid-problem and the first entry should be the likely one.
 * Nearly all of these are one cause: a load order the launcher did not build.
 */
export const connectionMessages: ClientMessage[] = [
  {
    title: "Your mods do not match the server's",
    body: `The server checks every plugin by name, by position in the load order, and by whether it
      is flagged light or regular. Any one of those being different stops the connection. Reinstall
      through the launcher and let it build the list. It is faster than finding the difference by
      hand, and hand-fixing tends to produce the next error on this page.`,
    seen: [
      "Disconnected: your mod list does not match the server. Fix mods, then Connect.",
      "A plugin name, order, or file does not match the server.",
      "Your load order or a mod file does not match the server.",
      "Your mod list could not be verified against the server.",
      "Mod List Check Failed",
    ],
  },
  {
    title: "You are missing mods the server runs",
    body: `Something the server expects is not installed, or is installed but switched off. Having
      the file in your Data folder is not enough on its own: it has to be enabled and actually
      loading. Reinstall through the launcher, which fetches the versions the server is running
      rather than whichever version you already had.`,
    seen: [
      "Your load order is missing required plugins.",
      "Install the missing plugins listed below (same versions as the server).",
      "Having a file in Data is not enough. It must be enabled and loaded.",
    ],
  },
  {
    title: "You have mods the server does not",
    body: `An extra plugin of your own is enough to be turned away, even a harmless one, because the
      list has to match exactly rather than merely contain everything required. Turn off anything
      you added yourself, or reinstall through the launcher to get back to a clean list. Mods that
      only change how the game looks for you still count as extra.`,
    seen: [
      "Your load order has extra plugins the server does not allow.",
      "Extra plugin not on the server:",
      "Extra client plugin not on server:",
      "Extra client SKSE DLL not on server:",
    ],
  },
  {
    title: "Your mods are in the wrong order",
    body: `You have the right plugins but they are not in the right slots, and a plugin in the wrong
      position fails in exactly the same way a missing one does. This is the error people spend
      longest on, because nothing looks wrong in the list. Do not reorder by hand. Reinstall through
      the launcher and let it own the order.`,
    seen: [
      "Fix the slots below so your load order matches the server mod pack.",
      "Your plugin list is longer than the server's, but names overlap. Check load order and duplicates.",
      "Your plugin list is shorter than the server's, but every server name is present. Check for duplicate or failed loads.",
    ],
  },
  {
    title: "A mod is flagged light when it should not be, or the other way round",
    body: `Plugins can load as light (ESL) or regular, and yours are flagged differently to the
      server's. It is the same file either way, which is why this one is so hard to spot by eye. A
      launcher reinstall sets the flags correctly. Changing them by hand in a mod manager is not
      worth the time.`,
    seen: [
      "Plugin ESL/light flags do not match the server.",
      "Your plugins' ESL (light) flags do not match the server mod pack.",
      "Your loader's ESL/light flags do not match the server mod pack.",
      "Fix light vs regular for the plugins below so they match the server, then reconnect.",
    ],
  },
  {
    title: "Your script extender plugins do not match",
    body: `SKSE plugins are checked by name, by file size and by checksum, so an out of date copy
      fails even though the name is right. Reinstall the script extender through the launcher.
      Copying a DLL in from elsewhere is what usually causes this.`,
    seen: [
      "An SKSE DLL name, size, or checksum does not match the server.",
      "Your SKSE plugin DLLs do not match the server.",
      "Your SKSE plugins could not be verified against the server.",
      "Replace the mismatched files with the server's SKSE plugin versions.",
      "SKSE Plugin Check Failed",
    ],
  },
  {
    title: "The connection dropped",
    body: `This is the network rather than your mods, and it is worth simply clicking Connect again
      before changing anything. If it keeps happening, check your own connection first. If it only
      happens to you and only on Mereth, say so in Discord with the exact wording you got, because
      these four cases look identical from the outside and the wording is what separates them.`,
    seen: [
      "Disconnected from the server. Click Connect to try again.",
      "Disconnected: connection dropped unexpectedly. Click Connect to try again.",
      "Disconnected: server link timed out. Click Connect to try again.",
      "Disconnected before any server data was received. Click Connect to try again.",
      "Check your internet connection and try again.",
    ],
  },
  {
    title: "The check could not finish, so it refused to guess",
    body: `The client could not build a full picture of your mods and stopped rather than letting you
      in half checked. Nothing is necessarily wrong with your install. Quit to the main menu and
      connect again. If it persists, it is worth reporting: this one is the server's end more often
      than yours.`,
    seen: [
      "Plugin slot map is not ready. Cannot join safely.",
      "The ESL slot map never arrived or failed to build.",
    ],
  },
];

/**
 * Messages you get while playing, and what the game wants from you.
 *
 * These are the ones the complaint was about. A player picks up a lockpick,
 * nothing happens, they read a line of terse text, and the site's answer used to
 * be the same terse line reprinted. The skill ones all share a cause worth
 * saying out loud rather than implying: a skill you have not locked into your
 * plan does not half work, it does not work at all.
 */
export const playMessages: ClientMessage[] = [
  {
    title: "Your lockpick does nothing",
    body: `Lockpicking is not on your skill plan, and the client refuses the action outright rather
      than letting you fail at it. This reads exactly like a bug and is not one. Open your skills
      with \`K\` and assign the skill, which you can do in the starting room or at any temple in the
      province. Nothing you do with a pick counts for anything until it is locked in, including
      practice.`,
    seen: ["Assign Lockpicking in your skill plan at a temple before you can pick locks."],
  },
  {
    title: "You cannot pickpocket anybody",
    body: `Same cause as the lock. Pickpocketing has to be assigned in your skill plan before the
      client will let you try at all. Press \`K\`, and assign it in the starting room or at a temple.`,
    seen: [
      "Assign Pickpocketing in your skill plan at a temple before you can pick pockets.",
      "Lock In your skill plan before you can pickpocket. Use the Skills menu (K).",
    ],
  },
  {
    title: "This lock will not open no matter your skill",
    body: `Some locks are not a skill check at all and want the key instead. No amount of Lockpicking
      opens one, so the way in is to find, buy or be handed the key, which on a roleplay server
      usually means asking whoever holds it.`,
    seen: ["This lock requires a key."],
  },
  {
    title: "They noticed you",
    body: `Pickpocketing only works on somebody who has not spotted you. Being detected does not make
      it harder, it stops it. Break line of sight, let them settle, and try again from sneak.`,
    seen: ["You can't pickpocket while detected."],
  },
  {
    title: "They are still wary of you",
    body: `You tried recently and it did not go unnoticed. The target stays on edge for a while and
      refuses further attempts until that passes. Waiting is the only thing that clears it, and
      trying repeatedly keeps it up.`,
    seen: ["They are on edge: wait before trying again."],
  },
  {
    title: "That target or item is off limits",
    body: `Some things are not stealable and some targets cannot be pickpocketed at all, animals and
      creatures among them. This is a rule rather than a difficulty, so no amount of skill changes
      it.`,
    seen: ["You can't pickpocket creatures.", "You cannot steal this"],
  },
  {
    title: "The game lost track of what you were aiming at",
    body: `Opening a menu can drop the thing you had targeted, and the interaction will not carry on
      without it. Close the menu, aim at them again, and press \`F3\` to re-acquire the target.`,
    seen: ["Look target lost. Close menu, aim, press F3 again."],
  },
];
