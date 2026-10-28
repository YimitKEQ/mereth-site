import type { Metadata } from "next";

import { AttributePlanner } from "@/components/codex/AttributePlanner";
import { CodexHeader } from "@/components/codex/CodexHeader";
import { SkillList } from "@/components/codex/SkillList";
import { SkillMenu } from "@/components/codex/SkillMenu";
import { SkillPlanner } from "@/components/codex/SkillPlanner";
import { Tabs } from "@/components/codex/Tabs";
import { PlateImage } from "@/components/ui/Plate";
import { pageMeta } from "@/lib/seo";
import { plate } from "@/lib/images";
import { buyableTiers, counts, mereth } from "@/lib/mereth";

export const metadata: Metadata = pageMeta({
  path: "/skills",
  title: "Skills",
  description:
    "Every skill on the server with the in-game text for each of its tiers, an 18 point planner, and an attribute planner with every race's base values and what each attribute does to your skills.",
});

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-[84rem] px-6 pt-12 pb-24 md:px-8 md:pt-16">
      <CodexHeader
        title="Skills"
        lede={`Tiers are **caps you buy once**, not levels you grind. Eighteen memory points, spent in
          the starting room or at any temple, decide the highest tier each skill can ever reach.
          Plan it here first: taking a point back in game burns the experience you earned in the
          tier you drop out of. Then set your **attributes**, because they add or take away skill
          levels on top of the tier you bought.`}
        facts={[
          { label: "Skills", value: String(counts.skills) },
          { label: "Categories", value: String(counts.categories) },
          { label: "Memory points", value: String(mereth.memoryPoints) },
          { label: "Master costs", value: "8" },
        ]}
      />

      <figure className="mx-auto mb-12 max-w-4xl">
        <PlateImage
          slug="skill-menu"
          scale="md"
          priority
          aspect="aspect-[1880/998]"
          sizes="(max-width: 1024px) 100vw, 56rem"
        />
        <figcaption className="mt-3 text-center text-[0.82rem] text-text-muted">
          {plate("skill-menu").caption}
        </figcaption>
      </figure>

      <Tabs
        tabs={[
          {
            id: "menu",
            label: "Skill menu",
            hint: "The way it looks in game",
            content: (
              <SkillMenu
                skills={mereth.skills}
                categories={mereth.categories}
                tiers={buyableTiers}
              />
            ),
          },
          {
            id: "planner",
            label: "Planner",
            hint: "The same plan, as a list",
            content: (
              <SkillPlanner
                skills={mereth.skills}
                categories={mereth.categories}
                tiers={buyableTiers}
              />
            ),
          },
          {
            id: "attributes",
            label: "Attributes",
            hint: "Race, points and what they do to your skills",
            content: (
              <AttributePlanner
                skills={mereth.skills}
                attributes={mereth.attributes}
                tiers={buyableTiers}
              />
            ),
          },
          {
            id: "all",
            label: "Every skill, every tier",
            hint: "What each tier unlocks",
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
