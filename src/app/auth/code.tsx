import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { Page, PrimaryButton, colors } from '../../components/ui';
import { useSession } from '../../context/session';

export default function Code() {
  const [code, setCode] = useState(''); const { role } = useSession();
  return <Page title="Введите код" subtitle="Мы отправили SMS с кодом подтверждения.">
    <TextInput value={code} onChangeText={setCode} placeholder="0000" maxLength={4} keyboardType="number-pad" style={styles.code}/>
    <PrimaryButton label="Подтвердить" disabled={code.length !== 4} onPress={() => router.replace(role === 'organizer' ? '/onboarding/organizer-video' : '/onboarding/social-dna')}/>
    <Pressable onPress={() => router.push({ pathname: '/auth/integration', params: { provider: 'sms' } })}><Text style={styles.link}>Не пришёл код?</Text></Pressable>
  </Page>;
}
const styles = StyleSheet.create({ code: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: 13, minHeight: 70, paddingHorizontal: 24, textAlign: 'center' }, link: { color: colors.violet, fontSize: 14, fontWeight: '800', textAlign: 'center' } });
