import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/AuthCard";
import { PageHeading } from "@/components/layout/PageHeading";

export const metadata: Metadata = { title: "Create an account" };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <PageHeading
        title="Create an account"
        subtitle="Free, and takes a minute. Your username is what you log in to the game with."
      />
      <div className="mt-12">
        <AuthCard mode="register" />
      </div>
    </div>
  );
}
