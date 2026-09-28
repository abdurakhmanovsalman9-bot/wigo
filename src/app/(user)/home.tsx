import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, Note, Page, PrimaryButton, colors } from '../../components/ui';
import { socialDnaSummary } from '../../domain/socialDna';
import { useSession } from '../../context/session';
import { askConcierge, ConciergeRecommendation } from '../../services/ai';
import { useRemote } from '../../hooks/useRemote';
import { fetchPublishedEvents } from '../../services/backend';

export default function Home() {
  const { dna, userId } = useSession();
  const upcoming = useRemote(userId ? `published-${userId}` : null, () => fetchPublishedEvents(userId as string));
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ConciergeRecommendation[] | null>(null);
  const search = async () => setResults(await askConcierge({ intent: query.trim(), city: 'Алматы', socialDna: dna }));
  return <Page title="Чем займёмся?" subtitle={socialDnaSummary(dna)} accessory={<Text style={styles.location}>Алматы · Медеу</Text>}>
    <View style={styles.concierge}>
      <Text style={styles.eyebrow}>AI CONCIERGE</Text>
      <Text style={styles.prompt}>Опишите свой план — подберём следующий шаг.</Text>
      <TextInput value={query} onChangeText={setQuery} placeholder="Падел вечером или кофе в субботу" style={styles.input} returnKeyType="search" onSubmitEditing={search} />
    </View>
    <PrimaryButton label="Найти" onPress={search} />
    {results ? <>
      {results.map((item) => <Card key={item.title} title={item.title} text={item.reason} action="Открыть" onPress={() => router.push(item.action === 'people' ? '/(user)/whisper' : '/(user)/plans')} />)}
      <Note>Демо-подборка: AI Concierge ещё не подключён, запрос никуда не отправляется.</Note>
    </> : null}
    <Pressable accessibilityRole="button" onPress={() => router.push('/(user)/now')} style={({ pressed }) => [styles.nowCard, pressed && styles.cardPressed]}>
      <View><Text style={styles.nowTitle}>Свободен сейчас</Text><Text style={styles.nowText}>Откройте спокойный формат встречи рядом</Text></View><Text style={styles.arrow}>→</Text>
    </Pressable>
    <Text style={styles.section}>Для вас</Text>
    {userId ? <>
      {upcoming.data?.slice(0, 3).map((event) => <Card key={event.id} title={event.title} text={`${event.when} · ${event.format}`} action="Подробнее" onPress={() => router.push({ pathname: '/(user)/event', params: { id: event.id } })} />)}
      {upcoming.data?.length === 0 ? <Note>Открытых событий пока нет.</Note> : null}
    </> : <>
      <Card title="Падел сегодня" text="19:30 · Медеу · 2 места" action="Подробнее" onPress={() => router.push('/(user)/plans')} />
      <Card title="Кофе и книги" text="Завтра · 3 человека · бесплатно" action="Открыть чат" onPress={() => router.push('/(user)/chats')} />
    </>}
    <MobileTabs active="Главная" />
  </Page>;
}

export function MobileTabs({ active }: { active: string }) { const items = [['Главная', '/(user)/home'], ['Обзор', '/(user)/explore'], ['Планы', '/(user)/plans'], ['Чаты', '/(user)/chats'], ['Вы', '/(user)/profile']] as const; return <View style={styles.nav}>{items.map(([name, path]) => <Pressable accessibilityRole="tab" key={name} onPress={() => router.replace(path)} style={styles.navButton}><Text style={[styles.navText, active === name && styles.active]}>{name}</Text>{active === name ? <View style={styles.activeDot}/> : null}</Pressable>)}</View>; }
const styles = StyleSheet.create({ location: { backgroundColor: colors.soft, borderRadius: 99, color: colors.violet, fontSize: 12, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 7 }, concierge: { backgroundColor: colors.soft, borderRadius: 22, gap: 8, padding: 18 }, eyebrow: { color: colors.violet, fontSize: 11, fontWeight: '900', letterSpacing: 1 }, prompt: { color: colors.text, fontSize: 18, fontWeight: '800', lineHeight: 24 }, input: { backgroundColor: colors.white, borderColor: '#DED7FF', borderRadius: 14, borderWidth: 1, color: colors.text, fontSize: 15, minHeight: 54, paddingHorizontal: 14 }, nowCard: { alignItems: 'center', backgroundColor: colors.white, borderColor: colors.border, borderRadius: 20, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 18 }, cardPressed: { backgroundColor: colors.soft }, nowTitle: { color: colors.text, fontSize: 17, fontWeight: '900' }, nowText: { color: colors.muted, fontSize: 13, marginTop: 4 }, arrow: { color: colors.violet, fontSize: 23, fontWeight: '800' }, section: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 10 }, nav: { borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 10 }, navButton: { alignItems: 'center', flex: 1, minHeight: 40, paddingTop: 3 }, navText: { color: colors.muted, fontSize: 11, fontWeight: '700' }, active: { color: colors.violet }, activeDot: { backgroundColor: colors.violet, borderRadius: 99, height: 4, marginTop: 5, width: 4 } });
