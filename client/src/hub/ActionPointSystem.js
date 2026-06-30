import { spendActionPoint } from '../game/GameState.js';

export const ACTIVITY_IDS = {
  nira: 'speak-nira',
  vael: 'sync-vael',
  rook: 'upgrade-rook',
  sera: 'rest-sera',
  quarters: 'rest-quarters',
  research: 'research-veil',
  observation: 'review-map',
  map: 'review-map'
};

export function spendForCrew(state, crewId) {
  const activity = ACTIVITY_IDS[crewId];
  if (!activity) return state;
  return spendActionPoint(state, activity, crewId);
}
