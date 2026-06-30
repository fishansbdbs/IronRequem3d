import { GAME_VERSION, PHASES, OBJECTIVES } from './constants.js';
import { BASE_STATS, STARTING_AP, STARTING_SALVAGE } from './balance.js';

export const SAVE_SCHEMA_VERSION = 3;

export const CHAPTER_SEQUENCE = [
  {
    id: 'chapter-1-iron-wake',
    missionId: 'operation-iron-wake',
    completedFlag: 'firstBattleWon',
    unlockFlag: 'chapter2Unlocked'
  },
  {
    id: 'chapter-2-hollow-signal',
    missionId: 'operation-hollow-signal',
    completedFlag: 'hollowSignalWon',
    unlockFlag: 'chapter3Unlocked'
  },
  {
    id: 'chapter-3-redline-descent',
    missionId: 'operation-redline-descent',
    completedFlag: 'redlineDescentWon',
    legacyFlag: 'prototypeComplete',
    unlockFlag: 'chapter4Unlocked'
  },
  {
    id: 'chapter-4-glass-horizon',
    missionId: 'operation-glass-horizon',
    completedFlag: 'glassHorizonWon',
    unlockFlag: 'chapter5Unlocked'
  },
  {
    id: 'chapter-5-black-orchard',
    missionId: 'operation-black-orchard',
    completedFlag: 'blackOrchardWon',
    unlockFlag: 'chapter6Unlocked'
  },
  {
    id: 'chapter-6-silent-choir',
    missionId: 'operation-silent-choir',
    completedFlag: 'silentChoirWon',
    unlockFlag: 'chapter7Unlocked'
  },
  {
    id: 'chapter-7-ashfall-cradle',
    missionId: 'operation-ashfall-cradle',
    completedFlag: 'ashfallCradleWon',
    unlockFlag: 'chapter8Unlocked'
  },
  {
    id: 'chapter-8-vaels-door',
    missionId: 'operation-vaels-door',
    completedFlag: 'vaelsDoorWon',
    unlockFlag: 'chapter9Unlocked'
  },
  {
    id: 'chapter-9-heaven-static',
    missionId: 'operation-heaven-static',
    completedFlag: 'heavenStaticWon',
    unlockFlag: 'chapter10Unlocked'
  },
  {
    id: 'chapter-10-iron-requiem',
    missionId: 'operation-iron-requiem',
    completedFlag: 'campaignComplete'
  }
];

const CHAPTER_TO_MISSION = Object.fromEntries(CHAPTER_SEQUENCE.map((chapter) => [chapter.id, chapter.missionId]));
const FACILITY_ROOMS = [
  'central-atrium',
  'command-corridor',
  'nira-office',
  'hangar-bay',
  'engineering-deck',
  'med-bay',
  'pilot-quarters',
  'vael-sync-chamber',
  'research-lab',
  'observation-deck',
  'briefing-room'
];

const ENDING_FLAGS = {
  trusts_vael: false,
  questions_vael: false,
  supports_nira: false,
  challenges_nira: false,
  comforts_rook: false,
  confronts_rook: false,
  accepts_sera_help: false,
  hides_stress: false,
  aggressive_pilot: false,
  protective_pilot: false,
  reckless_sync: false
};

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function asArray(value) {
  return Array.isArray(value) ? [...value] : [];
}

function chapterIndex(chapterId) {
  return CHAPTER_SEQUENCE.findIndex((chapter) => chapter.id === chapterId);
}

function deriveProgress(candidate, storyFlags) {
  const completedMissions = unique(asArray(candidate.completedMissions));
  const unlockedChapters = asArray(candidate.unlockedChapters).length
    ? asArray(candidate.unlockedChapters)
    : [CHAPTER_SEQUENCE[0].id];
  const completedChapters = asArray(candidate.completedChapters);
  let currentIndex = Math.max(0, chapterIndex(candidate.currentChapter || CHAPTER_SEQUENCE[0].id));

  CHAPTER_SEQUENCE.forEach((chapter, index) => {
    const completed =
      completedMissions.includes(chapter.missionId) ||
      Boolean(storyFlags[chapter.completedFlag]) ||
      Boolean(chapter.legacyFlag && storyFlags[chapter.legacyFlag]);

    if (!completed) return;

    completedChapters.push(chapter.id);
    storyFlags[chapter.completedFlag] = true;

    if (chapter.legacyFlag) {
      storyFlags[chapter.legacyFlag] = true;
    }

    const nextChapter = CHAPTER_SEQUENCE[index + 1];
    if (nextChapter) {
      unlockedChapters.push(nextChapter.id);
      storyFlags[chapter.unlockFlag] = true;
      currentIndex = Math.max(currentIndex, index + 1);
    } else {
      currentIndex = Math.max(currentIndex, index);
      storyFlags.campaignComplete = true;
    }
  });

  const currentChapter = CHAPTER_SEQUENCE[Math.min(currentIndex, CHAPTER_SEQUENCE.length - 1)].id;
  unlockedChapters.push(currentChapter);

  return {
    currentChapter,
    activeMissionId: CHAPTER_TO_MISSION[currentChapter],
    unlockedChapters: unique(unlockedChapters),
    completedChapters: unique(completedChapters),
    completedMissions
  };
}

export function createSaveTemplate() {
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    version: GAME_VERSION,
    currentPhase: PHASES.MENU,
    currentChapter: CHAPTER_SEQUENCE[0].id,
    activeMissionId: CHAPTER_SEQUENCE[0].missionId,
    day: 1,
    ap: {
      current: STARTING_AP,
      max: STARTING_AP,
      spentActivities: []
    },
    salvage: STARTING_SALVAGE,
    stats: { ...BASE_STATS },
    upgrades: {},
    bonds: {
      nira: 0,
      vael: 0,
      rook: 0,
      sera: 0
    },
    sync: {
      value: 0,
      max: 100
    },
    completedMissions: [],
    completedChapters: [],
    unlockedChapters: [CHAPTER_SEQUENCE[0].id],
    dialogueChoices: {},
    toneRecord: {
      tactical: 0,
      supportive: 0,
      defiant: 0,
      quiet: 0,
      honest: 0
    },
    missionResultsHistory: [],
    enemyDefeats: {},
    facility: {
      currentRoom: 'central-atrium',
      unlockedRooms: [...FACILITY_ROOMS],
      visitedRooms: ['central-atrium']
    },
    endingFlags: { ...ENDING_FLAGS },
    endingUnlocked: null,
    endingOptions: [],
    launchSequenceWatched: false,
    objective: OBJECTIVES.TALK_NIRA,
    storyFlags: {
      introSeen: false,
      emergencyStarted: false,
      briefingComplete: false,
      firstBattleWon: false,
      chapter2Unlocked: false,
      hollowSignalWon: false,
      chapter3Unlocked: false,
      redlineDescentWon: false,
      prototypeComplete: false,
      chapter4Unlocked: false,
      glassHorizonWon: false,
      chapter5Unlocked: false,
      blackOrchardWon: false,
      chapter6Unlocked: false,
      silentChoirWon: false,
      chapter7Unlocked: false,
      ashfallCradleWon: false,
      chapter8Unlocked: false,
      vaelsDoorWon: false,
      chapter9Unlocked: false,
      heavenStaticWon: false,
      chapter10Unlocked: false,
      campaignComplete: false,
      challengedNiraConcern: false,
      vaelActedWithoutOrder: false,
      rookRecoveredTechHint: false,
      seraStressWarning: false
    },
    settings: {
      masterVolume: 0.8,
      musicVolume: 0.45,
      sfxVolume: 0.75,
      mouseSensitivity: 0.75,
      graphicsQuality: 'standard',
      screenShake: true,
      reducedMotion: false,
      fullscreen: false
    }
  };
}

export function normalizeSave(candidate) {
  const fallback = createSaveTemplate();
  if (!candidate || typeof candidate !== 'object') {
    return fallback;
  }

  const storyFlags = { ...fallback.storyFlags, ...(candidate.storyFlags || {}) };
  const progress = deriveProgress(candidate, storyFlags);
  const candidateFacility = candidate.facility || {};

  return {
    ...fallback,
    ...candidate,
    schemaVersion: SAVE_SCHEMA_VERSION,
    version: GAME_VERSION,
    ap: { ...fallback.ap, ...(candidate.ap || {}) },
    stats: { ...fallback.stats, ...(candidate.stats || {}) },
    upgrades: { ...fallback.upgrades, ...(candidate.upgrades || {}) },
    bonds: { ...fallback.bonds, ...(candidate.bonds || {}) },
    sync: { ...fallback.sync, ...(candidate.sync || {}) },
    storyFlags,
    settings: { ...fallback.settings, ...(candidate.settings || {}) },
    completedMissions: progress.completedMissions,
    completedChapters: progress.completedChapters,
    unlockedChapters: progress.unlockedChapters,
    currentChapter: progress.currentChapter,
    activeMissionId: progress.activeMissionId || candidate.activeMissionId || fallback.activeMissionId,
    dialogueChoices: { ...fallback.dialogueChoices, ...(candidate.dialogueChoices || {}) },
    toneRecord: { ...fallback.toneRecord, ...(candidate.toneRecord || {}) },
    missionResultsHistory: asArray(candidate.missionResultsHistory),
    enemyDefeats: { ...fallback.enemyDefeats, ...(candidate.enemyDefeats || {}) },
    facility: {
      ...fallback.facility,
      ...candidateFacility,
      currentRoom: candidateFacility.currentRoom || fallback.facility.currentRoom,
      unlockedRooms: unique([...fallback.facility.unlockedRooms, ...asArray(candidateFacility.unlockedRooms)]),
      visitedRooms: unique(asArray(candidateFacility.visitedRooms).length ? candidateFacility.visitedRooms : fallback.facility.visitedRooms)
    },
    endingFlags: { ...fallback.endingFlags, ...(candidate.endingFlags || {}) },
    endingUnlocked: candidate.endingUnlocked || fallback.endingUnlocked,
    endingOptions: unique(asArray(candidate.endingOptions))
  };
}
