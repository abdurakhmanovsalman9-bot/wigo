import { router } from 'expo-router';
import { TextInput, StyleSheet } from 'react-native';
import { Card, Page, PrimaryButton, colors } from '../../components/ui'; import { OrganizerTabs } from './home';
export default function Messages() { return <Page title="Сообщения" subtitle="Один чат на событие — без перехода в веб-панель."><Card title="Падел в субботу" text="Данияр: Ракетки можно взять на корте"/><TextInput placeholder="Написать в чат" style={styles.input}/><PrimaryButton label="Отправить" onPress={() => router.push('/(organizer)/event-detail')}/><OrganizerTabs active="Сообщения"/></Page>; }
const styles = StyleSheet.create({ input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, color: colors.text, minHeight: 54, paddingHorizontal: 15 } });
