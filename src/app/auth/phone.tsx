import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';
import { useSession } from '../../context/session';

export default function Phone() {
  const [phone, setPhone] = useState(''); const { role } = useSession();
  return <Page title="Вход по номеру" subtitle="SMS-вход станет доступен после подключения защищённого сервиса сообщений.">
    <TextInput value={phone} onChangeText={setPhone} placeholder="+7 700 000 00 00" keyboardType="phone-pad" style={styles.input}/>
    <PrimaryButton label="SMS-вход пока недоступен" disabled onPress={() => undefined}/>
    <SecondaryButton label="Открыть демо без входа" onPress={() => router.replace(role === 'organizer' ? '/(organizer)/home' : '/(user)/home')}/>
    <Text style={styles.hint}>Мы не имитируем отправку SMS: для неё нужны SMS-провайдер и серверный API.</Text>
  </Page>;
}
const styles = StyleSheet.create({ input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, fontSize: 17, minHeight: 58, paddingHorizontal: 16 }, hint: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' } });
