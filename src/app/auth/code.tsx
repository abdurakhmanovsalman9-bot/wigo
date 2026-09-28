import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { Card, Note, Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';
import { useSession } from '../../context/session';
import { supabase } from '../../services/supabase';

// Codes are verified only by Supabase Auth. Without a backend this screen never accepts a code.
export default function Code() {
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const { role } = useSession();
  const organizer = role === 'organizer';
  const [code, setCode] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);

  if (!supabase || !phone) {
    return <Page title="Код из SMS" subtitle="SMS-вход пока не подключён.">
      <Card title="Коды не отправляются" text="Подтверждение номера заработает после подключения SMS-провайдера и серверной проверки в Wigo." />
      <PrimaryButton label="Открыть демо без входа" onPress={() => router.replace(organizer ? '/(organizer)/home' : '/(user)/home')} />
      <SecondaryButton label="Подробнее об интеграции" onPress={() => router.push({ pathname: '/auth/integration', params: { provider: 'sms' } })} />
      <Note>Мы не имитируем проверку кода.</Note>
    </Page>;
  }

  const client = supabase;
  const verify = async () => {
    setLoading(true); setError(null);
    const { error: verifyError } = await client.auth.verifyOtp({ phone, token: code, type: 'sms' });
    setLoading(false);
    if (verifyError) { setError('Неверный или просроченный код.'); return; }
    router.replace(organizer ? '/onboarding/organizer-video' : '/onboarding/social-dna');
  };
  const resend = async () => {
    setError(null);
    const { error: sendError } = await client.auth.signInWithOtp({ phone });
    setError(sendError ? 'Не удалось отправить SMS повторно. Попробуйте позже.' : 'Новый код отправлен.');
  };

  return <Page title="Введите код" subtitle={`Мы отправили SMS на ${phone}.`}>
    <TextInput value={code} onChangeText={(value) => setCode(value.replace(/\D/g, ''))} placeholder="000000" maxLength={6} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="sms-otp" style={styles.code}/>
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <PrimaryButton label={loading ? 'Проверяем…' : 'Подтвердить'} disabled={code.length !== 6 || loading} onPress={verify}/>
    <SecondaryButton label="Отправить код ещё раз" onPress={resend}/>
  </Page>;
}
const styles = StyleSheet.create({ code: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: 10, minHeight: 70, paddingHorizontal: 24, textAlign: 'center' }, error: { color: colors.muted, fontSize: 14, textAlign: 'center' } });
