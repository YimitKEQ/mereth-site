import type { Metadata } from "next";

import { SimplePage } from "@/components/layout/SimplePage";
import { simplePage } from "@/lib/pages";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/discord",
  title: simplePage("discord")?.title ?? "Discord",
  description:
    "Discord is the login, the front door and the only support channel on Mereth. What to do once you are in, and what the connection errors actually mean.",
});

export default function Page() {
  return <SimplePage slug="discord" />;
}
