import { createContext, ReactNode, useContext, useState } from 'react';
import { SocialDna } from '../domain/socialDna';
import { DemoEvent, DemoPlan, initialEvents, initialParticipants, initialPlans, Participant, ParticipantStatus } from '../domain/demo';

export type Role = 'user' | 'organizer';
export type PrivacyPreferences = { whispers: 'verified' | 'friends'; planAlerts: boolean; approximateLocation: boolean };
type Session = {
  role: Role; setRole: (role: Role) => void; dna: SocialDna; setDna: (dna: SocialDna) => void; privacy: PrivacyPreferences; setPrivacy: (privacy: PrivacyPreferences) => void;
  plans: DemoPlan[]; addPlan: (plan: Omit<DemoPlan, 'id'>) => void;
  events: DemoEvent[]; saveEvent: (event: Omit<DemoEvent, 'id'> & { id?: string }) => string;
  participants: Participant[]; setParticipantStatus: (id: string, status: ParticipantStatus) => void;
  userMessages: string[]; addUserMessage: (text: string) => void;
  organizerMessages: string[]; addOrganizerMessage: (text: string) => void;
  resetDemo: () => void;
};
const SessionContext = createContext<Session | undefined>(undefined);
const defaultPrivacy: PrivacyPreferences = { whispers: 'verified', planAlerts: true, approximateLocation: true };

// Demo data lives only in memory on the device: nothing is sent to a server or to other people.
export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('user');
  const [dna, setDna] = useState<SocialDna>({});
  const [privacy, setPrivacy] = useState<PrivacyPreferences>(defaultPrivacy);
  const [plans, setPlans] = useState<DemoPlan[]>(initialPlans);
  const [events, setEvents] = useState<DemoEvent[]>(initialEvents);
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [organizerMessages, setOrganizerMessages] = useState<string[]>([]);

  const addPlan = (plan: Omit<DemoPlan, 'id'>) => setPlans((current) => [{ ...plan, id: `plan-${Date.now()}` }, ...current]);
  const saveEvent = ({ id, ...event }: Omit<DemoEvent, 'id'> & { id?: string }) => {
    const eventId = id ?? `event-${Date.now()}`;
    setEvents((current) => current.some((item) => item.id === eventId)
      ? current.map((item) => item.id === eventId ? { ...event, id: eventId } : item)
      : [{ ...event, id: eventId }, ...current]);
    return eventId;
  };
  const setParticipantStatus = (id: string, status: ParticipantStatus) => setParticipants((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  const addUserMessage = (text: string) => setUserMessages((current) => [...current, text]);
  const addOrganizerMessage = (text: string) => setOrganizerMessages((current) => [...current, text]);
  const resetDemo = () => {
    setRole('user'); setDna({}); setPrivacy(defaultPrivacy); setPlans(initialPlans); setEvents(initialEvents);
    setParticipants(initialParticipants); setUserMessages([]); setOrganizerMessages([]);
  };

  return <SessionContext.Provider value={{ role, setRole, dna, setDna, privacy, setPrivacy, plans, addPlan, events, saveEvent, participants, setParticipantStatus, userMessages, addUserMessage, organizerMessages, addOrganizerMessage, resetDemo }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('SessionProvider is required');
  return value;
}
