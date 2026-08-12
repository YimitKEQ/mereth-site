"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

import { HashSeedProvider } from "@/components/codex/hash-seed";
import { parseHash, subscribeToHash, type HashTarget } from "@/lib/hash";

const NO_PARAMS: ReadonlyMap<string, string> = new Map();

/**
 * Reads the fragment before anything inside a tab panel can.
 *
 * Rendering nothing, and rendered first, and both of those are the point.
 * Effects run child before parent and siblings in tree order, so an effect
 * written inside `Tabs` fires after every effect in the panel `Tabs` rendered.
 * On the skills page that is far too late: the planner clears any fragment
 * that is not a saved build in its own mount effect, so by the time the parent
 * looked, the link the reader followed was already gone. The first child of
 * the subtree is the earliest seat available.
 *
 * A layout effect would be early enough too, and it was tried. It runs before
 * every passive effect in the tree and it also disturbs the order the planner
 * depends on badly enough to drop a shared build on arrival, which is a
 * heavier bug than the one being fixed. Sitting earlier in the tree costs
 * nothing and disturbs nothing.
 */
function HashReader({ onRead }: { onRead: (target: HashTarget) => void }) {
  useEffect(() => {
    const read = (): void => onRead(parseHash(window.location.hash));
    read();

    /* An in-page link, and a palette jump from this page to another entry on
       it, both change the fragment and nothing else. There is no mount to hang
       either off. */
    return subscribeToHash(read);
  }, [onRead]);

  return null;
}

/**
 * Two or three views of the same dataset, switched in place.
 *
 * Deliberately not routes. The planner and the skill list are the same subject
 * seen two ways, and giving each its own URL would put a page load between two
 * things a reader flips between constantly. Which view is open gets the hash
 * instead.
 *
 * That hash is load bearing rather than a convenience. Only the open panel is
 * in the DOM, so a link into a tab that is closed resolves to nothing at all:
 * the reader lands on the right page, on the wrong view, with no sign that
 * anything was meant to happen. Every deep link the command palette emits
 * names its tab here first, and anything after the tab id is passed down to
 * the panel through `useHashSeed`.
 *
 * The fragment has other owners on some of these pages, the skill planner most
 * of all, so this reads and writes only fragments that name one of its own
 * tabs and leaves everything else untouched.
 */
export function Tabs({
  tabs,
  initial = 0,
}: {
  tabs: { id: string; label: string; hint?: string; content: ReactNode }[];
  initial?: number;
}) {
  const [active, setActive] = useState(initial);
  const [seed, setSeed] = useState<ReadonlyMap<string, string>>(NO_PARAMS);

  /* Keyed on the id list rather than on `tabs` itself. The pages build that
     array inline, so its identity changes on every render while the only thing
     read out of it here does not. */
  const ids = tabs.map((tab) => tab.id).join("\n");

  const onRead = useCallback(
    (target: HashTarget) => {
      const index = ids.split("\n").indexOf(target.tab);
      /* A miss covers both "no hash" and a fragment written in somebody else's
         grammar, a saved build or a chapter, and `initial` is the right answer
         for both. Leaving the seed alone matters as much: parameters that were
         never meant for a tab are not a search term. */
      if (index < 0) return;
      setActive(index);
      setSeed(target.params);
    },
    [ids],
  );

  const go = (index: number): void => {
    const tab = tabs[index];
    if (tab === undefined) return;
    setActive(index);

    /* The seed is dropped with the click, and the hash written below says the
       same thing. A reader picking a tab by hand is asking for that tab, not
       for the search term somebody else's link happened to arrive with. */
    setSeed(NO_PARAMS);

    /* Only when the fragment is ours to write. The skills page keeps a saved
       build in the same string, and stamping a tab id over `#plan=mining:3`
       would throw away the thing the reader came to make: tab away, tab back,
       eighteen points gone. An empty fragment belongs to nobody, so it is fair
       game. */
    const current = parseHash(window.location.hash).tab;
    if (current !== "" && !tabs.some((item) => item.id === current)) return;

    /* replaceState rather than assigning the hash: assigning it makes the
       browser hunt for an element with that id and scroll to it, and it pushes
       a history entry per click, so Back would walk the tabs instead of leaving
       the page. */
    window.history.replaceState(null, "", `#${tab.id}`);
  };

  return (
    <div>
      <HashReader onRead={onRead} />

      <div className="mb-9 flex flex-wrap items-end gap-x-8 gap-y-3 border-b border-brand-accent/20">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => go(index)}
            aria-current={active === index}
            className={`-mb-px cursor-pointer border-b-2 pb-3 text-left transition-colors ${
              active === index
                ? "border-brand-accent"
                : "border-transparent hover:border-brand-accent/40"
            }`}
          >
            <span
              className={`font-display block text-[0.95rem] tracking-heading uppercase ${
                active === index ? "text-brand-accent" : "text-text-muted"
              }`}
            >
              {tab.label}
            </span>
            {tab.hint !== undefined ? (
              <span className="mt-0.5 block text-[11px] text-text-muted">{tab.hint}</span>
            ) : null}
          </button>
        ))}
      </div>

      <HashSeedProvider value={seed}>{tabs[active]?.content}</HashSeedProvider>
    </div>
  );
}
