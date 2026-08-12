import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/AuthCard";
import { PageHeading } from "@/components/layout/PageHeading";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <PageHeading title="Log in" subtitle="Use your account username, not your email address." />
      <div className="mt-12">
        <AuthCard mode="login" />
      </div>
    </div>
  );
}
