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
        title="How to Play"
        subtitle="Follow the steps to start playing."
        note="Note: Server is still under development"
      />

      <OrnateFrame weight="heavy" className="mt-12" contentClassName="px-6 py-14 md:px-16 md:py-20">
        <div className="flex flex-col gap-16">
          <Step index={1} title="Create an Account">
            <p className={BODY}>
              Create your free {site.name} account to get started. You&apos;ll use your username
              (not email) to log in to the game.
            </p>
            <ButtonLink href="/register" variant="solid" size="md" className="mt-6 min-w-[260px]">
              Sign Up
            </ButtonLink>
          </Step>

          <Step index={2} title="Download the Game">
            <p className={BODY}>
              Choose your preferred client type and language, then download the game files.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Select label="Client Type" options={["Full Client", "Minimal Client"]} className="w-[190px]" />
              <Select label="Language" options={["English", "Deutsch", "Français"]} className="w-[190px]" />
              <button
                type="button"
                aria-label="Download"
                className="flex h-12 w-12 items-center justify-center border border-brand-accent/70 bg-brand-accent text-lg text-brand-dark transition-colors duration-[var(--duration-fast)] hover:bg-brand-accent/90"
              >
                <Download />
              </button>
            </div>
          </Step>

          <Step index={3} title="Play!">
            <p className={BODY}>
              Unzip the downloaded files, launch Wow-64.exe, and log in using your username (not
              your email address).
              <br />
              See you in the Mist!
            </p>
          </Step>

          <OrnateLabelDivider>Want to use your own client?</OrnateLabelDivider>

          <Step index={1} title="Create an Account">
            <p className={BODY}>
              Create your free {site.name} account to get started. You&apos;ll use your username
              (not email) to log in to the game.
            </p>
            <ButtonLink href="/register" variant="solid" size="md" className="mt-6 min-w-[260px]">
              Sign Up
            </ButtonLink>
          </Step>

          <Step index={2} title={`Setup ${site.name}`}>
            <p className={BODY}>
              Open your realmlist.wtf file (located in your WoW Data folder) and replace its
              contents with:
            </p>
            <div className="mt-5 w-full">
              <CopyField value="NOT PUBLIC YET" />
            </div>
            <p className={`${BODY} mt-8`}>
              Then open your Config.wtf file (located in your WoW WTF folder) and add this line:
            </p>
            <div className="mt-5 w-full">
              <CopyField value="NOT PUBLIC YET" />
            </div>
          </Step>

          <Step index={3} title="Play!">
            <p className={BODY}>
              Unzip the downloaded files, launch Wow-64.exe, and log in using your username (not
              your email address).
              <br />
              See you in the Mist!
            </p>
          </Step>
        </div>
      </OrnateFrame>
    </div>
  );
}
