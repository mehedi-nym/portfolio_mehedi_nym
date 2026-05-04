import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import type { ExperienceItem } from "@/lib/portfolio-data";

type Props = {
  experiences: ExperienceItem[];
};

export function ExperienceSection({ experiences }: Props) {
  return (
    <section id="experience" className="section-shell pt-24">
      <SectionHeading
        eyebrow="Experience"
        title="Focused on complex operational systems with real delivery pressure."
        description="Ryoko is the centerpiece of this journey, where travel operations, AI features, CRM workflows, and dynamic CMS tooling intersect."
      />
      <div className="mt-12 space-y-6">
        {experiences.map((item, index) => (
          <FadeIn
            key={item.company}
            delay={index * 0.08}
            className="section-card grid gap-8 p-8 lg:grid-cols-[220px_1fr]"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">{item.period}</p>
              <h3 className="mt-3 text-2xl font-semibold text-fg">{item.company}</h3>
              <p className="mt-2 text-sm font-medium text-accent">{item.role}</p>
            </div>
            <div>
              <p className="text-lg leading-8 text-fg">{item.focus}</p>
              <div className="mt-6 grid gap-4">
                {item.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="rounded-[1.5rem] border border-line/70 bg-surface/70 p-5 text-sm leading-7 text-muted"
                  >
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
