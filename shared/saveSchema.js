import { GAME_VERSION, PHASES, OBJECTIVES } from './constants.js';
import { BASE_STATS, STARTING_AP, STARTING_SALVAGE } from './balance.js';

export const SAVE_SCHEMA_VERSION = 1;

export function createSaveTemplate() {
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    version: GAME_VERSION,
    currentPhase: PHASES.MENU,
    currentChapter: 'chapter-1-iron-wake',
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
    launchSequenceWatched: false,
    objective: OBJECTIVES.TALK_NIRA,
    storyFlags: {
      introSeen: false,
      emergencyStarted: false,
      briefingComplete: false,
      firstBattleWon: false
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

  return {
    ...fallback,
    ...candidate,
    ap: { ...fallback.ap, ...(candidate.ap || {}) },
    stats: { ...fallback.stats, ...(candidate.stats || {}) },
    upgrades: { ...fallback.upgrades, ...(candidate.upgrades || {}) },
    bonds: { ...fallback.bonds, ...(candidate.bonds || {}) },
    sync: { ...fallback.sync, ...(candidate.sync || {}) },
    storyFlags: { ...fallback.storyFlags, ...(candidate.storyFlags || {}) },
    settings: { ...fallback.settings, ...(candidate.settings || {}) },
    completedMissions: Array.isArray(candidate.completedMissions) ? candidate.completedMissions : []
  };
}
