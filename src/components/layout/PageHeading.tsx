import type { ReactNode } from "react";

/**
 * The centred gold title with a muted line under it.
 *
 * Used identically at the top of a subpage and above each home section, so it
 * is one component with a scale switch rather than two near-copies.
 */
export function PageHeading({
  title,
  subtitle,
  note,
  as: Tag = "h1",
  size = "page",
  className = "",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  note?: ReactNode;
  as?: "h1" | "h2";
  size?: "page" | "section";
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <Tag
        className={`font-display text-brand-accent text-shadow-page-heading ${
          size === "page"
            ? "text-3xl tracking-title md:text-[var(--text-page-title)]"
            : "text-2xl tracking-heading md:text-[var(--text-section-heading)]"
        }`}
      >
        {title}
      </Tag>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-sm text-text-muted text-shadow-subtle md:text-base">
          {subtitle}
        </p>
      ) : null}
      {note ? (
        <p className="mt-2 max-w-2xl text-sm text-text-muted text-shadow-subtle md:text-base">
          {note}
        </p>
      ) : null}
    </div>
  );
}
