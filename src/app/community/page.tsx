import type { Metadata } from "next";

import { SimplePage } from "@/components/layout/SimplePage";
import { simplePage } from "@/lib/pages";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/community",
  title: simplePage("community")?.title ?? "Community",
  description:
    "How Mereth runs on Discord: release notes, tickets, whitelist postings, faction recruitment, and the out-of-character side of a serious roleplay server.",
});

export default function Page() {
  return <SimplePage slug="community" />;
}
