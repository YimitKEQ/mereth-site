"use client";

import { useEffect, useState } from "react";

/**
 * The sticky table of contents beside a long page.
 *
 * Scroll position is tracked with IntersectionObserver rather than a scroll
 * listener, so it costs nothing per frame. The rule that decides the active
 * entry is "the last heading that has crossed the top quarter of the viewport",
 * which is what a reader means by where they are: a heading half a screen below
 * you is not where you are, even though it is on screen.
 */
export function Contents({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (headings.length === 0) return;

    const seen = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.isIntersecting);

        // Walk backwards for the last heading whose top has passed the line.
        for (let i = headings.length - 1; i >= 0; i--) {
          const heading = headings[i];
          if (heading === undefined) continue;
          if (heading.getBoundingClientRect().top <= window.innerHeight * 0.25) {
            setActive(heading.id);
            return;
          }
        }
        setActive(headings[0]?.id ?? "");
      },
      { rootMargin: "-25% 0px -70% 0px", threshold: 0 },
    );

    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="hidden lg:block">
      <div className="sticky top-[140px]">
        <p className="font-display mb-4 text-[11px] tracking-[2px] text-text-muted uppercase">
          On this page
        </p>
        <ul className="space-y-0.5 border-l border-brand-accent/20">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`-ml-px block border-l-2 py-1.5 pl-4 text-[0.85rem] leading-snug transition-colors ${
                  active === item.id
                    ? "border-brand-accent text-brand-accent"
                    : "border-transparent text-text-muted hover:border-brand-accent/40 hover:text-text-light"
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
