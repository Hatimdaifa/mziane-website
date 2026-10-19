-- Espace client Mziane : profils, dossiers, documents, historique.
-- Chaque client ne voit que ses données ; les conseillers voient tout.

-- ── Profils ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  role text not null default 'client' check (role in ('client', 'conseiller')),
  created_at timestamptz not null default now()
);

create or replace function public.is_conseiller() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'conseiller');
$$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce(new.raw_user_meta_data->>'phone', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Un client ne peut pas se donner le rôle de conseiller
create or replace function public.protect_role() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- auth.uid() est vide pour les requêtes d'administration (SQL, clé service)
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_conseiller() then
    raise exception 'role non modifiable';
  end if;
  return new;
end $$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role before update on public.profiles
  for each row execute function public.protect_role();

alter table public.profiles enable row level security;
drop policy if exists "profil lu" on public.profiles;
create policy "profil lu" on public.profiles for select using (id = auth.uid() or public.is_conseiller());
drop policy if exists "profil modifie" on public.profiles;
create policy "profil modifie" on public.profiles for update using (id = auth.uid() or public.is_conseiller());

-- ── Dossiers (une commande = un dossier) ───────────────────────────────────
create table if not exists public.dossiers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference text not null unique,
  title text not null,
  spec jsonb not null default '{}'::jsonb,
  summary jsonb not null default '{}'::jsonb,
  status text not null default 'recu' check (status in ('recu', 'documents', 'en_cours', 'depose', 'termine', 'annule')),
  extra_docs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists dossiers_user_idx on public.dossiers(user_id);

alter table public.dossiers enable row level security;
drop policy if exists "dossier lu" on public.dossiers;
create policy "dossier lu" on public.dossiers for select using (user_id = auth.uid() or public.is_conseiller());
drop policy if exists "dossier cree" on public.dossiers;
create policy "dossier cree" on public.dossiers for insert with check (user_id = auth.uid() and status = 'recu' and extra_docs = '[]'::jsonb);
drop policy if exists "dossier suivi" on public.dossiers;
create policy "dossier suivi" on public.dossiers for update using (public.is_conseiller());

-- ── Documents ──────────────────────────────────────────────────────────────
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  requirement_id text,
  name text not null,
  path text not null unique,
  size bigint not null default 0,
  mime text not null default '',
  from_mziane boolean not null default false,
  status text not null default 'recu' check (status in ('recu', 'valide', 'a_refaire')),
  comment text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists documents_dossier_idx on public.documents(dossier_id);

alter table public.documents enable row level security;
drop policy if exists "document lu" on public.documents;
create policy "document lu" on public.documents for select using (user_id = auth.uid() or public.is_conseiller());
drop policy if exists "document ajoute" on public.documents;
create policy "document ajoute" on public.documents for insert with check (
  public.is_conseiller()
  or (user_id = auth.uid() and from_mziane = false and status = 'recu'
      and exists (select 1 from public.dossiers d where d.id = dossier_id and d.user_id = auth.uid()))
);
drop policy if exists "document revu" on public.documents;
create policy "document revu" on public.documents for update using (public.is_conseiller());
drop policy if exists "document retire" on public.documents;
create policy "document retire" on public.documents for delete using (
  public.is_conseiller() or (user_id = auth.uid() and from_mziane = false and status <> 'valide')
);

-- ── Historique du dossier ──────────────────────────────────────────────────
create table if not exists public.dossier_events (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  author uuid references auth.users(id) on delete set null,
  kind text not null default 'note' check (kind in ('note', 'statut', 'document', 'demande')),
  text text not null,
  created_at timestamptz not null default now()
);
create index if not exists events_dossier_idx on public.dossier_events(dossier_id);

alter table public.dossier_events enable row level security;
drop policy if exists "evenement lu" on public.dossier_events;
create policy "evenement lu" on public.dossier_events for select using (
  public.is_conseiller() or exists (select 1 from public.dossiers d where d.id = dossier_id and d.user_id = auth.uid())
);
drop policy if exists "evenement ajoute" on public.dossier_events;
create policy "evenement ajoute" on public.dossier_events for insert with check (
  author = auth.uid() and (
    public.is_conseiller()
    or (kind = 'document' and exists (select 1 from public.dossiers d where d.id = dossier_id and d.user_id = auth.uid()))
  )
);

create or replace function public.touch_dossier() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.dossiers set updated_at = now() where id = new.dossier_id;
  return new;
end $$;
drop trigger if exists documents_touch on public.documents;
create trigger documents_touch after insert or update on public.documents for each row execute function public.touch_dossier();
drop trigger if exists events_touch on public.dossier_events;
create trigger events_touch after insert on public.dossier_events for each row execute function public.touch_dossier();

-- ── Stockage privé : documents/<user_id>/<dossier_id>/<fichier> ────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', false, 10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "fichier lu" on storage.objects;
create policy "fichier lu" on storage.objects for select using (
  bucket_id = 'documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_conseiller())
);
drop policy if exists "fichier envoye" on storage.objects;
create policy "fichier envoye" on storage.objects for insert with check (
  bucket_id = 'documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_conseiller())
);
drop policy if exists "fichier retire" on storage.objects;
create policy "fichier retire" on storage.objects for delete using (
  bucket_id = 'documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_conseiller())
);

-- ── Réponses écrites (noms proposés, activité, capital...) ─────────────────
create table if not exists public.dossier_answers (
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  requirement_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  value text not null default '' check (char_length(value) <= 4000),
  updated_at timestamptz not null default now(),
  primary key (dossier_id, requirement_id)
);

alter table public.dossier_answers enable row level security;
drop policy if exists "reponse lue" on public.dossier_answers;
create policy "reponse lue" on public.dossier_answers for select using (user_id = auth.uid() or public.is_conseiller());
drop policy if exists "reponse ecrite" on public.dossier_answers;
create policy "reponse ecrite" on public.dossier_answers for insert with check (
  user_id = auth.uid() and exists (select 1 from public.dossiers d where d.id = dossier_id and d.user_id = auth.uid())
);
drop policy if exists "reponse modifiee" on public.dossier_answers;
create policy "reponse modifiee" on public.dossier_answers for update using (user_id = auth.uid() or public.is_conseiller());
