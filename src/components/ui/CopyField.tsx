"use client";

import { useState } from "react";

import { FrameCorners } from "@/components/ornament/OrnateFrame";

/**
 * A read-only value with a copy button welded to its left edge.
 *
 * Used for the realmlist and config lines. The button reports success in place
 * rather than through a toast, because it is the only feedback the reference
 * gives and a toast would be inventing behaviour.
 */
export function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard is blocked without a secure context or permission. Saying
      // nothing would look broken, so the label reports the failure instead.
      setCopied(false);
    }
  }

  return (
    <div className="relative mx-auto flex h-12 w-full max-w-lg items-stretch border border-brand-accent/70 bg-black/70 text-brand-accent">
      <FrameCorners size={14} />
      <button
        type="button"
        onClick={copy}
        className="font-display relative border-r border-brand-accent/70 px-5 text-xs tracking-widest text-brand-accent transition-colors duration-[var(--duration-fast)] hover:bg-brand-accent hover:text-brand-dark"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <span className="font-display relative flex flex-1 items-center justify-center text-xs tracking-widest text-white">
        {value}
      </span>
    </div>
  );
}
