import { router } from 'expo-router';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { Card, Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';
import { useSession } from '../../context/session';

export default function Privacy() {
  const { dna, privacy, setPrivacy, persistSettings } = useSession();
  return <Page title="Приватность и доступы" subtitle="Эти настройки можно изменить в любой момент. Они не влияют на доступ к базовым функциям.">
    <Card title="Кто может отправить Whisper" text={privacy.whispers === 'verified' ? 'Только пользователи с подтверждённым профилем.' : 'Только люди из вашего списка друзей.'} />
    <View style={styles.row}><View style={styles.copy}><Text style={styles.title}>Только друзья</Text><Text style={styles.text}>Ограничить Whisper знакомыми людьми</Text></View><Switch value={privacy.whispers === 'friends'} onValueChange={(value) => setPrivacy({ ...privacy, whispers: value ? 'friends' : 'verified' })} trackColor={{ true: colors.violet }}/></View>
    <View style={styles.row}><View style={styles.copy}><Text style={styles.title}>Приблизительная геолокация</Text><Text style={styles.text}>Показываем район, но не точную точку</Text></View><Switch value={privacy.approximateLocation} onValueChange={(value) => setPrivacy({ ...privacy, approximateLocation: value })} trackColor={{ true: colors.violet }}/></View>
    <View style={styles.row}><View style={styles.copy}><Text style={styles.title}>Уведомления о планах</Text><Text style={styles.text}>Напоминания о времени, изменениях и сообщениях</Text></View><Switch value={privacy.planAlerts} onValueChange={(value) => setPrivacy({ ...privacy, planAlerts: value })} trackColor={{ true: colors.violet }}/></View>
    <PrimaryButton label="Сохранить" onPress={() => { persistSettings(dna, privacy).catch(() => Alert.alert('Не удалось сохранить', 'Настройки применены на устройстве, но не сохранены на сервере.')); router.back(); }} />
    <SecondaryButton label="Как это работает" onPress={() => router.push('/onboarding/social-dna')} />
  </Page>;
}
const styles = StyleSheet.create({ row: { alignItems: 'center', backgroundColor: colors.white, borderColor: colors.border, borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 12, justifyContent: 'space-between', padding: 16 }, copy: { flex: 1 }, title: { color: colors.text, fontSize: 16, fontWeight: '800' }, text: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 3 } });
