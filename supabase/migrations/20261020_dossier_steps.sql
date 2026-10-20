-- Suivi des étapes des fiches procédures, par dossier. Réservé aux conseillers : le client ne voit rien.
create table if not exists public.dossier_steps (
  dossier_id uuid not null references public.dossiers (id) on delete cascade,
  step_key text not null,
  done boolean not null default true,
  note text not null default '',
  done_by uuid references auth.users (id),
  updated_at timestamptz not null default now(),
  primary key (dossier_id, step_key)
);

alter table public.dossier_steps enable row level security;

create policy "etape lue" on public.dossier_steps for select using (public.is_conseiller());
create policy "etape cochee" on public.dossier_steps for insert with check (public.is_conseiller());
create policy "etape modifiee" on public.dossier_steps for update using (public.is_conseiller());
create policy "etape retiree" on public.dossier_steps for delete using (public.is_conseiller());
