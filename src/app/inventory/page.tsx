import type { Metadata } from "next";

import { PageHeading } from "@/components/layout/PageHeading";
import { AccountPanel } from "@/components/shop/AccountPanel";

export const metadata: Metadata = { title: "Inventory" };

export default function InventoryPage() {
  return (
    <div className="mx-auto max-w-site px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <PageHeading
        title="Inventory"
        subtitle="Everything you have purchased or received, ready to claim when you want."
      />
      <div className="mt-12">
        <AccountPanel />
      </div>
    </div>
  );
}
