import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Page, PrimaryButton, SecondaryButton, colors } from '../components/ui';
import { useSession } from '../context/session';

export default function Welcome() {
  const { setRole } = useSession();
  return <Page title="Wigo" subtitle="Найдите людей, с которыми хочется что-то сделать.">
    <View style={styles.hero}><Text style={styles.mark}>W</Text><Text style={styles.heroText}>Не ждите планов.{`\n`}Создавайте их.</Text></View>
    <PrimaryButton label="Открыть демо" onPress={() => { setRole('user'); router.replace('/(user)/home'); }} />
    <SecondaryButton label="Демо организатора" onPress={() => { setRole('organizer'); router.replace('/(organizer)/home'); }} />
    <SecondaryButton label="Войти или зарегистрироваться" onPress={() => { setRole('user'); router.push('/auth/user'); }} />
    <Text style={styles.hint}>Демо открывается без регистрации. Реальные SMS, Apple и Google-входы подключаются после настройки безопасного серверного API.</Text>
  </Page>;
}
const styles = StyleSheet.create({ hero: { backgroundColor: colors.soft, borderRadius: 24, minHeight: 190, padding: 24, justifyContent: 'space-between' }, mark: { color: colors.violet, fontSize: 48, fontWeight: '900' }, heroText: { color: colors.text, fontSize: 25, fontWeight: '800', lineHeight: 31 }, hint: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' } });
