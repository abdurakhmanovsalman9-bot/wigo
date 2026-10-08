import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, Note, Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';
import { initialEvents } from '../../domain/demo';
import { ageMode } from '../../domain/eventSafety';
import { socialDnaSummary } from '../../domain/socialDna';
import { useSession } from '../../context/session';
import { askConcierge, ConciergeRecommendation } from '../../services/ai';
import { useRemote } from '../../hooks/useRemote';
import { fetchPublishedEvents } from '../../services/backend';
import { eventDnaFit, rankEventsForDna } from '../../domain/dnaRecommendations';

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
    {ageMode(dna) !== 'adult' ? <Note>Показываем только события 16+ без алкоголя в публичных местах. Для остальных событий нужны известные возрастные условия.</Note> : null}
    {userId ? <>
      {rankEventsForDna(upcoming.data ?? [], dna).slice(0, 3).map((event) => <Card key={event.id} title={event.title} text={`${event.when} · ${event.format} · ${eventDnaFit(event, dna).reason}`} action="Подробнее" onPress={() => router.push({ pathname: '/(user)/event', params: { id: event.id } })} />)}
      {upcoming.data && rankEventsForDna(upcoming.data, dna).length === 0 ? <Note>Подходящих открытых событий пока нет.</Note> : null}
    </> : <>
      {rankEventsForDna(initialEvents.filter((event) => event.status === 'published'), dna).map((event) => <Card key={event.id} title={event.title} text={event.when + ' · ' + eventDnaFit(event, dna).reason} action="Подробнее" onPress={() => router.push('/(user)/plans')} />)}
      <Note>Это демонстрационные события.</Note>
    </>}
    <MobileTabs active="Главная" />
  </Page>;
}

export function MobileTabs({ active }: { active: string }) { const items = [['Главная', '/(user)/home'], ['Обзор', '/(user)/explore'], ['Планы', '/(user)/plans'], ['Чаты', '/(user)/chats'], ['Вы', '/(user)/profile']] as const; return <View style={styles.nav}>{items.map(([name, path]) => <Text key={name} accessibilityRole="button" onPress={() => router.replace(path)} style={[styles.navText, active === name && styles.active]}>{name}</Text>)}</View>; }
const styles = StyleSheet.create({ input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, fontSize: 17, minHeight: 58, paddingHorizontal: 16 }, section: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 10 }, nav: { borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 16 }, navText: { color: colors.muted, fontSize: 12, fontWeight: '700', paddingVertical: 6 }, active: { color: colors.violet } });
