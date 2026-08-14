import type { Metadata } from "next";

import { SimplePage } from "@/components/layout/SimplePage";
import { simplePage } from "@/lib/pages";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/privacy",
  title: simplePage("privacy")?.title ?? "Privacy",
  description:
    "A readable version of the Mereth RP Privacy Policy: what the launcher, servers and Discord collect, why, for how long, and how to ask for it back.",
});

export default function Page() {
  return <SimplePage slug="privacy" />;
}
