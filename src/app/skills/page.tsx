import type { Metadata } from "next";

import { CodexHeader } from "@/components/codex/CodexHeader";
import { SkillList } from "@/components/codex/SkillList";
import { SkillPlanner } from "@/components/codex/SkillPlanner";
import { Tabs } from "@/components/codex/Tabs";
import { buyableTiers, counts, mereth } from "@/lib/mereth";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "All 51 Mereth skills with the team's own text for every tier, and an 18 point planner that does the arithmetic before you spend anything.",
};

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <CodexHeader
        title="Skills"
        lede={`Tiers are **caps you buy once**, not levels you grind. Eighteen memory points, spent in
          the starting room or at any temple, decide the highest tier each skill can ever reach.
          Plan it here first: taking a point back in game burns the experience you earned in the
          tier you drop out of.`}
        facts={[
          { label: "Skills", value: String(counts.skills) },
          { label: "Categories", value: String(counts.categories) },
          { label: "Memory points", value: String(mereth.memoryPoints) },
          { label: "Master costs", value: "8" },
        ]}
      />

      <Tabs
        tabs={[
          {
            id: "planner",
            label: "Planner",
            hint: "Spend the eighteen",
            content: (
              <SkillPlanner
                skills={mereth.skills}
                categories={mereth.categories}
                tiers={buyableTiers}
              />
            ),
          },
          {
            id: "all",
            label: "Every skill, every tier",
            hint: "Mereth's own words",
            content: (
              <SkillList
                skills={mereth.skills}
                categories={mereth.categories}
                tiers={mereth.tiers.slice(0, 5)}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
