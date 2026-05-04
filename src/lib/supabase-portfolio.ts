import "server-only";

import {
  staticPortfolioData,
  type AdditionalProject,
  type ContactLink,
  type ExperienceItem,
  type FlagshipPoint,
  type HeroMetric,
  type PortfolioData,
  type Project,
  type ProjectCategory,
  type SkillGroup,
} from "@/lib/portfolio-data";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_IMAGE_BUCKET = process.env.SUPABASE_PROJECT_IMAGE_BUCKET || "project-images";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && (SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY));

type QueryOptions = {
  includeHidden?: boolean;
  service?: boolean;
};

type DbProject = {
  id: string;
  title: string;
  category: ProjectCategory;
  summary: string | null;
  live_url: string | null;
  featured: boolean | null;
  visual_label: string | null;
  order_no: number | null;
  is_visible: boolean | null;
};

type DbExperience = {
  id: string;
  company: string | null;
  period: string | null;
  role: string | null;
  focus: string | null;
  order_no: number | null;
  is_visible: boolean | null;
};

type DbSkillGroup = {
  id: string;
  title: string;
  order_no: number | null;
  is_visible: boolean | null;
};

type DbSetting = {
  id: string;
  type: string;
  label: string | null;
  value: string | null;
  href: string | null;
  order_no: number | null;
  is_visible: boolean | null;
};

type DbContact = {
  id: string;
  label: string | null;
  value: string | null;
  href: string | null;
  order_no?: number | null;
  is_visible: boolean | null;
};

type DbFlagshipPoint = {
  id: string;
  title: string | null;
  description: string | null;
  order_no: number | null;
  is_visible: boolean | null;
};

type DbAdditionalProject = {
  id: string;
  text: string | null;
  order_no?: number | null;
  is_visible: boolean | null;
};

function headers(service = false) {
  const apiKey = service ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !apiKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

function tableUrl(table: string, query = "") {
  if (!SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  return `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}${query}`;
}

function storageUrl(path: string) {
  if (!SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  return `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/${path}`;
}

async function request<T>(table: string, query = "", init: RequestInit = {}, service = false): Promise<T> {
  const response = await fetch(tableUrl(table, query), {
    ...init,
    headers: {
      ...headers(service),
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${table} request failed: ${response.status} ${message}`);
  }

  if (response.status === 204) {
    return [] as T;
  }

  return (await response.json()) as T;
}

function visibilityQuery(includeHidden = false) {
  return includeHidden ? "" : "&is_visible=eq.true";
}

function byOrder<T extends { order_no?: number | null; created_at?: string | null }>(items: T[]) {
  return [...items].sort((a, b) => (a.order_no ?? 0) - (b.order_no ?? 0));
}

export async function getPortfolioData(options: QueryOptions = {}): Promise<PortfolioData> {
  if (!isSupabaseConfigured) {
    return staticPortfolioData;
  }

  try {
    const includeHidden = options.includeHidden ?? false;
    const service = options.service ?? false;
    const visible = visibilityQuery(includeHidden);

    const [
      settings,
      skillGroups,
      skills,
      experiences,
      experienceBullets,
      projects,
      projectTech,
      projectImages,
      projectHighlights,
      flagshipPoints,
      additionalProjects,
      contacts,
    ] = await Promise.all([
      request<DbSetting[]>("settings", `?select=*&order=order_no.asc,created_at.asc${visible}`, {}, service),
      request<DbSkillGroup[]>("skill_groups", `?select=*&order=order_no.asc,created_at.asc${visible}`, {}, service),
      request<Array<{ id: string; group_id: string | null; name: string }>>("skills", "?select=*&order=created_at.asc", {}, service),
      request<DbExperience[]>("experiences", `?select=*&order=order_no.asc,created_at.asc${visible}`, {}, service),
      request<Array<{ id: string; experience_id: string | null; text: string | null }>>("experience_bullets", "?select=*&order=created_at.asc", {}, service),
      request<DbProject[]>("projects", `?select=*&order=order_no.asc,created_at.asc${visible}`, {}, service),
      request<Array<{ id: string; project_id: string | null; tech: string | null }>>("project_tech", "?select=*&order=created_at.asc", {}, service),
      request<Array<{ id: string; project_id: string | null; image_url: string | null }>>("project_images", "?select=*&order=created_at.asc", {}, service),
      request<Array<{ id: string; project_id: string | null; text: string | null }>>("project_highlights", "?select=*&order=created_at.asc", {}, service),
      request<DbFlagshipPoint[]>("flagship_points", `?select=*&order=order_no.asc,created_at.asc${visible}`, {}, service),
      request<DbAdditionalProject[]>("additional_projects", `?select=*&order=created_at.asc${visible}`, {}, service),
      request<DbContact[]>("contacts", `?select=*&order=created_at.asc${visible}`, {}, service),
    ]);

    const mappedSettings = byOrder(settings);
    const navItems = mappedSettings
      .filter((item) => item.type === "nav")
      .map((item) => ({ label: item.label || "", href: item.href || item.value || "#" }))
      .filter((item) => item.label && item.href);

    const heroMetrics = mappedSettings
      .filter((item) => item.type === "hero_metric")
      .map<HeroMetric>((item) => ({
        id: item.id,
        label: item.label || "",
        value: item.value || "",
        href: item.href || undefined,
        orderNo: item.order_no ?? 0,
        isVisible: item.is_visible ?? true,
      }))
      .filter((item) => item.label || item.value);

    const mappedSkillGroups = byOrder(skillGroups).map<SkillGroup>((group) => ({
      id: group.id,
      title: group.title,
      items: skills.filter((skill) => skill.group_id === group.id).map((skill) => skill.name),
      orderNo: group.order_no ?? 0,
      isVisible: group.is_visible ?? true,
    }));

    const mappedExperiences = byOrder(experiences).map<ExperienceItem>((experience) => ({
      id: experience.id,
      company: experience.company || "",
      period: experience.period || "",
      role: experience.role || "",
      focus: experience.focus || "",
      bullets: experienceBullets
        .filter((bullet) => bullet.experience_id === experience.id && bullet.text)
        .map((bullet) => bullet.text as string),
      orderNo: experience.order_no ?? 0,
      isVisible: experience.is_visible ?? true,
    }));

    const mappedProjects = byOrder(projects).map<Project>((project) => ({
      id: project.id,
      title: project.title,
      category: project.category,
      summary: project.summary || "",
      liveUrl: project.live_url || undefined,
      featured: project.featured ?? false,
      tech: projectTech.filter((item) => item.project_id === project.id && item.tech).map((item) => item.tech as string),
      images: projectImages
        .filter((item) => item.project_id === project.id && item.image_url)
        .map((item) => item.image_url as string),
      highlights: projectHighlights
        .filter((item) => item.project_id === project.id && item.text)
        .map((item) => item.text as string),
      visualLabel: project.visual_label || project.title,
      orderNo: project.order_no ?? 0,
      isVisible: project.is_visible ?? true,
    }));

    const mappedFlagshipPoints = byOrder(flagshipPoints).map<FlagshipPoint>((point) => ({
      id: point.id,
      title: point.title || "",
      description: point.description || "",
      orderNo: point.order_no ?? 0,
      isVisible: point.is_visible ?? true,
    }));

    const mappedAdditionalProjects = additionalProjects.map<AdditionalProject>((item) => ({
      id: item.id,
      text: item.text || "",
      orderNo: item.order_no ?? 0,
      isVisible: item.is_visible ?? true,
    }));

    const mappedContacts = contacts.map<ContactLink>((item) => ({
      id: item.id,
      label: item.label || "",
      value: item.value || "",
      href: item.href || "",
      orderNo: item.order_no ?? 0,
      isVisible: item.is_visible ?? true,
    }));

    return {
      navItems: navItems.length ? navItems : staticPortfolioData.navItems,
      heroMetrics: heroMetrics.length ? heroMetrics : staticPortfolioData.heroMetrics,
      skillGroups: mappedSkillGroups.length ? mappedSkillGroups : staticPortfolioData.skillGroups,
      experiences: mappedExperiences.length ? mappedExperiences : staticPortfolioData.experiences,
      projectFilters: staticPortfolioData.projectFilters,
      projects: mappedProjects.length ? mappedProjects : staticPortfolioData.projects,
      additionalProjects: mappedAdditionalProjects.length ? mappedAdditionalProjects : staticPortfolioData.additionalProjects,
      flagshipPoints: mappedFlagshipPoints.length ? mappedFlagshipPoints : staticPortfolioData.flagshipPoints,
      contactLinks: mappedContacts.length ? mappedContacts : staticPortfolioData.contactLinks,
    };
  } catch (error) {
    console.error(error);
    return staticPortfolioData;
  }
}

export async function adminSelect<T>(table: string, query = "?select=*") {
  return request<T[]>(table, query, {}, true);
}

export async function adminInsert<T>(table: string, payload: T) {
  return request<T[]>(table, "", { method: "POST", body: JSON.stringify(payload) }, true);
}

export async function adminUpdate<T>(table: string, id: string, payload: Partial<T>) {
  return request<T[]>(table, `?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(payload) }, true);
}

export async function adminDelete(table: string, id: string) {
  return request<unknown[]>(table, `?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" }, true);
}

export async function adminDeleteWhere(table: string, column: string, value: string) {
  return request<unknown[]>(
    table,
    `?${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}`,
    { method: "DELETE" },
    true
  );
}

export async function adminDeleteAll(table: string) {
  return request<unknown[]>(table, "?id=not.is.null", { method: "DELETE" }, true);
}

export async function uploadProjectImage(file: File, projectId: string) {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  const objectPath = `${projectId}/${Date.now()}-${crypto.randomUUID()}-${safeName || "project-image"}.${extension}`;

  const response = await fetch(storageUrl(`object/${PROJECT_IMAGE_BUCKET}/${objectPath}`), {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: file,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Image upload failed: ${response.status} ${message}`);
  }

  return storageUrl(`object/public/${PROJECT_IMAGE_BUCKET}/${objectPath}`);
}
