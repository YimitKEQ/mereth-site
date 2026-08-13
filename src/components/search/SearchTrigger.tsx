"use client";

import { useEffect, useState } from "react";

import { SearchPalette } from "@/components/search/SearchPalette";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { NAV_BUTTON_SIZE } from "@/components/ui/Button";
import { Search } from "@/components/ui/icons";

/**
 * The navbar's search control, and the global shortcut that opens it.
 *
 * The shortcut is registered here rather than in the layout so the key handler
 * and the button that does the same thing live in one file. Both Ctrl-K and
 * Cmd-K are accepted, and `/` on its own when focus is not already in a field,
 * which is the convention a reader coming from a wiki will try first.
 */
export function SearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search Mereth"
        className={`ornate-glow relative flex cursor-pointer items-center gap-2.5 border-[2px] border-brand-accent/70 bg-black/40 text-brand-accent transition-colors hover:text-[var(--color-brand-glow)] ${NAV_BUTTON_SIZE}`}
      >
        <FrameCorners size={14} />
        <Search className="relative text-base" />
        {/* No size or tracking of its own: it inherits them from the shared
            navbar metrics, so the word sits at the same weight as "Discord"
            beside it. */}
        <span className="font-display relative hidden uppercase 2xl:inline">Search</span>
        <kbd className="relative hidden rounded-sm border border-brand-accent/30 px-1.5 py-0.5 font-mono text-[10px] text-text-muted 2xl:inline">
          Ctrl K
        </kbd>
      </button>

      <SearchPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}
