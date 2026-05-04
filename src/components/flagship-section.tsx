import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import type { FlagshipPoint } from "@/lib/portfolio-data";

type Props = {
  flagshipPoints: FlagshipPoint[];
};

export function FlagshipSection({ flagshipPoints }: Props) {
  return (
    <section id="flagship-system" className="section-shell pt-24">
      <div className="section-card overflow-hidden p-8 sm:p-10 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionHeading
            eyebrow="Flagship System"
            title="AI-Powered Travel OTA"
            description="A business-critical platform designed to streamline visa and tour operations through guided workflows, conditional logic, document handling, finance approvals, and CRM-level visibility."
          />
          <div className="grid gap-5">
            {flagshipPoints.map((point, index) => (
              <FadeIn
                key={point.title}
                delay={index * 0.06}
                className="rounded-[1.75rem] border border-line/80 bg-surface/80 p-6"
              >
                <p className="text-sm uppercase tracking-[0.18em] text-accent">
                  {point.title}
                </p>
                <p className="mt-4 text-base leading-8 text-muted">{point.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
