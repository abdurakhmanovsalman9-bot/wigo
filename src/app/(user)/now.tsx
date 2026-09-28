import { router } from 'expo-router';
import { Card, Page, PrimaryButton, SecondaryButton } from '../../components/ui';

export default function Now() {
  return <Page title="Свободен сейчас" subtitle="Показываем только ваш район и только тем, кому вы разрешили Whisper.">
    <Card title="Ваш статус" text="Вы видимы до 21:00. Точная геолокация никому не показывается." />
    <Card title="Кофе рядом" text="2 человека · Медеуский район · готовы в течение часа" action="Открыть Whisper" onPress={() => router.push('/(user)/whisper')} />
    <SecondaryButton label="Настроить видимость" onPress={() => router.push('/(user)/privacy')} />
    <PrimaryButton label="Выключить статус" onPress={() => router.replace('/(user)/home')} />
  </Page>;
}
