import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';
import { useSession } from '../../context/session';

export default function SocialDnaVideo() {
  const { role } = useSession();
  return <Page title="Найдём твой ритм" subtitle="Короткая история о том, с кем и как тебе приятно проводить время.">
    <View style={styles.video}><View style={styles.play}><Text style={styles.playText}>✦</Text></View><Text style={styles.videoTitle}>Не «какой ты тип», а что тебе по душе.</Text><Text style={styles.videoCopy}>До 18 коротких вопросов. Следующий вопрос зависит от твоего ответа. В конце увидишь свою социальную ДНК и сможешь всё изменить.</Text></View>
    <PrimaryButton label="Начать тест" onPress={() => router.push('/onboarding/quiz')} />
    <SecondaryButton label="Пока пропустить" onPress={() => router.replace(role === 'organizer' ? '/(organizer)/home' : '/(user)/home')} />
    <Pressable onPress={() => Alert.alert('Что сохраняется?', 'Твои ответы используются для подбора формата и событий. Личные ответы не показываются в публичном профиле. Это не психологический диагноз.')}><Text style={styles.link}>Что именно сохраняется?</Text></Pressable>
  </Page>;
}
const styles = StyleSheet.create({ video: { backgroundColor: colors.soft, borderRadius: 24, minHeight: 270, padding: 24, justifyContent: 'flex-end' }, play: { alignItems: 'center', backgroundColor: colors.violet, borderRadius: 30, height: 60, justifyContent: 'center', marginBottom: 'auto', width: 60 }, playText: { color: colors.white, fontSize: 21 }, videoTitle: { color: colors.text, fontSize: 23, fontWeight: '800', lineHeight: 29 }, videoCopy: { color: colors.muted, fontSize: 15, lineHeight: 21, marginTop: 8 }, link: { color: colors.violet, fontSize: 14, fontWeight: '800', textAlign: 'center' } });
