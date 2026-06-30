import { OBJECTIVES, PHASES } from '../../../shared/constants.js';
import { UPGRADE_DEFS } from '../../../shared/balance.js';
import { createSaveTemplate, normalizeSave } from '../../../shared/saveSchema.js';

const MISSION_PROGRESS = {
  'operation-iron-wake': {
    chapterId: 'chapter-1-iron-wake',
    nextChapterId: 'chapter-2-hollow-signal',
    nextMissionId: 'operation-hollow-signal',
    completedFlag: 'firstBattleWon',
    unlockFlag: 'chapter2Unlocked',
    enemyId: 'fracture-worm',
    unlockLabel: 'Chapter 2 - Hollow Signal'
  },
  'operation-hollow-signal': {
    chapterId: 'chapter-2-hollow-signal',
    nextChapterId: 'chapter-3-redline-descent',
    nextMissionId: 'operation-redline-descent',
    completedFlag: 'hollowSignalWon',
    unlockFlag: 'chapter3Unlocked',
    enemyId: 'echo-stalker',
    unlockLabel: 'Chapter 3 - Redline Descent'
  },
  'operation-redline-descent': {
    chapterId: 'chapter-3-redline-descent',
    completedFlag: 'redlineDescentWon',
    finalFlag: 'prototypeComplete',
    enemyId: 'redline-colossus',
    unlockLabel: 'Chapter 4 teaser'
  }
};

const CHAPTER_OBJECTIVES = {
  'chapter-1-iron-wake': OBJECTIVES.DEFEAT_WORM,
  'chapter-2-hollow-signal': OBJECTIVES.DEFEAT_ECHO_STALKER,
  'chapter-3-redline-descent': OBJECTIVES.DEFEAT_REDLINE_COLOSSUS
};

function pushUnique(list, value) {
  if (value && !list.includes(value)) list.push(value);
}

export function createInitialState() {
  return normalizeSave(createSaveTemplate());
}

export function cloneState(state) {
  return structuredClone(normalizeSave(state));
}

export function spendActionPoint(state, activityId, bondTarget) {
  const next = cloneState(state);
  if (next.ap.current <= 0 || next.ap.spentActivities.includes(activityId)) {
    return next;
  }

  next.ap.current -= 1;
  next.ap.spentActivities.push(activityId);

  if (bondTarget && Object.hasOwn(next.bonds, bondTarget)) {
    next.bonds[bondTarget] += 1;
  }

  if (activityId === 'speak-nira') {
    next.objective = OBJECTIVES.VISIT_VAEL;
  } else if (activityId === 'sync-vael') {
    next.sync.value = Math.min(next.sync.max, next.sync.value + 5);
    next.objective = OBJECTIVES.INSPECT_UPGRADE;
  } else if (activityId === 'rest-sera') {
    next.stats.hull = Math.max(next.stats.hull, 100);
    next.objective = OBJECTIVES.END_DAY;
  } else if (next.ap.current === 0) {
    next.objective = OBJECTIVES.END_DAY;
  }

  return next;
}

export function startEmergency(state) {
  const next = cloneState(state);
  next.storyFlags.emergencyStarted = true;
  next.currentPhase = PHASES.HUB;
  next.objective = OBJECTIVES.REPORT_BRIEFING;
  return next;
}

export function markBriefingComplete(state) {
  const next = cloneState(state);
  next.storyFlags.briefingComplete = true;
  next.objective = OBJECTIVES.ENTER_HANGAR;
  return next;
}

export function markLaunchWatched(state) {
  const next = cloneState(state);
  next.launchSequenceWatched = true;
  next.objective = CHAPTER_OBJECTIVES[next.currentChapter] || OBJECTIVES.DEFEAT_WORM;
  return next;
}

export function completeMission(state, reward) {
  const next = cloneState(state);
  const missionId = reward.missionId;
  const progress = MISSION_PROGRESS[missionId];
  next.salvage += reward.salvage ?? 0;
  next.sync.value = Math.min(next.sync.max, next.sync.value + (reward.sync ?? 0));
  next.objective = OBJECTIVES.RETURN_ARC12;

  if (missionId && !next.completedMissions.includes(missionId)) {
    next.completedMissions.push(missionId);
  }

  if (progress) {
    pushUnique(next.completedChapters, progress.chapterId);
    next.storyFlags[progress.completedFlag] = true;
    next.enemyDefeats[progress.enemyId] = true;

    if (progress.nextChapterId) {
      pushUnique(next.unlockedChapters, progress.nextChapterId);
      next.currentChapter = progress.nextChapterId;
      next.activeMissionId = progress.nextMissionId;
      next.storyFlags[progress.unlockFlag] = true;
    }

    if (progress.finalFlag) {
      next.storyFlags[progress.finalFlag] = true;
    }
  }

  if (reward.result) {
    const result = {
      missionId,
      victory: true,
      missionName: reward.result.missionName || missionId,
      hull: reward.result.hull ?? null,
      time: reward.result.time ?? null,
      damageTaken: reward.result.damageTaken ?? 0,
      damageDealt: reward.result.damageDealt ?? 0,
      enemiesDefeated: reward.result.enemiesDefeated ?? reward.result.shardsDefeated ?? 0,
      bossDefeated: reward.result.bossDefeated || progress?.enemyId || '',
      salvage: reward.salvage ?? 0,
      sync: reward.sync ?? 0,
      bondsAffected: reward.result.bondsAffected || [],
      chapterUnlocked: progress?.nextChapterId || null
    };
    next.missionResultsHistory.push(result);
  }

  return next;
}

export function returnToArc12(state) {
  const next = cloneState(state);
  next.currentPhase = PHASES.HUB;
  next.day += 1;
  next.ap.current = next.ap.max;
  next.ap.spentActivities = [];
  next.storyFlags.briefingComplete = false;
  next.launchSequenceWatched = false;
  next.objective = next.storyFlags.prototypeComplete ? OBJECTIVES.CHAPTER4_TEASER : OBJECTIVES.TALK_NIRA;
  return next;
}

export function applyUpgrade(state, upgradeId) {
  const def = UPGRADE_DEFS[upgradeId];
  const next = cloneState(state);
  const unlocked = !def?.unlockChapter || next.unlockedChapters.includes(def.unlockChapter);
  if (!def || !unlocked || next.salvage < def.cost) {
    return next;
  }

  const existing = next.upgrades[upgradeId] || { level: 0 };
  next.salvage -= def.cost;
  next.upgrades[upgradeId] = { level: existing.level + 1 };

  const current = next.stats[def.stat] ?? 0;
  const changed = current + def.amount;
  next.stats[def.stat] = def.minimum ? Math.max(def.minimum, changed) : changed;
  return next;
}

export function recordDialogueChoice(state, choice) {
  const next = cloneState(state);
  if (!choice?.conversationId || !choice.choiceId) return next;

  const alreadyRecorded = Boolean(next.dialogueChoices[choice.conversationId]);
  next.dialogueChoices[choice.conversationId] = choice.choiceId;

  if (!alreadyRecorded) {
    if (choice.tone) {
      next.toneRecord[choice.tone] = (next.toneRecord[choice.tone] || 0) + 1;
    }

    if (choice.bond && Object.hasOwn(next.bonds, choice.bond)) {
      next.bonds[choice.bond] += choice.bondDelta ?? 0;
    }
  }

  if (choice.flags) {
    next.storyFlags = { ...next.storyFlags, ...choice.flags };
  }

  return next;
}

export function setPhase(state, phase) {
  const next = cloneState(state);
  next.currentPhase = phase;
  return next;
}

export { UPGRADE_DEFS };
