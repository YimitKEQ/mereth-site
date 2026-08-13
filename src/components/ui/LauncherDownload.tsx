import Link from "next/link";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ButtonLink } from "@/components/ui/Button";
import { LAUNCHER_DOWNLOAD, LAUNCHER_SIZE_MB } from "@/lib/site";

/**
 * The launcher, and the documents that come with it.
 *
 * The legal links are not decoration here. Mereth's own Terms describe the
 * download button as an acceptance action, and require conspicuous links to the
 * Privacy Policy, the Terms and the launcher EULA beside it. A bare download
 * button would quietly break the process the team wrote down, so the links are
 * part of the component rather than something a page has to remember to add.
 *
 * The size is stated because it is 86 MB and a stalled progress bar with no
 * expected total reads as a broken download.
 */
export function LauncherDownload({ className = "" }: { className?: string }) {
  return (
    <div className={`relative border border-brand-accent/40 bg-black/35 p-7 ${className}`}>
      <FrameCorners size={18} />

      <h2 className="font-display relative text-[1.05rem] tracking-heading text-brand-accent uppercase">
        Download the launcher
      </h2>
      <p className="relative mt-2.5 max-w-[62ch] text-[0.95rem] leading-relaxed text-text-light">
        It installs the whole mod list in the right order and checks your files against the server
        before it lets you connect. All you need is Skyrim Special Edition on PC. Everything else
        comes from here, and you should not assemble the list by hand.
      </p>

      <div className="relative mt-6 flex flex-wrap items-center gap-4">
        <ButtonLink href={LAUNCHER_DOWNLOAD} variant="solid" size="lg">
          Download for Windows
        </ButtonLink>
        <span className="text-[0.82rem] tabular-nums text-text-muted">
          {LAUNCHER_SIZE_MB} MB, .exe
        </span>
      </div>

      <p className="relative mt-5 text-[0.82rem] leading-relaxed text-text-muted">
        Downloading and accepting in the launcher enters you into an agreement with the Mereth RP
        Administration Team. Read the{" "}
        <Link
          href="/terms"
          className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 hover:decoration-brand-glow"
        >
          Terms
        </Link>{" "}
        and the{" "}
        <Link
          href="/privacy"
          className="text-brand-glow underline decoration-brand-accent/40 underline-offset-4 hover:decoration-brand-glow"
        >
          Privacy Policy
        </Link>{" "}
        first. The launcher has its own licence, which it shows you on first run. Mereth is 18+.
      </p>
    </div>
  );
}
