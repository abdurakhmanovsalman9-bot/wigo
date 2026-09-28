import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';
import { useSession } from '../../context/session';

export default function CreatePlan() {
  const [title, setTitle] = useState('Кофе и книги'); const [when, setWhen] = useState<'Сегодня' | 'Завтра'>('Завтра'); const { addPlan } = useSession();
  return <Page title="Создать личный план" subtitle="Сначала создайте идею, затем выберите людей и согласуйте время в чате.">
    <Text style={styles.label}>Идея встречи</Text><TextInput value={title} onChangeText={setTitle} placeholder="Например, прогулка после работы" style={styles.input}/>
    <Text style={styles.label}>Когда</Text><View style={styles.row}>{(['Сегодня', 'Завтра'] as const).map((item) => <Pressable key={item} onPress={() => setWhen(item)} style={[styles.choice, when === item && styles.selected]}><Text style={[styles.choiceText, when === item && styles.selectedText]}>{item}</Text></Pressable>)}</View>
    <Text style={styles.note}>3–5 человек · до 5 000 ₸ на человека. Это предпочтения, а не оценка ваших возможностей.</Text>
    <PrimaryButton label="Создать черновик" disabled={!title.trim()} onPress={() => { addPlan({ title: title.trim(), details: `${when} · черновик · участники не приглашены` }); router.replace('/(user)/plans'); }} />
    <SecondaryButton label="Отмена" onPress={() => router.back()} />
  </Page>;
}
const styles = StyleSheet.create({ label: { color: colors.text, fontSize: 14, fontWeight: '800' }, input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, fontSize: 16, minHeight: 54, paddingHorizontal: 15 }, row: { flexDirection: 'row', gap: 9 }, choice: { alignItems: 'center', backgroundColor: colors.white, borderColor: colors.border, borderRadius: 14, borderWidth: 1, flex: 1, minHeight: 50, justifyContent: 'center' }, selected: { backgroundColor: colors.soft, borderColor: colors.violet, borderWidth: 2 }, choiceText: { color: colors.text, fontWeight: '800' }, selectedText: { color: colors.pressed }, note: { color: colors.muted, fontSize: 13, lineHeight: 19 } });
