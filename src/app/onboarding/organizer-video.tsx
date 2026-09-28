import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';

export default function OrganizerVideo() {
  return <Page title="Режим организатора" subtitle="Коротко о вашей новой роли.">
    <View style={styles.video}><Text style={styles.symbol}>⌁</Text><Text style={styles.title}>Создавайте события. Собирайте людей.</Text><Text style={styles.copy}>Здесь позже появится видео 35–45 секунд: создание события, заявки, участники, чат и посещаемость.</Text></View>
    <SecondaryButton label="Смотреть позже" onPress={() => router.replace('/(organizer)/home')} /><PrimaryButton label="Открыть панель" onPress={() => router.replace('/(organizer)/home')} />
  </Page>;
}
const styles = StyleSheet.create({ video: { backgroundColor: colors.soft, borderRadius: 24, minHeight: 270, padding: 24, justifyContent: 'flex-end' }, symbol: { color: colors.violet, fontSize: 52, marginBottom: 'auto' }, title: { color: colors.text, fontSize: 23, fontWeight: '800', lineHeight: 29 }, copy: { color: colors.muted, fontSize: 15, lineHeight: 21, marginTop: 8 } });
