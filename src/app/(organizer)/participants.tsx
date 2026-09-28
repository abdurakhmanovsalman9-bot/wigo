import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { Card, Note, Page, PrimaryButton } from '../../components/ui'; import { useSession } from '../../context/session'; import { participantStatusLabel } from '../../domain/demo'; import { OrganizerTabs } from './home';
export default function Participants() {
  const { participants, setParticipantStatus, userId, refreshOrganizerData } = useSession();
  useFocusEffect(useCallback(() => { refreshOrganizerData().catch(() => undefined); }, [refreshOrganizerData]));
  return <Page title="Участники" subtitle="Заявки и подтверждённые места.">
    {participants.map((person) => <Card key={person.id} title={person.name} text={`${participantStatusLabel[person.status]} · ${person.note}`}
      action={person.status === 'pending' ? 'Ответить на заявку' : 'Написать'}
      onPress={person.status === 'pending' ? () => Alert.alert(person.name, 'Подтвердить участие?', [
        { text: 'Отклонить', style: 'destructive', onPress: () => { setParticipantStatus(person.id, 'declined').catch(() => Alert.alert('Не удалось отклонить', 'Проверьте интернет и попробуйте ещё раз.')); } },
        { text: 'Отмена', style: 'cancel' },
        { text: 'Подтвердить', onPress: () => { setParticipantStatus(person.id, 'confirmed').catch(() => Alert.alert('Не удалось подтвердить', 'Проверьте интернет и попробуйте ещё раз.')); } },
      ]) : () => router.push('/(organizer)/messages')}/>)}
    <PrimaryButton label="Открыть событие" onPress={() => router.push('/(organizer)/event-detail')}/>
    {userId ? (participants.length ? null : <Note>Заявок пока нет.</Note>) : <Note>Демо: участники вымышленные, уведомления не отправляются.</Note>}
    <OrganizerTabs active="Участники"/>
  </Page>;
}
