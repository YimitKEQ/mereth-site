import { Fragment, type ReactNode } from "react";
import Link from "next/link";

/**
 * A four token inline markup for handbook prose.
 *
 *   **emphasis**      a claim the reader must not miss
 *   `code`            a key, a command, a literal the game shows
 *   [label](/href)    a link, internal through next/link, external as an anchor
 *
 * Handbook copy is long, and writing it as JSX buries the sentence inside tags.
 * Writing it as HTML strings would mean dangerouslySetInnerHTML on every
 * paragraph, which is a habit worth not forming even for our own content. This
 * parses a fixed grammar into elements instead, so nothing can inject markup:
 * anything the grammar does not recognise stays text.
 */

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

export function inline(text: string): ReactNode {
  const parts = text.split(TOKEN).filter((part) => part !== "");

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-sm border border-brand-accent/25 bg-brand-accent/10 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-glow"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link !== null) {
      const [, label, href] = link as unknown as [string, string, string];
      const external = href.startsWith("http");
      const className =
        "text-brand-glow underline decoration-brand-accent/40 underline-offset-4 transition-colors hover:decoration-brand-glow";

      if (external) {
        return (
          <a key={i} href={href} className={className} target="_blank" rel="noreferrer">
            {label}
          </a>
        );
      }
      return (
        <Link key={i} href={href} className={className}>
          {label}
        </Link>
      );
    }

    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** A block of paragraphs, each parsed through `inline`. */
export function Prose({ paragraphs, className = "" }: { paragraphs: string[]; className?: string }) {
  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={className}>
          {inline(paragraph)}
        </p>
      ))}
    </>
  );
}
