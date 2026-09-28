import { Stack } from 'expo-router';
import { SessionProvider } from '../context/session';

export default function RootLayout() {
  return <SessionProvider><Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} /></SessionProvider>;
}
