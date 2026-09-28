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
