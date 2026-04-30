import { FadeIn } from "@/components/motion";
import { additionalProjects } from "@/lib/portfolio-data";

export function AdditionalProjectsSection() {
  return (
    <section className="section-shell pt-24">
      <FadeIn className="section-card p-8 sm:p-10">
        <div>
          <span className="eyebrow">Additional Projects</span>
          <h2 className="mt-5 text-3xl font-semibold text-fg">
            Smaller systems with practical operational value.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {additionalProjects.map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-line/80 bg-surface/70 p-5 text-sm leading-7 text-muted"
            >
              {item}
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
