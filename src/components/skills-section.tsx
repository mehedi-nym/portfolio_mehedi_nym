import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import type { SkillGroup } from "@/lib/portfolio-data";

type Props = {
  skillGroups: SkillGroup[];
};

export function SkillsSection({ skillGroups }: Props) {
  return (
    <section id="skills" className="section-shell pt-24">
      <SectionHeading
        eyebrow="Core Skills"
        title="Organized across product delivery, technical implementation, and system operations."
        description="Built around the realities of shipping business-critical platforms rather than generic portfolio keywords."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <FadeIn key={group.title} delay={index * 0.05} className="section-card p-8">
            <h3 className="text-xl font-semibold text-fg">{group.title}</h3>
            <div className="mt-6 flex flex-wrap gap-3">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-line/80 bg-surface px-4 py-2 text-sm text-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
