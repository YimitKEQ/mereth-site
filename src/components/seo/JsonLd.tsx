import { OG_IMAGE, SITE_ORIGIN } from "@/lib/asset";
import { canonicalFor } from "@/lib/seo";
import { DISCORD_INVITE, PATREON_URL, site } from "@/lib/site";

/**
 * Structured data.
 *
 * The site carried none, on any of its forty pages, which means no rich result
 * is possible and an AI answer engine has to infer from prose what a single
 * object could have told it: that this is a Skyrim roleplay server, what it is
 * called, where to join, and which page answers which question.
 *
 * Everything below is generated from data already on the page. Schema that
 * asserts something the page does not show is the one kind that actively hurts:
 * Google treats a mismatch as spam rather than as a mistake.
 */

/**
 * Serialise safely.
 *
 * `</script>` inside a JSON string closes the block early and everything after
 * it is parsed as markup. The content here is all ours and none of it contains
 * that today, but this is a one-line habit and the failure is an injection
 * rather than a typo.
 */
function serialise(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function Script({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: serialise(data) }}
    />
  );
}

/**
 * Who the site is, and what it is about, once per page.
 *
 * `Organization` and `WebSite` are the two entities every other piece of markup
 * refers back to by `@id`, so they are emitted from the layout rather than per
 * page. The `VideoGame` node is the honest description of the subject: this is
 * a server for a game, not a company selling something.
 */
export function SiteJsonLd() {
  const organisation = {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: `${site.name} Roleplay`,
    url: `${SITE_ORIGIN}/`,
    logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/brand/icon.png` },
    description: site.description,
    sameAs: [DISCORD_INVITE, PATREON_URL],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    url: `${SITE_ORIGIN}/`,
    name: `${site.name} Roleplay`,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
  };

  const server = {
    "@type": "VideoGame",
    "@id": `${SITE_ORIGIN}/#server`,
    name: `${site.name} Roleplay`,
    url: `${SITE_ORIGIN}/`,
    description: site.description,
    image: OG_IMAGE.url,
    /* The mod list, the skill system and the economy are this server's, but the
       game underneath is Bethesda's and saying otherwise would be a false
       claim in markup. */
    gamePlatform: "PC",
    playMode: "MultiPlayer",
    applicationCategory: "Game",
    genre: ["Roleplaying", "Multiplayer", "Survival"],
    isBasedOn: {
      "@type": "VideoGame",
      name: "The Elder Scrolls V: Skyrim Special Edition",
      publisher: { "@type": "Organization", name: "Bethesda Softworks" },
    },
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
  };

  return <Script data={{ "@context": "https://schema.org", "@graph": [organisation, website, server] }} />;
}

export interface Crumb {
  name: string;
  path: string;
}

/**
 * The trail to this page.
 *
 * Google renders these in place of the raw URL in a result, which on a site
 * with a `/lore/harbinger-reflections` shaped path is the difference between a
 * result that reads as a document on a shelf and one that reads as a slug.
 */
export function BreadcrumbJsonLd({ trail }: { trail: readonly Crumb[] }) {
  if (trail.length === 0) return null;
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: canonicalFor(crumb.path),
        })),
      }}
    />
  );
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * Questions and answers, as themselves.
 *
 * Only for pages that genuinely are a list of questions with answers visible on
 * the page. Both pages using this render every answer in the HTML, which is the
 * condition Google actually enforces.
 */
export function FaqJsonLd({ entries, path }: { entries: readonly FaqEntry[]; path: string }) {
  if (entries.length === 0) return null;
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${canonicalFor(path)}#faq`,
        mainEntity: entries.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: { "@type": "Answer", text: entry.answer },
        })),
      }}
    />
  );
}

/**
 * A lore document.
 *
 * `Article` rather than `CreativeWork`, and the author is the server rather
 * than the in-world signature at the bottom: these are written for Mereth, and
 * attributing them to a fictional custodian of the Skyforge would be markup
 * that contradicts the page it describes.
 */
export function ArticleJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${canonicalFor(path)}#article`,
        headline: title,
        description,
        image: OG_IMAGE.url,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
        author: { "@id": `${SITE_ORIGIN}/#organization` },
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      }}
    />
  );
}
