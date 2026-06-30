export const STARTING_AP = 3;
export const STARTING_SALVAGE = 0;

export const BASE_STATS = {
  hull: 100,
  energy: 100,
  meleePower: 10,
  riflePower: 8,
  dashCooldown: 1.2,
  syncRate: 0,
  signalResistance: 0,
  overdriveRecovery: 0
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
  },
  'reinforced-frame': {
    name: 'Reinforced Frame',
    stat: 'hull',
    amount: 25,
    cost: 90,
    unlockChapter: 'chapter-2-hollow-signal',
    requirement: 'Unlocked after Chapter 1',
    description: 'Rook welds heavier frame members into AEGIS-7 after the Fracture Worm damage report.'
  },
  'focused-rifle-core': {
    name: 'Focused Rifle Core',
    stat: 'riflePower',
    amount: 4,
    cost: 95,
    unlockChapter: 'chapter-2-hollow-signal',
    requirement: 'Unlocked after Chapter 1',
    description: 'A tighter compression core keeps rifle bursts stable through Hollow Signal interference.'
  },
  'blade-actuator': {
    name: 'Blade Actuator',
    stat: 'meleePower',
    amount: 4,
    cost: 95,
    unlockChapter: 'chapter-2-hollow-signal',
    requirement: 'Unlocked after Chapter 1',
    description: 'Adds a second-stage blade actuator for cleaner follow-through and heavier impact.'
  },
  'emergency-thrusters': {
    name: 'Emergency Thrusters',
    stat: 'dashCooldown',
    amount: -0.2,
    cost: 110,
    minimum: 0.55,
    unlockChapter: 'chapter-2-hollow-signal',
    requirement: 'Unlocked after Chapter 1',
    description: 'Auxiliary venting lets AEGIS-7 dash again a little sooner under pressure.'
  },
  'signal-anchor': {
    name: 'Signal Anchor',
    stat: 'signalResistance',
    amount: 1,
    cost: 130,
    unlockChapter: 'chapter-3-redline-descent',
    requirement: 'Unlocked after Chapter 2',
    description: 'Vael routes hostile signal noise into a grounded buffer during the Redline descent.'
  },
  'sync-capacitor': {
    name: 'Sync Capacitor',
    stat: 'syncRate',
    amount: 5,
    cost: 140,
    unlockChapter: 'chapter-3-redline-descent',
    requirement: 'Unlocked after Chapter 2',
    description: 'Stores small neural sync surges so Overdrive builds slightly faster in extended fights.'
  },
  'overdrive-stabilizer': {
    name: 'Overdrive Stabilizer',
    stat: 'overdriveRecovery',
    amount: 0.5,
    cost: 150,
    unlockChapter: 'chapter-3-redline-descent',
    requirement: 'Unlocked after Chapter 2',
    description: 'Reduces post-Overdrive recoil so the blade arm returns to guard faster.'
  }
};

export const MISSION_REWARDS = {
  'operation-iron-wake': {
    salvage: 100,
    sync: 15
  },
  'operation-hollow-signal': {
    salvage: 150,
    sync: 20
  },
  'operation-redline-descent': {
    salvage: 200,
    sync: 25
  }
};

export const MISSION_REWARD = MISSION_REWARDS['operation-iron-wake'];

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
