# Wigo backend (Supabase)

`migrations/` holds the database schema. Every table has Row Level Security enabled.

## Tables

- **profiles.** Public name and avatar, readable by signed-in users.
- **profile_settings.** Social DNA and privacy settings, visible only to the owner.
- **events.** Organizer events. Drafts are visible only to their author.
- **event_private_details.** Exact address, visible to the organizer and confirmed participants only.
- **event_participants.** Join requests. A user can only create a `pending` request; only the organizer confirms it.
- **event_messages.** Event chat for the organizer and confirmed participants, with Realtime enabled.

## Apply the schema

Supabase Dashboard → SQL Editor → paste the migration file → Run.
Or use the Supabase CLI: `supabase db push`.

The app needs only `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
Never put the `service_role` key in the app or in Git.
