import { notFound } from "next/navigation";

import { PageHeading } from "@/components/layout/PageHeading";
import { OrnateFrame } from "@/components/ornament/OrnateFrame";
import { ButtonLink } from "@/components/ui/Button";
import { simplePage } from "@/lib/pages";

/** Renders one entry from the prose page map. */
export function SimplePage({ slug }: { slug: string }) {
  const content = simplePage(slug);
  if (content === undefined) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <PageHeading title={content.title} subtitle={content.subtitle} />

      <OrnateFrame weight="heavy" className="mt-12" contentClassName="px-6 py-10 md:px-12">
        <div className="flex flex-col gap-10">
          {content.sections.map((section, index) => (
            <section key={index}>
              {section.heading ? (
                <h2 className="font-display text-sm tracking-heading text-brand-accent md:text-base">
                  {section.heading}
                </h2>
              ) : null}
              {section.paragraphs ? (
                <div className="mt-4 flex flex-col gap-4">
                  {section.paragraphs.map((text, i) => (
                    <p key={i} className="text-sm leading-relaxed text-text-primary md:text-base">
                      {text}
                    </p>
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
            </section>
          ))}
        </div>

        {content.cta ? (
          <div className="mt-10 flex justify-center">
            <ButtonLink href={content.cta.href} variant="solid" size="md">
              {content.cta.label}
            </ButtonLink>
          </div>
        ) : null}
      </OrnateFrame>
    </div>
  );
}
