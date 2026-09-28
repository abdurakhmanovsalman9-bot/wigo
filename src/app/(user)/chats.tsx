import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, Note, Page, PrimaryButton, colors } from '../../components/ui';
import { useSession } from '../../context/session';
import { MobileTabs } from './home';

export default function Chats() {
  const [message, setMessage] = useState(''); const { userMessages, addUserMessage } = useSession();
  const send = () => { if (!message.trim()) return; addUserMessage(message.trim()); setMessage(''); };
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
