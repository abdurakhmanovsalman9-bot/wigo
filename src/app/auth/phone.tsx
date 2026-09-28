import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { Note, Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';
import { useSession } from '../../context/session';
import { isBackendConfigured, normalizeKzPhone, supabase } from '../../services/supabase';

export default function Phone() {
  const [phone, setPhone] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);
  const { role } = useSession();
  const normalized = normalizeKzPhone(phone);
  const openDemo = () => router.replace(role === 'organizer' ? '/(organizer)/home' : '/(user)/home');

  if (!isBackendConfigured || !supabase) {
    return <Page title="Вход по номеру" subtitle="SMS-вход станет доступен после подключения сервера Wigo.">
      <TextInput value={phone} onChangeText={setPhone} placeholder="+7 700 000 00 00" keyboardType="phone-pad" style={styles.input}/>
      <PrimaryButton label="SMS-вход пока недоступен" disabled onPress={() => undefined}/>
      <SecondaryButton label="Открыть демо без входа" onPress={openDemo}/>
      <Note>Мы не имитируем отправку SMS: для неё нужны SMS-провайдер и серверный API.</Note>
    </Page>;
  }

  const client = supabase;
  const sendCode = async () => {
    if (!normalized) return;
    setLoading(true); setError(null);
    const { error: sendError } = await client.auth.signInWithOtp({ phone: normalized });
    setLoading(false);
    if (sendError) { setError('Не удалось отправить SMS. Проверьте номер или попробуйте позже.'); return; }
    router.push({ pathname: '/auth/code', params: { phone: normalized } });
  };

  return <Page title="Вход по номеру" subtitle="Отправим SMS с кодом подтверждения.">
    <TextInput value={phone} onChangeText={setPhone} placeholder="+7 700 000 00 00" keyboardType="phone-pad" textContentType="telephoneNumber" autoComplete="tel" style={styles.input}/>
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <PrimaryButton label={loading ? 'Отправляем…' : 'Получить код'} disabled={!normalized || loading} onPress={sendCode}/>
    <SecondaryButton label="Открыть демо без входа" onPress={openDemo}/>
  </Page>;
}
const styles = StyleSheet.create({ input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, fontSize: 17, minHeight: 58, paddingHorizontal: 16 }, error: { color: '#C2413B', fontSize: 14, textAlign: 'center' } });
