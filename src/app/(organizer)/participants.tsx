import { router } from 'expo-router';
import { Card, Note, Page, PrimaryButton } from '../../components/ui'; import { useSession } from '../../context/session'; import { participantStatusLabel } from '../../domain/demo'; import { OrganizerTabs } from './home';
export default function Participants() {
  const { participants, setParticipantStatus } = useSession();
  return <Page title="Участники" subtitle="Заявки и подтверждённые места.">
    {participants.map((person) => <Card key={person.id} title={person.name} text={`${participantStatusLabel[person.status]} · ${person.note}`}
      action={person.status === 'pending' ? 'Подтвердить' : 'Написать'}
      onPress={person.status === 'pending' ? () => setParticipantStatus(person.id, 'confirmed') : () => router.push('/(organizer)/messages')}/>)}
    <PrimaryButton label="Открыть событие" onPress={() => router.push('/(organizer)/event-detail')}/>
    <Note>Демо: участники вымышленные, уведомления не отправляются.</Note>
    <OrganizerTabs active="Участники"/>
  </Page>;
}
