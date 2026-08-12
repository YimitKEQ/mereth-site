import type { Metadata } from "next";

import { NewsCard } from "@/components/home/NewsCard";
import { PageHeading } from "@/components/layout/PageHeading";
import { news } from "@/lib/content";

export const metadata: Metadata = { title: "News" };

export default function NewsIndexPage() {
  return (
    <div className="mx-auto max-w-site px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <PageHeading
        title="News"
        subtitle="Announcements, events, server highlights - stay up to date with the latest of the project"
      />
      <div className="mt-12 flex flex-wrap gap-8">
        {news.map((article) => (
          <NewsCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
