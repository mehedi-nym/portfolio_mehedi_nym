import { ArrowRight, Mail, MapPin } from "lucide-react";
import { FadeIn } from "@/components/motion";
import type { HeroMetric } from "@/lib/portfolio-data";

type Props = {
  heroMetrics: HeroMetric[];
};

export function HeroSection({ heroMetrics }: Props) {
  return (
    <section id="top" className="section-shell pt-12 sm:pt-16">
      <div className="section-card overflow-hidden px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <FadeIn className="max-w-3xl">
            <span className="eyebrow">Dhaka, Bangladesh</span>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl leading-[0.96] text-fg sm:text-6xl lg:text-7xl">
              MD. Mehedi Hasan Nayem
            </h1>
            <p className="mt-6 text-lg font-semibold uppercase tracking-[0.18em] text-accent">
              Technical Project Coordinator | AI Travel Tech | System Builder
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              Building scalable travel tech systems, CMS platforms &amp; AI-driven
              workflows.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-accent dark:bg-white dark:text-ink"
              >
                View Projects
                <ArrowRight size={16} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-6 py-4 text-sm font-semibold text-fg hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
              >
                Contact Me
                <Mail size={16} />
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="grid gap-4">
            <div className="rounded-[1.75rem] border border-line/80 bg-sand/80 p-6 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-muted">
                <MapPin size={14} />
                Based in Dhaka
              </div>
              <p className="mt-4 text-2xl font-semibold text-fg">
                Bridging developers, operations, QA, and product decisions across
                real-world delivery systems.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroMetrics.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-line/80 bg-surface/80 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    {item.label}
                  </p>
                  <p className="mt-3 text-base font-semibold text-fg">{item.value}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
