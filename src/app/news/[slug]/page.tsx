import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FrameCorners, OrnateFrame } from "@/components/ornament/OrnateFrame";
import { ArtPlaceholder } from "@/components/ui/ArtPlaceholder";
import { articleBySlug, news } from "@/lib/content";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return news.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  return { title: article?.title ?? "News" };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (article === undefined) notFound();

  return (
    <div className="mx-auto max-w-site px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <header className="flex flex-col items-center text-center">
        <h1 className="font-display text-2xl tracking-title text-brand-accent text-shadow-page-heading md:text-[var(--text-page-title)]">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-text-muted">{article.publishedAt}</p>
      </header>

      <OrnateFrame weight="heavy" className="mt-10" contentClassName="p-5 md:p-10">
        {/* Hero image sits in its own frame inside the article panel */}
        <div className="relative text-brand-accent">
          <FrameCorners weight="thin" />
          <ArtPlaceholder
            seed={article.slug}
            label={article.title}
            className="aspect-[16/9] w-full border border-brand-accent/70"
          />
        </div>

        <div className="mt-10 flex flex-col gap-8">
          {article.sections.map((section, index) => (
            <section key={index}>
              {section.heading ? (
                <h2 className="font-display text-sm tracking-heading text-brand-accent text-shadow-drop md:text-base">
                  {section.heading}
                </h2>
              ) : null}
              <div className="mt-4 flex flex-col gap-4">
                {section.paragraphs.map((paragraph, position) => (
                  <p
                    key={position}
                    className="text-sm leading-relaxed text-text-primary md:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </OrnateFrame>
    </div>
  );
}
