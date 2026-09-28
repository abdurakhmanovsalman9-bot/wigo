import { router } from 'expo-router';
import { Card, Page, PrimaryButton } from '../../components/ui'; import { MobileTabs } from './home';
export default function Plans() { return <Page title="Планы" subtitle="Предстоящие встречи и приглашения."><Card title="Падел в субботу" text="19:30 · 4 участника · подтверждён" action="Открыть чат" onPress={() => router.push('/(user)/chats')}/><PrimaryButton label="Создать личный план" onPress={() => router.push('/(user)/create-plan')}/><MobileTabs active="Планы"/></Page>; }
