import { Redirect, router } from 'expo-router';
import { Alert } from 'react-native';
import { Card, Note, Page, PrimaryButton, SecondaryButton } from '../../components/ui';
import { useSession } from '../../context/session';
import { ageMode } from '../../domain/eventSafety';
import { getQuestionBank } from '../../domain/dnaTest';
import { activityCategories } from '../../domain/dnaCatalog';
import { socialDnaSummary, socialDnaTitle } from '../../domain/socialDna';

const valueLabels: Record<string, string> = {
  kindness: 'теплота и уважение', humor: 'юмор', reliability: 'надёжность',
  curiosity: 'любопытство', openness: 'открытость', calm: 'спокойствие',
};

export default function DnaResult() {
  const { dna, role, userId, privacy, persistSettings } = useSession();
  if (ageMode(dna) === 'blocked') return <Redirect href="/age-restriction" />;
  const expectation = getQuestionBank().find((q) => dna.answers?.[q.id] && q.id.split(':').length === 3 && q.id.startsWith('activity:'));
  const expectationLabel = expectation?.choices.find((option) => option.value === dna.answers?.[expectation.id])?.label;
  const deleteAnswers = () => Alert.alert('Удалить ответы?', 'Подбор перестанет учитывать твою ДНК. Пройти тест снова можно в профиле.', [
    { text: 'Оставить', style: 'cancel' },
    { text: 'Удалить', style: 'destructive', onPress: () => {
      persistSettings({}, privacy).then(() => router.replace(role === 'organizer' ? '/(organizer)/profile' : '/(user)/profile'))
        .catch(() => Alert.alert('Не удалось удалить', 'Проверьте соединение и попробуйте снова.'));
    } },
  ]);
  const categories = dna.categories?.map((id) => activityCategories.find((item) => item.id === id)?.label).filter(Boolean).join(', ');
  return <Page title="Твоя социальная ДНК" subtitle={socialDnaTitle(dna)}>
    <Card title="Твой ритм" text={socialDnaSummary(dna)} />
    <Card title="Что откликается" text={dna.interests?.length ? `${dna.interests.join(', ')}${categories ? ` · ${categories}` : ''}` : categories || 'Интересы можно добавить позже'} />
    <Card title="В людях важно" text={dna.values?.length ? dna.values.map((item) => valueLabels[item] ?? item).join(', ') : 'Твои ответы можно дополнить позже'} />
    {expectationLabel ? <Card title="Как хочется участвовать" text={expectationLabel} /> : null}
    {dna.worldview ? <Card title="Разные взгляды" text={dna.worldview === 'curious' ? 'Интересно понять другую точку зрения' : dna.worldview === 'respectful' ? 'Комфортно оставить каждому своё мнение' : 'Для близкого общения важны похожие взгляды'} /> : null}
    {ageMode(dna) === 'teen' ? <Note>Только события 16+ в публичных местах, без алкоголя и взрослых форматов. Эти условия действуют независимо от ответов про границы.</Note> : null}
    <Note>Это описание твоих ответов сегодня, а не ярлык или диагноз. Бюджет, возраст и границы остаются приватными. Совпадения станут точнее, когда ты будешь отмечать интересные планы.</Note>
    <PrimaryButton label={role === 'organizer' ? 'К моим событиям' : 'Смотреть планы'} onPress={() => router.replace(role === 'organizer' ? '/(organizer)/home' : '/(user)/home')} />
    <SecondaryButton label="Настройки приватности" onPress={() => router.push('/onboarding/privacy')} />
    <SecondaryButton label="Изменить ответы" onPress={() => router.replace('/onboarding/quiz')} />
    <SecondaryButton label="Удалить мои ответы" onPress={deleteAnswers} />
    {!userId ? <Note>Сейчас это демо: ответы хранятся только до закрытия приложения. После входа они сохранятся в твоём профиле.</Note> : null}
  </Page>;
}
