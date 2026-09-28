/**
 * Mobile clients must never contain Azure or model-provider keys.
 * This adapter will call the Wigo backend after Azure Foundry is configured.
 */
export type ConciergeRequest = {
  intent: string;
  city: string;
  socialDna: Record<string, unknown>;
};

export type ConciergeRecommendation = {
  title: string;
  reason: string;
  action: 'event' | 'people' | 'plan';
};

export async function askConcierge(_: ConciergeRequest): Promise<ConciergeRecommendation[]> {
  // Intentionally mocked until a server endpoint and consent policy exist.
  return [
    {
      title: 'Падел сегодня в 19:30',
      reason: 'Подходит формат небольшой группы.',
      action: 'event',
    },
  ];
}
