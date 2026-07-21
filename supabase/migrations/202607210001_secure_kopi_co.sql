-- Apply through the connected Supabase project after explicit approval.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Kopi friend',
  role text not null default 'customer' check (role in ('customer', 'staff')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1), 'Kopi friend'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.bookings enable row level security;
alter table public.game_scores enable row level security;
alter table public.profiles enable row level security;

create schema if not exists private;

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'staff'); $$;

create policy "menu is public" on public.menu_items for select using (true);
create policy "staff manage menu" on public.menu_items for all using ((select private.is_staff())) with check ((select private.is_staff()));

create policy "users read own orders" on public.orders for select using (auth.uid() = user_id or (select private.is_staff()));
create policy "users place own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "staff update orders" on public.orders for update using ((select private.is_staff())) with check ((select private.is_staff()));

create policy "users read own bookings" on public.bookings for select using (auth.uid() = user_id or (select private.is_staff()));
create policy "users create own bookings" on public.bookings for insert with check (auth.uid() = user_id);
create policy "staff update bookings" on public.bookings for update using ((select private.is_staff())) with check ((select private.is_staff()));

create policy "users read own scores" on public.game_scores for select using (auth.uid() = user_id);
create policy "users create own scores" on public.game_scores for insert with check (auth.uid() = user_id);

create policy "users read own profile" on public.profiles for select using (auth.uid() = id);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists bookings_preferred_at_idx on public.bookings (preferred_at);
create index if not exists game_scores_user_score_idx on public.game_scores (user_id, score desc);

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function private.is_staff() from public, anon, authenticated;
