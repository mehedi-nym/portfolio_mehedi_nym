import { Send } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import type { ContactLink } from "@/lib/portfolio-data";

type Props = {
  contactLinks: ContactLink[];
};

export function ContactSection({ contactLinks }: Props) {
  return (
    <section id="contact" className="section-shell py-24">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="section-card p-8 sm:p-10">
          <SectionHeading
            eyebrow="Contact"
            title="Let’s connect around product delivery, systems and travel-tech execution."
            description="Available for collaboration, technical coordination roles, and conversations around systems that need both operational clarity and implementation discipline."
          />
          <div className="mt-8 grid gap-4">
            {contactLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="rounded-[1.5rem] border border-line/80 bg-surface/80 p-5 hover:-translate-y-0.5 hover:border-accent/40"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  {item.label}
                </p>
                <p className="group relative mt-2 w-fit text-base font-semibold text-fg">
  {item.value}
  <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full"></span>
</p>

              </a>
            ))}
          </div>
        </div>

        <FadeIn delay={0.08} className="section-card p-8 sm:p-10">
          <div className="flex items-center justify-between">
            <div>
              <span className="eyebrow">Send a message</span>
              <h3 className="mt-5 text-2xl font-semibold text-fg">Contact form UI</h3>
            </div>
            <Send className="text-accent" />
          </div>

          <form className="mt-8 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-muted">
                Name
                <input
                  type="text"
                  placeholder="Your name"
                  className="rounded-2xl border border-line bg-surface px-4 py-3 text-fg outline-none transition focus:border-accent"
                />
              </label>
              <label className="grid gap-2 text-sm text-muted">
                Email
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="rounded-2xl border border-line bg-surface px-4 py-3 text-fg outline-none transition focus:border-accent"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm text-muted">
              Subject
              <input
                type="text"
                placeholder="Project, role, or collaboration topic"
                className="rounded-2xl border border-line bg-surface px-4 py-3 text-fg outline-none transition focus:border-accent"
              />
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Message
              <textarea
                rows={6}
                placeholder="Share a quick overview of what you want to discuss."
                className="rounded-[1.5rem] border border-line bg-surface px-4 py-3 text-fg outline-none transition focus:border-accent"
              />
            </label>
            <button
              type="button"
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-accent dark:bg-white dark:text-ink"
            >
              Send Inquiry
            </button>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
