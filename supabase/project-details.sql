-- Run this once in Supabase SQL Editor.
-- Detail content stays small: text and URLs only. Video files are not uploaded.
create table if not exists public.project_details (
  id uuid not null default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  story text,
  benefits text[] default '{}',
  differences text[] default '{}',
  video_url text,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now(),
  constraint project_details_pkey primary key (id)
);
