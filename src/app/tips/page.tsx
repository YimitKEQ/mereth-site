import type { Metadata } from "next";

import { Reader } from "@/components/handbook/Reader";
import { pageMeta } from "@/lib/seo";
import { tips } from "@/lib/handbook/tips";

export const metadata: Metadata = pageMeta({
  path: "/tips",
  title: "Tips and tricks",
  description:
    "The numbers, cooldowns and small mechanical facts that decide whether an evening on Mereth goes well.",
});

export default function TipsPage() {
  return <Reader page={tips} eyebrow="The Handbook" />;
}
