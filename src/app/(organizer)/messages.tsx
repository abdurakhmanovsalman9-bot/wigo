import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, Note, Page, PrimaryButton, colors } from '../../components/ui'; import { useSession } from '../../context/session'; import { OrganizerTabs } from './home';
export default function Messages() {
  const [message, setMessage] = useState(''); const { organizerMessages, addOrganizerMessage, userId, events } = useSession();
  const send = () => { if (!message.trim()) return; addOrganizerMessage(message.trim()); setMessage(''); };
  if (userId) {
    const published = events.filter((event) => event.status === 'published');
    return <Page title="Сообщения" subtitle="Один чат на событие — для вас и подтверждённых участников.">
      {published.map((event) => <Card key={event.id} title={event.title} text={event.when} action="Открыть чат" onPress={() => router.push({ pathname: '/chat/[eventId]', params: { eventId: event.id } })}/>)}
      {published.length === 0 ? <Note>Чаты появятся после публикации события.</Note> : null}
      <OrganizerTabs active="Сообщения"/>
    </Page>;
  }
  return <Page title="Сообщения" subtitle="Один чат на событие — без перехода в веб-панель.">
    <Card title="Падел в субботу" text="Данияр: Ракетки можно взять на корте"/>
    {organizerMessages.map((text, index) => <View key={index} style={styles.bubble}><Text style={styles.bubbleLabel}>Вы</Text><Text style={styles.bubbleText}>{text}</Text></View>)}
    <TextInput value={message} onChangeText={setMessage} placeholder="Написать в чат события" style={styles.input}/>
    <PrimaryButton label="Отправить" disabled={!message.trim()} onPress={send}/>
    <Note>Демо: сообщения остаются на этом устройстве и не доходят до участников.</Note>
    <OrganizerTabs active="Сообщения"/>
  </Page>;
}
const styles = StyleSheet.create({ input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, minHeight: 54, paddingHorizontal: 15 }, bubble: { alignSelf: 'flex-end', backgroundColor: colors.soft, borderRadius: 16, maxWidth: '85%', padding: 13 }, bubbleLabel: { color: colors.violet, fontSize: 12, fontWeight: '800' }, bubbleText: { color: colors.text, fontSize: 15, marginTop: 3 } });
