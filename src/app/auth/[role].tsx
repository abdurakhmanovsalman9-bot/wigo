import * as AppleAuthentication from 'expo-apple-authentication';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { Card, Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';
import { useSession } from '../../context/session';
import { isAppleSignInAvailable, signInWithApple } from '../../services/appleAuth';
import { isBackendConfigured } from '../../services/supabase';

export default function Auth() {
  const { role } = useLocalSearchParams<{ role: 'user' | 'organizer' }>();
  const { setRole } = useSession();
  const organizer = role === 'organizer';
  const [appleAvailable, setAppleAvailable] = useState(false);
  useEffect(() => { isAppleSignInAvailable().then(setAppleAvailable).catch(() => setAppleAvailable(false)); }, []);
  const continueWithApple = async () => {
    setRole(organizer ? 'organizer' : 'user');
    try {
      if (await signInWithApple() === 'signed-in') router.replace(organizer ? '/onboarding/organizer-video' : '/onboarding/social-dna');
    } catch {
      Alert.alert('Вход через Apple не удался', 'Попробуйте ещё раз или войдите по номеру телефона.');
    }
  };
  const openDemo = () => {
    setRole(organizer ? 'organizer' : 'user');
    router.replace(organizer ? '/(organizer)/home' : '/(user)/home');
  };
  return <Page title={organizer ? 'Вход организатора' : 'Вход в Wigo'} subtitle={organizer ? 'Создавайте открытые события в приложении.' : 'От идей — к реальным встречам.'}>
    <Card title="Посмотреть приложение" text="Откройте полноценный демонстрационный профиль без SMS, Apple ID или Google-аккаунта." />
    <PrimaryButton label={organizer ? 'Открыть демо организатора' : 'Открыть демо-версию'} onPress={openDemo} />
    <SecondaryButton label={organizer ? 'Знакомство с ролью (демо)' : 'Пройти знакомство (демо)'} onPress={() => { setRole(organizer ? 'organizer' : 'user'); router.push(organizer ? '/onboarding/organizer-video' : '/onboarding/social-dna'); }} />
    {isBackendConfigured
      ? <SecondaryButton label="Войти по номеру телефона" onPress={() => { setRole(organizer ? 'organizer' : 'user'); router.push('/auth/phone'); }} />
      : <SecondaryButton label="SMS-вход — скоро" onPress={() => router.push({ pathname: '/auth/integration', params: { provider: 'sms' } })} />}
    {appleAvailable
      ? <AppleAuthentication.AppleAuthenticationButton buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE} buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK} cornerRadius={15} style={styles.apple} onPress={continueWithApple} />
      : <SecondaryButton label="Вход через Apple — скоро" onPress={() => router.push({ pathname: '/auth/integration', params: { provider: 'apple' } })}/>}
    <SecondaryButton label="Вход через Google — скоро" onPress={() => router.push({ pathname: '/auth/integration', params: { provider: 'google' } })}/>
    <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' }}>Продолжая, вы соглашаетесь с правилами Wigo и политикой приватности.</Text>
  </Page>;
}
const styles = StyleSheet.create({ apple: { height: 56, width: '100%' } });
