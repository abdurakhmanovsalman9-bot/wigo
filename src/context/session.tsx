import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { SocialDna } from '../domain/socialDna';
import { DemoEvent, DemoPlan, initialEvents, initialParticipants, initialPlans, Participant, ParticipantStatus } from '../domain/demo';
import { fetchMyEvents, fetchParticipants, fetchSettings, saveSettings, updateParticipantStatus, upsertEvent } from '../services/backend';
import { supabase } from '../services/supabase';

export type Role = 'user' | 'organizer';
export type PrivacyPreferences = { whispers: 'verified' | 'friends'; planAlerts: boolean; approximateLocation: boolean };
type Session = {
  role: Role; setRole: (role: Role) => void; dna: SocialDna; setDna: (dna: SocialDna) => void; privacy: PrivacyPreferences; setPrivacy: (privacy: PrivacyPreferences) => void;
  /** Supabase user id when signed in; null means the in-memory demo is used. */
  userId: string | null; signOut: () => Promise<void>;
  persistSettings: (dna: SocialDna, privacy: PrivacyPreferences) => Promise<void>;
  plans: DemoPlan[]; addPlan: (plan: Omit<DemoPlan, 'id'>) => void;
  events: DemoEvent[]; saveEvent: (event: Omit<DemoEvent, 'id'> & { id?: string }) => Promise<string>;
  participants: Participant[]; setParticipantStatus: (id: string, status: ParticipantStatus) => Promise<void>;
  userMessages: string[]; addUserMessage: (text: string) => void;
  organizerMessages: string[]; addOrganizerMessage: (text: string) => void;
  resetDemo: () => void;
};
const SessionContext = createContext<Session | undefined>(undefined);
const defaultPrivacy: PrivacyPreferences = { whispers: 'verified', planAlerts: true, approximateLocation: true };

// Without a signed-in user, data lives only in memory on the device and is never sent anywhere.
export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('user');
  const [dna, setDna] = useState<SocialDna>({});
  const [privacy, setPrivacy] = useState<PrivacyPreferences>(defaultPrivacy);
  const [userId, setUserId] = useState<string | null>(null);
  const currentUser = useRef<string | null>(null);
  const [plans, setPlans] = useState<DemoPlan[]>(initialPlans);
  const [events, setEvents] = useState<DemoEvent[]>(initialEvents);
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [organizerMessages, setOrganizerMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!supabase) return;
    // A signed-in account must never show demo events or participants as if they were real.
    const applyUser = (id: string | null) => {
      if (id && id !== currentUser.current) { setEvents([]); setParticipants([]); }
      currentUser.current = id; setUserId(id);
    };
    supabase.auth.getSession().then(({ data }) => applyUser(data.session?.user.id ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => applyUser(session?.user.id ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    Promise.all([fetchMyEvents(userId), fetchParticipants(userId), fetchSettings(userId)]).then(([myEvents, myParticipants, settings]) => {
      if (!active) return;
      setEvents(myEvents); setParticipants(myParticipants);
      if (settings) { setDna(settings.dna); setPrivacy(settings.privacy); }
    }).catch((error: unknown) => console.warn('Wigo: failed to load account data', error));
    return () => { active = false; };
  }, [userId]);

  const addPlan = (plan: Omit<DemoPlan, 'id'>) => setPlans((current) => [{ ...plan, id: `plan-${Date.now()}` }, ...current]);
  const saveEvent = async ({ id, ...event }: Omit<DemoEvent, 'id'> & { id?: string }) => {
    const saved = userId ? await upsertEvent(userId, { ...event, id }) : { ...event, id: id ?? `event-${Date.now()}` };
    setEvents((current) => current.some((item) => item.id === saved.id)
      ? current.map((item) => item.id === saved.id ? saved : item)
      : [saved, ...current]);
    return saved.id;
  };
  const setParticipantStatus = async (id: string, status: ParticipantStatus) => {
    if (userId) await updateParticipantStatus(id, status);
    setParticipants((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  };
  const persistSettings = async (nextDna: SocialDna, nextPrivacy: PrivacyPreferences) => {
    setDna(nextDna); setPrivacy(nextPrivacy);
    if (userId) await saveSettings(userId, nextDna, nextPrivacy);
  };
  const addUserMessage = (text: string) => setUserMessages((current) => [...current, text]);
  const addOrganizerMessage = (text: string) => setOrganizerMessages((current) => [...current, text]);
  const resetDemo = () => {
    setRole('user'); setDna({}); setPrivacy(defaultPrivacy); setPlans(initialPlans); setEvents(initialEvents);
    setParticipants(initialParticipants); setUserMessages([]); setOrganizerMessages([]);
  };
  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    resetDemo();
  };

  return <SessionContext.Provider value={{ role, setRole, dna, setDna, privacy, setPrivacy, userId, signOut, persistSettings, plans, addPlan, events, saveEvent, participants, setParticipantStatus, userMessages, addUserMessage, organizerMessages, addOrganizerMessage, resetDemo }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('SessionProvider is required');
  return value;
}
