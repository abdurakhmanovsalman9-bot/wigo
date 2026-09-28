-- Wigo initial schema: profiles, organizer events, participation requests and event chat.
-- Every table has RLS enabled; the mobile app only ever uses the anon key plus the user's session.

create extension if not exists pgcrypto;

-- Public profile: what other people may see.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 60),
  avatar_url text,
  is_organizer boolean not null default false,
  created_at timestamptz not null default now()
);

-- Private settings: only the owner can read or change them.
create table public.profile_settings (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  social_dna jsonb not null default '{}'::jsonb,
  whispers text not null default 'verified' check (whispers in ('verified', 'friends')),
  plan_alerts boolean not null default true,
  approximate_location boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  format text not null check (char_length(format) between 1 and 40),
  starts_at timestamptz,
  district text check (char_length(district) <= 80),
  -- Exact address is revealed only to confirmed participants (see event_private_details).
  seats integer not null check (seats between 2 and 100),
  status text not null default 'draft' check (status in ('draft', 'published', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index events_organizer_idx on public.events (organizer_id);
create index events_published_idx on public.events (starts_at) where status = 'published';

create table public.event_private_details (
  event_id uuid primary key references public.events (id) on delete cascade,
  address text check (char_length(address) <= 200)
);

create table public.event_participants (
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined')),
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);
create index event_participants_user_idx on public.event_participants (user_id);

create table public.event_messages (
  id bigint generated always as identity primary key,
  event_id uuid not null references public.events (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index event_messages_event_idx on public.event_messages (event_id, created_at);

-- Helpers are SECURITY DEFINER so policies can check membership without recursive RLS.
create function public.is_event_organizer(target_event uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.events e where e.id = target_event and e.organizer_id = auth.uid());
$$;

create function public.is_event_member(target_event uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_event_organizer(target_event) or exists (
    select 1 from public.event_participants p
    where p.event_id = target_event and p.user_id = auth.uid() and p.status = 'confirmed'
  );
$$;

create function public.is_published_event(target_event uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.events e where e.id = target_event and e.status = 'published');
$$;

revoke execute on function public.is_event_organizer(uuid), public.is_event_member(uuid), public.is_published_event(uuid) from public, anon;
grant execute on function public.is_event_organizer(uuid), public.is_event_member(uuid), public.is_published_event(uuid) to authenticated;

-- A profile and settings row is created for every new auth user.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.profile_settings (user_id) values (new.id);
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger events_touch before update on public.events for each row execute function public.touch_updated_at();
create trigger profile_settings_touch before update on public.profile_settings for each row execute function public.touch_updated_at();

-- Participants may only change who they are by leaving; only organizers change status.
create function public.guard_participant_update() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.event_id <> old.event_id or new.user_id <> old.user_id then
    raise exception 'participant identity is immutable';
  end if;
  return new;
end;
$$;
create trigger event_participants_guard before update on public.event_participants
  for each row execute function public.guard_participant_update();

alter table public.profiles enable row level security;
alter table public.profile_settings enable row level security;
alter table public.events enable row level security;
alter table public.event_private_details enable row level security;
alter table public.event_participants enable row level security;
alter table public.event_messages enable row level security;

-- profiles
create policy "profiles readable by signed-in users" on public.profiles for select to authenticated using (true);
create policy "profiles updated by owner" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- profile_settings
create policy "settings readable by owner" on public.profile_settings for select to authenticated using (user_id = auth.uid());
create policy "settings updated by owner" on public.profile_settings for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- events
create policy "published or own events readable" on public.events for select to authenticated
  using (status = 'published' or organizer_id = auth.uid());
create policy "organizers create own events" on public.events for insert to authenticated
  with check (organizer_id = auth.uid());
create policy "organizers update own events" on public.events for update to authenticated
  using (organizer_id = auth.uid()) with check (organizer_id = auth.uid());
create policy "organizers delete own events" on public.events for delete to authenticated
  using (organizer_id = auth.uid());

-- event_private_details
create policy "address visible to members" on public.event_private_details for select to authenticated
  using (public.is_event_member(event_id));
create policy "address managed by organizer" on public.event_private_details for all to authenticated
  using (public.is_event_organizer(event_id)) with check (public.is_event_organizer(event_id));

-- event_participants
create policy "participation visible to self and organizer" on public.event_participants for select to authenticated
  using (user_id = auth.uid() or public.is_event_organizer(event_id));
create policy "users request to join published events" on public.event_participants for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending' and public.is_published_event(event_id) and not public.is_event_organizer(event_id));
create policy "organizer decides on requests" on public.event_participants for update to authenticated
  using (public.is_event_organizer(event_id)) with check (public.is_event_organizer(event_id));
create policy "users leave events" on public.event_participants for delete to authenticated
  using (user_id = auth.uid() or public.is_event_organizer(event_id));

-- event_messages
create policy "members read event chat" on public.event_messages for select to authenticated
  using (public.is_event_member(event_id));
create policy "members write as themselves" on public.event_messages for insert to authenticated
  with check (sender_id = auth.uid() and public.is_event_member(event_id));

-- Live chat updates (RLS still applies to realtime subscribers).
do $$ begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.event_messages;
  end if;
end $$;
