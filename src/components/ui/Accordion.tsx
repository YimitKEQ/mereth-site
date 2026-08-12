"use client";

import { useState } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ChevronDown, ChevronUp } from "@/components/ui/icons";
import type { FaqItem } from "@/lib/content";

/**
 * The FAQ row.
 *
 * Header and answer are two separate framed blocks stacked with a hairline gap,
 * not one box that grows, which is why an open row reads as a header sitting on
 * top of a panel. Rows open independently in the reference, so several can be
 * open at once.
 */
function Row({ item, defaultOpen }: { item: FaqItem; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="relative flex w-full items-center justify-between gap-4 border border-brand-accent/70 bg-black/45 px-6 py-4 text-left text-brand-accent transition-colors duration-[var(--duration-fast)] hover:bg-black/60"
        >
          <FrameCorners weight="thin" />
          <span className="font-display relative text-sm tracking-heading text-brand-accent text-shadow-drop md:text-base">
            {item.question}
          </span>
          <span className="relative text-brand-accent">
            {open ? <ChevronUp /> : <ChevronDown />}
          </span>
        </button>
      </h3>

      {open ? (
        <div className="relative mt-px border border-brand-accent/70 bg-black/45 px-6 py-5 text-brand-accent">
          <FrameCorners weight="thin" />
          <p className="relative text-sm leading-relaxed text-text-primary md:text-base">
            {item.answer}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function Accordion({
  items,
  openByDefault = 0,
}: {
  items: readonly FaqItem[];
  /** How many leading rows start open, matching the reference's landing state. */
  openByDefault?: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <Row key={item.question} item={item} defaultOpen={index < openByDefault} />
      ))}
    </div>
  );
}
