import { router } from 'expo-router';
import { Card, Page, PrimaryButton, SecondaryButton } from '../../components/ui';

export default function Whisper() {
  return <Page title="Whisper" subtitle="Короткое личное приглашение. Вы сами решаете, отвечать ли на него.">
    <Card title="Кофе в Bowler" text="Сегодня · в течение часа · Медеуский район" />
    <PrimaryButton label="Интересно" onPress={() => router.replace('/(user)/chats')} />
    <SecondaryButton label="Возможно позже" onPress={() => router.back()} />
    <SecondaryButton label="Не сейчас" onPress={() => router.replace('/(user)/home')} />
  </Page>;
}
