"use client";

import { useEffect, useState } from "react";

import { Calm, Ornate } from "@/components/ui/icons";
import { CALM_KEY } from "@/lib/calm";

/**
 * Quiet mode.
 *
 * The site is decorated: a moving plate behind every page, carved corners on
 * every panel, gold on dark, hairline rules. That is the register Mereth asked
 * for and most readers enjoy it. For some readers it is noise sitting on top of
 * the thing they came to read, and no amount of "it looks good" makes a page
 * they cannot get through worth having.
 *
 * So it is a switch rather than a compromise. Quiet mode stops the background
 * moving, replaces the photograph with a flat surface, hides the decorative
 * corners and rune bands, raises body contrast and opens the line spacing. It
 * changes nothing about what the pages say.
 *
 * The choice is remembered, and it starts on for anybody whose system already
 * asks for reduced motion, because that request means the same thing.
 */

export function CalmToggle() {
  const [quiet, setQuiet] = useState<boolean | null>(null);

  // Read what the boot script already decided, rather than deciding again.
  useEffect(() => {
    setQuiet(document.documentElement.getAttribute("data-calm") === "on");
  }, []);

  const toggle = (): void => {
    const next = !(quiet ?? false);
    setQuiet(next);
    document.documentElement.setAttribute("data-calm", next ? "on" : "off");
    try {
      localStorage.setItem(CALM_KEY, next ? "on" : "off");
    } catch {
      // A blocked storage API costs the reader their preference on the next
      // page, not this one. Nothing here is worth failing over.
    }
  };

  const on = quiet ?? false;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title={on ? "Quiet mode is on. Restore the decoration." : "Quiet mode: less movement and decoration."}
      className="navbar-icon-button"
    >
      {on ? <Ornate /> : <Calm />}
      <span className="sr-only">{on ? "Turn quiet mode off" : "Turn quiet mode on"}</span>
    </button>
  );
}
