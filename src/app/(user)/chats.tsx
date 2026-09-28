import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, Page, PrimaryButton, colors } from '../../components/ui';
import { MobileTabs } from './home';

export default function Chats() {
  const [message, setMessage] = useState(''); const [sent, setSent] = useState<string | null>(null);
  const send = () => { if (!message.trim()) return; setSent(message.trim()); setMessage(''); };
  return <Page title="Чаты" subtitle="Обсуждайте идеи и превращайте их в планы.">
    <Card title="Падел микст 2×2" text="Данияр: Ракетки можно взять на корте" action="Посмотреть план" onPress={() => router.push('/(user)/plans')}/>
    <Card title="Whisper от Армана" text="Кофе в Bowler сегодня" action="Ответить" onPress={() => router.push('/(user)/whisper')}/>
    {sent ? <View style={styles.bubble}><Text style={styles.bubbleLabel}>Вы</Text><Text style={styles.bubbleText}>{sent}</Text></View> : null}
    <TextInput value={message} onChangeText={setMessage} placeholder="Написать в выбранный чат" style={styles.input}/>
    <PrimaryButton label="Отправить" disabled={!message.trim()} onPress={send}/><MobileTabs active="Чаты"/>
  </Page>;
}
const styles = StyleSheet.create({ input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, minHeight: 54, paddingHorizontal: 15 }, bubble: { alignSelf: 'flex-end', backgroundColor: colors.soft, borderRadius: 16, maxWidth: '85%', padding: 13 }, bubbleLabel: { color: colors.violet, fontSize: 12, fontWeight: '800' }, bubbleText: { color: colors.text, fontSize: 15, marginTop: 3 } });
