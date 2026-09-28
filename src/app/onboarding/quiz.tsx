import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Page, PrimaryButton, colors } from '../../components/ui';
import { SocialDna } from '../../domain/socialDna';
import { useSession } from '../../context/session';

type Question = { key: keyof SocialDna; title: string; subtitle: string; choices: { label: string; value: string }[] };
const questions: Question[] = [
  { key: 'companySize', title: 'Какая компания комфортна?', subtitle: 'Это можно изменить в любой момент.', choices: [{ label: 'Один на один', value: 'one' }, { label: '3–5 человек', value: 'small' }, { label: 'Большая группа', value: 'large' }] },
  { key: 'familiarity', title: 'С кем встречаться?', subtitle: 'Вы сами выбираете круг общения.', choices: [{ label: 'Только друзья', value: 'friends' }, { label: 'Друзья друзей', value: 'friendsOfFriends' }, { label: 'Новые люди', value: 'newPeople' }] },
  { key: 'activityStyle', title: 'Какой формат ближе?', subtitle: 'Выберите то, что подходит сейчас.', choices: [{ label: 'Активный', value: 'active' }, { label: 'Спокойный', value: 'calm' }] },
  { key: 'planningStyle', title: 'Как планируете?', subtitle: 'Это влияет только на порядок рекомендаций.', choices: [{ label: 'Могу собраться сейчас', value: 'now' }, { label: 'Планирую заранее', value: 'planned' }] },
  { key: 'budget', title: 'Комфортный бюджет встречи?', subtitle: 'Это не доход. Видно только вам.', choices: [{ label: 'Бесплатно', value: 'free' }, { label: 'До 5 000 ₸', value: 'under5' }, { label: '5 000–10 000 ₸', value: '5to10' }, { label: '10 000–20 000 ₸', value: '10to20' }, { label: 'Зависит от активности', value: 'flexible' }] },
];

export default function Quiz() {
  const [step, setStep] = useState(0); const { dna, setDna } = useSession(); const question = questions[step]; const selected = dna[question.key];
  const choose = (value: string) => setDna({ ...dna, [question.key]: value } as SocialDna);
  return <Page step={`${step + 1} из ${questions.length}`} title={question.title} subtitle={question.subtitle}>
    <View style={styles.list}>{question.choices.map((choice) => <Pressable key={choice.value} onPress={() => choose(choice.value)} style={[styles.choice, selected === choice.value && styles.selected]}><Text style={[styles.choiceText, selected === choice.value && styles.selectedText]}>{choice.label}</Text>{selected === choice.value && <Text style={styles.check}>✓</Text>}</Pressable>)}</View>
    <PrimaryButton label={step === questions.length - 1 ? 'Готово' : 'Далее'} disabled={!selected} onPress={() => step === questions.length - 1 ? router.replace('/onboarding/privacy') : setStep(step + 1)}/>
    <Pressable onPress={() => Alert.alert('Зачем это нужно?', 'Wigo использует ответы только для рекомендаций. Никакие психологические или финансовые выводы не делаются.')}><Text style={styles.link}>Зачем это нужно?</Text></Pressable>
  </Page>;
}
const styles = StyleSheet.create({ list: { gap: 10 }, choice: { alignItems: 'center', backgroundColor: colors.white, borderColor: colors.border, borderRadius: 16, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 62, paddingHorizontal: 16 }, selected: { backgroundColor: colors.soft, borderColor: colors.violet, borderWidth: 2 }, choiceText: { color: colors.text, fontSize: 16, fontWeight: '700' }, selectedText: { color: colors.pressed }, check: { color: colors.violet, fontSize: 22, fontWeight: '900' }, link: { color: colors.violet, fontSize: 14, fontWeight: '800', textAlign: 'center' } });
