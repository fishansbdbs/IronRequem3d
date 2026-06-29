import { OBJECTIVES, PHASES } from '../../../shared/constants.js';
import { UPGRADE_DEFS } from '../../../shared/balance.js';
import { createSaveTemplate, normalizeSave } from '../../../shared/saveSchema.js';

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
  next.objective = OBJECTIVES.DEFEAT_WORM;
  return next;
}

export function completeMission(state, reward) {
  const next = cloneState(state);
  const missionId = reward.missionId;
  next.salvage += reward.salvage ?? 0;
  next.sync.value = Math.min(next.sync.max, next.sync.value + (reward.sync ?? 0));
  next.storyFlags.firstBattleWon = true;
  next.objective = OBJECTIVES.RETURN_ARC12;

  if (missionId && !next.completedMissions.includes(missionId)) {
    next.completedMissions.push(missionId);
  }

  return next;
}

export function returnToArc12(state) {
  const next = cloneState(state);
  next.currentPhase = PHASES.HUB;
  next.day += 1;
  next.ap.current = next.ap.max;
  next.ap.spentActivities = [];
  next.objective = OBJECTIVES.TALK_NIRA;
  return next;
}

export function applyUpgrade(state, upgradeId) {
  const def = UPGRADE_DEFS[upgradeId];
  const next = cloneState(state);
  if (!def || next.salvage < def.cost) {
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

export function setPhase(state, phase) {
  const next = cloneState(state);
  next.currentPhase = phase;
  return next;
}

export { UPGRADE_DEFS };
