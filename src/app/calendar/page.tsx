import type { Metadata } from "next";

import { LiveCount } from "@/components/codex/LiveCount";
import { CalendarBoard } from "@/components/codex/CalendarBoard";
import { CodexHeader } from "@/components/codex/CodexHeader";
import { pageMeta } from "@/lib/seo";
import { chronicleRegister } from "@/lib/world/calendar";

export const metadata: Metadata = pageMeta({
  path: "/calendar",
  title: "The Calendar",
  description:
    "What is coming in the province and what is already written down: scheduled events in your own time zone, and the dated history of Skyrim in 4E 185.",
});

/**
 * The calendar, which is two registers rather than one.
 *
 * Asked for by the team as "an event calendar and dates of things", and those
 * are genuinely two things: a gathering somebody can turn up to at eight on
 * Saturday, and the year a High King died. They share a page because they share
 * an authoring surface and a way of writing a date, and they are kept visibly
 * apart because one is a plan and the other is a record.
 *
 * Both come from the lore office in the staff console, baked at build time and
 * corrected in the browser. Nothing on this page is written in this repository
 * except the seed, and every seeded entry cites where Mereth already published
 * it.
 */
export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <CodexHeader
        title="The Calendar"
        eyebrow="The Realm"
        lede={`Two registers. **What is coming**, which is anything the province has called and
          anyone may attend, shown in your own time zone because this server is played from
          several continents. And **the annals**, which is what has already happened, dated in the
          province's own calendar and carrying the source for every entry.`}
        facts={[
          { label: "Scheduled", value: <LiveCount baked={chronicleRegister} kind="events" /> },
          { label: "In the annals", value: <LiveCount baked={chronicleRegister} kind="annals" /> },
          { label: "The year", value: "4E 185" },
        ]}
      />

      <div className="max-w-[72rem]">
        <CalendarBoard baked={chronicleRegister} />
      </div>
    </div>
  );
}
