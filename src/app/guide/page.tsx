import type { Metadata } from "next";

import { Reader } from "@/components/handbook/Reader";
import { guide } from "@/lib/handbook/guide";

export const metadata: Metadata = {
  title: "The Guide",
  description:
    "How Mereth works, from installing it to holding a rank: memory points, professions, magic, holds and parcels, law and the world.",
};

export default function GuidePage() {
  return <Reader page={guide} eyebrow="The Handbook" />;
}
