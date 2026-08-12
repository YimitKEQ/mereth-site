import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PageHeading } from "@/components/layout/PageHeading";
import { OrnateLabelDivider } from "@/components/ornament/Divider";
import { OrnateFrame } from "@/components/ornament/OrnateFrame";
import { ButtonLink } from "@/components/ui/Button";
import { CopyField } from "@/components/ui/CopyField";
import { Select } from "@/components/ui/Select";
import { Download } from "@/components/ui/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "How to Play" };

/** Numbered step: a small underlined eyebrow, a gold heading, then the body. */
function Step({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col items-center text-center">
      <p className="font-display border-b border-white/70 pb-1 text-[11px] tracking-widest text-white">
        Step {index}
      </p>
      <h2 className="font-display mt-5 text-2xl tracking-heading text-brand-accent text-shadow-heading md:text-4xl">
        {title}
      </h2>
      <div className="mt-4 flex w-full flex-col items-center">{children}</div>
    </section>
  );
}

const BODY = "max-w-2xl text-sm leading-relaxed text-text-muted md:text-base";

export default function HowToPlayPage() {
  return (
    <div className="mx-auto max-w-site px-6 pt-12 pb-8 md:px-8 md:pt-16">
      <PageHeading
        title="Begin"
        subtitle="Four steps from here to standing in a hold."
        note="Applications are read by a person and answered within a few days."
      />

      <OrnateFrame weight="heavy" className="mt-12" contentClassName="px-6 py-14 md:px-16 md:py-20">
        <div className="flex flex-col gap-16">
          <Step index={1} title="Make an account">
            <p className={BODY}>
              Your account name is what you sign in with, not your email. Keep it plain: it is
              administrative, and your character's name is a separate thing entirely.
            </p>
            <ButtonLink href="/register" variant="solid" size="md" className="mt-6 min-w-[260px]">
              Apply
            </ButtonLink>
          </Step>

          <Step index={2} title="Install the modlist">
            <p className={BODY}>
              Our launcher installs and updates the modlist for you, and keeps your load order matching the server exactly.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Select label="Client Type" options={["Full modlist", "Minimal modlist"]} className="w-[220px]" />
              <Select label="Language" options={["English", "Deutsch", "Français", "Nederlands"]} className="w-[220px]" />
              <button
                type="button"
                aria-label="Download"
                className="flex h-12 w-12 items-center justify-center border border-brand-accent/70 bg-brand-accent text-lg text-brand-dark transition-colors duration-[var(--duration-fast)] hover:bg-brand-accent/90"
              >
                <Download />
              </button>
            </div>
          </Step>

          <Step index={3} title="Ride in">
            <p className={BODY}>
              Launch through the launcher, sign in, and make your character. An officer will meet
              you at the gate for the first hour if you want one.
            </p>
          </Step>

          <OrnateLabelDivider>Managing your own install?</OrnateLabelDivider>

          <Step index={1} title="Make an account">
            <p className={BODY}>
              Your account name is what you sign in with, not your email. Keep it plain: it is
              administrative, and your character's name is a separate thing entirely.
            </p>
            <ButtonLink href="/register" variant="solid" size="md" className="mt-6 min-w-[260px]">
              Apply
            </ButtonLink>
          </Step>

          <Step index={2} title="Point it at Mereth">
            <p className={BODY}>
              If you would rather manage your own install, point your client at this address:
            </p>
            <div className="mt-5 w-full">
              <CopyField value="NOT PUBLIC YET" />
            </div>
            <p className={`${BODY} mt-8`}>
              And set the world it should load:
            </p>
            <div className="mt-5 w-full">
              <CopyField value="NOT PUBLIC YET" />
            </div>
          </Step>

          <Step index={3} title="Ride in">
            <p className={BODY}>
              Launch through the launcher, sign in, and make your character. An officer will meet
              you at the gate for the first hour if you want one.
            </p>
          </Step>
        </div>
      </OrnateFrame>
    </div>
  );
}
