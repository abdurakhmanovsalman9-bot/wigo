import { router } from 'expo-router';
import { Card, Note, Page, PrimaryButton, SecondaryButton } from '../../components/ui'; import { useSession } from '../../context/session'; import { useRemote } from '../../hooks/useRemote'; import { fetchPublishedEvents } from '../../services/backend'; import { MobileTabs } from './home';
import { eventDnaFit, rankEventsForDna } from '../../domain/dnaRecommendations';

const statusLabel = { pending: 'заявка отправлена', confirmed: 'вы участвуете', declined: 'заявка отклонена' } as const;

export default function Explore() {
  const { userId, dna } = useSession();
  const events = useRemote(userId ? `published-${userId}` : null, () => fetchPublishedEvents(userId as string));
  if (!userId) {
    return <Page title="Обзор" subtitle="Люди, события, сообщества и места."><Card title="Люди рядом" text="Демо: подбор людей ещё не подключён" action="Открыть Whisper" onPress={() => router.push('/(user)/whisper')}/><Card title="Открытые события" text="Сегодня и на выходных" action="Смотреть планы" onPress={() => router.push('/(user)/plans')}/><PrimaryButton label="Настроить предпочтения" onPress={() => router.push('/onboarding/quiz')}/><MobileTabs active="Обзор"/></Page>;
  }
  return <Page title="Обзор" subtitle="Открытые события рядом с вами.">
    {rankEventsForDna(events.data ?? [], dna).map((event) => <Card key={event.id} title={event.title} text={`${event.when} · ${event.format} · ${eventDnaFit(event, dna).reason}${event.myStatus ? ` · ${statusLabel[event.myStatus]}` : ''}`} action="Подробнее" onPress={() => router.push({ pathname: '/(user)/event', params: { id: event.id } })}/>)}
    {events.loading && !events.data ? <Note>Загружаем события…</Note> : null}
    {events.data && rankEventsForDna(events.data, dna).length === 0 ? <Note>Подходящих открытых событий пока нет.</Note> : null}
    {events.error ? <SecondaryButton label="Не удалось загрузить — повторить" onPress={events.reload}/> : null}
    <PrimaryButton label="Настроить предпочтения" onPress={() => router.push('/onboarding/quiz')}/>
    <MobileTabs active="Обзор"/>
  </Page>;
}
