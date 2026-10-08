-- Apply before releasing the new app. Unknown metadata is never teen-safe.
alter table public.events
  add column age_rating text not null default 'unknown' check (age_rating in ('16+', '18+', 'unknown')),
  add column alcohol_policy text not null default 'unknown' check (alcohol_policy in ('none', 'present', 'unknown')),
  add column venue_type text not null default 'unknown' check (venue_type in ('public', 'private', 'unknown'));

alter table public.events add constraint adult_alcohol_events check (alcohol_policy <> 'present' or age_rating = '18+');

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create function private.viewer_age_mode() returns text
language sql stable security invoker set search_path = '' as $$
  select case
    when s.social_dna->>'ageBand' = 'under16' then 'blocked'
    when s.social_dna->>'ageBand' = '16-17' then 'teen'
    when s.social_dna->>'ageBand' in ('18-24', '25-34', '35-44', '45-54', '55+') then 'adult'
    else 'unknown' end
  from public.profile_settings s where s.user_id = auth.uid();
$$;

-- Avoid recursive events RLS. The lookup is scoped to this signed-in viewer.
create function private.viewer_can_access_event(target_event uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from public.events e
    where e.id = target_event and case
      when private.viewer_age_mode() = 'blocked' then false
      when private.viewer_age_mode() = 'adult' then true
      else e.age_rating = '16+' and e.alcohol_policy = 'none' and e.venue_type = 'public'
        and (e.title || ' ' || e.format) !~* '(алкогол|вино|винный|пиво|пивной|\mбар\M|коктейл|кальян|казино|азарт|18\s*\+|ночной клуб|стриптиз|alcohol|wine|beer|casino|hookah|striptease|nightclub)'
      end
  );
$$;
revoke all on function private.viewer_age_mode(), private.viewer_can_access_event(uuid) from public, anon;
grant execute on function private.viewer_age_mode(), private.viewer_can_access_event(uuid) to authenticated;

drop policy "published or own events readable" on public.events;
create policy "age appropriate events readable" on public.events for select to authenticated
  using ((status = 'published' and private.viewer_can_access_event(id))
    or (organizer_id = auth.uid() and private.viewer_age_mode() = 'adult'));

drop policy "organizers create own events" on public.events;
create policy "adult organizers create own events" on public.events for insert to authenticated
  with check (organizer_id = auth.uid() and private.viewer_age_mode() = 'adult');
drop policy "organizers update own events" on public.events;
create policy "adult organizers update own events" on public.events for update to authenticated
  using (organizer_id = auth.uid() and private.viewer_age_mode() = 'adult')
  with check (organizer_id = auth.uid() and private.viewer_age_mode() = 'adult');
drop policy "organizers delete own events" on public.events;
create policy "adult organizers delete own events" on public.events for delete to authenticated
  using (organizer_id = auth.uid() and private.viewer_age_mode() = 'adult');

create or replace function public.is_event_organizer(target_event uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and private.viewer_age_mode() = 'adult' and exists
    (select 1 from public.events e where e.id = target_event and e.organizer_id = auth.uid());
$$;
create or replace function public.is_event_member(target_event uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and private.viewer_can_access_event(target_event) and
    (public.is_event_organizer(target_event) or exists
      (select 1 from public.event_participants p where p.event_id = target_event
        and p.user_id = auth.uid() and p.status = 'confirmed'));
$$;

drop policy "users request to join published events" on public.event_participants;
create policy "users request to join eligible events" on public.event_participants for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending' and public.is_published_event(event_id)
    and private.viewer_can_access_event(event_id) and not public.is_event_organizer(event_id));
