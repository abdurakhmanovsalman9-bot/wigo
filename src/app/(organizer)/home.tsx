import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Page, PrimaryButton, colors } from '../../components/ui';
import { useSession } from '../../context/session';
export default function OrganizerHome() {
  const { events, participants, refreshOrganizerData } = useSession();
  useFocusEffect(useCallback(() => { refreshOrganizerData().catch(() => undefined); }, [refreshOrganizerData]));
  const published = events.filter((item) => item.status === 'published');
  const next = published[0];
  return <Page title="Организатор" subtitle="Ваши события, заявки и участники в одном месте." accessory={<Text style={styles.badge}>Wigo Studio</Text>}>
    <View style={styles.metrics}><Metric label="Активные" value={String(published.length)}/><Metric label="Заявки" value={String(participants.filter((item) => item.status === 'pending').length)}/><Metric label="Места" value={String(published.reduce((sum, item) => sum + item.seats, 0))}/></View>
    {next ? <Card title={next.title} text={`${next.when} · ${next.seats} мест`} action="Управлять" onPress={() => router.push({ pathname: '/(organizer)/event-detail', params: { id: next.id } })}/> : null}
    <PrimaryButton label="Создать событие" onPress={() => router.push('/(organizer)/create-event')}/>
    <OrganizerTabs active="Главная"/>
  </Page>;
}
function Metric({ label, value }: { label: string; value: string }) { return <View style={styles.metric}><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></View>; }
export function OrganizerTabs({ active }: { active: string }) { const items = [['Главная','/(organizer)/home'],['События','/(organizer)/events'],['Участники','/(organizer)/participants'],['Сообщения','/(organizer)/messages'],['Профиль','/(organizer)/profile']] as const; return <View style={styles.nav}>{items.map(([name, path]) => <Pressable accessibilityRole="tab" key={name} onPress={() => router.replace(path)} style={styles.navButton}><Text style={[styles.navText, name === active && styles.active]}>{name}</Text>{name === active ? <View style={styles.activeDot}/> : null}</Pressable>)}</View>; }
const styles = StyleSheet.create({ badge: { backgroundColor: colors.soft, borderRadius: 99, color: colors.violet, fontSize: 12, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 7 }, metrics: { flexDirection: 'row', gap: 8 }, metric: { backgroundColor: colors.soft, borderRadius: 16, flex: 1, padding: 14 }, value: { color: colors.violet, fontSize: 25, fontWeight: '900' }, label: { color: colors.muted, fontSize: 12, marginTop: 3 }, nav: { borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 10 }, navButton: { alignItems: 'center', flex: 1, minHeight: 40, paddingTop: 3 }, navText: { color: colors.muted, fontSize: 10, fontWeight: '700', textAlign: 'center' }, active: { color: colors.violet }, activeDot: { backgroundColor: colors.violet, borderRadius: 99, height: 4, marginTop: 5, width: 4 } });
