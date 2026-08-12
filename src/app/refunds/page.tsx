import type { Metadata } from "next";

import { SimplePage } from "@/components/layout/SimplePage";
import { simplePage } from "@/lib/pages";

export const metadata: Metadata = { title: simplePage("refunds")?.title ?? "Refunds" };

export default function Page() {
  return <SimplePage slug="refunds" />;
}
