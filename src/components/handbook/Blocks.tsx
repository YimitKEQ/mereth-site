import { Clip } from "@/components/gallery/Clip";
import { ClientMessages } from "@/components/handbook/ClientMessages";
import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { PlateFigure } from "@/components/ui/Plate";
import type { Block, DataBlock } from "@/lib/handbook/blocks";
import { connectionMessages, playMessages } from "@/lib/handbook/client-messages";
import { inline } from "@/lib/markup";
import { citations, mereth } from "@/lib/mereth";

/**
 * Renders the handbook's block vocabulary.
 *
 * A server component on purpose: `cite` blocks carry a RegExp, which cannot
 * cross into a client component, and resolving them here means the release
 * notes are matched once at build rather than in every reader's browser.
 */

/** A message the client itself prints. Verbatim, including its own punctuation. */
function Quote({ text }: { text: string }) {
  return (
    <figure className="my-6 border-l-2 border-brand-accent/50 bg-black/25 py-3 pr-4 pl-5">
      <blockquote className="font-mono text-[0.82rem] leading-relaxed text-text-light">
        {text}
      </blockquote>
      <figcaption className="mt-1.5 text-[11px] tracking-wide text-text-muted">
        the client's own message
      </figcaption>
    </figure>
  );
}

/** Dated release notes backing a claim made above them. */
function Citations({ pattern, limit }: { pattern: RegExp; limit: number }) {
  const notes = citations(pattern, limit);
  if (notes.length === 0) return null;

  /*
   * Folded, because this is evidence rather than reading.
   *
   * Every claim on these pages is backed by the release note that made it true,
   * and printing all of them inline tripled the length of a page while burying
   * the sentence they were supporting. Somebody checking whether we are making
   * things up can open one. Everybody else gets the paragraph.
   *
   * A <details> rather than state: it works before hydration, it is one element,
   * and the browser's own find-in-page opens it.
   */
  return (
    <details className="my-6 border-l border-brand-accent/20 pl-5">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[0.8rem] text-text-muted transition-colors hover:text-brand-accent">
        <span className="fold-marker text-brand-accent/70">&#9656;</span>
        {notes.length === 1 ? "the release note behind this" : `the ${notes.length} release notes behind this`}
      </summary>
      <ul className="mt-3 space-y-2.5">
        {notes.map((note, i) => (
          <li key={i} className="text-[0.84rem] leading-relaxed text-text-muted">
            <span className="text-text-light">{note.text}</span>
            <span className="mt-0.5 block font-mono text-[11px] text-brand-accent/70">
              {note.version}
              {note.date === null ? "" : ` · ${note.date}`}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}

function Note({ tone, title, body }: { tone: "key" | "warn"; title?: string; body: string }) {
  const accent = tone === "warn" ? "border-[#a8503c]/60" : "border-brand-accent/45";
  const label = tone === "warn" ? "text-[#d08a76]" : "text-brand-accent";

  return (
    <div className={`relative my-7 border ${accent} bg-black/35 px-6 py-5`}>
      <FrameCorners weight="thin" size={16} />
      {title !== undefined ? (
        <h3 className={`font-display relative mb-2 text-[0.95rem] tracking-heading uppercase ${label}`}>
          {title}
        </h3>
      ) : null}
      <p className="relative text-[0.95rem] leading-relaxed text-text-light">{inline(body)}</p>
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="my-7 overflow-x-auto">
      <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
        <thead>
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                className="font-display border-b border-brand-accent/35 pb-2.5 pr-6 text-[11px] tracking-[1.6px] text-brand-accent uppercase"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border-subtle last:border-0">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`py-2.5 pr-6 ${j === 0 ? "text-text-primary" : "text-text-muted"}`}
                >
                  {inline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="my-6 flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="border border-brand-accent/25 bg-black/30 px-3 py-1.5 text-[0.82rem] text-text-light"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Turn `{ endurance: 2, strength: 1 }` into "2 x Endurance + Strength".
 *
 * `multiplier` and `flat` are the two non-attribute terms their formulas carry, and both
 * belong at the end: carry is `(Strength + Endurance) x 1.25 + 10`.
 */
function poolFormula(terms: Record<string, number>): string {
  const attributes = Object.entries(terms).filter(([key]) => key !== "multiplier" && key !== "flat");
  const sum = attributes
    .map(([key, weight]) => {
      const name = key.replace(/^\w/, (c) => c.toUpperCase());
      return weight === 1 ? name : `${weight} x ${name}`;
    })
    .join(" + ");
  const multiplier = terms.multiplier;
  const flat = terms.flat;
  const scaled = multiplier === undefined ? sum : `(${sum}) x ${multiplier}`;
  return flat === undefined ? scaled : `${scaled} + ${flat}`;
}

/** Datasets that would be unreadable written out as literals in the content file. */
function Data({ name }: { name: DataBlock }) {
  switch (name) {
    case "binds":
      return (
        <Table
          head={["Action", "Key", "Gamepad"]}
          rows={mereth.binds.map((bind) => [
            bind.action.replace(/^\w/, (c) => c.toUpperCase()),
            `\`${bind.key}\``,
            bind.pad,
          ])}
        />
      );

    case "tiers":
      return (
        <Table
          head={["Tier", "Memory points", "Skill level"]}
          rows={mereth.tiers.map((tier) => [
            tier.name,
            tier.cost === null ? "cannot be bought" : String(tier.cost),
            // Legendary spans a single level, so "100 to 100" is accurate and daft.
            tier.from === tier.to ? String(tier.from) : `${tier.from} to ${tier.to}`,
          ])}
        />
      );

    /*
     * The thresholds came out of the client's own needs HUD. That HUD was deleted
     * in 0.72 when hunger, thirst and energy moved to TrueHUD, a native plugin,
     * and nothing published the numbers after it. An empty table would read as a
     * rendering bug, so the absence is stated instead of drawn.
     */
    case "needs":
      if (mereth.needs.length === 0) {
        return (
          <p className="text-frost-dim">
            The client stopped publishing these. Food and drink still warn you twice on the way
            down, but since the needs bars moved to TrueHUD in 0.72 the percentages behind those
            warnings are not in anything a reader can check. Treat the first warning as
            &ldquo;soon&rdquo; and the second as &ldquo;now&rdquo;.
          </p>
        );
      }
      return (
        <Table
          head={["Need", "Low at", "Critical at"]}
          rows={mereth.needs.map((need) => [need.label, String(need.lowAt), String(need.criticalAt)])}
        />
      );

    case "attributes":
      return (
        <Table
          head={["Attribute", "What it does"]}
          rows={mereth.attributes.map((attribute) => [`**${attribute.label}**`, attribute.blurb])}
        />
      );

    /*
     * Rendered from the coefficients rather than written out, so the arithmetic on
     * the page is the arithmetic in the menu. Their own source calls these "the same
     * official floors as derivedPools.ts / AttrPools.h": the menu, the server and the
     * native plugin agreeing on one formula.
     */
    case "pools":
      return (
        <Table
          head={["Pool", "How it is worked out"]}
          rows={Object.entries(mereth.pools).map(([pool, terms]) => [
            `**${pool.replace(/^\w/, (c) => c.toUpperCase())}**`,
            poolFormula(terms),
          ])}
        />
      );

    case "access":
      return <Chips items={mereth.accessLevels} />;

    case "races":
      return <Chips items={mereth.races} />;

    case "months":
      return <Chips items={mereth.months} />;

    case "slash":
      return <Chips items={mereth.slashCommands} />;

    case "menus":
      return (
        <Table
          head={["Menu", "What it is"]}
          rows={[
            ["`skillMenu`", "your skill plan"],
            ["`spellBook`", "the grimoire of what you have been taught"],
            ["`holdstone`", "pledging, ranks and parcels"],
            ["`boardMenu`", "the missive board in every hold"],
            ["`titleMenu`", "the titles you have unlocked"],
            ["`settingsMenu`", "your own client settings"],
            ["`kitMenu`, `animMenu`, `performMenu`, `sceneMenu`", "the roleplay tools"],
          ]}
        />
      );

    /*
     * Both of these used to filter the raw client strings with a regex and print
     * whatever survived. That published two fragments cut mid-sentence and three
     * ways of saying the same thing, and it told nobody what to do. The
     * explanations are written now, in `lib/handbook/client-messages.ts`, and
     * the support page renders the same ones, so the two pages cannot drift
     * apart the way they had.
     */
    case "troubles":
      return <ClientMessages messages={connectionMessages} />;

    case "refusals":
      return <ClientMessages messages={playMessages} />;
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "prose":
            return (
              <div key={i} className="space-y-4">
                {block.paragraphs.map((paragraph, j) => (
                  <p key={j} className="text-[1.02rem] leading-[1.85] text-text-light">
                    {inline(paragraph)}
                  </p>
                ))}
              </div>
            );
          case "note":
            return <Note key={i} tone={block.tone} title={block.title} body={block.body} />;
          case "quote":
            return <Quote key={i} text={block.text} />;
          case "clip":
            return (
              <Clip
                key={i}
                slug={block.slug}
                title={block.title}
                caption={block.caption}
              />
            );
          case "plate":
            return (
              <PlateFigure
                key={i}
                slug={block.slug}
                aspect="aspect-[26/27]"
                sizes="(max-width: 768px) 100vw, 320px"
                className="mt-2 mb-8 md:float-right md:mb-4 md:ml-8 md:w-[42%]"
              />
            );
          case "cite":
            return <Citations key={i} pattern={block.pattern} limit={block.limit ?? 3} />;
          case "table":
            return <Table key={i} head={block.head} rows={block.rows} />;
          case "list":
            return block.style === "bare" ? (
              <Chips key={i} items={block.items} />
            ) : (
              <ul key={i} className="my-6 space-y-2.5">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="relative pl-5 text-[0.98rem] leading-relaxed text-text-light before:absolute before:top-[0.7em] before:left-0 before:h-1 before:w-1 before:bg-brand-accent"
                  >
                    {inline(item)}
                  </li>
                ))}
              </ul>
            );
          case "data":
            return <Data key={i} name={block.name} />;
        }
      })}
    </>
  );
}
