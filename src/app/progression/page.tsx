import type { Metadata } from "next";

import { Reader } from "@/components/handbook/Reader";
import { pageMeta } from "@/lib/seo";
import { progression } from "@/lib/handbook/progression";

export const metadata: Metadata = pageMeta({
  path: "/progression",
  title: "Progression",
  description:
    "What a tier is worth, how long one takes, and which questions have a published answer rather than an in-character one.",
});

export default function ProgressionPage() {
  return <Reader page={progression} eyebrow="The Handbook" />;
}
