import Link from "next/link";

import { FrameCorners } from "@/components/ornament/OrnateFrame";
import { counts, mereth } from "@/lib/mereth";

/**
 * The five doors into the codex, each carrying its real count.
 *
 * The numbers are the point. "Skills" is a category name and tells a visitor
 * nothing; "51 skills, and what all 255 tiers unlock" tells them whether this
 * page is worth their evening. Every figure comes from the exported bundle, so
 * none of them can drift away from what the page actually contains.
 */
const doors = [
  {
    href: "/skills",
    title: "Skills",
    line: `${counts.skills} skills, and what all ${counts.skills * 5} tiers unlock. Plus a planner for the eighteen memory points.`,
  },
  {
    href: "/magic",
    title: "Magic",
    line: `Why you cannot teach yourself, how the College actually works, and every spell you can be taught with its tier.`,
  },
  {
    href: "/crafting",
    title: "Crafting",
    line: `${counts.recipes.toLocaleString("en-GB")} recipes across ${mereth.benches.length} benches, an alchemy bench that shows what two ingredients brew, and where the nodes stand.`,
  },
  {
    href: "/world",
    title: "The World",
    line: `Holds, parcels and who grants what. The ${mereth.binds.length} interaction keys, ${mereth.races.length} races, the shared calendar, and what passes for law.`,
  },
  {
    href: "/records",
    title: "Records",
    line: `Search ${counts.searchable.toLocaleString("en-GB")} named records from the ${counts.plugins} plugins the launcher installs, plus the full mod list and release history.`,
  },
];

export function CodexGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {doors.map((door) => (
        <Link
          key={door.href}
          href={door.href}
          className="group relative flex flex-col border border-brand-accent/30 bg-black/35 p-6 transition-colors duration-[var(--duration-fast)] hover:border-brand-accent/70 hover:bg-black/50"
        >
          <FrameCorners weight="thin" size={18} />
          <h3 className="font-display relative text-lg tracking-heading text-brand-accent uppercase">
            {door.title}
          </h3>
          <p className="relative mt-3 flex-1 text-[0.9rem] leading-relaxed text-text-muted">
            {door.line}
          </p>
          <span className="relative mt-5 text-[0.82rem] text-brand-accent/70 transition-colors group-hover:text-brand-glow">
            Open <span aria-hidden="true">&rarr;</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
