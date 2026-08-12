import type { Metadata } from "next";

import { PageHeading } from "@/components/layout/PageHeading";
import { Accordion } from "@/components/ui/Accordion";
import { faq } from "@/lib/content";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-site px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <PageHeading
        title="Frequently Asked Questions"
        subtitle="Everything you need to know before you begin, clear, simple, and updated."
      />
      <div className="mt-12">
        {/* The reference lands with the first four already open. */}
        <Accordion items={faq} openByDefault={4} />
      </div>
    </div>
  );
}
