"use client";

import { useEffect, useId, useRef, useState } from "react";

import { OrnateBox } from "@/components/ornament/OrnateBox";
import { ChevronDown } from "@/components/ui/icons";

/**
 * Listbox, not a native select.
 *
 * A native control cannot carry the ornament: the popup is drawn by the
 * operating system, so options render as a plain grey menu however the trigger
 * is styled. That mismatch is what made the earlier dropdowns read as
 * unfinished.
 *
 * Rebuilding means owning the keyboard contract that used to come free, so this
 * follows the ARIA listbox pattern properly. Up and Down move the active
 * option, Home and End jump, Enter and Space commit, Escape cancels, typing
 * jumps to a match, and focus returns to the trigger on close.
 * `aria-activedescendant` keeps DOM focus on the button, so the focus ring never
 * leaves the control while the active option is still announced.
 */
export function Select({
  label,
  options,
  value,
  onChange,
  id,
  className = "",
  disabled = false,
}: {
  label: string;
  options: readonly string[];
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  className?: string;
  disabled?: boolean;
}) {
  const autoId = useId();
  const controlId = id ?? autoId;
  const listId = `${controlId}-list`;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef<{ text: string; at: number }>({ text: "", at: 0 });

  const selectedIndex = value === undefined || value === "" ? -1 : options.indexOf(value);

  function close(): void {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function commit(index: number): void {
    const next = options[index];
    if (next === undefined) return;
    onChange?.(next);
    close();
  }

  useEffect(() => {
    if (open) setActive(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  // Keep the active option in view when moving by keyboard.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent): void => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function onKeyDown(event: React.KeyboardEvent): void {
    if (disabled) return;

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((i) => Math.min(i + 1, options.length - 1));
        return;
      case "ArrowUp":
        event.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        return;
      case "Home":
        event.preventDefault();
        setActive(0);
        return;
      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(active);
        return;
      case "Escape":
        event.preventDefault();
        close();
        return;
      case "Tab":
        setOpen(false);
        return;
      default:
        break;
    }

    // Type-ahead. Keystrokes inside a second accumulate into one search.
    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
      const now = Date.now();
      typed.current = {
        text: now - typed.current.at < 1000 ? typed.current.text + event.key : event.key,
        at: now,
      };
      const found = options.findIndex((option) =>
        option.toLowerCase().startsWith(typed.current.text.toLowerCase()),
      );
      if (found >= 0) setActive(found);
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <OrnateBox size="sm" className={disabled ? "opacity-50" : ""}>
        <button
          ref={buttonRef}
          type="button"
          id={controlId}
          disabled={disabled}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open ? `${controlId}-opt-${active}` : undefined}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onKeyDown}
          className="flex h-12 w-full items-center justify-between gap-3 px-4 text-left disabled:cursor-not-allowed"
        >
          <span
            className={`font-display truncate text-xs tracking-widest ${
              selectedIndex >= 0 ? "text-text-primary" : "text-text-placeholder"
            }`}
          >
            {selectedIndex >= 0 ? value : label}
          </span>
          <ChevronDown
            className={`shrink-0 text-[var(--color-chevron)] transition-transform duration-[var(--duration-fast)] ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </OrnateBox>

      {open ? (
        <div
          className="absolute top-[calc(100%+6px)] right-0 left-0"
          style={{ zIndex: "var(--z-dropdown)", filter: "drop-shadow(0 6px 14px #00000080)" }}
        >
          <OrnateBox size="sm" fill="var(--color-bg-overlay)">
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label={label}
              className="max-h-64 overflow-y-auto py-1"
            >
              {options.map((option, index) => (
                <li
                  key={option}
                  id={`${controlId}-opt-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={index === selectedIndex}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => commit(index)}
                  className={`cursor-pointer px-4 py-2.5 text-sm transition-colors duration-[var(--duration-fast)] ${
                    index === active ? "bg-brand-accent/15 text-brand-accent" : "text-text-primary"
                  } ${index === selectedIndex ? "font-semibold" : ""}`}
                >
                  {option}
                </li>
              ))}
            </ul>
          </OrnateBox>
        </div>
      ) : null}
    </div>
  );
}
