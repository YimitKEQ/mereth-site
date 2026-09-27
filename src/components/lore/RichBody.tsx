import Link from "next/link";
import type { ReactNode } from "react";

import { cleanRichText, type RichNode } from "@/lib/world/richtext";

/**
 * A lore document's rich body, drawn node by node.
 *
 * No `dangerouslySetInnerHTML` anywhere, and that is the reason the office
 * stores structured blocks rather than HTML: every node here is matched against
 * a type this file knows and rendered with the site's own component and the
 * site's own type scale. A node nobody wrote a case for is dropped rather than
 * printed, so the failure when the office adds something new is a missing
 * paragraph, not an injection.
 *
 * It is cleaned again on the way in. The console already cleans on the way out,
 * but a consumer of a public endpoint should never assume the producer was
 * careful, and this one runs in every reader's browser.
 */

function Marked({ node }: { node: RichNode }): ReactNode {
  let content: ReactNode = node.text ?? "";

  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") content = <strong className="font-semibold text-text-bright">{content}</strong>;
    if (mark.type === "italic") content = <em>{content}</em>;
    if (mark.type === "link") {
      const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "#";
      const internal = href.startsWith("/");
      content = internal ? (
        <Link href={href} className="text-brand-accent underline underline-offset-2 hover:text-text-bright">
          {content}
        </Link>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-accent underline underline-offset-2 hover:text-text-bright"
        >
          {content}
        </a>
      );
    }
  }

  return content;
}

function Children({ nodes }: { nodes: RichNode[] | undefined }): ReactNode {
  return (nodes ?? []).map((child, index) => <Node key={index} node={child} />);
}

function Node({ node }: { node: RichNode }): ReactNode {
  switch (node.type) {
    case "text":
      return <Marked node={node} />;

    case "hardBreak":
      return <br />;

    case "paragraph":
      /* An empty paragraph is a writer's spacing, and the document already has
         rhythm from its margins. Rendering it would open a hole in the column. */
      if ((node.content ?? []).length === 0) return null;
      return (
        <p className="mt-[1.15em] text-[1.0625rem] leading-[1.95] text-text-body first:mt-0">
          <Children nodes={node.content} />
        </p>
      );

    case "heading": {
      const level = node.attrs?.level === 3 ? 3 : 2;
      const Tag = level === 3 ? "h3" : "h2";
      return (
        <Tag
          className={
            level === 3
              ? "font-display mt-[2em] mb-[0.6em] text-[1.15rem] tracking-[0.02em] text-text-bright"
              : "font-display mt-[2.4em] mb-[0.7em] text-[1.45rem] tracking-[0.02em] text-brand-accent"
          }
        >
          <Children nodes={node.content} />
        </Tag>
      );
    }

    case "blockquote":
      return (
        <blockquote className="my-[1.6em] border-l-2 border-edge-soft pl-[1.3em] text-text-muted italic">
          <Children nodes={node.content} />
        </blockquote>
      );

    case "bulletList":
      return (
        <ul className="mt-[1.15em] list-disc space-y-[0.35em] pl-[1.4em] text-[1.0625rem] leading-[1.9] text-text-body marker:text-brand-accent/70">
          <Children nodes={node.content} />
        </ul>
      );

    case "orderedList":
      return (
        <ol className="mt-[1.15em] list-decimal space-y-[0.35em] pl-[1.5em] text-[1.0625rem] leading-[1.9] text-text-body marker:text-brand-accent/70">
          <Children nodes={node.content} />
        </ol>
      );

    case "listItem":
      return (
        <li>
          {/* A list item's paragraph must not take a paragraph's top margin, or
              every bullet sits a line below its own marker. */}
          <div className="[&>p]:mt-0 [&>p+p]:mt-[0.6em]">
            <Children nodes={node.content} />
          </div>
        </li>
      );

    case "horizontalRule":
      /* The scene break the site already draws everywhere else: a rule with a
         mark on it rather than a bare line. */
      return (
        <div className="my-[2.4em] flex items-center justify-center gap-4" aria-hidden="true">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-edge-soft" />
          <span className="size-[6px] rotate-45 border border-brand-accent/60" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-edge-soft" />
        </div>
      );

    case "image": {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : null;
      if (src === null) return null;
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      return (
        <figure className="my-[2em]">
          {/* A plain img, not next/image: these are already sized on the way in,
              this site is a static export, and the optimiser would need a server. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="w-full border border-edge-soft" loading="lazy" />
          {alt !== "" ? (
            <figcaption className="mt-2 text-center text-[0.8rem] text-text-muted">{alt}</figcaption>
          ) : null}
        </figure>
      );
    }

    default:
      return null;
  }
}

export function RichBody({ doc }: { doc: unknown }) {
  const cleaned = cleanRichText(doc);
  if (cleaned === null) return null;
  return <Children nodes={cleaned.content} />;
}
