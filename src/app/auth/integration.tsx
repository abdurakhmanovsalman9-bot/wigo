import { router, useLocalSearchParams } from 'expo-router';
import { Card, Page, PrimaryButton, SecondaryButton } from '../../components/ui';

const details = {
  apple: { title: 'Вход с Apple', text: 'Для реального входа нужен настроенный Sign in with Apple в App ID и защищённый серверный обмен токенами. В приложении не хранится ключ Apple.' },
  google: { title: 'Вход с Google', text: 'Для реального входа нужен OAuth-клиент Google и серверная проверка ID token. Клиентский секрет не должен попадать в мобильное приложение.' },
  sms: { title: 'Подтверждение номера', text: 'Код отправляет выбранный SMS-провайдер через сервер Wigo. До подключения провайдера коды не имитируются и сообщения не рассылаются.' },
} as const;

export default function IntegrationInfo() {
  const { provider } = useLocalSearchParams<{ provider: keyof typeof details }>();
  const current = details[provider] ?? details.sms;
  return <Page title={current.title} subtitle="Безопасная интеграция, а не ложная кнопка входа."><Card title="Что нужно подключить" text={current.text}/><Card title="Что уже есть" text="Экран, навигация и безопасная граница: секреты и проверка токенов остаются на сервере Wigo."/><PrimaryButton label="Вернуться ко входу" onPress={() => router.back()}/><SecondaryButton label="На старт" onPress={() => router.replace('/')}/></Page>;
}
