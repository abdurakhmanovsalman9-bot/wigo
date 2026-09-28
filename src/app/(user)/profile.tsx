import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput } from 'react-native';
import { Card, Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui'; import { useSession } from '../../context/session'; import { socialDnaSummary } from '../../domain/socialDna'; import { useRemote } from '../../hooks/useRemote'; import { fetchDisplayName, updateDisplayName } from '../../services/backend'; import { MobileTabs } from './home';
export default function Profile() {
  const { dna, setRole, resetDemo, userId, signOut } = useSession();
  const savedName = useRemote(userId ? `name-${userId}` : null, () => fetchDisplayName(userId as string));
  const [name, setName] = useState<string | null>(null);
  const nameValue = name ?? savedName.data ?? '';
  const saveName = () => { if (!userId || name === null) return; updateDisplayName(userId, name.trim()).then(() => setName(null)).then(savedName.reload).catch(() => Alert.alert('Не удалось сохранить имя', 'Проверьте интернет и попробуйте ещё раз.')); };
  return <Page title="Ваш профиль" subtitle="Настройки встреч и безопасности.">
    {userId ? <><Text style={styles.label}>Имя для других участников</Text><TextInput value={nameValue} onChangeText={setName} onBlur={saveName} onSubmitEditing={saveName} placeholder="Как вас называть" maxLength={60} style={styles.input}/></> : null}
    <Card title="Social DNA" text={socialDnaSummary(dna)} action="Изменить" onPress={() => router.push('/onboarding/quiz')}/>
    <Card title="Приватность" text="Whisper, геолокация и видимость профиля" action="Открыть" onPress={() => router.push('/(user)/privacy')}/>
    <PrimaryButton label={userId ? 'Режим организатора' : 'Перейти в демо организатора'} onPress={() => { setRole('organizer'); router.replace('/(organizer)/home'); }}/>
    {userId
      ? <SecondaryButton label="Выйти из аккаунта" onPress={() => { signOut().finally(() => router.replace('/')); }}/>
      : <SecondaryButton label="Выйти из демо" onPress={() => { resetDemo(); router.replace('/'); }}/>}
    <MobileTabs active="Вы"/>
  </Page>;
}
const styles = StyleSheet.create({ label: { color: colors.text, fontSize: 14, fontWeight: '800' }, input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, fontSize: 16, minHeight: 54, paddingHorizontal: 15 } });
