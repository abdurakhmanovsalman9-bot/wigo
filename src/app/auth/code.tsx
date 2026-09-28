import { router } from 'expo-router';
import { Card, Note, Page, PrimaryButton, SecondaryButton } from '../../components/ui';
import { useSession } from '../../context/session';

// SMS codes are not sent yet, so this screen must not accept a code or pretend to verify one.
export default function Code() {
  const { role } = useSession();
  const organizer = role === 'organizer';
  return <Page title="Код из SMS" subtitle="SMS-вход пока не подключён.">
    <Card title="Коды не отправляются" text="Подтверждение номера заработает после подключения SMS-провайдера и серверной проверки в Wigo." />
    <PrimaryButton label="Открыть демо без входа" onPress={() => router.replace(organizer ? '/(organizer)/home' : '/(user)/home')} />
    <SecondaryButton label="Подробнее об интеграции" onPress={() => router.push({ pathname: '/auth/integration', params: { provider: 'sms' } })} />
    <Note>Мы не имитируем проверку кода.</Note>
  </Page>;
}
