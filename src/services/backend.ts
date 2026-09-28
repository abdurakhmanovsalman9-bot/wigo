import { DemoEvent, Participant, ParticipantStatus } from '../domain/demo';
import { dateToLabel, labelToDate } from '../domain/schedule';
import { SocialDna } from '../domain/socialDna';
import { supabase } from './supabase';

type PrivacySettings = { whispers: 'verified' | 'friends'; planAlerts: boolean; approximateLocation: boolean };
type EventRow = { id: string; title: string; format: string; starts_at: string | null; seats: number; status: 'draft' | 'published' | 'cancelled' };
type ParticipantRow = { event_id: string; user_id: string; status: ParticipantStatus; events: { title: string } | null; profiles: { display_name: string } | null };

function client() {
  if (!supabase) throw new Error('Сервер Wigo не подключён');
  return supabase;
}

const toEvent = (row: EventRow): DemoEvent => ({
  id: row.id, title: row.title, format: row.format, when: dateToLabel(row.starts_at), seats: row.seats,
  status: row.status === 'published' ? 'published' : 'draft',
});

export async function fetchMyEvents(userId: string): Promise<DemoEvent[]> {
  const { data, error } = await client().from('events').select('id, title, format, starts_at, seats, status')
    .eq('organizer_id', userId).neq('status', 'cancelled').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as EventRow[]).map(toEvent);
}

export async function upsertEvent(userId: string, event: Omit<DemoEvent, 'id'> & { id?: string }): Promise<DemoEvent> {
  const row = { organizer_id: userId, title: event.title, format: event.format, starts_at: labelToDate(event.when)?.toISOString() ?? null, seats: event.seats, status: event.status };
  const query = event.id ? client().from('events').update(row).eq('id', event.id) : client().from('events').insert(row);
  const { data, error } = await query.select('id, title, format, starts_at, seats, status').single();
  if (error) throw error;
  return toEvent(data as EventRow);
}

export async function fetchParticipants(userId: string): Promise<Participant[]> {
  const { data, error } = await client().from('event_participants')
    .select('event_id, user_id, status, events!inner(title, organizer_id), profiles(display_name)')
    .eq('events.organizer_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data as unknown as ParticipantRow[]).map((row) => ({
    id: `${row.event_id}:${row.user_id}`, name: row.profiles?.display_name || 'Участник', note: row.events?.title ?? 'Событие', status: row.status,
  }));
}

export async function updateParticipantStatus(participantId: string, status: ParticipantStatus) {
  const [eventId, userId] = participantId.split(':');
  const { error } = await client().from('event_participants').update({ status }).eq('event_id', eventId).eq('user_id', userId);
  if (error) throw error;
}

export async function fetchSettings(userId: string): Promise<{ dna: SocialDna; privacy: PrivacySettings } | null> {
  const { data, error } = await client().from('profile_settings').select('social_dna, whispers, plan_alerts, approximate_location').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { dna: data.social_dna as SocialDna, privacy: { whispers: data.whispers, planAlerts: data.plan_alerts, approximateLocation: data.approximate_location } };
}

export async function saveSettings(userId: string, dna: SocialDna, privacy: PrivacySettings) {
  const { error } = await client().from('profile_settings')
    .update({ social_dna: dna, whispers: privacy.whispers, plan_alerts: privacy.planAlerts, approximate_location: privacy.approximateLocation })
    .eq('user_id', userId);
  if (error) throw error;
}

export type PublicEvent = DemoEvent & { myStatus: ParticipantStatus | null };
export type ChatMessage = { id: number; body: string; senderName: string; mine: boolean };
type PublicEventRow = EventRow & { event_participants: { status: ParticipantStatus; user_id: string }[] };

const toPublicEvent = (row: PublicEventRow, userId: string): PublicEvent => ({
  ...toEvent(row), myStatus: row.event_participants.find((item) => item.user_id === userId)?.status ?? null,
});

/** Published events of other organizers, with the signed-in user's request status (RLS hides others' requests). */
export async function fetchPublishedEvents(userId: string): Promise<PublicEvent[]> {
  const { data, error } = await client().from('events').select('id, title, format, starts_at, seats, status, event_participants(status, user_id)')
    .eq('status', 'published').neq('organizer_id', userId).order('starts_at', { ascending: true, nullsFirst: false }).limit(50);
  if (error) throw error;
  return (data as PublicEventRow[]).map((row) => toPublicEvent(row, userId));
}

export async function fetchMyParticipations(userId: string): Promise<PublicEvent[]> {
  const { data, error } = await client().from('events').select('id, title, format, starts_at, seats, status, event_participants!inner(status, user_id)')
    .eq('event_participants.user_id', userId).order('starts_at', { ascending: true, nullsFirst: false });
  if (error) throw error;
  return (data as PublicEventRow[]).map((row) => toPublicEvent(row, userId));
}

export async function fetchEvent(eventId: string, userId: string): Promise<PublicEvent | null> {
  const { data, error } = await client().from('events').select('id, title, format, starts_at, seats, status, event_participants(status, user_id)').eq('id', eventId).maybeSingle();
  if (error) throw error;
  return data ? toPublicEvent(data as PublicEventRow, userId) : null;
}

export async function requestToJoin(eventId: string, userId: string) {
  const { error } = await client().from('event_participants').insert({ event_id: eventId, user_id: userId });
  if (error) throw error;
}

export async function leaveEvent(eventId: string, userId: string) {
  const { error } = await client().from('event_participants').delete().eq('event_id', eventId).eq('user_id', userId);
  if (error) throw error;
}

export async function fetchMessages(eventId: string, userId: string): Promise<ChatMessage[]> {
  const { data, error } = await client().from('event_messages').select('id, body, sender_id, profiles(display_name)')
    .eq('event_id', eventId).order('created_at', { ascending: true }).limit(200);
  if (error) throw error;
  return (data as unknown as { id: number; body: string; sender_id: string; profiles: { display_name: string } | null }[]).map((row) => ({
    id: row.id, body: row.body, mine: row.sender_id === userId, senderName: row.sender_id === userId ? 'Вы' : row.profiles?.display_name || 'Участник',
  }));
}

export async function sendMessage(eventId: string, userId: string, body: string) {
  const { error } = await client().from('event_messages').insert({ event_id: eventId, sender_id: userId, body });
  if (error) throw error;
}

/** Calls onChange whenever a new message arrives in the event chat. Returns an unsubscribe function. */
export function subscribeToMessages(eventId: string, onChange: () => void): () => void {
  const channel = client().channel(`event-chat-${eventId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'event_messages', filter: `event_id=eq.${eventId}` }, onChange)
    .subscribe();
  return () => { client().removeChannel(channel); };
}

export async function fetchDisplayName(userId: string): Promise<string> {
  const { data, error } = await client().from('profiles').select('display_name').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data?.display_name ?? '';
}

export async function updateDisplayName(userId: string, displayName: string) {
  const { error } = await client().from('profiles').update({ display_name: displayName }).eq('id', userId);
  if (error) throw error;
}

/** Exact address: RLS returns it only to the organizer and confirmed participants. */
export async function fetchAddress(eventId: string): Promise<string | null> {
  const { data, error } = await client().from('event_private_details').select('address').eq('event_id', eventId).maybeSingle();
  if (error) throw error;
  return data?.address ?? null;
}

export async function saveAddress(eventId: string, address: string) {
  const { error } = await client().from('event_private_details').upsert({ event_id: eventId, address: address || null });
  if (error) throw error;
}
