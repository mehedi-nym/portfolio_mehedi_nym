"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Filter, X } from "lucide-react";
import { useMemo, useState } from "react";
import { FadeIn } from "@/components/motion";
import { ProjectVisual } from "@/components/project-visual";
import { SectionHeading } from "@/components/section-heading";
import { projectFilters, projects, type Project } from "@/lib/portfolio-data";

export function ProjectsSection() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    if (filter === "All") {
      return projects;
    }

    return projects.filter((project) => project.category === filter);
  }, [filter]);

  return (
    <section id="projects" className="section-shell pt-24">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Projects"
          title="Systems built around real operations, admin control, and measurable workflow clarity."
          description="From ecommerce and HR tooling to dynamic CMS platforms and a flagship travel OTA, each project is framed around functionality, control, and execution quality."
        />
        <FadeIn className="flex flex-wrap gap-3">
          {projectFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                filter === item
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-surface text-muted hover:border-accent/30 hover:text-accent"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Filter size={14} />
                {item}
              </span>
            </button>
          ))}
        </FadeIn>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {filteredProjects.map((project, index) => (
          <FadeIn
            key={project.title}
            delay={index * 0.04}
            className={`group section-card overflow-hidden p-5 sm:p-6 ${
              project.featured ? "lg:col-span-2" : ""
            }`}
          >
            <div className={`grid gap-6 ${project.featured ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
              <ProjectVisual label={project.visualLabel} 
              images={project.images}
              featured={project.featured} />
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      {project.category}
                    </span>
                    {project.featured ? (
                      <span className="rounded-full border border-coral/20 bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
                        Featured system
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-fg sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-muted">{project.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.tech.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-line/80 bg-surface px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] text-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target={project.liveUrl.startsWith("http") ? "_blank" : undefined}
                      rel={project.liveUrl.startsWith("http") ? "noreferrer" : undefined}
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-accent dark:bg-white dark:text-ink"
                    >
                      Live
                      <ExternalLink size={15} />
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-fg hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.24 }}
              onClick={(event) => event.stopPropagation()}
              className="section-card max-h-[90vh] w-full max-w-3xl overflow-auto p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="eyebrow">{selectedProject.category}</span>
                  <h3 className="mt-5 text-3xl font-semibold text-fg">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-muted hover:text-fg"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="mt-5 text-base leading-8 text-muted">{selectedProject.summary}</p>
              <div className="mt-8 grid gap-4">
                {selectedProject.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-[1.5rem] border border-line/80 bg-surface/80 p-5 text-sm leading-7 text-fg"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
