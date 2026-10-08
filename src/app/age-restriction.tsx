import { router } from 'expo-router';
import { Page, PrimaryButton, SecondaryButton } from '../components/ui';
import { useSession } from '../context/session';

export default function AgeRestriction() {
  const { signOut } = useSession();
  return <Page title="Wigo доступен с 16 лет" subtitle="Когда тебе исполнится 16, здесь можно будет искать компанию и подходящие события.">
    <PrimaryButton label="Исправить ответ, если ошибся" onPress={() => router.replace('/onboarding/quiz')} />
    <SecondaryButton label="На старт" onPress={() => { void signOut().then(() => router.replace('/')); }} />
  </Page>;
}
