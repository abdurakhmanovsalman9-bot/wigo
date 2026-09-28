import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, Note, Page, PrimaryButton, colors } from '../../components/ui';
import { useSession } from '../../context/session';
import { useRemote } from '../../hooks/useRemote';
import { fetchMyParticipations } from '../../services/backend';
import { MobileTabs } from './home';

export default function Chats() {
  const [message, setMessage] = useState(''); const { userMessages, addUserMessage, userId } = useSession();
  const mine = useRemote(userId ? `participations-${userId}` : null, () => fetchMyParticipations(userId as string));
  const send = () => { if (!message.trim()) return; addUserMessage(message.trim()); setMessage(''); };
  if (userId) {
    const confirmed = mine.data?.filter((event) => event.myStatus === 'confirmed') ?? [];
    return <Page title="Чаты" subtitle="Чаты событий, где ваше участие подтверждено.">
      {confirmed.map((event) => <Card key={event.id} title={event.title} text={event.when} action="Открыть чат" onPress={() => router.push({ pathname: '/chat/[eventId]', params: { eventId: event.id } })}/>)}
      {mine.data && confirmed.length === 0 ? <Note>Чаты появятся, когда организатор подтвердит ваше участие.</Note> : null}
      {mine.error ? <Note>Не удалось загрузить чаты. Проверьте интернет.</Note> : null}
      <MobileTabs active="Чаты"/>
    </Page>;
  }
  return <Page title="Чаты" subtitle="Обсуждайте идеи и превращайте их в планы.">
    <Card title="Падел микст 2×2" text="Данияр: Ракетки можно взять на корте" action="Посмотреть план" onPress={() => router.push('/(user)/plans')}/>
    <Card title="Whisper от Армана" text="Кофе в Bowler сегодня" action="Ответить" onPress={() => router.push('/(user)/whisper')}/>
    {userMessages.map((text, index) => <View key={index} style={styles.bubble}><Text style={styles.bubbleLabel}>Вы · Падел микст 2×2</Text><Text style={styles.bubbleText}>{text}</Text></View>)}
    <TextInput value={message} onChangeText={setMessage} placeholder="Написать в «Падел микст 2×2»" style={styles.input}/>
    <PrimaryButton label="Отправить" disabled={!message.trim()} onPress={send}/>
    <Note>Демо: сообщения остаются на этом устройстве и не доходят до других людей.</Note>
    <MobileTabs active="Чаты"/>
  </Page>;
}
const styles = StyleSheet.create({ input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, minHeight: 54, paddingHorizontal: 15 }, bubble: { alignSelf: 'flex-end', backgroundColor: colors.soft, borderRadius: 16, maxWidth: '85%', padding: 13 }, bubbleLabel: { color: colors.violet, fontSize: 12, fontWeight: '800' }, bubbleText: { color: colors.text, fontSize: 15, marginTop: 3 } });
