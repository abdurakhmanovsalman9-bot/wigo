import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Note, Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';
import { isEventAllowed } from '../../domain/eventSafety';
import { useSession } from '../../context/session';
import { useRemote } from '../../hooks/useRemote';
import { ChatMessage, fetchEvent, fetchMessages, sendMessage, subscribeToMessages } from '../../services/backend';

// Real event chat. RLS lets only the organizer and confirmed participants read or write it.
export default function EventChat() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { userId, role, dna } = useSession();
  const event = useRemote(userId && eventId ? `event-${eventId}` : null, () => fetchEvent(eventId, userId as string));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState(''); const [sending, setSending] = useState(false); const [error, setError] = useState<string | null>(null);

  const allowed = !!event.data && isEventAllowed(event.data, dna);
  useEffect(() => {
    if (!userId || !eventId || !allowed) return;
    let active = true;
    const load = () => fetchMessages(eventId, userId)
      .then((items) => { if (active) { setMessages(items); setError(null); } })
      .catch(() => { if (active) setError('Чат доступен организатору и подтверждённым участникам.'); });
    load();
    const unsubscribe = subscribeToMessages(eventId, load);
    return () => { active = false; unsubscribe(); };
  }, [eventId, userId, allowed]);

  if (!userId) {
    return <Page title="Чат события" subtitle="Чат доступен после входа в аккаунт.">
      <PrimaryButton label="Открыть демо-чаты" onPress={() => router.replace(role === 'organizer' ? '/(organizer)/messages' : '/(user)/chats')} />
      <SecondaryButton label="Назад" onPress={() => router.back()} />
    </Page>;
  }

  if (!allowed) return <Page title="Чат события" subtitle={event.loading ? 'Проверяем условия события…' : 'Событие недоступно для твоего возраста или выбранных условий.'}><SecondaryButton label="Назад" onPress={() => router.back()} /></Page>;
  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setSending(true);
    try { await sendMessage(eventId, userId, body); setText(''); } catch { setError('Сообщение не отправлено. Проверьте интернет.'); } finally { setSending(false); }
  };

  return <Page title={event.data?.title ?? 'Чат события'} subtitle={event.data?.when ?? 'Загружаем…'}>
    {messages.length === 0 && !error ? <Note>Сообщений пока нет. Напишите первым.</Note> : null}
    {messages.map((message) => <View key={message.id} style={[styles.bubble, message.mine ? styles.mine : styles.theirs]}>
      <Text style={styles.name}>{message.senderName}</Text><Text style={styles.body}>{message.body}</Text>
    </View>)}
    {error ? <Note>{error}</Note> : null}
    <TextInput value={text} onChangeText={setText} placeholder="Сообщение" maxLength={2000} multiline style={styles.input} />
    <PrimaryButton label={sending ? 'Отправляем…' : 'Отправить'} disabled={!text.trim() || sending} onPress={send} />
    <SecondaryButton label="Назад" onPress={() => router.back()} />
  </Page>;
}
const styles = StyleSheet.create({ bubble: { borderRadius: 16, maxWidth: '85%', padding: 13 }, mine: { alignSelf: 'flex-end', backgroundColor: colors.soft }, theirs: { alignSelf: 'flex-start', backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 }, name: { color: colors.violet, fontSize: 12, fontWeight: '800' }, body: { color: colors.text, fontSize: 15, marginTop: 3 }, input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, fontSize: 16, minHeight: 54, paddingHorizontal: 15, paddingVertical: 14 } });
