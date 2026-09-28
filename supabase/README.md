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

## Connect the app

Copy `.env.example` to `.env` locally, or set the same two variables in EAS (expo.dev → Project → Environment variables) for builds.
Until both variables are set, the app stays in honest demo mode: SMS sign-in is shown as not connected.

Enable phone sign-in in Supabase: Authentication → Providers → Phone. It needs an SMS provider such as Twilio.

## Sign in with Apple (iOS)

1. Apple Developer → Identifiers → `app.wigo.mobile` → enable **Sign In with Apple**. EAS usually syncs this capability automatically during the build.
2. Supabase → Authentication → Providers → Apple → enable, and set **Client IDs** to `app.wigo.mobile`. Native iOS sign-in does not need the Apple secret key.

The button appears only on iOS when Supabase is configured. Otherwise the app shows the honest "coming soon" screen.
