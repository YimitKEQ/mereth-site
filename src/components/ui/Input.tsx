"use client";

import { useId } from "react";

import { OrnateBox } from "@/components/ornament/OrnateBox";

/**
 * The framed text field.
 *
 * The reference's fields are unusually tall (80px, dropping to 48px on mobile)
 * and set their value in uppercase at 1.375rem with 1.44px tracking, which is
 * why a normal-height input looks wrong in this design. A `--no-uppercase`
 * modifier exists there for values where casing is meaningful, so email and
 * password opt out here.
 *
 * The label is visually hidden rather than absent: the placeholder carries the
 * design, but a placeholder is not a label and disappears the moment you type.
 */
export function Input({
  label,
  error,
  preserveCase = false,
  className = "",
  id,
  ...rest
}: {
  label: string;
  error?: string;
  /** Keep the typed value as entered. On for email, password and anything cased. */
  preserveCase?: boolean;
  className?: string;
} & Omit<React.ComponentProps<"input">, "className">) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const invalid = typeof error === "string" && error.length > 0;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <OrnateBox
        size="sm"
        className={`w-full transition-[filter] duration-[var(--duration-fast)] focus-within:brightness-125 ${
          invalid ? "text-error" : "text-brand-accent"
        }`}
      >
        <input
          id={inputId}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : undefined}
          className={[
            "h-[var(--size-input-height-mobile)] md:h-[var(--size-input-height)]",
            "w-full bg-transparent px-6 outline-none",
            "text-[var(--text-input)] tracking-input text-text-primary",
            "placeholder:text-text-placeholder",
            preserveCase ? "" : "uppercase placeholder:normal-case",
            "disabled:cursor-not-allowed disabled:opacity-50",
          ].join(" ")}
          {...rest}
        />
      </OrnateBox>
      {invalid ? (
        <p id={errorId} role="alert" className="mt-2 px-1 text-[var(--text-error)] text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
