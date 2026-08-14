import type { Metadata } from "next";

import { Reader } from "@/components/handbook/Reader";
import { pageMeta } from "@/lib/seo";
import { survival } from "@/lib/handbook/survival";

export const metadata: Metadata = pageMeta({
  path: "/survival",
  title: "Food, Drink and Exhaustion",
  description:
    "The three bars that tick down while you play, what refills each one, and why the purple bar is Energy rather than an experience budget.",
});

export default function SurvivalPage() {
  return <Reader page={survival} eyebrow="The Handbook" />;
}
