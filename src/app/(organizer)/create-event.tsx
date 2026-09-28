import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';

const formats = ['Спорт', 'Кофе и общение', 'Прогулка', 'Творчество'];

export default function CreateEvent() {
  const [format, setFormat] = useState(formats[0]);
  const [title, setTitle] = useState('Падел для новичков');
  return <Page title="Новое событие" subtitle="Короткая мобильная форма. Перед публикацией вы увидите, что именно увидят участники.">
    <Text style={styles.label}>Название</Text><TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Например, кофе после работы" />
    <Text style={styles.label}>Формат</Text><View style={styles.options}>{formats.map((item) => <Pressable key={item} onPress={() => setFormat(item)} style={[styles.option, format === item && styles.selected]}><Text style={[styles.optionText, format === item && styles.selectedText]}>{item}</Text></Pressable>)}</View>
    <Text style={styles.hint}>Время, район, число мест и правила участия задаются на следующем шаге. Точная геолокация не публикуется.</Text>
    <PrimaryButton label="Продолжить" onPress={() => router.push('/(organizer)/event-detail')} />
    <SecondaryButton label="Сохранить черновик" onPress={() => router.replace('/(organizer)/events')} />
    <SecondaryButton label="Отмена" onPress={() => router.back()} />
  </Page>;
}
const styles = StyleSheet.create({ label: { color: colors.text, fontSize: 14, fontWeight: '800' }, input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, fontSize: 16, minHeight: 54, paddingHorizontal: 15 }, options: { gap: 9 }, option: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 14, borderWidth: 1, padding: 15 }, selected: { backgroundColor: colors.soft, borderColor: colors.violet, borderWidth: 2 }, optionText: { color: colors.text, fontWeight: '700' }, selectedText: { color: colors.pressed }, hint: { color: colors.muted, fontSize: 13, lineHeight: 19 } });
