-- Preparada para proyecto PULSE independiente. No se ha aplicado a ninguna base.
create table if not exists public.pulse_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  updated_at timestamptz not null default now()
);
create table if not exists public.pulse_training_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null default 0 check (revision >= 0),
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint pulse_state_is_object check (jsonb_typeof(state) = 'object')
);
alter table public.pulse_profiles enable row level security;
alter table public.pulse_training_state enable row level security;
revoke all on public.pulse_profiles from anon;
revoke all on public.pulse_training_state from anon;
grant select, insert, update, delete on public.pulse_profiles to authenticated;
grant select, insert, update, delete on public.pulse_training_state to authenticated;
create policy pulse_profiles_select_self on public.pulse_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy pulse_profiles_insert_self on public.pulse_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy pulse_profiles_update_self on public.pulse_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy pulse_profiles_delete_self on public.pulse_profiles for delete to authenticated using ((select auth.uid()) = user_id);
create policy pulse_state_select_self on public.pulse_training_state for select to authenticated using ((select auth.uid()) = user_id);
create policy pulse_state_insert_self on public.pulse_training_state for insert to authenticated with check ((select auth.uid()) = user_id);
create policy pulse_state_update_self on public.pulse_training_state for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy pulse_state_delete_self on public.pulse_training_state for delete to authenticated using ((select auth.uid()) = user_id);
