import { GAME_VERSION, PHASES, OBJECTIVES } from './constants.js';
import { BASE_STATS, STARTING_AP, STARTING_SALVAGE } from './balance.js';

export const SAVE_SCHEMA_VERSION = 2;

const CHAPTER_1 = 'chapter-1-iron-wake';
const CHAPTER_2 = 'chapter-2-hollow-signal';
const CHAPTER_3 = 'chapter-3-redline-descent';
const MISSION_BY_CHAPTER = {
  [CHAPTER_1]: 'operation-iron-wake',
  [CHAPTER_2]: 'operation-hollow-signal',
  [CHAPTER_3]: 'operation-redline-descent'
};

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function asArray(value) {
  return Array.isArray(value) ? [...value] : [];
}

function deriveProgress(candidate, storyFlags) {
  const completedMissions = asArray(candidate.completedMissions);
  const unlockedChapters = asArray(candidate.unlockedChapters).length
    ? asArray(candidate.unlockedChapters)
    : [CHAPTER_1];
  const completedChapters = asArray(candidate.completedChapters);
  let currentChapter = candidate.currentChapter || CHAPTER_1;

  if (completedMissions.includes('operation-iron-wake') || storyFlags.firstBattleWon) {
    completedChapters.push(CHAPTER_1);
    unlockedChapters.push(CHAPTER_2);
    if (currentChapter === CHAPTER_1) currentChapter = CHAPTER_2;
    storyFlags.chapter2Unlocked = true;
  }

  if (completedMissions.includes('operation-hollow-signal')) {
    completedChapters.push(CHAPTER_2);
    unlockedChapters.push(CHAPTER_3);
    currentChapter = CHAPTER_3;
    storyFlags.chapter3Unlocked = true;
  }

  if (completedMissions.includes('operation-redline-descent')) {
    completedChapters.push(CHAPTER_3);
    unlockedChapters.push(CHAPTER_3);
    currentChapter = CHAPTER_3;
    storyFlags.prototypeComplete = true;
  }

  return {
    currentChapter,
    unlockedChapters: unique(unlockedChapters),
    completedChapters: unique(completedChapters)
  };
}

export function createSaveTemplate() {
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    version: GAME_VERSION,
    currentPhase: PHASES.MENU,
    currentChapter: 'chapter-1-iron-wake',
    activeMissionId: 'operation-iron-wake',
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
    unlockedChapters: ['chapter-1-iron-wake'],
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
    launchSequenceWatched: false,
    objective: OBJECTIVES.TALK_NIRA,
    storyFlags: {
      introSeen: false,
      emergencyStarted: false,
      briefingComplete: false,
      firstBattleWon: false,
      chapter2Unlocked: false,
      chapter3Unlocked: false,
      prototypeComplete: false,
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
    completedMissions: asArray(candidate.completedMissions),
    completedChapters: progress.completedChapters,
    unlockedChapters: progress.unlockedChapters,
    currentChapter: progress.currentChapter,
    activeMissionId: candidate.activeMissionId || MISSION_BY_CHAPTER[progress.currentChapter] || fallback.activeMissionId,
    dialogueChoices: { ...fallback.dialogueChoices, ...(candidate.dialogueChoices || {}) },
    toneRecord: { ...fallback.toneRecord, ...(candidate.toneRecord || {}) },
    missionResultsHistory: asArray(candidate.missionResultsHistory),
    enemyDefeats: { ...fallback.enemyDefeats, ...(candidate.enemyDefeats || {}) }
  };
}
