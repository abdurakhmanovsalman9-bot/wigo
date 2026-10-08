import type { EventSafety } from './eventSafety';
export type DemoPlan = { id: string; title: string; details: string };
export type DemoEvent = EventSafety & { id: string; title: string; format: string; when: string; seats: number; status: 'draft' | 'published' };
export type ParticipantStatus = 'pending' | 'confirmed' | 'declined';
export type Participant = { id: string; name: string; note: string; status: ParticipantStatus };

export const initialPlans: DemoPlan[] = [
  { id: 'padel', title: 'Падел в субботу', details: '19:30 · 4 участника · подтверждён' },
];

export const initialEvents: DemoEvent[] = [
  { id: 'padel', title: 'Падел в субботу', format: 'Спорт', when: 'Суббота · 19:30 · Медеу', seats: 4, status: 'published', ageRating: '16+', alcoholPolicy: 'none', venueType: 'public' },
  { id: 'walk', title: 'Прогулка у Медеу', format: 'Прогулка', when: 'Воскресенье · 11:00', seats: 8, status: 'draft', ageRating: '16+', alcoholPolicy: 'none', venueType: 'public' },
];

export const initialParticipants: Participant[] = [
  { id: 'aliya', name: 'Алия', note: 'Предпочитает активные встречи', status: 'pending' },
  { id: 'daniyar', name: 'Данияр', note: 'Придёт на событие', status: 'confirmed' },
];

export const participantStatusLabel: Record<ParticipantStatus, string> = {
  pending: 'Новая заявка', confirmed: 'Подтверждён', declined: 'Отклонён',
};
