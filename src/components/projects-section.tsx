"use client";

import Image from "next/image";
import { ExternalLink, Filter, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { FadeIn } from "@/components/motion";
import { ProjectVisual } from "@/components/project-visual";
import { SectionHeading } from "@/components/section-heading";
import type { Project, ProjectCategory } from "@/lib/portfolio-data";
import { projectSlug } from "@/lib/project-slug";
import Link from "next/link";

type Props = {
  projects: Project[];
  projectFilters: Array<ProjectCategory | "All">;
};

export function ProjectsSection({ projects, projectFilters }: Props) {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("All");
  const [loadingProject, setLoadingProject] = useState<string | null>(null);

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
            className={`group section-card h-full overflow-hidden p-5 sm:p-6 ${
              project.featured ? "lg:col-span-2" : "min-h-[520px]"
            }`}
          >
            <div className={`grid h-full gap-6 ${project.featured ? "lg:min-h-[390px] lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
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
                  <p className="mt-4 line-clamp-3 text-base leading-8 text-muted">{project.summary}</p>
                  <Link
                    href={`/projects/${projectSlug(project.title)}`}
                    onClick={() => setLoadingProject(project.title)}
                    className="mt-3 inline-flex text-sm font-semibold text-accent hover:text-fg"
                  >
                    See more
                  </Link>
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
                <div className="mt-8 flex flex-col items-start gap-3">
                  <Link
                    href={`/projects/${projectSlug(project.title)}`}
                    onClick={() => setLoadingProject(project.title)}
                    className="rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-fg hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
                  >
                    Case study
                  </Link>
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target={project.liveUrl.startsWith("http") ? "_blank" : undefined}
                      rel={project.liveUrl.startsWith("http") ? "noreferrer" : undefined}
                      className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-accent hover:text-fg"
                    >
                      Visit live project
                      <ExternalLink size={15} />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {loadingProject ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-bg/90 px-6 backdrop-blur-md">
          <div className="flex flex-col items-center text-center">
            <div className="animate-pulse rounded-2xl border border-line/70 bg-card/80 px-8 py-6 shadow-soft">
              <Image src="/logo/digital-sign-nym.png" alt="Mehedi Hasan Nayem" width={240} height={100} priority className="h-auto w-48 dark:invert" />
            </div>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              <LoaderCircle size={15} className="animate-spin" /> Loading case study
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
