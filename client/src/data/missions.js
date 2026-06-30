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
    objectives: [
      'Deploy AEGIS-7',
      'Reach the broadcast tower',
      'Destroy Rift Shards',
      'Survive signal interference',
      'Defeat Echo Stalker'
    ],
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
      'The Hollow Signal leads underground into a collapsing transit grid. The Veilborn have nested around the old Redline, and something huge is guarding the rails.',
    objectives: [
      'Descend into Redline Tunnel',
      'Clear Veilborn nests',
      'Protect AEGIS-7 from tunnel collapse',
      'Defeat Redline Colossus',
      'Escape before collapse timer ends'
    ],
    reward: MISSION_REWARDS['operation-redline-descent'],
    launchSubtitle: 'Underground insertion. Drop elevator primed.',
    launchBody:
      'AEGIS-7 locks into the descent frame. The hangar rail lowers into a service shaft lit by red emergency lamps.',
    launchLines: [
      { time: 0.5, speaker: 'System', text: 'Drop elevator clamps engaged.' },
      { time: 1.5, speaker: 'Nira', text: 'This may be a trap. We still go because Arc-12 cannot outrun the signal forever.' },
      { time: 2.8, speaker: 'Sera', text: 'Kaito, your stress curve changed after the last sync. Tell me if the tunnel answers back.' },
      { time: 4.0, speaker: 'Vael', text: 'I have already plotted the descent. No one ordered me to do that.' },
      { time: 5.1, speaker: 'Rook', text: 'Redline frame stress is ugly. Try not to let a train monster punch the new plating.' },
      { time: 6.6, speaker: 'System', text: 'AEGIS-7 / REDLINE DESCENT' }
    ],
    callouts: [
      { speaker: 'Nira', text: 'Tunnel collapse markers are live. Keep moving between strikes.' },
      { speaker: 'Vael', text: 'The Colossus chest core is exposed after heavy attacks.' },
      { speaker: 'Rook', text: 'That armor is old train plating fused into bone. I hate how interesting that is.' },
      { speaker: 'Sera', text: 'Your fear response just flattened. That is not calm, Kaito. That is overload.' }
    ]
  }
};

export const MISSION_BY_CHAPTER = {
  'chapter-1-iron-wake': MISSIONS.ironWake,
  'chapter-2-hollow-signal': MISSIONS.hollowSignal,
  'chapter-3-redline-descent': MISSIONS.redlineDescent
};

export function getMissionByChapter(chapterId) {
  return MISSION_BY_CHAPTER[chapterId] || MISSIONS.ironWake;
}

export function getMissionById(missionId) {
  return Object.values(MISSIONS).find((mission) => mission.id === missionId) || getMissionByChapter(missionId);
}
