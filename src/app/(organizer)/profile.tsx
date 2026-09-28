import { router } from 'expo-router';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Card, Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui'; import { useSession } from '../../context/session'; import { OrganizerTabs } from './home';
export default function OrganizerProfile() {
  const { privacy, setPrivacy, setRole, resetDemo, userId, signOut } = useSession();
  return <Page title="Профиль организатора" subtitle="Управление публичной информацией и безопасностью.">
    <Card title="Проверка профиля — не подключена" text="Подтверждение личности будет через выбранного KYC-провайдера. До этого профиль не отмечается как проверенный."/>
    <View style={styles.row}><View style={styles.copy}><Text style={styles.title}>Уведомления</Text><Text style={styles.text}>Новые заявки, изменения событий и сообщения. Push пока не подключены.</Text></View><Switch value={privacy.planAlerts} onValueChange={(value) => setPrivacy({ ...privacy, planAlerts: value })} trackColor={{ true: colors.violet }}/></View>
    <PrimaryButton label="Мои события" onPress={() => router.replace('/(organizer)/events')}/>
    <SecondaryButton label={userId ? 'Режим пользователя' : 'Перейти в демо пользователя'} onPress={() => { setRole('user'); router.replace('/(user)/home'); }}/>
    {userId
      ? <SecondaryButton label="Выйти из аккаунта" onPress={() => { signOut().finally(() => router.replace('/')); }}/>
      : <SecondaryButton label="Выйти из демо" onPress={() => { resetDemo(); router.replace('/'); }}/>}
    <OrganizerTabs active="Профиль"/>
  </Page>;
}
const styles = StyleSheet.create({ row: { alignItems: 'center', backgroundColor: colors.white, borderColor: colors.border, borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 12, justifyContent: 'space-between', padding: 16 }, copy: { flex: 1 }, title: { color: colors.text, fontSize: 16, fontWeight: '800' }, text: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 3 } });
