import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';

export default function SocialDnaVideo() {
  return <Page title="Как работает Social DNA" subtitle="Коротко и без сложных терминов.">
    <View style={styles.video}><View style={styles.play}><Text style={styles.playText}>▶</Text></View><Text style={styles.videoTitle}>Ваши ответы — ваши настройки встреч.</Text><Text style={styles.videoCopy}>Здесь позже появится короткое видео. Social DNA помогает подобрать формат, время и активности. Это не диагноз и не публичный рейтинг.</Text></View>
    <SecondaryButton label="Смотреть позже" onPress={() => router.push('/onboarding/quiz')} /><PrimaryButton label="Продолжить" onPress={() => router.push('/onboarding/quiz')} />
    <Pressable onPress={() => Alert.alert('Что сохраняется?', 'Только выбранные вами настройки. Их можно изменить или удалить в профиле.')}><Text style={styles.link}>Что именно сохраняется?</Text></Pressable>
  </Page>;
}
const styles = StyleSheet.create({ video: { backgroundColor: colors.soft, borderRadius: 24, minHeight: 270, padding: 24, justifyContent: 'flex-end' }, play: { alignItems: 'center', backgroundColor: colors.violet, borderRadius: 30, height: 60, justifyContent: 'center', marginBottom: 'auto', width: 60 }, playText: { color: colors.white, fontSize: 21 }, videoTitle: { color: colors.text, fontSize: 23, fontWeight: '800', lineHeight: 29 }, videoCopy: { color: colors.muted, fontSize: 15, lineHeight: 21, marginTop: 8 }, link: { color: colors.violet, fontSize: 14, fontWeight: '800', textAlign: 'center' } });
