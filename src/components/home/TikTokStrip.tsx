"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { TikTokPlayer } from "@/components/home/TikTokPlayer";
import { OrnateLabelDivider } from "@/components/ornament/Divider";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { ButtonLink } from "@/components/ui/Button";
import { fetchTikTok, readable, TIKTOK_PROFILE, type TikTokVideo } from "@/lib/tiktok";

/**
 * The four most recent TikToks, in the site's own frame.
 *
 * Asked for by the team: the clips should appear here whenever one goes up,
 * without anybody editing the site. So nothing about this row is written down.
 * It is read live from `/api/tiktok`, and the day they post a ninth video it is
 * the one on the left.
 *
 * Drawn rather than embedded, which is the whole design decision. TikTok's own
 * creator widget is the obvious route and it was built and looked at first: it
 * paints a white card onto a #10161a page, crops its video row at a fixed 458
 * pixels, and raises TikTok's cookie banner, in the reader's language, inside
 * our layout. What ships instead is the same data in the reference's card:
 * framed picture, words underneath on the page. No third-party script, no
 * third-party cookie, and nothing on the page that did not come from this
 * stylesheet.
 *
 * A card opens the post on TikTok in a new tab rather than playing inline. An
 * inline player means TikTok's iframe, which means the banner again, and the
 * team would rather the view landed on the post anyway.
 *
 * Play counts are deliberately not shown. They are real and they were available,
 * but one post at 44,500 beside three in the hundreds reads as three failures
 * rather than four posts, and this row exists to make people watch, not to
 * publish a scoreboard. Same judgement as the capacity figure withheld from the
 * player count in `ServerStatus`.
 */

/** One row, and only ever one. The rest of the account is a click away. */
const VISIBLE = 4;

/*
 * The card shape is a finding rather than a preference.
 *
 * The obvious shape for a TikTok is a tall 9:16 phone, and it was built that way
 * first. Then the eight covers were measured in the browser: five are landscape
 * (1920x1080, one 1920x994) and three are portrait (1080x1920 twice, 1620x2160
 * once). These are largely Skyrim clips that went to TikTok rather than phone
 * video, and a 9:16 card cropped the landscape ones to a third of their width
 * and cut the title clean off the two that had one.
 *
 * So the feed is genuinely mixed and no single crop serves it. 4:3 is the shape
 * that treats both fairly: fitted whole rather than cropped, a landscape cover
 * fills three quarters of the height and a portrait one a tall centred panel,
 * with the picture's own blurred colours behind whatever is left. It also puts
 * this row in the same rhythm as the picture grid further up the page, which is
 * the point: it should read as part of the site, not as something imported.
 */
const CARD_ASPECT = "aspect-[4/3]";

/*
 * A guard, not a description of anything currently posted.
 *
 * Everything on the account today falls between 0.563 and 1.932, which fits the
 * frame comfortably. But nothing here controls what gets uploaded next, and a
 * panorama or a stitched slideshow cover fitted whole would render as a
 * hairline. Anything outside this range is cropped from its leading edge
 * instead, which for a strip of frames shows the first one.
 */
const TOO_WIDE = 2.6;
const TOO_TALL = 0.4;

type Phase = "waiting" | "loading" | "ready" | "empty";
type Fit = "contain" | "cover";

/** The frame every cell in the row uses, filled or not, so the loading state and
 *  the loaded one occupy exactly the same space and the page never jumps. */
function Cell({ children }: { children?: ReactNode }) {
  return (
    <div className="relative text-brand-accent">
      <FrameCorners size={16} />
      <div
        className={`plate-frame relative w-full overflow-hidden bg-black/40 ${CARD_ASPECT}`}
        style={{
          borderWidth: "var(--border-ornate-thin)",
          borderStyle: "solid",
          borderColor: "color-mix(in srgb, var(--color-brand-accent) 62%, transparent)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Card({ video, onPlay }: { video: TikTokVideo; onPlay: () => void }) {
  const caption = readable(video.caption);

  /*
   * How this particular cover sits in the frame, decided once it has loaded and
   * its real proportions are known. TikTok reports width and height as 0 on
   * every item, so there is nothing to go on until the browser has the file.
   *
   * `contain` first, because six of the eight want it and a wrong first paint
   * that corrects itself is worse than a right one that never has to. The frame
   * is a fixed size either way, so nothing on the page moves when this changes.
   */
  const [fit, setFit] = useState<Fit>("contain");

  return (
    /*
      Still a real link to the post, and still opened as one by a middle click,
      a ctrl-click or a reader with no JavaScript. The overlay is layered on top
      of that rather than replacing it: making the card a <button> would have
      cost the copyable address and the open-in-new-tab that people expect from
      a picture of a video.
    */
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (event.button !== 0) return;
        event.preventDefault();
        onPlay();
      }}
      className="group flex flex-col"
    >
      <Cell>
        {/*
          The cover again, enlarged and blurred, filling whatever the fitted
          picture does not. A 16:9 frame in a 4:3 card leaves a band top and
          bottom, and this is what the site already does behind every plate:
          the picture's own colours, out of focus, rather than a flat black bar.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url("${encodeURI(video.cover)}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(18px) saturate(0.75) brightness(0.55)",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element -- a signed
            third-party URL that expires in about two days. next/image would want
            a whitelisted host and would cache a file that dies under it. */}
        <img
          src={video.cover}
          alt={caption === "" ? "A clip from Mereth on TikTok" : caption}
          loading="lazy"
          decoding="async"
          /* Nothing about which page a reader is on needs to reach TikTok's CDN.
             Checked: the covers serve with no referrer at all. */
          referrerPolicy="no-referrer"
          onLoad={(event) => {
            const { naturalWidth, naturalHeight } = event.currentTarget;
            if (naturalHeight === 0) return;
            const ratio = naturalWidth / naturalHeight;
            if (ratio > TOO_WIDE || ratio < TOO_TALL) setFit("cover");
          }}
          className={`absolute inset-0 h-full w-full ${
            fit === "cover" ? "object-cover object-left" : "object-contain"
          }`}
        />

        {/* The same hairline of the page's own dark that sits under every
            picture on this site, so the play mark has something to sit on. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top, #0b1013cc 0%, transparent 34%)" }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full border border-brand-accent/70 bg-black/60 transition-colors duration-[var(--duration-normal)] group-hover:border-brand-glow"
        >
          <svg
            viewBox="0 0 24 24"
            className="ml-0.5 h-3.5 w-3.5 fill-current text-brand-accent transition-colors group-hover:text-brand-glow"
            focusable="false"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </Cell>

      {caption === "" ? null : (
        <p className="mt-3.5 line-clamp-2 text-[0.84rem] leading-relaxed text-text-muted text-shadow-subtle">
          {caption}
        </p>
      )}
      <span className="mt-2 text-[0.78rem] text-brand-accent/70 transition-colors group-hover:text-brand-glow">
        Watch it here <span aria-hidden="true">&rarr;</span>
      </span>
    </a>
  );
}

export function TikTokStrip() {
  const anchor = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<Phase>("waiting");
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  /** Which clip the overlay is playing, or null when it is shut. */
  const [playing, setPlaying] = useState<number | null>(null);

  /*
   * The request waits until the row is nearly in view.
   *
   * This section sits well below the fold and most readers never reach it, so
   * firing the fetch on mount would put a request to TikTok's embed in front of
   * every single visit to the front page to serve a row most of them will not
   * see. Same reasoning as the trailer, which does not build its iframe until
   * somebody presses play.
   */
  useEffect(() => {
    const node = anchor.current;
    if (node === null) return;

    /* No observer means an older browser, not a reason to show nothing. */
    if (typeof IntersectionObserver === "undefined") {
      setPhase("loading");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          setPhase("loading");
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;

    const controller = new AbortController();
    let cancelled = false;

    void fetchTikTok(controller.signal).then((feed) => {
      if (cancelled) return;
      setVideos(feed.videos.slice(0, VISIBLE));
      setPhase(feed.videos.length === 0 ? "empty" : "ready");
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [phase]);

  return (
    <section ref={anchor} className="mx-auto max-w-[84rem] px-6 pt-24 md:px-8 md:pt-28">
      <OrnateLabelDivider>Mereth on TikTok</OrnateLabelDivider>

      {/* The second sentence is a promise about the row underneath it, so it is
          not said when there is no row. */}
      <p className="mx-auto mt-5 max-w-xl text-center text-[0.95rem] leading-relaxed text-text-muted">
        Short clips cut from the province by the team.
        {phase === "empty"
          ? " They are all on the account, and the feed could not be read from here just now."
          : " The newest are here, and the row fills itself the moment another one goes up."}
      </p>

      {phase === "empty" ? (
        /*
          Held, not faked. An unreadable feed leaves the one thing that is still
          true, which is where the account is, rather than an empty grid or an
          error a reader can do nothing about.
        */
        null
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {phase === "ready"
            ? videos.map((video, index) => (
                <Card key={video.id} video={video} onPlay={() => setPlaying(index)} />
              ))
            : Array.from({ length: VISIBLE }, (unused, index) => <Cell key={index} />)}
        </div>
      )}

      <p className="mt-10 text-center">
        <ButtonLink href={TIKTOK_PROFILE} size="md" target="_blank" rel="noopener noreferrer">
          Follow @merethrp
        </ButtonLink>
      </p>

      <TikTokPlayer
        videos={videos}
        index={playing}
        onClose={() => setPlaying(null)}
        onMove={setPlaying}
      />
    </section>
  );
}
