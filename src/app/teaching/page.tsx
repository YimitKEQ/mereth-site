import type { Metadata } from "next";

import { Reader } from "@/components/handbook/Reader";
import { pageMeta } from "@/lib/seo";
import { teaching } from "@/lib/handbook/teaching";

export const metadata: Metadata = pageMeta({
  path: "/teaching",
  title: "Teaching Magic",
  description:
    "The Teacher whitelist: what it takes to apply, how the Teach interaction works, the three apprentice slots, and what an audit asks for.",
});

export default function TeachingPage() {
  return <Reader page={teaching} eyebrow="The Handbook" />;
}
