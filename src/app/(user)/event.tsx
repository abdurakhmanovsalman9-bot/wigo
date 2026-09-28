import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Card, Note, Page, PrimaryButton, SecondaryButton } from '../../components/ui';
import { useSession } from '../../context/session';
import { useRemote } from '../../hooks/useRemote';
import { fetchAddress, fetchEvent, leaveEvent, requestToJoin } from '../../services/backend';

const statusText = {
  pending: { title: 'Заявка отправлена', text: 'Ждём ответа организатора. Адрес откроется после подтверждения.' },
  confirmed: { title: 'Вы участвуете', text: 'Детали и общение — в чате события.' },
  declined: { title: 'Заявка отклонена', text: 'Организатор не смог подтвердить участие. Посмотрите другие события.' },
} as const;

export default function UserEvent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useSession();
  const event = useRemote(userId && id ? `event-${id}` : null, () => fetchEvent(id, userId as string));
  const confirmed = event.data?.myStatus === 'confirmed';
  const address = useRemote(confirmed ? `address-${id}` : null, () => fetchAddress(id));
  const [busy, setBusy] = useState(false);

  if (!userId) {
    return <Page title="Событие" subtitle="Заявки на реальные события доступны после входа.">
      <PrimaryButton label="Открыть демо-планы" onPress={() => router.replace('/(user)/plans')} />
      <SecondaryButton label="Назад" onPress={() => router.back()} />
    </Page>;
  }
  if (!event.data) {
    return <Page title="Событие" subtitle={event.loading ? 'Загружаем…' : 'Событие не найдено или уже закрыто.'}>
      {event.error ? <SecondaryButton label="Повторить" onPress={event.reload} /> : null}
      <SecondaryButton label="Назад" onPress={() => router.back()} />
    </Page>;
  }

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try { await action(); event.reload(); } catch { Alert.alert('Не получилось', 'Проверьте интернет и попробуйте ещё раз.'); } finally { setBusy(false); }
  };
  const { title, when, seats, format, myStatus } = event.data;

  return <Page title={title} subtitle={`${when} · ${format} · ${seats} мест`}>
    {myStatus ? <Card title={statusText[myStatus].title} text={statusText[myStatus].text} /> : <Card title="Открытое событие" text="Организатор увидит вашу заявку и подтвердит участие." />}
    {confirmed ? <Card title="Адрес" text={address.data ?? (address.loading ? 'Загружаем…' : 'Организатор ещё не указал адрес.')} /> : null}
    {!myStatus ? <PrimaryButton label={busy ? 'Отправляем…' : 'Подать заявку'} disabled={busy} onPress={() => run(() => requestToJoin(id, userId))} /> : null}
    {confirmed ? <PrimaryButton label="Открыть чат" onPress={() => router.push({ pathname: '/chat/[eventId]', params: { eventId: id } })} /> : null}
    {myStatus === 'pending' || confirmed ? <SecondaryButton label={confirmed ? 'Отказаться от участия' : 'Отозвать заявку'} onPress={() => run(() => leaveEvent(id, userId))} /> : null}
    <SecondaryButton label="Назад" onPress={() => router.back()} />
    <Note>Точная геолокация не публикуется.</Note>
  </Page>;
}
