/**
 * Roleplay language: how to say a thing in character.
 *
 * This page exists because of the single most common failure new players hit,
 * and it is not malice. Somebody wants to join a faction and says "I'll make a
 * new character for that". Somebody explains they have not put points into
 * One-Handed yet. Neither is trolling. They simply have not been shown what the
 * in-world version of that sentence sounds like, and every time it happens it
 * lands in somebody else's scene.
 *
 * A standing rule for this file, inherited from `pages.ts` and it matters more
 * here than anywhere: **this is an official Mereth surface, so anything written
 * here reads as policy.** Every rule quoted below is a real code from
 * `rules.ts`. Everything else is presented as guidance and phrasing, never as a
 * new rule, because the rulebook is the authority and this page is not allowed
 * to quietly grow it.
 */

export interface Swap {
  /** What a player actually types or says. */
  ooc: string;
  /** The same intent, in character. */
  ic: string;
  /** Only where the reason is not obvious from the pair. */
  why?: string;
}

export interface SwapGroup {
  id: string;
  title: string;
  blurb: string;
  swaps: Swap[];
}

/** The rules this page is built on. Codes are exact, so they can be cited. */
export const groundedIn = [
  {
    code: "SRP.2",
    text: "Everything your character does should be considered as if it were their real life. Think about consequences and how your actions affect your character's future in Skyrim.",
  },
  {
    code: "B.1",
    text: "Out-of-character talk in character is prohibited. If an issue arises, remove yourself from the scene quickly but methodically and handle it in a ticket or a direct message.",
  },
  {
    code: "B.2",
    text: "A ticket is out of character. Do not discuss one in character.",
  },
  {
    code: "N.3",
    text: "Modern slang breaks the Fourth Era. Bruh, cap and YOLO are not permitted.",
  },
  {
    code: "N.4",
    text: "Use in-universe expressions instead. By the Nine. Talos preserve us. Milk-drinker. S'wit, N'wah, fetcher. By Y'ffre. May your road lead to warm sands. Walk with the shadows.",
  },
];

export const swapGroups: SwapGroup[] = [
  {
    id: "sheet",
    title: "Your character sheet",
    blurb:
      "Nobody in Skyrim has ever seen a skill tier or a memory point. They know what you can do, who taught you, and what you have never learned. Say that instead, and it is almost always the more interesting line anyway.",
    swaps: [
      {
        ooc: "My One-Handed is Adept, I need two more tiers.",
        ic: "I can hold my own with a blade. I have never had proper training with one.",
      },
      {
        ooc: "I put eight points into Destruction.",
        ic: "I studied under a mage in Whiterun for two winters. Fire, mostly.",
        why: "Magic on Mereth needs a teacher and a book, so who taught you is a real part of your character, not a number.",
      },
      {
        ooc: "I'm only level 12, I can't fight him.",
        ic: "I have seen what that man does to people. I am not walking into it.",
      },
      {
        ooc: "I need to grind smithing.",
        ic: "I am looking for work at a forge. I will sweep the floor if it means watching him work.",
      },
      {
        ooc: "That's locked behind Master tier.",
        ic: "I have not been taught that. I would need to find someone who has.",
      },
      {
        ooc: "My build is a stealth archer.",
        ic: "I hunt. I am better at it from a distance, and better still if nobody knows I am there.",
      },
      {
        ooc: "I'm out of energy.",
        ic: "I am spent. I have been on my feet since first light.",
      },
    ],
  },
  {
    id: "machine",
    title: "The game underneath",
    blurb:
      "Servers, patches, mods, framerate and respawns do not exist in the Fourth Era. Most of this belongs in Discord. The rest has a perfectly good in-world version, because Skyrim already has words for being hurt, being lost, and going home.",
    swaps: [
      {
        ooc: "I died and respawned at the temple.",
        ic: "I woke on a cot in the temple. Somebody carried me there, and I do not know who.",
        why: "How you came back is a scene. Take it, it is free.",
      },
      {
        ooc: "Server's lagging.",
        ic: "Say nothing in the scene. Step out first.",
      },
      {
        ooc: "I have to log off, my dinner's ready.",
        ic: "I am for bed. Ride safe.",
        why: "Put your character somewhere a person would plausibly be before you go, rather than vanishing mid-street.",
      },
      {
        ooc: "Anyone know where the quest marker is?",
        ic: "Has anyone heard where the work is? I am asking after a job.",
      },
      {
        ooc: "Just an NPC.",
        ic: "The innkeeper. The smith. That woman by the gate.",
      },
      {
        ooc: "Is this scripted?",
        ic: "Nothing. If you truly need to know, that is a Discord question.",
      },
      {
        ooc: "Brb, AFK.",
        ic: "Sit your character down somewhere sensible and say nothing.",
      },
    ],
  },
  {
    id: "meta",
    title: "You, and your other characters",
    blurb:
      "This is the one that costs the most scenes, and the hardest to unlearn. Your character does not know they are one of several people you play. They do not know that you, the player, are considering somebody else.",
    swaps: [
      {
        ooc: "I'm gonna make a new character to join the Legion.",
        ic: "Have this one ask. Walk into the barracks and ask a legionnaire how a man enlists.",
        why: "Almost every faction on Mereth takes people in character. Announcing a second character in a scene tells everyone present that the person in front of them is disposable, and it is the fastest way to flatten a room.",
      },
      {
        ooc: "My other character knows this guy.",
        ic: "This character has never met him. Play that.",
        why: "What one of your characters knows, another one does not. Acting on it is metagaming, and it is unfair in a way that is hard to prove and easy to feel.",
      },
      {
        ooc: "Somebody told me in Discord he's a vampire.",
        ic: "Your character has heard nothing. Until they see it or someone tells them in a scene, they do not know.",
      },
      {
        ooc: "I'm going to retire this character.",
        ic: "That is a real decision, and it is made out of character. Do not announce it in a scene. Give them an exit somebody could believe.",
      },
      {
        ooc: "Who are you actually?",
        ic: "Do not ask. Your character has a name to go on, and that is all they get.",
        why: "Your Discord name already matches your character name, per CRE.3, so there is nothing left to ask.",
      },
    ],
  },
  {
    id: "mouth",
    title: "The words themselves",
    blurb:
      "N.3 forbids modern slang outright, and N.4 gives you the replacements. This is the easiest rule on the whole server to follow and the one most often broken, because it slips out before you think.",
    swaps: [
      { ooc: "Bruh. No cap. YOLO.", ic: "By the Nine. Talos preserve us. Gods be good.", why: "N.3 names these three specifically." },
      { ooc: "lol / lmao", ic: "Laugh. Or write it: he snorts into his cup." },
      { ooc: "OK. Yeah, cool.", ic: "Aye. As you say. Fair enough." },
      { ooc: "Hey guys.", ic: "Well met. Evening. Gods bless." },
      { ooc: "Dude. Man. Buddy.", ic: "Friend. Kinsman. Stranger. Milk-drinker, if you mean it." },
      { ooc: "Thanks so much!", ic: "You have my thanks. I will not forget it." },
      { ooc: "Sorry, my bad.", ic: "My mistake. I spoke out of turn." },
      { ooc: "Guys, wait up.", ic: "Hold. A moment, all of you." },
    ],
  },
];

/**
 * Phrasing patterns for the four things newcomers most often need to say and do
 * not yet have the words for. Deliberately not scripts: they are shapes.
 */
export const patterns = [
  {
    id: "asking-in",
    title: "Getting into something",
    lines: [
      "Find a member and ask them, not the room. Every organisation on Mereth is made of people, and people can be asked.",
      "Give a reason that belongs to your character. Coin, safety, a debt, a grudge, somewhere to sleep. Not: because I want the role.",
      "Expect to be told no, or to be told to come back. Being refused is a scene. Being refused and coming back anyway is a character.",
    ],
  },
  {
    id: "refusing",
    title: "Saying no",
    lines: [
      "You are allowed to refuse anything in character. Your character is not obliged to like the plan.",
      "Refuse as them, with their reason: I have a wife in Rorikstead. I have seen a man hang for less. I do not work for Nords.",
      "If you need to refuse something out of character, that is not a refusal in the scene. Step out and take it to a ticket, per B.1.",
    ],
  },
  {
    id: "threatening",
    title: "Threats and pressure",
    lines: [
      "Say what your character wants and what happens if they do not get it. That is the whole of a threat.",
      "Keep it possible. A threat your character cannot carry out is a bluff, and other players are allowed to call it.",
      "Smack talk is permitted with a line, per T.5. When somebody says a subject should go no further, it goes no further.",
    ],
  },
  {
    id: "hurt",
    title: "Being hurt",
    lines: [
      "Injuries get roleplayed. Refusing to is named in N.1 as no intent to roleplay.",
      "Describe it plainly and keep it consistent. A broken arm is broken in the next scene too.",
      "Let it cost you something. A character who is never slowed down is a character nothing can happen to.",
    ],
  },
];

/**
 * The part players actually ask about most, and the reason this page was
 * requested. Derived from B.1 rather than invented: the rule already says what
 * to do, it just does not say it in the situation people meet it in.
 */
export const whenSomebodyElseBreaks = {
  rule: "B.1",
  lead:
    "Somebody else dropping out of character does not put you out of character. Their break is theirs. If you answer it in kind, there are now two people out of the scene instead of one, and everybody else present is watching the fiction come apart.",
  steps: [
    "Stay in character. In most cases the scene survives one stray sentence if nobody else picks it up.",
    "If you can, absorb it in character. A confused look, a change of subject, or simply carrying on is usually enough, and it teaches by example better than a correction would.",
    "Do not correct them in the scene. A rules lecture in character is itself out-of-character talk, and it does more damage than the thing it is correcting.",
    "If it needs saying, say it afterwards and say it kindly, in a direct message. Most people doing this are new and are trying.",
    "If it keeps happening or it is deliberate, remove yourself from the scene quickly but methodically and open a ticket. That is what B.1 asks for, and a ticket stays out of character per B.2.",
  ],
  closing:
    "Pulling somebody aside in character to teach them is generous and it works, but it is not required of you and it is not the fix for a player who is not trying. The rules exist so that nobody has to police a scene themselves.",
};

/** A short self-check. Not a rule, and it does not pretend to be one. */
export const selfCheck = [
  "Would my character know this, or do only I know it?",
  "Am I saying what I can do, or what I have been taught to do?",
  "Does this sentence mention anything that does not exist in the Fourth Era?",
  "If somebody clipped this scene and posted it, would it read as a story or as a lobby?",
];
