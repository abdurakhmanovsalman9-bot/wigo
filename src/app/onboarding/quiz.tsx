import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Page, PrimaryButton, SecondaryButton, colors } from '../../components/ui';
import { answered, cleanDnaAnswers, DnaAnswer, DnaAnswers, getDnaFlow, questionBankSize } from '../../domain/dnaTest';
import { buildSocialDna } from '../../domain/socialDna';
import { useSession } from '../../context/session';

export default function Quiz() {
  const { dna, privacy, persistSettings } = useSession();
  const [answers, setAnswers] = useState<DnaAnswers>(dna.answers ?? {});
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const flow = useMemo(() => getDnaFlow(answers), [answers]);
  const question = flow[Math.min(step, flow.length - 1)];
  const selected = answers[question.id];
  const progress = Math.round(((step + 1) / (answers.age === 'under16' ? 1 : 18)) * 100);

  const choose = (value: string) => {
    if (saving) return;
    setAnswers((current) => {
      const previous = current[question.id];
      let next: DnaAnswer = value;
      if (question.multiple) {
        const choices = Array.isArray(previous) ? previous : [];
        if (value === 'none') return { ...current, [question.id]: ['none'] };
        const meaningful = choices.filter((item) => item !== 'none');
        next = choices.includes(value) ? choices.filter((item) => item !== value)
          : meaningful.length < (question.maxChoices ?? 2) ? [...meaningful, value] : meaningful;
      }
      return { ...current, [question.id]: next };
    });
  };

  const finish = async (nextAnswers: DnaAnswers) => {
    setSaving(true);
    try {
      const clean = cleanDnaAnswers(nextAnswers);
      await persistSettings(buildSocialDna(clean), privacy);
      router.replace(clean.age === 'under16' ? '/age-restriction' : '/onboarding/dna-result');
    } catch {
      Alert.alert('Не удалось сохранить ДНК', 'Проверьте соединение и попробуйте снова. Ответы пока остались на этом экране.');
    } finally { setSaving(false); }
  };

  const advance = (nextAnswers = answers) => {
    const nextFlow = getDnaFlow(nextAnswers);
    if (step >= nextFlow.length - 1) void finish(nextAnswers);
    else setStep(step + 1);
  };

  const skip = () => {
    const next = { ...answers, [question.id]: 'skip' };
    setAnswers(next);
    advance(next);
  };

  return <Page step={`${step + 1} · до 18 вопросов`} title={question.title} subtitle={question.subtitle}>
    <View style={styles.track}><View style={[styles.fill, { width: `${progress}%` }]} /></View>
    <View style={styles.list}>{question.choices.map((option) => {
      const active = Array.isArray(selected) ? selected.includes(option.value) : selected === option.value;
      return <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} key={option.value} onPress={() => choose(option.value)} style={[styles.choice, active && styles.selected]}>
        <Text style={[styles.choiceText, active && styles.selectedText]}>{option.label}</Text>{active && <Text style={styles.check}>✓</Text>}
      </Pressable>;
    })}</View>
    <PrimaryButton label={saving ? 'Сохраняем…' : answers.age === 'under16' ? 'Продолжить' : step === flow.length - 1 ? 'Увидеть мою ДНК' : 'Далее'} disabled={!answered(answers, question) || saving} onPress={() => advance()} />
    {question.optional ? <SecondaryButton label="Пропустить вопрос" onPress={() => { if (!saving) skip(); }} /> : null}
    {step > 0 ? <SecondaryButton label="Назад" onPress={() => { if (!saving) setStep(step - 1); }} /> : null}
    <Pressable onPress={() => Alert.alert('О тесте', `В банке ${questionBankSize} вопросов и уточнений, но ты увидишь не больше 18. Wigo запоминает выбранные предпочтения, а не ставит психологический диагноз. Бюджет и другие личные ответы не показываются в публичном профиле.`)}><Text style={styles.link}>Зачем эти вопросы?</Text></Pressable>
  </Page>;
}

const styles = StyleSheet.create({
  track: { backgroundColor: colors.soft, borderRadius: 8, height: 7, overflow: 'hidden' },
  fill: { backgroundColor: colors.violet, borderRadius: 8, height: 7 },
  list: { gap: 9 },
  choice: { alignItems: 'center', backgroundColor: colors.white, borderColor: colors.border, borderRadius: 16, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 58, paddingHorizontal: 16, paddingVertical: 12 },
  selected: { backgroundColor: colors.soft, borderColor: colors.violet, borderWidth: 2 },
  choiceText: { color: colors.text, flex: 1, fontSize: 16, fontWeight: '700' },
  selectedText: { color: colors.pressed },
  check: { color: colors.violet, fontSize: 22, fontWeight: '900' },
  link: { color: colors.violet, fontSize: 14, fontWeight: '800', textAlign: 'center' },
});
