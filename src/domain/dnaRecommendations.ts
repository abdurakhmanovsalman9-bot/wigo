import { activityCategories } from './dnaCatalog';
import { SocialDna } from './socialDna';
import { EventSafety, isEventAllowed } from './eventSafety';

export type RecommendableEvent = EventSafety & { title: string; format: string; when: string; seats: number };

/** Uses only fields that existing Wigo events actually store. A weak match stays a weak match. */
export function eventDnaFit(event: RecommendableEvent, dna: SocialDna) {
  const searchable = `${event.title} ${event.format}`.toLocaleLowerCase('ru');
  const activity = dna.interests?.find((item) => searchable.includes(item.toLocaleLowerCase('ru')));
  const category = activityCategories.find((item) =>
    dna.categories?.includes(item.id) && (searchable.includes(item.label.toLocaleLowerCase('ru')) ||
      item.activities.some((candidate) => searchable.includes(candidate.toLocaleLowerCase('ru')))));
  let score = activity ? 6 : category ? 3 : 0;
  if (dna.companySize === 'small' && event.seats >= 3 && event.seats <= 6) score += 1;
  if (dna.companySize === 'large' && event.seats >= 7) score += 1;
  const hour = Number(event.when.match(/(?:^|\D)(\d{1,2}):\d{2}/)?.[1]);
  const weekend = /суббот|воскресен/i.test(event.when);
  if (!Number.isNaN(hour) && /суббот|воскресен|понедель|вторник|сред|четверг|пятниц/i.test(event.when)) {
    const window = weekend ? hour < 18 ? 'weekendDay' : 'weekendEvening' : hour < 18 ? 'weekdayDay' : 'weekdayEvening';
    if (dna.timeWindows?.includes(window)) score += 1;
  }
  const reason = activity ? `В твоих интересах: ${activity.toLowerCase()}`
    : category ? `Тебе интересно направление «${category.label.toLowerCase()}»`
    : score > 0 ? 'Подходит по формату компании или времени' : 'Открытое событие';
  return { score, reason };
}

export function rankEventsForDna<T extends RecommendableEvent>(events: readonly T[], dna: SocialDna): T[] {
  return events.filter((event) => isEventAllowed(event, dna)).map((event, index) => ({ event, index, score: eventDnaFit(event, dna).score }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ event }) => event);
}
