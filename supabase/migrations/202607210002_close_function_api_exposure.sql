-- Close the temporary public helper exposure created by the first migration.
create schema if not exists private;

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'staff'); $$;

drop policy "staff manage menu" on public.menu_items;
drop policy "users read own orders" on public.orders;
drop policy "staff update orders" on public.orders;
drop policy "users read own bookings" on public.bookings;
drop policy "staff update bookings" on public.bookings;

create policy "staff manage menu" on public.menu_items for all using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "users read own orders" on public.orders for select using (auth.uid() = user_id or (select private.is_staff()));
create policy "staff update orders" on public.orders for update using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "users read own bookings" on public.bookings for select using (auth.uid() = user_id or (select private.is_staff()));
create policy "staff update bookings" on public.bookings for update using ((select private.is_staff())) with check ((select private.is_staff()));

drop function public.is_staff();
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function private.is_staff() from public, anon, authenticated;
