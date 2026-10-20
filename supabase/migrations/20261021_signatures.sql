-- Signatures électroniques des documents du dossier (mandat, déclaration, pouvoir).
-- Une signature ne se modifie pas : le texte signé, son empreinte SHA-256, le nom, le téléphone
-- (vérifié par SMS ou non), l'image de la signature et l'heure sont figés à l'insertion.
create table if not exists public.signatures (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  doc_key text not null,
  title text not null,
  content text not null check (char_length(content) <= 20000),
  content_hash text not null,
  signer_name text not null,
  signer_phone text not null default '',
  phone_verified boolean not null default false,
  signature_png text not null check (char_length(signature_png) <= 400000),
  user_agent text not null default '',
  signed_at timestamptz not null default now(),
  unique (dossier_id, doc_key)
);

alter table public.signatures enable row level security;

-- Numéro de téléphone confirmé par SMS du compte connecté (chiffres seuls), ou null.
create or replace function public.my_confirmed_phone() returns text
language sql stable security definer set search_path = public, auth as $$
  select regexp_replace(phone, '\D', '', 'g') from auth.users where id = auth.uid() and phone_confirmed_at is not null
$$;

drop policy if exists "signature lue" on public.signatures;
create policy "signature lue" on public.signatures for select using (user_id = auth.uid() or public.is_conseiller());

drop policy if exists "signature ajoutee" on public.signatures;
create policy "signature ajoutee" on public.signatures for insert with check (
  user_id = auth.uid()
  and exists (select 1 from public.dossiers d where d.id = dossier_id and d.user_id = auth.uid())
  -- le téléphone n'est déclaré vérifié que s'il correspond au numéro confirmé du compte
  and (phone_verified = false or public.my_confirmed_phone() = regexp_replace(signer_phone, '\D', '', 'g'))
);

-- Le conseiller peut retirer une signature (document à refaire) ; personne ne peut la modifier.
drop policy if exists "signature retiree" on public.signatures;
create policy "signature retiree" on public.signatures for delete using (public.is_conseiller());

create or replace trigger signatures_touch after insert on public.signatures for each row execute function public.touch_dossier();
