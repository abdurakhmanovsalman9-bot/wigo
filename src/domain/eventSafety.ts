import type { SocialDna } from './socialDna';

export type EventSafety = {
  ageRating?: '16+' | '18+' | 'unknown';
  alcoholPolicy?: 'none' | 'present' | 'unknown';
  venueType?: 'public' | 'private' | 'unknown';
};

export function ageMode(dna: SocialDna): 'blocked' | 'teen' | 'adult' | 'unknown' {
  if (dna.ageBand === 'under16') return 'blocked';
  if (dna.ageBand === '16-17') return 'teen';
  if (['18-24', '25-34', '35-44', '45-54', '55+'].includes(dna.ageBand ?? '')) return 'adult';
  return 'unknown';
}

const restrictedWords = /алкогол|вино|винный|пиво|пивной|бар(?:$|[^а-яё])|баре(?:$|[^а-яё])|коктейл|кальян|казино|азарт|18\s*\+|ночной клуб|стриптиз|alcohol|wine|beer|casino|hookah|striptease|nightclub/i;

export function isEventAllowed(event: EventSafety & { title: string; format: string }, dna: SocialDna) {
  const mode = ageMode(dna);
  if (mode === 'blocked') return false;
  if (mode !== 'adult') {
    return event.ageRating === '16+' && event.alcoholPolicy === 'none' && event.venueType === 'public'
      && !restrictedWords.test(`${event.title} ${event.format}`);
  }
  if (dna.boundaries?.includes('noAlcohol') && event.alcoholPolicy !== 'none') return false;
  if (dna.boundaries?.includes('public') && event.venueType !== 'public') return false;
  return true;
}
