import type { Metadata } from "next";

import { Reader } from "@/components/handbook/Reader";
import { pageMeta } from "@/lib/seo";
import { peoplesPage } from "@/lib/handbook/peoples";

export const metadata: Metadata = pageMeta({
  path: "/peoples",
  title: "The peoples of Tamriel",
  description:
    "The Lore Team's guide to playing every people of Tamriel in Skyrim, from Nords to Khajiit: their faiths, customs and the backgrounds that shape them.",
});

export default function PeoplesPage() {
  return <Reader page={peoplesPage} eyebrow="The Handbook" />;
}
