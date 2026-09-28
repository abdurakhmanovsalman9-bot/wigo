import { router } from 'expo-router';
import { Card, Page, PrimaryButton, SecondaryButton } from '../../components/ui';

export default function EventDetail() {
  return <Page title="Падел в субботу" subtitle="Суббота · 19:30 · Медеу · 4 места">
    <Card title="Публикация" text="Событие видно подходящим участникам. Адрес показывается только после подтверждения участия." />
    <Card title="Заявки" text="4 новых заявки · 1 место ожидает ответа" action="Открыть участников" onPress={() => router.push('/(organizer)/participants')} />
    <Card title="Сообщения" text="Участники могут уточнять детали в групповом чате." action="Открыть чат" onPress={() => router.push('/(organizer)/messages')} />
    <PrimaryButton label="Изменить событие" onPress={() => router.push('/(organizer)/create-event')} />
    <SecondaryButton label="К списку событий" onPress={() => router.replace('/(organizer)/events')} />
  </Page>;
}
