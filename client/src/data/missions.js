import { MISSION_REWARD } from '../../../shared/balance.js';

export const MISSIONS = {
  ironWake: {
    id: 'operation-iron-wake',
    name: 'Operation Iron Wake',
    enemy: 'Fracture Worm',
    location: 'Ruined City Outskirts',
    objectives: [
      'Deploy AEGIS-7',
      'Engage Fracture Worm',
      'Avoid telegraphed burrow attacks',
      'Destroy target',
      'Return alive'
    ],
    reward: MISSION_REWARD
  }
};
