import type { Metadata } from "next";

import { Reader } from "@/components/handbook/Reader";
import { pageMeta } from "@/lib/seo";
import { combat } from "@/lib/handbook/combat";

export const metadata: Metadata = pageMeta({
  path: "/combat",
  title: "Combat",
  description:
    "Combat after the August rebuild: timed parries, a poise bar, the double tap dodge, crowd control that can be resisted, and stamina as the resource that decides a fight.",
});

export default function CombatPage() {
  return <Reader page={combat} eyebrow="The Handbook" />;
}
