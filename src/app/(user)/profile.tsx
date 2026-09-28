import { router } from 'expo-router';
import { Card, Page, PrimaryButton, SecondaryButton } from '../../components/ui'; import { useSession } from '../../context/session'; import { socialDnaSummary } from '../../domain/socialDna'; import { MobileTabs } from './home';
export default function Profile() {
  const { dna, setRole, resetDemo } = useSession();
  return <Page title="Ваш профиль" subtitle="Настройки встреч и безопасности.">
    <Card title="Social DNA" text={socialDnaSummary(dna)} action="Изменить" onPress={() => router.push('/onboarding/quiz')}/>
    <Card title="Приватность" text="Whisper, геолокация и видимость профиля" action="Открыть" onPress={() => router.push('/(user)/privacy')}/>
    <PrimaryButton label="Перейти в демо организатора" onPress={() => { setRole('organizer'); router.replace('/(organizer)/home'); }}/>
    <SecondaryButton label="Выйти из демо" onPress={() => { resetDemo(); router.replace('/'); }}/>
    <MobileTabs active="Вы"/>
  </Page>;
}
