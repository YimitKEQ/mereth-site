import type { Metadata } from "next";

import { PageHeading } from "@/components/layout/PageHeading";
import { Accordion } from "@/components/ui/Accordion";
import { faq } from "@/lib/content";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-site px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <PageHeading
        title="Questions"
        subtitle="What people ask before they apply, answered plainly."
      />
      <div className="mt-12">
        {/* Everything starts closed: an accordion that lands open is a list. */}
        <Accordion items={faq} />
      </div>
    </div>
  );
}
