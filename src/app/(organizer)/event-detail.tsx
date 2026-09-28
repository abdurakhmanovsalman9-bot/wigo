import { router, useLocalSearchParams } from 'expo-router';
import { Card, Page, PrimaryButton, SecondaryButton } from '../../components/ui';
import { useSession } from '../../context/session';

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { events, participants, saveEvent } = useSession();
  const event = events.find((item) => item.id === id) ?? events[0];
  const pending = participants.filter((item) => item.status === 'pending').length;
  if (!event) return <Page title="Событие не найдено" subtitle="Создайте новое событие."><PrimaryButton label="Создать событие" onPress={() => router.replace('/(organizer)/create-event')} /></Page>;
  const published = event.status === 'published';
  return <Page title={event.title} subtitle={`${event.when} · ${event.seats} мест · ${event.format}`}>
    <Card title={published ? 'Опубликовано в демо' : 'Черновик'} text={published ? 'Адрес показывается только после подтверждения участия.' : 'Событие пока не видно участникам.'} action={published ? undefined : 'Опубликовать в демо'} onPress={published ? undefined : () => saveEvent({ ...event, status: 'published' })} />
    <Card title="Заявки" text={pending ? `Ожидают ответа: ${pending}` : 'Новых заявок нет'} action="Открыть участников" onPress={() => router.push('/(organizer)/participants')} />
    <Card title="Сообщения" text="Участники уточняют детали в групповом чате." action="Открыть чат" onPress={() => router.push('/(organizer)/messages')} />
    <PrimaryButton label="Изменить событие" onPress={() => router.push({ pathname: '/(organizer)/create-event', params: { id: event.id } })} />
    <SecondaryButton label="К списку событий" onPress={() => router.replace('/(organizer)/events')} />
  </Page>;
}
