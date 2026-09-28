import { createContext, ReactNode, useContext, useState } from 'react';
import { SocialDna } from '../domain/socialDna';

export type Role = 'user' | 'organizer';
export type PrivacyPreferences = { whispers: 'verified' | 'friends'; planAlerts: boolean; approximateLocation: boolean };
type Session = { role: Role; setRole: (role: Role) => void; dna: SocialDna; setDna: (dna: SocialDna) => void; privacy: PrivacyPreferences; setPrivacy: (privacy: PrivacyPreferences) => void; };
const SessionContext = createContext<Session | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('user');
  const [dna, setDna] = useState<SocialDna>({});
  const [privacy, setPrivacy] = useState<PrivacyPreferences>({ whispers: 'verified', planAlerts: true, approximateLocation: true });
  return <SessionContext.Provider value={{ role, setRole, dna, setDna, privacy, setPrivacy }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('SessionProvider is required');
  return value;
}
