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
  },
  'reflective-plating': {
    name: 'Reflective Plating',
    stat: 'signalResistance',
    amount: 1,
    cost: 175,
    unlockChapter: 'chapter-4-glass-horizon',
    requirement: 'Unlocked after Chapter 3',
    description: 'Mirrored Arc-12 plating bleeds Prism refraction away from the cockpit lattice.'
  },
  'longshot-rifle-core': {
    name: 'Longshot Rifle Core',
    stat: 'riflePower',
    amount: 5,
    cost: 190,
    unlockChapter: 'chapter-4-glass-horizon',
    requirement: 'Unlocked after Chapter 3',
    description: 'A longer compression channel lets the Veil Rifle punch through glassed horizon mirages.'
  },
  'rootbreaker-actuators': {
    name: 'Rootbreaker Actuators',
    stat: 'meleePower',
    amount: 5,
    cost: 215,
    unlockChapter: 'chapter-5-black-orchard',
    requirement: 'Unlocked after Chapter 4',
    description: 'Rook overclocks the blade elbow to sever living orchard roots before they can anchor AEGIS-7.'
  },
  'stabilized-neural-dampers': {
    name: 'Stabilized Neural Dampers',
    stat: 'signalResistance',
    amount: 1,
    cost: 225,
    unlockChapter: 'chapter-5-black-orchard',
    requirement: 'Unlocked after Chapter 4',
    description: 'Sera signs off on dampers that soften hostile memory bleed without numbing Kaito completely.'
  },
  'resonance-filter': {
    name: 'Resonance Filter',
    stat: 'signalResistance',
    amount: 1,
    cost: 245,
    unlockChapter: 'chapter-6-silent-choir',
    requirement: 'Unlocked after Chapter 5',
    description: 'A Vael-built filter cuts choir harmonics out of the neural bus before they become commands.'
  },
  'overdrive-capacitor': {
    name: 'Overdrive Capacitor',
    stat: 'overdriveRecovery',
    amount: 0.7,
    cost: 260,
    unlockChapter: 'chapter-6-silent-choir',
    requirement: 'Unlocked after Chapter 5',
    description: 'Stores recoil from Overdrive vents and returns control to Kaito faster after sync spikes.'
  },
  'heavy-frame-reinforcement': {
    name: 'Heavy Frame Reinforcement',
    stat: 'hull',
    amount: 35,
    cost: 285,
    unlockChapter: 'chapter-7-ashfall-cradle',
    requirement: 'Unlocked after Chapter 6',
    description: 'Thick cradle-zone braces keep AEGIS-7 standing when the ground begins to breathe ash.'
  },
  'crater-step-thrusters': {
    name: 'Crater Step Thrusters',
    stat: 'dashCooldown',
    amount: -0.15,
    cost: 300,
    minimum: 0.45,
    unlockChapter: 'chapter-7-ashfall-cradle',
    requirement: 'Unlocked after Chapter 6',
    description: 'Microbursts snap AEGIS-7 across unstable ash fields before the crater floor opens.'
  },
  'prototype-countermeasure': {
    name: 'Prototype Countermeasure',
    stat: 'meleePower',
    amount: 6,
    cost: 325,
    unlockChapter: 'chapter-8-vaels-door',
    requirement: 'Unlocked after Chapter 7',
    description: 'A forbidden lab routine lets the Requiem Blade interrupt L-0 prototype sync attacks.'
  },
  'sync-guard': {
    name: 'Sync Guard',
    stat: 'signalResistance',
    amount: 2,
    cost: 340,
    unlockChapter: 'chapter-8-vaels-door',
    requirement: 'Unlocked after Chapter 7',
    description: 'Vael walls off a fragment of itself to keep hostile copies from wearing Kaito voice-first.'
  },
  'gravity-anchor': {
    name: 'Gravity Anchor',
    stat: 'hull',
    amount: 30,
    cost: 365,
    unlockChapter: 'chapter-9-heaven-static',
    requirement: 'Unlocked after Chapter 8',
    description: 'Anchor pylons bite into impossible gravity wells during high-altitude rift fighting.'
  },
  'rift-targeting': {
    name: 'Rift Targeting Array',
    stat: 'riflePower',
    amount: 6,
    cost: 380,
    unlockChapter: 'chapter-9-heaven-static',
    requirement: 'Unlocked after Chapter 8',
    description: 'A triangulated optic marks Seraphim flight paths across static-filled sky fractures.'
  },
  'requiem-core': {
    name: 'Requiem Core',
    stat: 'syncRate',
    amount: 10,
    cost: 420,
    unlockChapter: 'chapter-10-iron-requiem',
    requirement: 'Unlocked for the final operation',
    description: 'The last safe Arc-12 core route, tuned for one impossible push into the Requiem Heart.'
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
  },
  'operation-glass-horizon': {
    salvage: 250,
    sync: 30
  },
  'operation-black-orchard': {
    salvage: 300,
    sync: 35
  },
  'operation-silent-choir': {
    salvage: 350,
    sync: 40
  },
  'operation-ashfall-cradle': {
    salvage: 400,
    sync: 45
  },
  'operation-vaels-door': {
    salvage: 450,
    sync: 50
  },
  'operation-heaven-static': {
    salvage: 500,
    sync: 55
  },
  'operation-iron-requiem': {
    salvage: 0,
    sync: 60
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
