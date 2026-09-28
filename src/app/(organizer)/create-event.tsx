import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Note, Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';
import { useSession } from '../../context/session';
import { useRemote } from '../../hooks/useRemote';
import { fetchAddress, saveAddress } from '../../services/backend';

const formats = ['Спорт', 'Кофе и общение', 'Прогулка', 'Творчество'];
const times = ['Сегодня · 19:30', 'Суббота · 19:30', 'Воскресенье · 11:00'];

export default function CreateEvent() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { events, saveEvent, userId } = useSession();
  const existing = events.find((item) => item.id === id);
  const [format, setFormat] = useState(existing?.format ?? formats[0]);
  const [title, setTitle] = useState(existing?.title ?? 'Падел для новичков');
  const [when, setWhen] = useState(existing?.when ?? times[1]);
  const [seats, setSeats] = useState(existing?.seats ?? 4);
  const [saving, setSaving] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const savedAddress = useRemote(userId && existing ? `address-${existing.id}` : null, () => fetchAddress(existing?.id as string));
  const addressValue = address ?? savedAddress.data ?? '';
  const save = async (status: 'draft' | 'published') => {
    setSaving(true);
    try {
      const eventId = await saveEvent({ id: existing?.id, title: title.trim(), format, when, seats, status });
      if (userId && address !== null) await saveAddress(eventId, address.trim());
      return eventId;
    }
    catch { Alert.alert('Не удалось сохранить', 'Проверьте интернет и попробуйте ещё раз.'); return null; }
    finally { setSaving(false); }
  };
  return <Page title={existing ? 'Изменить событие' : 'Новое событие'} subtitle="Короткая мобильная форма. Точная геолокация не публикуется.">
    <Text style={styles.label}>Название</Text><TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Например, кофе после работы" />
    <Text style={styles.label}>Формат</Text><View style={styles.options}>{formats.map((item) => <Pressable key={item} onPress={() => setFormat(item)} style={[styles.option, format === item && styles.selected]}><Text style={[styles.optionText, format === item && styles.selectedText]}>{item}</Text></Pressable>)}</View>
    <Text style={styles.label}>Когда</Text><View style={styles.options}>{times.map((item) => <Pressable key={item} onPress={() => setWhen(item)} style={[styles.option, when === item && styles.selected]}><Text style={[styles.optionText, when === item && styles.selectedText]}>{item}</Text></Pressable>)}</View>
    <Text style={styles.label}>Мест</Text><View style={styles.row}>
      <Pressable accessibilityLabel="Меньше мест" onPress={() => setSeats(Math.max(2, seats - 1))} style={styles.step}><Text style={styles.stepText}>−</Text></Pressable>
      <Text style={styles.seats}>{seats}</Text>
      <Pressable accessibilityLabel="Больше мест" onPress={() => setSeats(Math.min(30, seats + 1))} style={styles.step}><Text style={styles.stepText}>+</Text></Pressable>
    </View>
    {userId ? <><Text style={styles.label}>Адрес</Text><TextInput value={addressValue} onChangeText={setAddress} style={styles.input} placeholder="Увидят только подтверждённые участники" maxLength={200} /></> : null}
    <PrimaryButton label={userId ? 'Опубликовать' : 'Опубликовать в демо'} disabled={!title.trim() || saving} onPress={async () => { const id = await save('published'); if (id) router.replace({ pathname: '/(organizer)/event-detail', params: { id } }); }} />
    <SecondaryButton label="Сохранить черновик" onPress={async () => { if (title.trim() && !(await save('draft'))) return; router.replace('/(organizer)/events'); }} />
    <SecondaryButton label="Отмена" onPress={() => router.back()} />
    {userId ? null : <Note>Демо: событие сохраняется только на этом устройстве и не видно другим людям.</Note>}
  </Page>;
}
const styles = StyleSheet.create({ label: { color: colors.text, fontSize: 14, fontWeight: '800' }, input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, fontSize: 16, minHeight: 54, paddingHorizontal: 15 }, options: { gap: 9 }, option: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 14, borderWidth: 1, padding: 15 }, selected: { backgroundColor: colors.soft, borderColor: colors.violet, borderWidth: 2 }, optionText: { color: colors.text, fontWeight: '700' }, selectedText: { color: colors.pressed }, row: { alignItems: 'center', flexDirection: 'row', gap: 16 }, step: { alignItems: 'center', backgroundColor: colors.soft, borderRadius: 14, height: 48, justifyContent: 'center', width: 48 }, stepText: { color: colors.violet, fontSize: 24, fontWeight: '800' }, seats: { color: colors.text, fontSize: 22, fontWeight: '800', minWidth: 32, textAlign: 'center' } });
