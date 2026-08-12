import { notFound } from "next/navigation";

import { ReadingScrim } from "@/components/layout/ReadingScrim";
import { OrnateDivider } from "@/components/ornament/Divider";
import { ButtonLink } from "@/components/ui/Button";
import { simplePage } from "@/lib/pages";

/**
 * Renders one entry from the prose page map.
 *
 * Same masthead, measure and scrim as the handbook, so the short pages read as
 * part of the same document rather than as a boxed panel from a template.
 */
export function SimplePage({ slug, eyebrow = "The Realm" }: { slug: string; eyebrow?: string }) {
  const content = simplePage(slug);
  if (content === null) notFound();

  return (
    <div className="mx-auto max-w-[70rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <ReadingScrim />

      <header className="max-w-3xl">
        <p className="font-display text-[11px] tracking-[3px] text-brand-accent/70 uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-title text-text-primary text-shadow-page-heading md:text-[var(--text-page-title)]">
          {content.title}
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.8] text-text-muted">{content.subtitle}</p>
      </header>

      <OrnateDivider className="my-12" />

      <div className="flex max-w-[68ch] flex-col gap-11">
        {content.sections.map((section, index) => (
          <section key={index}>
            {section.heading !== undefined ? (
              <h2 className="font-display mb-4 text-xl tracking-heading text-brand-accent uppercase">
                {section.heading}
              </h2>
            ) : null}

            {section.paragraphs !== undefined ? (
              <div className="flex flex-col gap-4">
                {section.paragraphs.map((text, i) => (
                  <p key={i} className="text-[1.02rem] leading-[1.85] text-text-light">
                    {text}
                  </p>
                ))}
              </div>
            ) : null}

            {section.bullets !== undefined ? (
              <ul className={`flex flex-col gap-3 ${section.paragraphs === undefined ? "" : "mt-4"}`}>
                {section.bullets.map((text, i) => (
                  <li
                    key={i}
                    className="relative pl-5 text-[0.98rem] leading-[1.8] text-text-light before:absolute before:top-[0.75em] before:left-0 before:h-1 before:w-1 before:bg-brand-accent"
                  >
                    {text}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      {content.cta !== undefined ? (
        <div className="mt-12">
          <ButtonLink href={content.cta.href} variant="solid" size="md">
            {content.cta.label}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
