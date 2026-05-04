import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { adminSelect, getPortfolioData } from "@/lib/supabase-portfolio";
import {
  deleteAdditionalProject,
  deleteContact,
  deleteExperience,
  deleteFlagshipPoint,
  deleteProject,
  deleteSetting,
  deleteSkillGroup,
  loginAdmin,
  logoutAdmin,
  saveAdditionalProject,
  saveContact,
  saveExperience,
  saveFlagshipPoint,
  saveProject,
  saveSetting,
  saveSkillGroup,
  seedStaticPortfolioData,
} from "./actions";

type AdminPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

type SettingRow = {
  id: string;
  type: string;
  label: string | null;
  value: string | null;
  href: string | null;
  order_no: number | null;
  is_visible: boolean | null;
};

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-accent";
const textareaClass =
  "min-h-28 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm leading-6 text-fg outline-none focus:border-accent";
const labelClass = "grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted";

async function hasAdminAccess() {
  const password = process.env.ADMIN_PASSWORD;
  const store = await cookies();
  return Boolean(password && store.get("portfolio_admin")?.value === password);
}

function SaveButton({ label = "Save" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent dark:bg-white dark:text-ink"
    >
      {label}
    </button>
  );
}

function DeleteButton() {
  return (
    <button
      type="submit"
      className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
    >
      Delete
    </button>
  );
}

function Visibility({ visible = true }: { visible?: boolean | null }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-muted">
      <input name="is_visible" type="checkbox" defaultChecked={visible ?? true} className="h-4 w-4 accent-teal-700" />
      Visible
    </label>
  );
}

function SectionShell({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="section-card scroll-mt-28 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-fg">{title}</h2>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p> : null}
        </div>
        <a href="#top" className="text-sm font-semibold text-accent hover:text-fg">
          Back to top
        </a>
      </div>
      <div className="mt-6 grid gap-5">{children}</div>
    </section>
  );
}

function FormCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-line/80 bg-surface/70 p-5">{children}</div>;
}

function EditPanel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <details className="rounded-2xl border border-line/80 bg-surface/70 p-5">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{eyebrow}</p> : null}
            <h3 className="mt-1 text-lg font-semibold text-fg">{title}</h3>
          </div>
          <span className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted">
            Edit
          </span>
        </div>
      </summary>
      <div className="mt-5">{children}</div>
    </details>
  );
}

function ImageManager({ images = [] }: { images?: string[] }) {
  return (
    <div className="grid gap-4">
      {images.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {images.map((image) => (
            <a
              key={image}
              href={image}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden rounded-xl border border-line bg-bg"
            >
              <img src={image} alt="" className="aspect-video w-full object-cover" />
            </a>
          ))}
        </div>
      ) : null}
      <label className={labelClass}>
        Current image URLs
        <textarea
          name="images"
          defaultValue={images.join("\n")}
          className={textareaClass}
          placeholder="Keep URLs here. Remove a line to remove that image from the project."
        />
      </label>
      <label className={labelClass}>
        Upload new images
        <input
          name="image_uploads"
          type="file"
          accept="image/*"
          multiple
          className="w-full rounded-xl border border-dashed border-line bg-bg px-3 py-4 text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-accent/50 dark:file:bg-white dark:file:text-ink"
        />
      </label>
    </div>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = searchParams ? await searchParams : {};
  const serviceReady = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const passwordReady = Boolean(process.env.ADMIN_PASSWORD);
  const authenticated = await hasAdminAccess();

  if (!serviceReady || !passwordReady) {
    return (
      <ThemeProvider>
        <main className="min-h-screen bg-bg px-6 py-12 text-fg">
          <div className="mx-auto max-w-2xl section-card p-8">
            <span className="eyebrow">Admin setup</span>
            <h1 className="mt-5 text-3xl font-semibold">Environment variables needed</h1>
            <p className="mt-4 text-muted">
              Add `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_PASSWORD` to `.env.local` before using this page.
            </p>
          </div>
        </main>
      </ThemeProvider>
    );
  }

  if (!authenticated) {
    return (
      <ThemeProvider>
        <main className="flex min-h-screen items-center justify-center bg-bg px-6 py-12 text-fg">
          <form action={loginAdmin} className="section-card w-full max-w-md p-8">
            <span className="eyebrow">Portfolio admin</span>
            <h1 className="mt-5 text-3xl font-semibold">Sign in</h1>
            {params.error ? <p className="mt-4 text-sm text-red-600">Wrong password.</p> : null}
            <label className={`${labelClass} mt-8`}>
              Password
              <input name="password" type="password" className={inputClass} autoFocus />
            </label>
            <div className="mt-6">
              <SaveButton label="Enter admin" />
            </div>
          </form>
        </main>
      </ThemeProvider>
    );
  }

  const [portfolio, settings] = await Promise.all([
    getPortfolioData({ includeHidden: true, service: true }),
    adminSelect<SettingRow>("settings", "?select=*&order=type.asc,order_no.asc,created_at.asc"),
  ]);

  return (
    <ThemeProvider>
      <main id="top" className="min-h-screen bg-bg px-6 py-10 text-fg">
        <div className="mx-auto grid max-w-7xl gap-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">Private editor</span>
              <h1 className="mt-5 text-4xl font-semibold">Portfolio Admin</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Add new content from the top of each section. Existing entries stay collapsed until you want to edit them.
              </p>
            </div>
            <form action={logoutAdmin}>
              <button className="rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-fg hover:border-accent/40">
                Logout
              </button>
            </form>
          </header>

          <nav className="sticky top-4 z-40 rounded-2xl border border-line/80 bg-card/90 p-3 shadow-soft backdrop-blur">
            <div className="flex flex-wrap gap-2">
              {[
                ["Projects", "#projects-admin"],
                ["Experience", "#experience-admin"],
                ["Skills", "#skills-admin"],
                ["Flagship", "#flagship-admin"],
                ["More", "#additional-admin"],
                ["Contacts", "#contacts-admin"],
                ["Settings", "#settings-admin"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-muted hover:border-accent/40 hover:text-accent"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>

          <section className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">First-time setup</p>
                <h2 className="mt-1 text-xl font-semibold text-fg">Save all static portfolio data to Supabase</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                  Use this before editing. It replaces current portfolio rows in Supabase with the data from `src/lib/portfolio-data.ts`, including projects, skills, experience, contacts, and image URLs.
                </p>
              </div>
              <form action={seedStaticPortfolioData}>
                <button
                  type="submit"
                  className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-ink"
                >
                  Save All Static Data
                </button>
              </form>
            </div>
          </section>

          <SectionShell
            id="projects-admin"
            title="Projects"
            description="Create a new project here, upload screenshots directly to Supabase Storage, and edit existing projects only when needed."
          >
            <ProjectCreateForm nextOrder={portfolio.projects.length + 1} />
            {portfolio.projects.map((project) => (
              <EditPanel
                key={project.id || project.title}
                title={project.title}
                eyebrow={`${project.category}${project.featured ? " / Featured" : ""}`}
              >
                <form action={saveProject} encType="multipart/form-data" className="grid gap-4">
                  <input type="hidden" name="id" defaultValue={project.id} />
                  <div className="grid gap-4 lg:grid-cols-3">
                    <label className={labelClass}>Title<input name="title" defaultValue={project.title} className={inputClass} /></label>
                    <label className={labelClass}>Category<select name="category" defaultValue={project.category} className={inputClass}>{["OTA", "CMS", "AI", "Ecommerce"].map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label className={labelClass}>Order<input name="order_no" type="number" defaultValue={project.orderNo ?? 0} className={inputClass} /></label>
                  </div>
                  <label className={labelClass}>Summary<textarea name="summary" defaultValue={project.summary} className={textareaClass} /></label>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <label className={labelClass}>Live URL<input name="live_url" defaultValue={project.liveUrl} className={inputClass} /></label>
                    <label className={labelClass}>Visual label<input name="visual_label" defaultValue={project.visualLabel} className={inputClass} /></label>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    <label className={labelClass}>Tech, one per line<textarea name="tech" defaultValue={project.tech.join("\n")} className={textareaClass} /></label>
                    <ImageManager images={project.images || []} />
                    <label className={labelClass}>Highlights, one per line<textarea name="highlights" defaultValue={project.highlights.join("\n")} className={textareaClass} /></label>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-5"><Visibility visible={project.isVisible} /><label className="inline-flex items-center gap-2 text-sm text-muted"><input name="featured" type="checkbox" defaultChecked={project.featured} className="h-4 w-4 accent-teal-700" />Featured</label></div>
                    <SaveButton />
                  </div>
                </form>
                <form action={deleteProject} className="mt-3"><input type="hidden" name="id" defaultValue={project.id} /><DeleteButton /></form>
              </EditPanel>
            ))}
          </SectionShell>

          <SectionShell id="experience-admin" title="Experience">
            {portfolio.experiences.map((item) => (
              <FormCard key={item.id || item.company}>
                <form action={saveExperience} className="grid gap-4">
                  <input type="hidden" name="id" defaultValue={item.id} />
                  <div className="grid gap-4 lg:grid-cols-4">
                    <label className={labelClass}>Company<input name="company" defaultValue={item.company} className={inputClass} /></label>
                    <label className={labelClass}>Period<input name="period" defaultValue={item.period} className={inputClass} /></label>
                    <label className={labelClass}>Role<input name="role" defaultValue={item.role} className={inputClass} /></label>
                    <label className={labelClass}>Order<input name="order_no" type="number" defaultValue={item.orderNo ?? 0} className={inputClass} /></label>
                  </div>
                  <label className={labelClass}>Focus<textarea name="focus" defaultValue={item.focus} className={textareaClass} /></label>
                  <label className={labelClass}>Bullets, one per line<textarea name="bullets" defaultValue={item.bullets.join("\n")} className={textareaClass} /></label>
                  <div className="flex items-center justify-between"><Visibility visible={item.isVisible} /><SaveButton /></div>
                </form>
                <form action={deleteExperience} className="mt-3"><input type="hidden" name="id" defaultValue={item.id} /><DeleteButton /></form>
              </FormCard>
            ))}
            <ExperienceCreateForm />
          </SectionShell>

          <SectionShell id="skills-admin" title="Skills">
            {portfolio.skillGroups.map((group) => (
              <FormCard key={group.id || group.title}>
                <form action={saveSkillGroup} className="grid gap-4">
                  <input type="hidden" name="id" defaultValue={group.id} />
                  <div className="grid gap-4 lg:grid-cols-[1fr_160px]">
                    <label className={labelClass}>Title<input name="title" defaultValue={group.title} className={inputClass} /></label>
                    <label className={labelClass}>Order<input name="order_no" type="number" defaultValue={group.orderNo ?? 0} className={inputClass} /></label>
                  </div>
                  <label className={labelClass}>Skills, one per line<textarea name="skills" defaultValue={group.items.join("\n")} className={textareaClass} /></label>
                  <div className="flex items-center justify-between"><Visibility visible={group.isVisible} /><SaveButton /></div>
                </form>
                <form action={deleteSkillGroup} className="mt-3"><input type="hidden" name="id" defaultValue={group.id} /><DeleteButton /></form>
              </FormCard>
            ))}
            <SkillCreateForm />
          </SectionShell>

          <SimpleSections settings={settings} portfolio={portfolio} />
        </div>
      </main>
    </ThemeProvider>
  );
}

function ProjectCreateForm({ nextOrder }: { nextOrder: number }) {
  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
      <form action={saveProject} encType="multipart/form-data" className="grid gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">New project</p>
          <h3 className="mt-1 text-xl font-semibold">Add another portfolio project</h3>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <label className={labelClass}>Title<input name="title" required className={inputClass} /></label>
          <label className={labelClass}>Category<select name="category" className={inputClass}>{["OTA", "CMS", "AI", "Ecommerce"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className={labelClass}>Order<input name="order_no" type="number" defaultValue={nextOrder} className={inputClass} /></label>
        </div>
        <label className={labelClass}>Summary<textarea name="summary" className={textareaClass} /></label>
        <div className="grid gap-4 lg:grid-cols-2">
          <label className={labelClass}>Live URL<input name="live_url" className={inputClass} /></label>
          <label className={labelClass}>Visual label<input name="visual_label" className={inputClass} /></label>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <label className={labelClass}>Tech<textarea name="tech" className={textareaClass} /></label>
          <ImageManager />
          <label className={labelClass}>Highlights<textarea name="highlights" className={textareaClass} /></label>
        </div>
        <div className="flex items-center justify-between"><Visibility /><SaveButton label="Add project" /></div>
      </form>
    </div>
  );
}

function ExperienceCreateForm() {
  return (
    <FormCard>
      <form action={saveExperience} className="grid gap-4">
        <h3 className="text-lg font-semibold">Add experience</h3>
        <div className="grid gap-4 lg:grid-cols-4">
          <label className={labelClass}>Company<input name="company" className={inputClass} /></label>
          <label className={labelClass}>Period<input name="period" className={inputClass} /></label>
          <label className={labelClass}>Role<input name="role" className={inputClass} /></label>
          <label className={labelClass}>Order<input name="order_no" type="number" defaultValue={0} className={inputClass} /></label>
        </div>
        <label className={labelClass}>Focus<textarea name="focus" className={textareaClass} /></label>
        <label className={labelClass}>Bullets<textarea name="bullets" className={textareaClass} /></label>
        <div className="flex items-center justify-between"><Visibility /><SaveButton label="Add experience" /></div>
      </form>
    </FormCard>
  );
}

function SkillCreateForm() {
  return (
    <FormCard>
      <form action={saveSkillGroup} className="grid gap-4">
        <h3 className="text-lg font-semibold">Add skill group</h3>
        <div className="grid gap-4 lg:grid-cols-[1fr_160px]">
          <label className={labelClass}>Title<input name="title" required className={inputClass} /></label>
          <label className={labelClass}>Order<input name="order_no" type="number" defaultValue={0} className={inputClass} /></label>
        </div>
        <label className={labelClass}>Skills<textarea name="skills" className={textareaClass} /></label>
        <div className="flex items-center justify-between"><Visibility /><SaveButton label="Add skill group" /></div>
      </form>
    </FormCard>
  );
}

function SimpleSections({ settings, portfolio }: { settings: SettingRow[]; portfolio: Awaited<ReturnType<typeof getPortfolioData>> }) {
  return (
    <>
      <SectionShell id="flagship-admin" title="Flagship Points">
        {portfolio.flagshipPoints.map((point) => (
          <FormCard key={point.id || point.title}>
            <form action={saveFlagshipPoint} className="grid gap-4">
              <input type="hidden" name="id" defaultValue={point.id} />
              <div className="grid gap-4 lg:grid-cols-[1fr_160px]">
                <label className={labelClass}>Title<input name="title" defaultValue={point.title} className={inputClass} /></label>
                <label className={labelClass}>Order<input name="order_no" type="number" defaultValue={point.orderNo ?? 0} className={inputClass} /></label>
              </div>
              <label className={labelClass}>Description<textarea name="description" defaultValue={point.description} className={textareaClass} /></label>
              <div className="flex items-center justify-between"><Visibility visible={point.isVisible} /><SaveButton /></div>
            </form>
            <form action={deleteFlagshipPoint} className="mt-3"><input type="hidden" name="id" defaultValue={point.id} /><DeleteButton /></form>
          </FormCard>
        ))}
        <FormCard><form action={saveFlagshipPoint} className="grid gap-4"><h3 className="text-lg font-semibold">Add flagship point</h3><label className={labelClass}>Title<input name="title" className={inputClass} /></label><label className={labelClass}>Description<textarea name="description" className={textareaClass} /></label><label className={labelClass}>Order<input name="order_no" type="number" defaultValue={0} className={inputClass} /></label><div className="flex items-center justify-between"><Visibility /><SaveButton label="Add point" /></div></form></FormCard>
      </SectionShell>

      <SectionShell id="additional-admin" title="Additional Projects">
        {portfolio.additionalProjects.map((item) => (
          <FormCard key={item.id || item.text}>
            <form action={saveAdditionalProject} className="grid gap-4"><input type="hidden" name="id" defaultValue={item.id} /><label className={labelClass}>Text<textarea name="text" defaultValue={item.text} className={textareaClass} /></label><div className="flex items-center justify-between"><Visibility visible={item.isVisible} /><SaveButton /></div></form>
            <form action={deleteAdditionalProject} className="mt-3"><input type="hidden" name="id" defaultValue={item.id} /><DeleteButton /></form>
          </FormCard>
        ))}
        <FormCard><form action={saveAdditionalProject} className="grid gap-4"><h3 className="text-lg font-semibold">Add additional project</h3><label className={labelClass}>Text<textarea name="text" className={textareaClass} /></label><div className="flex items-center justify-between"><Visibility /><SaveButton label="Add item" /></div></form></FormCard>
      </SectionShell>

      <SectionShell id="contacts-admin" title="Contacts">
        {portfolio.contactLinks.map((item) => (
          <FormCard key={item.id || item.label}>
            <form action={saveContact} className="grid gap-4"><input type="hidden" name="id" defaultValue={item.id} /><div className="grid gap-4 lg:grid-cols-3"><label className={labelClass}>Label<input name="label" defaultValue={item.label} className={inputClass} /></label><label className={labelClass}>Value<input name="value" defaultValue={item.value} className={inputClass} /></label><label className={labelClass}>Href<input name="href" defaultValue={item.href} className={inputClass} /></label></div><div className="flex items-center justify-between"><Visibility visible={item.isVisible} /><SaveButton /></div></form>
            <form action={deleteContact} className="mt-3"><input type="hidden" name="id" defaultValue={item.id} /><DeleteButton /></form>
          </FormCard>
        ))}
        <FormCard><form action={saveContact} className="grid gap-4"><h3 className="text-lg font-semibold">Add contact</h3><div className="grid gap-4 lg:grid-cols-3"><label className={labelClass}>Label<input name="label" className={inputClass} /></label><label className={labelClass}>Value<input name="value" className={inputClass} /></label><label className={labelClass}>Href<input name="href" className={inputClass} /></label></div><div className="flex items-center justify-between"><Visibility /><SaveButton label="Add contact" /></div></form></FormCard>
      </SectionShell>

      <SectionShell id="settings-admin" title="Settings">
        {settings.map((item) => (
          <FormCard key={item.id}>
            <form action={saveSetting} className="grid gap-4"><input type="hidden" name="id" defaultValue={item.id} /><div className="grid gap-4 lg:grid-cols-5"><label className={labelClass}>Type<input name="type" defaultValue={item.type} className={inputClass} /></label><label className={labelClass}>Label<input name="label" defaultValue={item.label || ""} className={inputClass} /></label><label className={labelClass}>Value<input name="value" defaultValue={item.value || ""} className={inputClass} /></label><label className={labelClass}>Href<input name="href" defaultValue={item.href || ""} className={inputClass} /></label><label className={labelClass}>Order<input name="order_no" type="number" defaultValue={item.order_no ?? 0} className={inputClass} /></label></div><div className="flex items-center justify-between"><Visibility visible={item.is_visible} /><SaveButton /></div></form>
            <form action={deleteSetting} className="mt-3"><input type="hidden" name="id" defaultValue={item.id} /><DeleteButton /></form>
          </FormCard>
        ))}
        <FormCard><form action={saveSetting} className="grid gap-4"><h3 className="text-lg font-semibold">Add nav item or hero metric</h3><div className="grid gap-4 lg:grid-cols-5"><label className={labelClass}>Type<select name="type" className={inputClass}><option value="hero_metric">hero_metric</option><option value="nav">nav</option></select></label><label className={labelClass}>Label<input name="label" className={inputClass} /></label><label className={labelClass}>Value<input name="value" className={inputClass} /></label><label className={labelClass}>Href<input name="href" className={inputClass} /></label><label className={labelClass}>Order<input name="order_no" type="number" defaultValue={0} className={inputClass} /></label></div><div className="flex items-center justify-between"><Visibility /><SaveButton label="Add setting" /></div></form></FormCard>
      </SectionShell>
    </>
  );
}
