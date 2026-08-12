import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeading } from "@/components/layout/PageHeading";
import { OrnateBox } from "@/components/ornament/OrnateBox";
import { OrnateFrame } from "@/components/ornament/OrnateFrame";
import { articlesInCategory, wikiArticles, wikiBySlug, wikiCategories } from "@/lib/wiki";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return wikiArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = wikiBySlug(slug);
  return {
    title: article?.title ?? "Wiki",
    description: article?.summary,
  };
}

export default async function WikiArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = wikiBySlug(slug);
  if (article === undefined) notFound();

  const category = wikiCategories.find((c) => c.id === article.category);
  const siblings = articlesInCategory(article.category);

  return (
    <div className="mx-auto max-w-site px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <nav aria-label="Breadcrumb" className="mb-6 flex justify-center">
        <ol className="flex flex-wrap items-center gap-2 text-xs tracking-widest text-text-muted uppercase">
          <li><Link href="/wiki" className="hover:text-brand-accent">Wiki</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-accent">{category?.label}</li>
        </ol>
      </nav>

      <PageHeading title={article.title} subtitle={article.summary} />
      <p className="mt-3 text-center text-xs text-text-muted">
        {article.readMinutes} min read · updated {article.updated}
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <OrnateFrame weight="heavy" contentClassName="px-6 py-10 md:px-12">
          <div className="flex flex-col gap-10">
            {article.sections.map((section, index) => (
              <section key={index}>
                {section.heading ? (
                  <h2 className="font-display text-sm tracking-heading text-brand-accent md:text-base">
                    {section.heading}
                  </h2>
                ) : null}

                {section.paragraphs ? (
                  <div className="mt-4 flex flex-col gap-4">
                    {section.paragraphs.map((text, i) => (
                      <p key={i} className="text-sm leading-relaxed text-text-primary md:text-base">{text}</p>
                    ))}
                  </div>
                ) : null}

                {section.bullets ? (
                  <ul className="mt-4 flex flex-col gap-3">
                    {section.bullets.map((text, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-text-primary md:text-base">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-brand-accent" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {section.table ? (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[420px] border-collapse text-left text-sm">
                      <thead>
                        <tr>
                          {section.table.columns.map((column) => (
                            <th
                              key={column}
                              scope="col"
                              className="font-display border-b border-brand-accent/40 px-3 py-2 text-xs tracking-widest text-brand-accent"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, i) => (
                          <tr key={i} className="border-b border-white/8">
                            {row.map((cell, j) => (
                              <td key={j} className="px-3 py-2.5 text-text-primary tabular-nums">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </OrnateFrame>

        <aside className="lg:sticky lg:top-[132px] lg:self-start">
          <OrnateBox size="sm" contentClassName="p-6">
            <h2 className="font-display text-xs tracking-heading text-brand-accent">
              More in {category?.label}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {siblings.map((sibling) => (
                <li key={sibling.slug}>
                  <Link
                    href={`/wiki/${sibling.slug}`}
                    aria-current={sibling.slug === article.slug ? "page" : undefined}
                    className={`text-sm transition-colors hover:text-brand-accent ${
                      sibling.slug === article.slug ? "text-brand-accent" : "text-text-muted"
                    }`}
                  >
                    {sibling.title}
                  </Link>
                </li>
              ))}
            </ul>
          </OrnateBox>
        </aside>
      </div>
    </div>
  );
}
