import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectVisual } from "@/components/project-visual";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { getNavigationItems, getProjectBySlug } from "@/lib/supabase-portfolio";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [project, navItems] = await Promise.all([getProjectBySlug(slug), getNavigationItems()]);

  if (!project) notFound();

  return (
    <ThemeProvider>
      <main className="min-h-screen bg-bg text-fg">
        <Navbar navItems={navItems} />
        <div className="section-shell py-8 sm:py-12">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft size={16} /> Back to projects
          </Link>

          <header className="mt-12 max-w-4xl">
            <span className="eyebrow">{project.category}</span>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl leading-none sm:text-7xl">{project.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{project.summary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {project.tech.map((item) => <span key={item} className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted">{item}</span>)}
              {project.liveUrl?.startsWith("http") ? <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-ink">Visit live project <ExternalLink size={15} /></a> : null}
            </div>
          </header>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="section-card overflow-hidden p-4 sm:p-6">
              <ProjectVisual label={project.visualLabel} images={project.images} featured />
              {project.videoUrl ? <video className="mt-5 w-full rounded-2xl border border-line" controls playsInline poster={project.images?.[0]}><source src={project.videoUrl} /></video> : null}
            </div>
            <div className="grid gap-6">
              <InfoBlock title="The story" text={project.story} />
              <InfoList title="Benefits" items={project.benefits} />
              <InfoList title="What makes it different" items={project.differences} />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </ThemeProvider>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return <section className="section-card p-7"><p className="eyebrow">{title}</p><p className="mt-5 text-base leading-8 text-muted">{text}</p></section>;
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return <section className="section-card p-7"><p className="eyebrow">{title}</p><div className="mt-5 grid gap-3">{items.map((item) => <div key={item} className="border-l-2 border-accent pl-4 text-sm leading-7 text-muted">{item}</div>)}</div></section>;
}
