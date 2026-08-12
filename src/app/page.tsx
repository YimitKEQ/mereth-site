import { CommunityCta } from "@/components/home/CommunityCta";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { Hero } from "@/components/home/Hero";
import { NewsCard } from "@/components/home/NewsCard";
import { PageHeading } from "@/components/layout/PageHeading";
import { Accordion } from "@/components/ui/Accordion";
import { faq, news } from "@/lib/content";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-site px-6 pt-4 md:px-8">
        <PageHeading
          as="h2"
          size="section"
          title="Project Information"
          subtitle={`Learn more about the ${site.name} project`}
        />
        <div className="mt-12">
          <FeatureGrid />
        </div>
      </section>

      <section className="mx-auto max-w-site px-6 pt-28 md:px-8">
        <PageHeading
          as="h2"
          size="section"
          title={`Latest updates from ${site.name}`}
          subtitle="Announcements, events, server highlights - stay up to date with the latest of the project"
        />
        <div className="mt-12 flex flex-wrap justify-center gap-8 md:justify-start">
          {news.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-site px-6 pt-28 md:px-8">
        <PageHeading
          as="h2"
          size="section"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before you begin, clear, simple, and updated."
        />
        <div className="mt-12">
          {/* The home page shows a trimmed list; the full set lives on /faq. */}
          <Accordion items={faq.slice(0, 5)} openByDefault={0} />
        </div>
      </section>

      <CommunityCta />
    </>
  );
}
