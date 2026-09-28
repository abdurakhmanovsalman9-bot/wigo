import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { updateDisplayName } from './backend';
import { supabase } from './supabase';

export type AppleSignInResult = 'signed-in' | 'canceled';

export async function isAppleSignInAvailable() {
  return Platform.OS === 'ios' && supabase !== null && AppleAuthentication.isAvailableAsync();
}

/** Native Sign in with Apple; the identity token is verified by Supabase Auth, never trusted locally. */
export async function signInWithApple(): Promise<AppleSignInResult> {
  if (!supabase) throw new Error('Сервер Wigo не подключён');
  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
    });
  } catch (error) {
    if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') return 'canceled';
    throw error;
  }
  if (!credential.identityToken) throw new Error('Apple не вернул токен входа');
  const { data, error } = await supabase.auth.signInWithIdToken({ provider: 'apple', token: credential.identityToken });
  if (error) throw error;
  // Apple shares the name only on the very first sign-in, so save it right away.
  const name = [credential.fullName?.givenName, credential.fullName?.familyName].filter(Boolean).join(' ');
  if (name && data.user) await updateDisplayName(data.user.id, name).catch(() => undefined);
  return 'signed-in';
}
