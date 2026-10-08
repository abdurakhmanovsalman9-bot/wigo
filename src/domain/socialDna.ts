import { DnaAnswers } from './dnaTest';

export type SocialDna = {
  version?: 2;
  answers?: DnaAnswers;
  companySize?: 'one' | 'small' | 'large';
  familiarity?: 'friends' | 'friendsOfFriends' | 'newPeople';
  activityStyle?: 'active' | 'calm';
  planningStyle?: 'now' | 'planned';
  budget?: 'free' | 'under5' | '5to10' | '10to20' | 'over20' | 'flexible';
  ageBand?: string;
  paymentStyle?: string;
  socialEnergy?: string;
  connectionStyle?: string;
  worldview?: string;
  goal?: string;
  companyPreference?: string;
  values?: string[];
  categories?: string[];
  interests?: string[];
  timeWindows?: string[];
  boundaries?: string[];
};

const stringValue = (answers: DnaAnswers, key: string) => typeof answers[key] === 'string' && answers[key] !== 'skip' ? answers[key] as string : undefined;
const listValue = (answers: DnaAnswers, key: string) => Array.isArray(answers[key]) ? answers[key] as string[] : [];

export function buildSocialDna(answers: DnaAnswers): SocialDna {
  const category = listValue(answers, 'category')[0];
  const activity = category ? stringValue(answers, `activity:${category}`) : undefined;
  return {
    version: 2, answers,
    companySize: stringValue(answers, 'companySize') as SocialDna['companySize'],
    familiarity: stringValue(answers, 'familiarity') as SocialDna['familiarity'],
    activityStyle: stringValue(answers, 'energy') === 'lively' ? 'active' : stringValue(answers, 'energy') === 'quiet' ? 'calm' : undefined,
    planningStyle: stringValue(answers, 'planningStyle') === 'now' ? 'now' : 'planned',
    budget: stringValue(answers, 'budget') as SocialDna['budget'],
    ageBand: stringValue(answers, 'age'),
    paymentStyle: stringValue(answers, 'paymentOne') ?? stringValue(answers, 'payment'),
    socialEnergy: stringValue(answers, 'energy'),
    connectionStyle: stringValue(answers, 'connection'),
    worldview: stringValue(answers, 'worldview'),
    goal: stringValue(answers, 'intent'),
    companyPreference: stringValue(answers, 'companyPreference'),
    values: listValue(answers, 'values'),
    categories: listValue(answers, 'category'),
    interests: activity ? [activity] : [],
    timeWindows: listValue(answers, 'time'),
    boundaries: [...new Set([...listValue(answers, 'boundaries').filter((item) => item !== 'none'), ...(answers.age === '16-17' ? ['public', 'noAlcohol'] : [])])],
  };
}

export const socialDnaSummary = (dna: SocialDna) => {
  if (!dna.companySize && !dna.interests?.length) return 'Подберём людей и планы под твой ритм.';
  const company = {
    one: 'встречи один на один',
    small: 'небольшие компании',
    large: 'большие группы',
  }[dna.companySize ?? 'small'];

  const pace = dna.planningStyle === 'now' ? 'можно собраться быстро' : 'лучше планировать заранее';
  const activity = dna.activityStyle === 'active' ? 'активный отдых' : dna.activityStyle === 'calm' ? 'спокойные активности' : 'разные активности';

  const interest = dna.interests?.[0] ? ` Интерес: ${dna.interests[0].toLowerCase()}.` : '';
  return `${company}, ${activity}; ${pace}.${interest}`;
};

export function socialDnaTitle(dna: SocialDna) {
  return dna.goal === 'friends' ? 'Близкое общение в твоём ритме' : dna.goal === 'explore' ? 'Новые впечатления с комфортным стартом' : dna.goal === 'company' ? 'Компания для любимых занятий' : 'Планы, на которые хочется пойти';
}

export const recommendationReason = (dna: SocialDna) => {
  if (dna.planningStyle === 'now') return 'Вы открыты к спонтанным планам.';
  if (dna.companySize === 'small') return 'Подходит формат небольшой группы.';
  return 'Подходит по выбранным интересам и времени.';
};
