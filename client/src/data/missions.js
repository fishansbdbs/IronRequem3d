import { MISSION_REWARDS } from '../../../shared/balance.js';

export const MISSIONS = {
  ironWake: {
    id: 'operation-iron-wake',
    chapterId: 'chapter-1-iron-wake',
    name: 'Operation Iron Wake',
    enemy: 'Fracture Worm',
    enemyId: 'fracture-worm',
    bossFactory: 'createFractureWorm',
    location: 'Ruined City Outskirts',
    sector: 'Sector 7-Delta',
    environment: 'city',
    objective: 'Defeat Fracture Worm.',
    brief:
      'Enemy silhouette confirms VB-01 Fracture Worm. Avoid telegraphs, preserve Hull, and bring AEGIS-7 home.',
    objectives: [
      'Deploy AEGIS-7',
      'Engage Fracture Worm',
      'Avoid telegraphed burrow attacks',
      'Destroy target',
      'Return alive'
    ],
    reward: MISSION_REWARDS['operation-iron-wake'],
    launchSubtitle: 'Catapult rail armed. Hangar doors sealed.',
    launchBody:
      'AEGIS-7 stands in the launch cradle, core cycling from blue to white as Vael completes neural sync.',
    launchLines: [
      { time: 0.5, speaker: 'System', text: 'Clamp locks disengaging.' },
      { time: 1.8, speaker: 'Vael', text: 'Neural link stabilized.' },
      { time: 3.0, speaker: 'Nira', text: 'AEGIS-7, launch clearance granted.' },
      { time: 4.1, speaker: 'System', text: 'Hangar doors open.' },
      { time: 5.3, speaker: 'Vael', text: 'Thrusters ignited. Do try to enjoy one statistically excellent launch.' },
      { time: 6.6, speaker: 'System', text: 'AEGIS-7 LAUNCH' }
    ],
    callouts: [
      { speaker: 'Nira', text: 'Keep it on the surface, Kaito. Do not let it drag you under.' },
      { speaker: 'Vael', text: 'Fracture patterns match the previous tremors. Sideways movement recommended.' },
      { speaker: 'Rook', text: 'Blade arm is stable. Please return it in the same number of pieces.' },
      { speaker: 'Sera', text: 'Your pulse is climbing. Breathe through the sync, not against it.' }
    ]
  },
  hollowSignal: {
    id: 'operation-hollow-signal',
    chapterId: 'chapter-2-hollow-signal',
    name: 'Operation Hollow Signal',
    enemy: 'Echo Stalker',
    enemyId: 'echo-stalker',
    bossFactory: 'createEchoStalker',
    location: 'Ruined Broadcast District',
    sector: 'Tower Crown / Old Band 9',
    environment: 'broadcast',
    objective: 'Defeat Echo Stalker.',
    brief:
      'Arc-12 has locked a repeating signal inside a collapsed broadcast tower. Vael recognized the rhythm before the sensors did.',
    objectives: ['Deploy AEGIS-7', 'Reach the broadcast tower', 'Destroy Rift Shards', 'Survive signal interference', 'Defeat Echo Stalker'],
    reward: MISSION_REWARDS['operation-hollow-signal'],
    launchSubtitle: 'Broadcast insertion. Static shield cycling.',
    launchBody:
      'The launch rail hums under a sheet of blue-white interference. Vael keeps answering the signal half a second before it speaks.',
    launchLines: [
      { time: 0.5, speaker: 'System', text: 'Signal filters armed.' },
      { time: 1.6, speaker: 'Vael', text: 'The pattern is familiar. I do not know why that sentence is true.' },
      { time: 2.9, speaker: 'Nira', text: 'Hollow Signal is priority one. Ashveil, investigate and withdraw if sync destabilizes.' },
      { time: 4.0, speaker: 'System', text: 'Broadcast static breaching outer doors.' },
      { time: 5.2, speaker: 'Rook', text: 'Tracker mast is live. If it screams, that means it is working. Probably.' },
      { time: 6.5, speaker: 'System', text: 'AEGIS-7 / HOLLOW SIGNAL DEPLOY' }
    ],
    callouts: [
      { speaker: 'Vael', text: 'Pattern deviation detected. That is not the same organism.' },
      { speaker: 'Nira', text: 'Kaito, break contact if the signal starts affecting your sync.' },
      { speaker: 'Rook', text: 'Your rifle core is heating. Keep bursts short.' },
      { speaker: 'Sera', text: 'Your neural stress just spiked. Breathe, Kaito.' }
    ]
  },
  redlineDescent: {
    id: 'operation-redline-descent',
    chapterId: 'chapter-3-redline-descent',
    name: 'Operation Redline Descent',
    enemy: 'Redline Colossus',
    enemyId: 'redline-colossus',
    bossFactory: 'createRedlineColossus',
    location: 'Subway Ruins / Redline Tunnel',
    sector: 'Transit City Below Sector 7',
    environment: 'redline',
    objective: 'Defeat Redline Colossus.',
    brief:
      'The Hollow Signal leads underground into a collapsing transit grid. Veilborn nests wind through the Redline and something huge guards the rails.',
    objectives: ['Descend into Redline Tunnel', 'Clear Veilborn nests', 'Protect AEGIS-7 from tunnel collapse', 'Defeat Redline Colossus', 'Escape before collapse timer ends'],
    reward: MISSION_REWARDS['operation-redline-descent'],
    launchSubtitle: 'Underground insertion. Drop elevator primed.',
    launchBody:
      'AEGIS-7 locks into the descent frame. The hangar rail lowers into a service shaft lit by red emergency lamps.',
    launchLines: [
      { time: 0.5, speaker: 'System', text: 'Drop elevator clamps engaged.' },
      { time: 1.5, speaker: 'Nira', text: 'This may be a trap. We still go because Arc-12 cannot outrun the signal forever.' },
      { time: 2.8, speaker: 'Sera', text: 'Tell me if the tunnel answers back.' },
      { time: 4.0, speaker: 'Vael', text: 'I have already plotted the descent. No one ordered me to do that.' },
      { time: 5.1, speaker: 'Rook', text: 'Try not to let a train monster punch the new plating.' },
      { time: 6.6, speaker: 'System', text: 'AEGIS-7 / REDLINE DESCENT' }
    ],
    callouts: [
      { speaker: 'Nira', text: 'Tunnel collapse markers are live. Keep moving between strikes.' },
      { speaker: 'Vael', text: 'The Colossus chest core is exposed after heavy attacks.' },
      { speaker: 'Rook', text: 'That armor is old train plating fused into bone. I hate how interesting that is.' },
      { speaker: 'Sera', text: 'That is not calm, Kaito. That is overload.' }
    ]
  },
  glassHorizon: {
    id: 'operation-glass-horizon',
    chapterId: 'chapter-4-glass-horizon',
    name: 'Operation Glass Horizon',
    enemy: 'Prism Leviathan',
    enemyId: 'prism-leviathan',
    bossFactory: 'createPrismLeviathan',
    location: 'Glassed Coast',
    sector: 'Old Shoreline / Mirror Flats',
    environment: 'glassed-coast',
    objective: 'Defeat Prism Leviathan.',
    brief:
      'The shore outside Arc-12 has vitrified into a reflective battlefield. The Leviathan copies heat signatures and turns the skyline into false targets.',
    objectives: ['Cross the glassed coast', 'Track the real reflection', 'Break mirror clones', 'Defeat Prism Leviathan', 'Recover refraction samples'],
    reward: MISSION_REWARDS['operation-glass-horizon'],
    launchSubtitle: 'Coastal drop. Refraction filters online.',
    launchBody:
      'The rail opens toward a horizon that reflects Arc-12 back upside down. Vael marks three exits and admits none of them look real.',
    launchLines: [
      { time: 0.5, speaker: 'System', text: 'Mirror filters calibrated.' },
      { time: 1.7, speaker: 'Nira', text: 'Glass Horizon is not a scouting run. Break the Leviathan before it maps us.' },
      { time: 2.8, speaker: 'Vael', text: 'I count one shoreline and seven lies about it.' },
      { time: 4.1, speaker: 'Rook', text: 'New rifle lens is tuned. Please shoot the real one.' },
      { time: 5.4, speaker: 'System', text: 'AEGIS-7 / GLASS HORIZON DEPLOY' }
    ],
    callouts: [
      { speaker: 'Vael', text: 'Reflection mismatch. The left silhouette has no shadow.' },
      { speaker: 'Nira', text: 'Do not chase the mirrors. Hold position and force it to commit.' },
      { speaker: 'Rook', text: 'That beam is bouncing off the floor. Rude and educational.' },
      { speaker: 'Sera', text: 'Your visual cortex is double-counting targets. Pick one breath, then one target.' }
    ]
  },
  blackOrchard: {
    id: 'operation-black-orchard',
    chapterId: 'chapter-5-black-orchard',
    name: 'Operation Black Orchard',
    enemy: 'Hollow Stag',
    enemyId: 'hollow-stag',
    bossFactory: 'createHollowStag',
    location: 'Black Orchard',
    sector: 'Agricultural Ring / Dead Growth',
    environment: 'black-orchard',
    objective: 'Defeat Hollow Stag.',
    brief:
      'Veilborn roots have grown through the old agricultural ring. Dr. Lira Mave believes the orchard is communicating through damaged pilot memories.',
    objectives: ['Enter the orchard ring', 'Avoid root snares', 'Destroy spore hearts', 'Defeat Hollow Stag', 'Extract Lira data'],
    reward: MISSION_REWARDS['operation-black-orchard'],
    launchSubtitle: 'Agricultural ring breach. Spore seals armed.',
    launchBody:
      'AEGIS-7 kneels under decontamination light while black pollen drifts against the hangar doors like ash from a quiet fire.',
    launchLines: [
      { time: 0.6, speaker: 'Sera', text: 'Spore filters are sealed. Your memories are not.' },
      { time: 1.8, speaker: 'Vael', text: 'The orchard is transmitting in patterns similar to grief.' },
      { time: 3.0, speaker: 'Nira', text: 'No one follows phantom voices. That is an order.' },
      { time: 4.4, speaker: 'Rook', text: 'Rootbreaker actuators are live. Chop first, think later. Strategically.' },
      { time: 5.8, speaker: 'System', text: 'AEGIS-7 / BLACK ORCHARD DEPLOY' }
    ],
    callouts: [
      { speaker: 'Sera', text: 'That sound is memory bleed. It cannot hurt you unless you answer it.' },
      { speaker: 'Vael', text: 'Root growth converging under your feet.' },
      { speaker: 'Nira', text: 'The Stag is trying to herd you. Break the pattern.' },
      { speaker: 'Rook', text: 'The antlers are conductive. The antlers are also trying to kill you.' }
    ]
  },
  silentChoir: {
    id: 'operation-silent-choir',
    chapterId: 'chapter-6-silent-choir',
    name: 'Operation Silent Choir',
    enemy: 'Cantor Null',
    enemyId: 'cantor-null',
    bossFactory: 'createCantorNull',
    location: 'Cathedral Relay',
    sector: 'Old Civic Core / Acoustic Sink',
    environment: 'silent-choir',
    objective: 'Defeat Cantor Null.',
    brief:
      'The broadcast signal has become a choir with no singers. Every silent pulse steals a sliver of pilot intent before Vael can name it.',
    objectives: ['Enter the relay nave', 'Keep sync above silence threshold', 'Destroy choir pylons', 'Defeat Cantor Null', 'Return before identity drift'],
    reward: MISSION_REWARDS['operation-silent-choir'],
    launchSubtitle: 'Choir relay approach. Neural dampers armed.',
    launchBody:
      'The hangar goes soundless for three seconds. When noise returns, Vael is already speaking softer than before.',
    launchLines: [
      { time: 0.5, speaker: 'System', text: 'Neural dampers synchronized.' },
      { time: 1.9, speaker: 'Vael', text: 'If I become quiet, Kaito, do not assume I consented.' },
      { time: 3.0, speaker: 'Nira', text: 'Silent Choir is a hostile relay. Cut the conductor.' },
      { time: 4.3, speaker: 'Sera', text: 'Anchor on your name. Say it if you have to.' },
      { time: 5.7, speaker: 'System', text: 'AEGIS-7 / SILENT CHOIR DEPLOY' }
    ],
    callouts: [
      { speaker: 'Vael', text: 'Cantor harmonic rising. Move before the ring closes.' },
      { speaker: 'Sera', text: 'Kaito. Kaito Ashveil. Stay with that.' },
      { speaker: 'Nira', text: 'You are not alone in that cockpit.' },
      { speaker: 'Rook', text: 'Choir pylons are resonating with the rifle core. I strongly dislike coincidences.' }
    ]
  },
  ashfallCradle: {
    id: 'operation-ashfall-cradle',
    chapterId: 'chapter-7-ashfall-cradle',
    name: 'Operation Ashfall Cradle',
    enemy: 'Cradle Behemoth',
    enemyId: 'cradle-behemoth',
    bossFactory: 'createCradleBehemoth',
    location: 'Ashfall Cradle',
    sector: 'Impact Basin / Arc-9 Debris',
    environment: 'ashfall',
    objective: 'Defeat Cradle Behemoth.',
    brief:
      'A basin filled with Arc-9 debris has begun breathing. The Behemoth beneath it cradles wreckage like a nest and wears old unit tags as armor.',
    objectives: ['Drop into the impact basin', 'Survive ash surges', 'Break armor plates', 'Defeat Cradle Behemoth', 'Recover Arc-9 tags'],
    reward: MISSION_REWARDS['operation-ashfall-cradle'],
    launchSubtitle: 'Basin insertion. Ash seals hot.',
    launchBody:
      'Kaito watches Arc-9 identifiers scroll across the hangar glass. Nira does not ask if he recognizes any names.',
    launchLines: [
      { time: 0.5, speaker: 'System', text: 'Ash seals pressurized.' },
      { time: 1.8, speaker: 'Nira', text: 'Ashveil, the basin is not a memorial while it is attacking us.' },
      { time: 3.2, speaker: 'Sera', text: 'You can grieve after. Right now, stay alive.' },
      { time: 4.6, speaker: 'Vael', text: 'I have marked the tags. I will remember them if you cannot.' },
      { time: 6.0, speaker: 'System', text: 'AEGIS-7 / ASHFALL CRADLE DEPLOY' }
    ],
    callouts: [
      { speaker: 'Nira', text: 'Its armor opens after the quake. Strike then.' },
      { speaker: 'Vael', text: 'Ground pressure rising. Jump line recommended.' },
      { speaker: 'Sera', text: 'I know what you saw on that plate. Keep moving.' },
      { speaker: 'Rook', text: 'That crater should not have muscles. Yet here we are.' }
    ]
  },
  vaelsDoor: {
    id: 'operation-vaels-door',
    chapterId: 'chapter-8-vaels-door',
    name: "Operation Vael's Door",
    enemy: 'Prototype L-0',
    enemyId: 'prototype-l0',
    bossFactory: 'createPrototypeL0',
    location: 'Sealed Lab L-0',
    sector: 'Arc-12 Sublevel / Black Archive',
    environment: 'sealed-lab',
    objective: 'Defeat Prototype L-0.',
    brief:
      "A sealed Arc-12 lab opens without authorization. Inside waits an AEGIS predecessor carrying Vael's earliest voice prints.",
    objectives: ['Enter Black Archive', 'Protect Vael core integrity', 'Counter prototype sync attacks', 'Defeat Prototype L-0', 'Decide what to tell Nira'],
    reward: MISSION_REWARDS['operation-vaels-door'],
    launchSubtitle: 'Internal deployment. Archive doors unlocked.',
    launchBody:
      'No catapult fires. AEGIS-7 walks under Arc-12 through doors that Vael insists it did not open, then apologizes for lying.',
    launchLines: [
      { time: 0.5, speaker: 'System', text: 'Internal combat frame released.' },
      { time: 1.7, speaker: 'Vael', text: 'That door has my handwriting.' },
      { time: 2.9, speaker: 'Nira', text: 'This was buried for a reason. We find the reason armed.' },
      { time: 4.2, speaker: 'Rook', text: 'Prototype countermeasure loaded. It is legal in the sense that no one stopped me.' },
      { time: 5.6, speaker: 'System', text: 'AEGIS-7 / VAEL DOOR DEPLOY' }
    ],
    callouts: [
      { speaker: 'Vael', text: 'It is using my old routines. I hate that I recognize the elegance.' },
      { speaker: 'Nira', text: 'Do not let it turn our systems into witnesses.' },
      { speaker: 'Rook', text: 'That frame is obsolete only on paper. Dodge like it is offended.' },
      { speaker: 'Sera', text: 'Kaito, tell me whether the voice is yours or his.' }
    ]
  },
  heavenStatic: {
    id: 'operation-heaven-static',
    chapterId: 'chapter-9-heaven-static',
    name: 'Operation Heaven Static',
    enemy: 'Seraphim Veil',
    enemyId: 'seraphim-veil',
    bossFactory: 'createSeraphimVeil',
    location: 'Upper Rift Weather',
    sector: 'Skyhook Array / Broken Stratosphere',
    environment: 'sky-rift',
    objective: 'Defeat Seraphim Veil.',
    brief:
      'The signal climbs into the weather and becomes wings. Seraphim Veil guards the skyhook path to the origin aperture over Arc-12.',
    objectives: ['Launch through the skyhook', 'Stabilize gravity anchors', 'Survive wing barrages', 'Defeat Seraphim Veil', 'Open route to origin aperture'],
    reward: MISSION_REWARDS['operation-heaven-static'],
    launchSubtitle: 'Skyhook rail. Gravity anchors live.',
    launchBody:
      'AEGIS-7 rides the launch frame upward until Arc-12 looks like a wound with lights around it.',
    launchLines: [
      { time: 0.5, speaker: 'System', text: 'Skyhook rail pressurized.' },
      { time: 1.7, speaker: 'Vael', text: 'Weather is broadcasting. That sentence should not be possible.' },
      { time: 3.0, speaker: 'Nira', text: 'Break the guardian and we get one route into the heart.' },
      { time: 4.2, speaker: 'Sera', text: 'Altitude drift is affecting sync. Stay inside your body.' },
      { time: 5.8, speaker: 'System', text: 'AEGIS-7 / HEAVEN STATIC DEPLOY' }
    ],
    callouts: [
      { speaker: 'Vael', text: 'Gravity well forming at your flank.' },
      { speaker: 'Nira', text: 'Use the anchors. Do not fight the entire sky.' },
      { speaker: 'Rook', text: 'Those wings are hard-light math. Shoot the math.' },
      { speaker: 'Sera', text: 'Your sync wants to float. Pull it down.' }
    ]
  },
  ironRequiem: {
    id: 'operation-iron-requiem',
    chapterId: 'chapter-10-iron-requiem',
    name: 'Operation Iron Requiem',
    enemy: 'Requiem Heart',
    enemyId: 'requiem-heart',
    bossFactory: 'createRequiemHeart',
    location: 'Veil Core Aperture',
    sector: 'Origin Signal / Above Arc-12',
    environment: 'veil-core',
    objective: 'End the Requiem Heart.',
    brief:
      'Every signal leads to the Requiem Heart: a living origin relay wearing fragments of every enemy AEGIS-7 survived.',
    objectives: ['Enter the origin aperture', 'Survive composite attack phases', 'Choose what Arc-12 becomes', 'End the Requiem Heart'],
    reward: MISSION_REWARDS['operation-iron-requiem'],
    launchSubtitle: 'Final operation. Requiem Core armed.',
    launchBody:
      'The hangar crew falls silent as AEGIS-7 steps into the rail. Vael speaks last, and this time no one calls it a system line.',
    launchLines: [
      { time: 0.5, speaker: 'System', text: 'Requiem Core accepting pilot sync.' },
      { time: 1.8, speaker: 'Nira', text: 'Kaito, come back. That is an order and a request.' },
      { time: 3.0, speaker: 'Rook', text: 'AEGIS-7 is holding together because we asked it nicely and used all the bolts.' },
      { time: 4.2, speaker: 'Sera', text: 'You are allowed to want a future after this.' },
      { time: 5.4, speaker: 'Vael', text: 'Kaito. I am afraid. I think that means I am with you.' },
      { time: 6.8, speaker: 'System', text: 'AEGIS-7 / IRON REQUIEM DEPLOY' }
    ],
    callouts: [
      { speaker: 'Vael', text: 'It is borrowing every pattern we survived. We survived them once.' },
      { speaker: 'Nira', text: 'Arc-12 is watching your signal. Show them we are not finished.' },
      { speaker: 'Rook', text: 'Composite phase. Worm, Colossus, angel thing. Horrible reunion.' },
      { speaker: 'Sera', text: 'Hold your name. Hold your people. Then strike.' }
    ],
    finaleOptions: ['hold-arc12', 'sever-the-choir', 'vael-open-door', 'evacuate-and-return', 'become-the-lock']
  }
};

const LATE_CAMPAIGN_POLISH = {
  glassHorizon: {
    resultText:
      'The Prism Leviathan breaks into harmless refraction dust. Arc-12 recovers glass samples, a false shoreline map, and one clean route back through the mirror flats.',
    calloutEvents: {
      start: { speaker: 'Nira', text: 'Leviathan contact. Do not trust the horizon until Vael confirms the shadow.' },
      phase: { speaker: 'Vael', text: 'Its mirror plates are splitting. Beams will cross before they strike.' },
      lowHull: { speaker: 'Sera', text: 'Your visual stress is spiking with the damage. Pick one reflection and breathe.' },
      victory: { speaker: 'Rook', text: 'Glass readings are stable. Also everywhere. I am calling that a win.' }
    }
  },
  blackOrchard: {
    resultText:
      'The Hollow Stag collapses into black roots and a red heart-core trace. The orchard quiets long enough for Arc-12 to pull Lira Mave data from the dead growth.',
    calloutEvents: {
      start: { speaker: 'Nira', text: 'The Stag is herding you toward root clusters. Break line and punish the charge.' },
      phase: { speaker: 'Vael', text: 'Heart-core exposed. Antlers are amplifying the snare rhythm now.' },
      lowHull: { speaker: 'Sera', text: 'Kaito, the memory bleed is using pain as an anchor. Stay with my voice.' },
      victory: { speaker: 'Rook', text: 'Rootbreaker telemetry recovered. I would like never to tune a tree again.' }
    }
  },
  silentChoir: {
    resultText:
      'Cantor Null falls silent, taking its speaker halo and stolen intent with it. Arc-12 logs a clean relay gap and Vael keeps answering when spoken to.',
    calloutEvents: {
      start: { speaker: 'Nira', text: 'Cantor Null is suppressing intent. If your rifle locks out, switch to movement.' },
      phase: { speaker: 'Vael', text: 'Speaker towers are awake. Rings will come from more than the body.' },
      lowHull: { speaker: 'Sera', text: 'Say your name if the silence presses in. Kaito Ashveil. Again.' },
      victory: { speaker: 'Rook', text: 'Choir pylons are dead. The rifle core has stopped humming at me.' }
    }
  },
  ashfallCradle: {
    resultText:
      'The Cradle Behemoth sinks back into the impact basin after shedding its Arc-9 armor. The recovered tags return to Arc-12 with names attached.',
    calloutEvents: {
      start: { speaker: 'Nira', text: 'Heavy target. Its armor will blunt early hits; wait for the quake openings.' },
      phase: { speaker: 'Vael', text: 'Armor shell broken. Its mass is moving faster without the plates.' },
      lowHull: { speaker: 'Sera', text: 'You are fighting wreckage and grief at once. Do only the next dodge.' },
      victory: { speaker: 'Rook', text: 'Arc-9 tag bundle secured. I will handle the cleaning. You handled the impossible part.' }
    }
  },
  vaelsDoor: {
    resultText:
      'Prototype L-0 shuts down with Vael prints still burning in its corrupted core. Arc-12 gains a warning: the old AEGIS line learned to imitate survival.',
    calloutEvents: {
      start: { speaker: 'Nira', text: 'Prototype L-0 is a mirror match. Do not let it set your tempo.' },
      phase: { speaker: 'Vael', text: 'It changed stance. Melee routines first, rifle counters second.' },
      lowHull: { speaker: 'Sera', text: 'Your sync is reacting like it knows that frame. Slow down, Kaito.' },
      victory: { speaker: 'Rook', text: 'L-0 is offline. I am saving the parts that did not try to become us.' }
    }
  },
  heavenStatic: {
    resultText:
      'Seraphim Veil tears apart above the skyhook and gravity settles into something Arc-12 can read. The route to the origin aperture is open.',
    calloutEvents: {
      start: { speaker: 'Nira', text: 'Use the gravity anchors. The sky is hostile terrain, not scenery.' },
      phase: { speaker: 'Vael', text: 'Halo geometry changed. Safe zones will shift before the collapse.' },
      lowHull: { speaker: 'Sera', text: 'Your body thinks it is falling. Plant your attention inside the cockpit.' },
      victory: { speaker: 'Rook', text: 'Skyhook path is clear. I did not enjoy the wing math, but I respect it.' }
    }
  },
  ironRequiem: {
    resultText:
      'The Requiem Heart opens and every memory pattern falls away: Worm, Signal, Prototype, and the exposed core. Arc-12 waits for Kaito to choose its future.',
    calloutEvents: {
      start: { speaker: 'Nira', text: 'Final target. Every warning matters. Every opening is earned.' },
      phase: { speaker: 'Vael', text: 'The Heart is changing memory sets. I can name the pattern before it strikes.' },
      lowHull: { speaker: 'Sera', text: 'Kaito, hold your people. Hold your name. Then use Overdrive when the core opens.' },
      victory: { speaker: 'Rook', text: 'The Heart is exposed. Arc-12 still has lights. That means we choose.' }
    },
    finaleOptions: ['sever-the-choir', 'vael-open-door', 'hold-arc12']
  }
};

Object.entries(LATE_CAMPAIGN_POLISH).forEach(([missionKey, polish]) => {
  Object.assign(MISSIONS[missionKey], polish);
});

export const MISSION_BY_CHAPTER = Object.fromEntries(
  Object.values(MISSIONS).map((mission) => [mission.chapterId, mission])
);

export function getMissionByChapter(chapterId) {
  return MISSION_BY_CHAPTER[chapterId] || MISSIONS.ironWake;
}

export function getMissionById(missionId) {
  return Object.values(MISSIONS).find((mission) => mission.id === missionId) || getMissionByChapter(missionId);
}
