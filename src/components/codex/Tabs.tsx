"use client";

import { useState, type ReactNode } from "react";

/**
 * Two or three views of the same dataset, switched in place.
 *
 * Deliberately not routes. The planner and the skill list are the same subject
 * seen two ways, and giving each its own URL would put a page load between two
 * things a reader flips between constantly. The one thing that does deserve a
 * URL, a saved plan, gets the hash instead.
 */
export function Tabs({
  tabs,
  initial = 0,
}: {
  tabs: { id: string; label: string; hint?: string; content: ReactNode }[];
  initial?: number;
}) {
  const [active, setActive] = useState(initial);

  return (
    <div>
      <div className="mb-9 flex flex-wrap items-end gap-x-8 gap-y-3 border-b border-brand-accent/20">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(index)}
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

      {tabs[active]?.content}
    </div>
  );
}
