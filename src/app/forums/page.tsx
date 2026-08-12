import type { Metadata } from "next";

import { SimplePage } from "@/components/layout/SimplePage";
import { simplePage } from "@/lib/pages";

export const metadata: Metadata = { title: simplePage("forums")?.title ?? "Forums" };

export default function Page() {
  return <SimplePage slug="forums" />;
}
