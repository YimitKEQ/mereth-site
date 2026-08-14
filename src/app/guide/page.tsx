import type { Metadata } from "next";

import { Reader } from "@/components/handbook/Reader";
import { pageMeta } from "@/lib/seo";
import { guide } from "@/lib/handbook/guide";

export const metadata: Metadata = pageMeta({
  path: "/guide",
  title: "The Guide",
  description:
    "How Mereth works, from installing it to holding a rank: memory points, professions, magic, holds and parcels, law and the world.",
});

export default function GuidePage() {
  return <Reader page={guide} eyebrow="The Handbook" />;
}
