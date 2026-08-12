import type { Metadata } from "next";
import Link from "next/link";

import { PageHeading } from "@/components/layout/PageHeading";
import { OrnateBox } from "@/components/ornament/OrnateBox";
import { TicketForm } from "@/components/support/TicketForm";

export const metadata: Metadata = { title: "Support" };

const ROUTES = [
  { problem: "Cannot log in", where: "Ticket", eta: "Under 12 hours" },
  { problem: "Stuck character or lost item", where: "Ticket", eta: "Under 24 hours" },
  { problem: "Bug report", where: "Discord", eta: "Triaged daily" },
  { problem: "General question", where: "Discord", eta: "Usually minutes" },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-site px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <PageHeading
        title="Support"
        subtitle="Tell us what happened and we will get to it. Check the wiki first if it is a question rather than a fault."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <TicketForm />

        <aside className="flex flex-col gap-6 lg:sticky lg:top-[132px] lg:self-start">
          <OrnateBox size="sm" contentClassName="p-6">
            <h2 className="font-display text-xs tracking-heading text-brand-accent">
              Where to go
            </h2>
            <ul className="mt-4 flex flex-col gap-4">
              {ROUTES.map((route) => (
                <li key={route.problem}>
                  <p className="text-sm text-text-primary">{route.problem}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {route.where} · {route.eta}
                  </p>
                </li>
              ))}
            </ul>
          </OrnateBox>

          <OrnateBox size="sm" contentClassName="p-6">
            <h2 className="font-display text-xs tracking-heading text-brand-accent">
              Before you write
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Most login problems are the realmlist. The{" "}
              <Link href="/wiki/first-hour" className="text-brand-accent underline-offset-4 hover:underline">
                first hour guide
              </Link>{" "}
              covers it, and{" "}
              <Link href="/wiki/getting-help" className="text-brand-accent underline-offset-4 hover:underline">
                getting help
              </Link>{" "}
              lists what to include.
            </p>
          </OrnateBox>
        </aside>
      </div>
    </div>
  );
}
