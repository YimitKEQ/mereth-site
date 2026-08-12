"use client";

import { createContext, useContext } from "react";

/**
 * What the URL asked for, as the reader arrived with it.
 *
 * The browsers inside a tab panel cannot read `window.location.hash` for
 * themselves, and the reason is specific rather than defensive. On the skills
 * page the planner owns the same fragment and its mount effect clears any hash
 * that is not a saved plan. Effects run child first, so anything inside a tab
 * that looked at the address bar for itself was always looking after the wipe.
 *
 * So `Tabs` reads the fragment once, from a childless component rendered ahead
 * of the panel so that its effect runs first, and hands the parameters down
 * here. One reader, one writer, and a panel that sees the link it was opened
 * with rather than whatever a sibling last left behind.
 */
const HashSeed = createContext<ReadonlyMap<string, string>>(new Map());

export const HashSeedProvider = HashSeed.Provider;

/**
 * The `key=value` pairs carried in the fragment.
 *
 * Empty on the first render, including the server's, and filled in the commit
 * that opens the tab. Read it from an effect rather than from a `useState`
 * initialiser: a panel that was already on screen when the page hydrated has
 * long since taken its initial state by the time this arrives.
 */
export function useHashSeed(): ReadonlyMap<string, string> {
  return useContext(HashSeed);
}
