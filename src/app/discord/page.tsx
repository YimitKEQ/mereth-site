import type { Metadata } from "next";

import { SimplePage } from "@/components/layout/SimplePage";
import { simplePage } from "@/lib/pages";

export const metadata: Metadata = { title: simplePage("discord")?.title ?? "Discord" };

export default function Page() {
  return <SimplePage slug="discord" />;
}
