import Link from "next/link";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ArtPlaceholder } from "@/components/ui/ArtPlaceholder";
import type { NewsArticle } from "@/lib/content";

/**
 * Article teaser: the art fills the tile and the text sits on top of it, lifted
 * off the image by the news overlay gradient rather than by a solid panel.
 */
export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group relative block aspect-[7/6] w-full max-w-[700px] text-brand-accent"
    >
      <FrameCorners weight="thin" />
      <div className="absolute inset-0 border border-brand-accent/70">
        <ArtPlaceholder seed={article.slug} label={article.title} className="h-full w-full" />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-news-overlay)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
          <p className="text-[11px] text-text-muted">{article.publishedAt}</p>
          <h3 className="font-display text-lg leading-tight tracking-heading text-brand-accent text-shadow-drop transition-colors group-hover:text-white">
            {article.title}
          </h3>
          <p className="text-xs leading-relaxed text-text-muted">{article.excerpt}</p>
        </div>
      </div>
    </Link>
  );
}
