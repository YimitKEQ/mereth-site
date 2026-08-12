import type { Metadata } from "next";

import { PageHeading } from "@/components/layout/PageHeading";
import { WikiBrowser } from "@/components/wiki/WikiBrowser";

export const metadata: Metadata = { title: "Wiki" };

export default function WikiIndexPage() {
  return (
    <div className="mx-auto max-w-site px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <PageHeading
        title="Wiki"
        subtitle="Everything a new player needs, and the detail an old one comes back for."
      />
      <div className="mt-12">
        <WikiBrowser />
      </div>
    </div>
  );
}
