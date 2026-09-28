import { router } from 'expo-router';
import { Card, Note, Page, PrimaryButton, SecondaryButton } from '../../components/ui'; import { useSession } from '../../context/session'; import { useRemote } from '../../hooks/useRemote'; import { fetchMyParticipations } from '../../services/backend'; import { MobileTabs } from './home';

const statusLabel = { pending: 'ждёт подтверждения', confirmed: 'подтверждено', declined: 'отклонено' } as const;

export default function Plans() {
  const { plans, userId } = useSession();
  const mine = useRemote(userId ? `participations-${userId}` : null, () => fetchMyParticipations(userId as string));
  return <Page title="Планы" subtitle="Предстоящие встречи и приглашения.">
    {userId ? <>
      {mine.data?.map((event) => <Card key={event.id} title={event.title} text={`${event.when} · ${event.myStatus ? statusLabel[event.myStatus] : ''}`} action="Открыть" onPress={() => router.push({ pathname: '/(user)/event', params: { id: event.id } })}/>)}
      {mine.data?.length === 0 ? <Note>Вы пока никуда не записались. Загляните в «Обзор».</Note> : null}
      {mine.error ? <SecondaryButton label="Не удалось загрузить — повторить" onPress={mine.reload}/> : null}
    </> : plans.map((plan) => <Card key={plan.id} title={plan.title} text={plan.details} action="Открыть чат" onPress={() => router.push('/(user)/chats')}/>)}
    {userId ? <PrimaryButton label="Найти событие" onPress={() => router.replace('/(user)/explore')}/> : <PrimaryButton label="Создать личный план" onPress={() => router.push('/(user)/create-plan')}/>}
    <MobileTabs active="Планы"/>
  </Page>;
}
