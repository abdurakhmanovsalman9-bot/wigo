export type SocialDna = {
  companySize?: 'one' | 'small' | 'large';
  familiarity?: 'friends' | 'friendsOfFriends' | 'newPeople';
  activityStyle?: 'active' | 'calm';
  planningStyle?: 'now' | 'planned';
  budget?: 'free' | 'under5' | '5to10' | '10to20' | 'over20' | 'flexible';
};

export const socialDnaSummary = (dna: SocialDna) => {
  const company = {
    one: 'встречи один на один',
    small: 'небольшие компании',
    large: 'большие группы',
  }[dna.companySize ?? 'small'];

  const pace = dna.planningStyle === 'now' ? 'можно собраться быстро' : 'лучше планировать заранее';
  const activity = dna.activityStyle === 'active' ? 'активный отдых' : 'спокойные активности';

  return `${company}, ${activity}; ${pace}.`;
};

export const recommendationReason = (dna: SocialDna) => {
  if (dna.planningStyle === 'now') return 'Вы открыты к спонтанным планам.';
  if (dna.companySize === 'small') return 'Подходит формат небольшой группы.';
  return 'Подходит по выбранным интересам и времени.';
};
