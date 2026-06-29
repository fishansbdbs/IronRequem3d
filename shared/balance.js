export const STARTING_AP = 3;
export const STARTING_SALVAGE = 0;

export const BASE_STATS = {
  hull: 100,
  energy: 100,
  meleePower: 10,
  riflePower: 8,
  dashCooldown: 1.2,
  syncRate: 0
};

export const UPGRADE_DEFS = {
  'hull-plating': {
    name: 'Hull Plating',
    stat: 'hull',
    amount: 25,
    cost: 50,
    description: 'Reinforced Arc-12 alloy panels raise AEGIS-7 maximum Hull.'
  },
  'energy-cell': {
    name: 'Extended Energy Cell',
    stat: 'energy',
    amount: 25,
    cost: 50,
    description: 'Adds reserve capacitors for rifle fire and emergency maneuvers.'
  },
  'blade-servo': {
    name: 'Blade Servo Tuning',
    stat: 'meleePower',
    amount: 4,
    cost: 60,
    description: 'Tightens actuator timing for heavier close-range strikes.'
  },
  'rifle-focus': {
    name: 'Rifle Focus Lens',
    stat: 'riflePower',
    amount: 3,
    cost: 60,
    description: 'Stabilizes Veil-energy compression for stronger ranged shots.'
  },
  'dash-coolant': {
    name: 'Dash Coolant Loop',
    stat: 'dashCooldown',
    amount: -0.2,
    cost: 75,
    minimum: 0.6,
    description: 'Reduces thruster heat recovery time.'
  },
  'sync-driver': {
    name: 'Vael Sync Driver',
    stat: 'syncRate',
    amount: 5,
    cost: 80,
    description: 'Improves neural link response during Overdrive buildup.'
  }
};

export const MISSION_REWARD = {
  salvage: 100,
  sync: 15
};

export const BATTLE_BALANCE = {
  playerHull: 100,
  playerEnergy: 100,
  bossHull: 260,
  rifleEnergyCost: 8,
  rifleCooldown: 0.45,
  meleeCooldown: 0.75,
  dashCooldown: 1.2,
  overdriveDamage: 65,
  shardLimit: 3
};
