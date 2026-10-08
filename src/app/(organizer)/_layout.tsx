import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../context/session';
import { ageMode } from '../../domain/eventSafety';

export default function OrganizerLayout() {
  const { dna } = useSession();
  return ageMode(dna) !== 'adult' ? <Redirect href="/organizer-access" /> : <Stack screenOptions={{ headerShown: false }} />;
}
