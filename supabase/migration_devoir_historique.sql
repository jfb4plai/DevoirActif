-- devoiractif/supabase/migration_devoir_historique.sql
create table devoir_historique (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  niveau text not null,
  matiere text not null,
  competence text not null,
  format text not null,
  consigne_texte text not null,
  fiche_contenu text not null default '',
  created_at timestamptz default now()
);

create index idx_devoir_historique_user_id on devoir_historique(user_id);

alter table devoir_historique enable row level security;

create policy "own_rows_select" on devoir_historique
  for select using (auth.uid() = user_id);

create policy "own_rows_insert" on devoir_historique
  for insert with check (auth.uid() = user_id);
