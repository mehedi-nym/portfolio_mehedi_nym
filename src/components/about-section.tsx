import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";

export function AboutSection() {
  return (
    <section id="about" className="section-shell pt-24">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <SectionHeading
          eyebrow="About"
          title="A coordination mindset with systems-level execution."
          description="Technical Project Coordinator with hands-on experience in AI-powered travel platforms, workflow design, API testing, CMS and CRM systems, and operational optimization. Focused on translating business needs into dependable product execution while keeping developers, QA, and operations aligned."
        />
        <FadeIn delay={0.08} className="section-card p-8 sm:p-10">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted">Strength</p>
              <p className="mt-3 text-lg leading-8 text-fg">
                Bridging technical teams and business operations without losing sight of
                implementation detail.
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted">Focus</p>
              <p className="mt-3 text-lg leading-8 text-fg">
                Scalable travel tech, CMS platforms, CRM workflows, QA systems, and
                practical AI features.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
