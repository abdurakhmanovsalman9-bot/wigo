import { router } from 'expo-router';
import { Page, PrimaryButton, SecondaryButton } from '../components/ui';
import { useSession } from '../context/session';

export default function OrganizerAccess() {
  const { setRole } = useSession();
  return <Page title="Организация событий — с 18 лет" subtitle="В 16–17 можно участвовать в публичных событиях 16+ без алкоголя. Чтобы открыть панель организатора, сначала укажи возрастную группу.">
    <PrimaryButton label="Указать возраст в тесте" onPress={() => router.replace('/onboarding/quiz')} />
    <SecondaryButton label="Смотреть события" onPress={() => { setRole('user'); router.replace('/(user)/home'); }} />
  </Page>;
}
