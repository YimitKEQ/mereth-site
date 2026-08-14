import type { Metadata } from "next";

import { SimplePage } from "@/components/layout/SimplePage";
import { simplePage } from "@/lib/pages";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/terms",
  title: simplePage("terms")?.title ?? "Terms",
  description:
    "A readable version of the Mereth RP Terms of Service: who can play, what the agreement covers, and the independence from Bethesda, Valve and Discord.",
});

export default function Page() {
  return <SimplePage slug="terms" />;
}
