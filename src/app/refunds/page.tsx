import type { Metadata } from "next";

import { SimplePage } from "@/components/layout/SimplePage";
import { simplePage } from "@/lib/pages";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/refunds",
  title: simplePage("refunds")?.title ?? "Refunds",
  description:
    "This website sells nothing and takes no payments. Where to ask about a contribution made elsewhere, what to bring, and what support does not entitle you to.",
});

export default function Page() {
  return <SimplePage slug="refunds" />;
}
