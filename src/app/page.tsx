import { AboutSection } from "@/components/about-section";
import { AdditionalProjectsSection } from "@/components/additional-projects-section";
import { ContactSection } from "@/components/contact-section";
import { ExperienceSection } from "@/components/experience-section";
import { FlagshipSection } from "@/components/flagship-section";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { ThemeProvider } from "@/components/theme-provider";
import { getPortfolioData } from "@/lib/supabase-portfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
  const portfolio = await getPortfolioData();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-bg text-fg">
        <Navbar navItems={portfolio.navItems} />
        <main>
          <HeroSection heroMetrics={portfolio.heroMetrics} />
          <AboutSection />
          <SkillsSection skillGroups={portfolio.skillGroups} />
          <ExperienceSection experiences={portfolio.experiences} />
          <ProjectsSection projects={portfolio.projects} projectFilters={portfolio.projectFilters} />
          <FlagshipSection flagshipPoints={portfolio.flagshipPoints} />
          <AdditionalProjectsSection additionalProjects={portfolio.additionalProjects} />
          <ContactSection contactLinks={portfolio.contactLinks} />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
