import type { Metadata } from "next";

import { PageHeading } from "@/components/layout/PageHeading";
import { AccountPanel } from "@/components/shop/AccountPanel";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-site px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <PageHeading
        title="Shop"
        subtitle="Cosmetics and services. Nothing here gives an advantage in play."
      />
      <div className="mt-12">
        <AccountPanel />
      </div>
    </div>
  );
}
