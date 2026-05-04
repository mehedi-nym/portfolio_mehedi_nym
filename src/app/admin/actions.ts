"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { staticPortfolioData } from "@/lib/portfolio-data";
import {
  adminDelete,
  adminDeleteAll,
  adminDeleteWhere,
  adminInsert,
  adminUpdate,
  uploadProjectImage,
} from "@/lib/supabase-portfolio";

const ADMIN_COOKIE = "portfolio_admin";

function requireAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }

  return password;
}

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value || null;
}

function numberValue(formData: FormData, key: string) {
  const value = Number(text(formData, key) || 0);
  return Number.isFinite(value) ? value : 0;
}

function booleanValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function lines(formData: FormData, key: string) {
  return text(formData, key)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function files(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

async function isAdmin() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === requireAdminPassword();
}

async function assertAdmin() {
  if (!(await isAdmin())) {
    redirect("/admin");
  }
}

function refreshAdmin() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function loginAdmin(formData: FormData) {
  const password = text(formData, "password");

  if (password !== requireAdminPassword()) {
    redirect("/admin?error=1");
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function seedStaticPortfolioData() {
  await assertAdmin();

  await Promise.all([
    adminDeleteAll("project_tech"),
    adminDeleteAll("project_images"),
    adminDeleteAll("project_highlights"),
    adminDeleteAll("experience_bullets"),
    adminDeleteAll("skills"),
  ]);

  await Promise.all([
    adminDeleteAll("projects"),
    adminDeleteAll("experiences"),
    adminDeleteAll("skill_groups"),
    adminDeleteAll("flagship_points"),
    adminDeleteAll("additional_projects"),
    adminDeleteAll("contacts"),
    adminDeleteAll("settings"),
  ]);

  await Promise.all([
    ...staticPortfolioData.navItems.map((item, index) =>
      adminInsert("settings", {
        type: "nav",
        label: item.label,
        value: item.href,
        href: item.href,
        order_no: index + 1,
        is_visible: true,
      })
    ),
    ...staticPortfolioData.heroMetrics.map((item, index) =>
      adminInsert("settings", {
        type: "hero_metric",
        label: item.label,
        value: item.value,
        href: item.href || null,
        order_no: index + 1,
        is_visible: true,
      })
    ),
    ...staticPortfolioData.flagshipPoints.map((point, index) =>
      adminInsert("flagship_points", {
        title: point.title,
        description: point.description,
        order_no: index + 1,
        is_visible: true,
      })
    ),
    ...staticPortfolioData.additionalProjects.map((item) =>
      adminInsert("additional_projects", {
        text: item.text,
        is_visible: true,
      })
    ),
    ...staticPortfolioData.contactLinks.map((item) =>
      adminInsert("contacts", {
        label: item.label,
        value: item.value,
        href: item.href,
        is_visible: true,
      })
    ),
  ]);

  for (const [index, group] of staticPortfolioData.skillGroups.entries()) {
    const saved = await adminInsert("skill_groups", {
      title: group.title,
      order_no: index + 1,
      is_visible: true,
    });
    const groupId = (saved[0] as unknown as { id: string }).id;

    await Promise.all(group.items.map((name) => adminInsert("skills", { group_id: groupId, name })));
  }

  for (const [index, experience] of staticPortfolioData.experiences.entries()) {
    const saved = await adminInsert("experiences", {
      company: experience.company,
      period: experience.period,
      role: experience.role,
      focus: experience.focus,
      order_no: index + 1,
      is_visible: true,
    });
    const experienceId = (saved[0] as unknown as { id: string }).id;

    await Promise.all(
      experience.bullets.map((textValue) =>
        adminInsert("experience_bullets", { experience_id: experienceId, text: textValue })
      )
    );
  }

  for (const [index, project] of staticPortfolioData.projects.entries()) {
    const saved = await adminInsert("projects", {
      title: project.title,
      category: project.category,
      summary: project.summary,
      live_url: project.liveUrl || null,
      featured: project.featured ?? false,
      visual_label: project.visualLabel,
      order_no: index + 1,
      is_visible: true,
    });
    const projectId = (saved[0] as unknown as { id: string }).id;

    await Promise.all([
      ...project.tech.map((tech) => adminInsert("project_tech", { project_id: projectId, tech })),
      ...(project.images || []).map((image_url) => adminInsert("project_images", { project_id: projectId, image_url })),
      ...project.highlights.map((textValue) =>
        adminInsert("project_highlights", { project_id: projectId, text: textValue })
      ),
    ]);
  }

  refreshAdmin();
}

export async function saveProject(formData: FormData) {
  await assertAdmin();
  const id = text(formData, "id");
  const payload = {
    title: text(formData, "title"),
    category: text(formData, "category"),
    summary: nullableText(formData, "summary"),
    live_url: nullableText(formData, "live_url"),
    featured: booleanValue(formData, "featured"),
    visual_label: nullableText(formData, "visual_label"),
    order_no: numberValue(formData, "order_no"),
    is_visible: booleanValue(formData, "is_visible"),
  };

  const saved = id ? await adminUpdate<typeof payload>("projects", id, payload) : await adminInsert<typeof payload>("projects", payload);
  const projectId = id || (saved[0] as unknown as { id: string }).id;

  await Promise.all([
    adminDeleteWhere("project_tech", "project_id", projectId),
    adminDeleteWhere("project_images", "project_id", projectId),
    adminDeleteWhere("project_highlights", "project_id", projectId),
  ]);

  const uploadedImages = await Promise.all(
    files(formData, "image_uploads").map((file) => uploadProjectImage(file, projectId))
  );
  const imageUrls = Array.from(new Set([...lines(formData, "images"), ...uploadedImages]));

  await Promise.all([
    ...lines(formData, "tech").map((tech) => adminInsert("project_tech", { project_id: projectId, tech })),
    ...imageUrls.map((image_url) => adminInsert("project_images", { project_id: projectId, image_url })),
    ...lines(formData, "highlights").map((textValue) => adminInsert("project_highlights", { project_id: projectId, text: textValue })),
  ]);

  refreshAdmin();
}

export async function deleteProject(formData: FormData) {
  await assertAdmin();
  const id = text(formData, "id");
  await Promise.all([
    adminDeleteWhere("project_tech", "project_id", id),
    adminDeleteWhere("project_images", "project_id", id),
    adminDeleteWhere("project_highlights", "project_id", id),
  ]);
  await adminDelete("projects", id);
  refreshAdmin();
}

export async function saveExperience(formData: FormData) {
  await assertAdmin();
  const id = text(formData, "id");
  const payload = {
    company: nullableText(formData, "company"),
    period: nullableText(formData, "period"),
    role: nullableText(formData, "role"),
    focus: nullableText(formData, "focus"),
    order_no: numberValue(formData, "order_no"),
    is_visible: booleanValue(formData, "is_visible"),
  };

  const saved = id ? await adminUpdate<typeof payload>("experiences", id, payload) : await adminInsert<typeof payload>("experiences", payload);
  const experienceId = id || (saved[0] as unknown as { id: string }).id;

  await adminDeleteWhere("experience_bullets", "experience_id", experienceId);
  await Promise.all(lines(formData, "bullets").map((textValue) => adminInsert("experience_bullets", { experience_id: experienceId, text: textValue })));
  refreshAdmin();
}

export async function deleteExperience(formData: FormData) {
  await assertAdmin();
  const id = text(formData, "id");
  await adminDeleteWhere("experience_bullets", "experience_id", id);
  await adminDelete("experiences", id);
  refreshAdmin();
}

export async function saveSkillGroup(formData: FormData) {
  await assertAdmin();
  const id = text(formData, "id");
  const payload = {
    title: text(formData, "title"),
    order_no: numberValue(formData, "order_no"),
    is_visible: booleanValue(formData, "is_visible"),
  };

  const saved = id ? await adminUpdate<typeof payload>("skill_groups", id, payload) : await adminInsert<typeof payload>("skill_groups", payload);
  const groupId = id || (saved[0] as unknown as { id: string }).id;

  await adminDeleteWhere("skills", "group_id", groupId);
  await Promise.all(lines(formData, "skills").map((name) => adminInsert("skills", { group_id: groupId, name })));
  refreshAdmin();
}

export async function deleteSkillGroup(formData: FormData) {
  await assertAdmin();
  const id = text(formData, "id");
  await adminDeleteWhere("skills", "group_id", id);
  await adminDelete("skill_groups", id);
  refreshAdmin();
}

export async function saveFlagshipPoint(formData: FormData) {
  await assertAdmin();
  const id = text(formData, "id");
  const payload = {
    title: nullableText(formData, "title"),
    description: nullableText(formData, "description"),
    order_no: numberValue(formData, "order_no"),
    is_visible: booleanValue(formData, "is_visible"),
  };

  id ? await adminUpdate<typeof payload>("flagship_points", id, payload) : await adminInsert<typeof payload>("flagship_points", payload);
  refreshAdmin();
}

export async function deleteFlagshipPoint(formData: FormData) {
  await assertAdmin();
  await adminDelete("flagship_points", text(formData, "id"));
  refreshAdmin();
}

export async function saveAdditionalProject(formData: FormData) {
  await assertAdmin();
  const id = text(formData, "id");
  const payload = {
    text: nullableText(formData, "text"),
    is_visible: booleanValue(formData, "is_visible"),
  };

  id ? await adminUpdate<typeof payload>("additional_projects", id, payload) : await adminInsert<typeof payload>("additional_projects", payload);
  refreshAdmin();
}

export async function deleteAdditionalProject(formData: FormData) {
  await assertAdmin();
  await adminDelete("additional_projects", text(formData, "id"));
  refreshAdmin();
}

export async function saveContact(formData: FormData) {
  await assertAdmin();
  const id = text(formData, "id");
  const payload = {
    label: nullableText(formData, "label"),
    value: nullableText(formData, "value"),
    href: nullableText(formData, "href"),
    is_visible: booleanValue(formData, "is_visible"),
  };

  id ? await adminUpdate<typeof payload>("contacts", id, payload) : await adminInsert<typeof payload>("contacts", payload);
  refreshAdmin();
}

export async function deleteContact(formData: FormData) {
  await assertAdmin();
  await adminDelete("contacts", text(formData, "id"));
  refreshAdmin();
}

export async function saveSetting(formData: FormData) {
  await assertAdmin();
  const id = text(formData, "id");
  const payload = {
    type: text(formData, "type"),
    label: nullableText(formData, "label"),
    value: nullableText(formData, "value"),
    href: nullableText(formData, "href"),
    order_no: numberValue(formData, "order_no"),
    is_visible: booleanValue(formData, "is_visible"),
  };

  id ? await adminUpdate<typeof payload>("settings", id, payload) : await adminInsert<typeof payload>("settings", payload);
  refreshAdmin();
}

export async function deleteSetting(formData: FormData) {
  await assertAdmin();
  await adminDelete("settings", text(formData, "id"));
  refreshAdmin();
}
