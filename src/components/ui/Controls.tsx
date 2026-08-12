"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { OrnateBox } from "@/components/ornament/OrnateBox";
import { Check, Search, X } from "@/components/ui/icons";

/* -------------------------------------------------------------------------- */
/* Checkbox                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A real `input[type=checkbox]`, visually hidden and styled through a sibling.
 * Keeping the native control means keyboard, form submission and screen reader
 * semantics all work without being reimplemented.
 */
export function Checkbox({
  label,
  checked,
  onChange,
  className = "",
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-3 select-none peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-brand-accent"
      >
        <span
          aria-hidden="true"
          className={`flex h-5 w-5 items-center justify-center border-2 transition-colors duration-[var(--duration-fast)] ${
            checked
              ? "border-brand-accent bg-brand-accent text-brand-dark"
              : "border-brand-accent/60 bg-black/40 text-transparent"
          }`}
        >
          <Check className="text-[12px]" />
        </span>
        <span className="text-sm text-text-muted">{label}</span>
      </label>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Tabs                                                                        */
/* -------------------------------------------------------------------------- */

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

/** Segmented control, following the ARIA tab pattern including arrow keys. */
export function Tabs({
  tabs,
  active,
  onChange,
  className = "",
}: {
  tabs: readonly TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const move = (direction: 1 | -1): void => {
    const index = tabs.findIndex((tab) => tab.id === active);
    const next = tabs[(index + direction + tabs.length) % tabs.length];
    if (next) onChange(next.id);
  };

  return (
    <div role="tablist" className={`flex items-center gap-2 ${className}`}>
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
              if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
            }}
            className={`font-display flex items-center gap-2 rounded-sm px-4 py-2 text-xs tracking-widest transition-colors duration-[var(--duration-fast)] ${
              selected
                ? "bg-brand-accent text-brand-dark"
                : "bg-black/45 text-text-muted hover:text-brand-accent"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Badge                                                                       */
/* -------------------------------------------------------------------------- */

type BadgeTone = "neutral" | "accent" | "success" | "muted";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "bg-[#1f4d8a] text-white",
  accent: "bg-brand-accent text-brand-dark",
  success: "bg-[#2f6b33] text-white",
  muted: "bg-white/12 text-text-muted",
};

export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] leading-5 font-medium ${BADGE_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Search field                                                                */
/* -------------------------------------------------------------------------- */

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  label,
  className = "",
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <OrnateBox size="sm" className="w-full">
        <div className="flex h-11 items-center gap-3 px-4">
          <Search className="shrink-0 text-brand-accent" />
          <input
            id={id}
            type="search"
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-placeholder"
          />
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="shrink-0 text-text-muted transition-colors hover:text-brand-accent"
            >
              <X />
            </button>
          ) : null}
        </div>
      </OrnateBox>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Modal                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Confirmation dialog.
 *
 * Focus moves in on open and returns to the trigger on close, Escape dismisses,
 * and the backdrop is inert to scroll. Without those a dialog is a div that
 * looks like a dialog.
 */
export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      // Keep Tab inside the dialog while it is open.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      returnTo.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 backdrop-blur-[var(--blur-modal)]"
        style={{ zIndex: "var(--z-modal-backdrop)", background: "#000000b3" }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: "var(--z-modal)" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div ref={panelRef} tabIndex={-1} className="w-full max-w-lg outline-none">
          <OrnateBox size="md" fill="var(--color-bg-overlay)" contentClassName="p-8">
            <h2 id={titleId} className="font-display text-xl tracking-heading text-brand-accent">
              {title}
            </h2>
            <div className="mt-4 text-sm leading-relaxed text-text-muted">{children}</div>
            {footer ? <div className="mt-8 flex justify-end gap-3">{footer}</div> : null}
          </OrnateBox>
        </div>
      </div>
    </>
  );
}
