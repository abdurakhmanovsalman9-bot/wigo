import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../context/session';
import { ageMode } from '../../domain/eventSafety';

export default function UserLayout() {
  const { dna } = useSession();
  return ageMode(dna) === 'blocked' ? <Redirect href="/age-restriction" /> : <Stack screenOptions={{ headerShown: false }} />;
}
