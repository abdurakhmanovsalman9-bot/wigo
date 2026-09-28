import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, Note, Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';
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
  return <Page title="Чем займёмся?" subtitle={socialDnaSummary(dna)}>
    <TextInput value={query} onChangeText={setQuery} placeholder="Например: хочу в кино сегодня" style={styles.input} returnKeyType="search" onSubmitEditing={search} />
    <PrimaryButton label="Найти" onPress={search} />
    {results ? <>
      {results.map((item) => <Card key={item.title} title={item.title} text={item.reason} action="Открыть" onPress={() => router.push(item.action === 'people' ? '/(user)/whisper' : '/(user)/plans')} />)}
      <Note>Демо-подборка: AI Concierge ещё не подключён, запрос никуда не отправляется.</Note>
    </> : null}
    <SecondaryButton label="Свободен сейчас" onPress={() => router.push('/(user)/now')} />
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

export function MobileTabs({ active }: { active: string }) { const items = [['Главная', '/(user)/home'], ['Обзор', '/(user)/explore'], ['Планы', '/(user)/plans'], ['Чаты', '/(user)/chats'], ['Вы', '/(user)/profile']] as const; return <View style={styles.nav}>{items.map(([name, path]) => <Text key={name} accessibilityRole="button" onPress={() => router.replace(path)} style={[styles.navText, active === name && styles.active]}>{name}</Text>)}</View>; }
const styles = StyleSheet.create({ input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, fontSize: 17, minHeight: 58, paddingHorizontal: 16 }, section: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 10 }, nav: { borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 16 }, navText: { color: colors.muted, fontSize: 12, fontWeight: '700', paddingVertical: 6 }, active: { color: colors.violet } });
